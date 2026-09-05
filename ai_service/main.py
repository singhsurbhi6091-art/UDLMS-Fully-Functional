import os
import re
import io
from pathlib import Path
from typing import Optional, Dict, Any
from fastapi import FastAPI, File, UploadFile, HTTPException  # pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware  # pyrefly: ignore [missing-import]
from PIL import Image, ImageEnhance, ImageFilter, ImageOps  # pyrefly: ignore [missing-import]
import pytesseract  # pyrefly: ignore [missing-import]

# Configure Tesseract path for Windows
DEFAULT_TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
if os.path.exists(DEFAULT_TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = DEFAULT_TESSERACT_PATH

app = FastAPI(
    title="UDLMS AI Inspection & OCR Service",
    description="Microservice to extract serial numbers and plate markings from measuring instruments",
    version="1.0.0"
)

# Enable CORS for React frontend & Spring backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def preprocess_image(image: Image.Image) -> Image.Image:
    """Preprocess image to maximize OCR legibility for metal plates, stickers, and stamps."""
    # Handle RGBA / transparency by compositing onto pure white background
    if image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info):
        background = Image.new("RGB", image.size, (255, 255, 255))
        if image.mode == "P":
            image = image.convert("RGBA")
        background.paste(image, mask=image.split()[-1])
        image = background
    elif image.mode != "RGB":
        image = image.convert("RGB")

    # Convert to grayscale
    gray = image.convert("L")

    # Auto-contrast normalization
    gray = ImageOps.autocontrast(gray)

    # Enhance contrast
    enhancer = ImageEnhance.Contrast(gray)
    contrasted = enhancer.enhance(1.8)

    # Apply light unsharp mask sharpening
    sharpened = contrasted.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
    return sharpened

def extract_serial_number(text: str) -> Dict[str, Any]:
    """Detect serial number and instrument metadata from raw OCR text using regex heuristics."""
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    
    # 1. Match explicit prefix patterns (e.g., S/N: WS-12345, Serial No: 458923, ID: FD-992101)
    prefix_pattern = re.compile(
        r"(?:s\/?n|serial(?:\s*no)?|model|inst(?:rument)?\s*id|id|no)[\s.:#-]*([A-Z0-9\-_/]{4,20})",
        re.IGNORECASE
    )
    for line in lines:
        match = prefix_pattern.search(line)
        if match:
            serial = match.group(1).upper()
            return {"serial": serial, "confidence": 0.95, "matched_line": line}
            
    # 2. Match standard UDLMS code formats (e.g., WS-458923, FD-992101, PS-334120)
    udlms_pattern = re.compile(r"\b([A-Z]{2,4}[-\s]?[0-9]{4,8})\b", re.IGNORECASE)
    for line in lines:
        match = udlms_pattern.search(line)
        if match:
            serial = match.group(1).replace(" ", "-").upper()
            return {"serial": serial, "confidence": 0.92, "matched_line": line}

    # 3. Match standalone alphanumeric tokens with 5-15 chars containing at least 2 digits
    token_pattern = re.compile(r"\b([A-Z0-9\-_]{5,15})\b")
    for line in lines:
        for token in token_pattern.findall(line.upper()):
            digits = sum(c.isdigit() for c in token)
            if digits >= 3 and not token.startswith("HTTP"):
                return {"serial": token, "confidence": 0.80, "matched_line": line}

    # Fallback to first non-empty line or default
    first_token = lines[0] if lines else "UNKNOWN-SERIAL"
    return {"serial": first_token, "confidence": 0.40, "matched_line": first_token}

@app.get("/")
def root():
    return {
        "service": "UDLMS AI OCR Microservice",
        "status": "online",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "ocr": "/api/ocr/extract-serial"
        }
    }

@app.get("/health")
def health():
    tesseract_available = False
    version = "Unknown"
    try:
        version = pytesseract.get_tesseract_version()
        tesseract_available = True
    except Exception:
        pass

    return {
        "status": "healthy",
        "tesseract_installed": tesseract_available,
        "tesseract_version": str(version),
        "tesseract_path": pytesseract.pytesseract.tesseract_cmd
    }

@app.post("/api/ocr/extract-serial")
async def extract_serial(file: UploadFile = File(...)):
    # Validate MIME type and extension safely
    is_image = False
    if file.content_type and file.content_type.startswith("image/"):
        is_image = True
    elif file.filename and file.filename.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff")):
        is_image = True

    if not is_image:
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image file.")

    try:
        content = await file.read()
        image = Image.open(io.BytesIO(content))
        
        # Preprocessing pass
        preprocessed = preprocess_image(image)
        
        # Pass 1: Line-by-line single block OCR (--psm 6)
        ocr_result = pytesseract.image_to_string(preprocessed, config="--psm 6")
        raw_text: str = str(ocr_result) if ocr_result is not None else ""
        
        # Pass 2: Fully automatic page segmentation (--psm 3) if pass 1 produced low text
        if len(raw_text.strip()) < 4:
            fallback_result = pytesseract.image_to_string(image, config="--psm 3")
            if fallback_result is not None:
                raw_text = str(fallback_result)

        extraction: Dict[str, Any] = extract_serial_number(raw_text)
        cleaned_text: str = raw_text.strip()

        return {
            "success": True,
            "filename": file.filename or "instrument_photo",
            "detected_serial": str(extraction.get("serial", "UNKNOWN-SERIAL")),
            "confidence": float(extraction.get("confidence", 0.5)),
            "matched_line": str(extraction.get("matched_line", "")),
            "raw_text": cleaned_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn  # pyrefly: ignore [missing-import]
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
