# UDLMS — Unified Digital Legal Metrology System

> **Smart India Hackathon 2026**  
> **Problem Statement ID**: 26036  
> **Problem Statement Title**: Development of an Online Verification System for Weighing and Measuring Instruments  
> **Theme**: Transportation & Logistics  
> **Team**: Firestorm Innovators  
> **Motto**: *Verify. Certify. Track. Trust.*

---

## 📌 Overview

**UDLMS** is an enterprise-grade digital platform designed to modernize the legal metrology verification ecosystem across India under the **Legal Metrology Act, 2009** and **Legal Metrology (General) Rules, 2011**.

It replaces fragmented manual paperwork and physical record-keeping with a unified, transparent, and tamper-resistant digital pipeline for weighing and measuring instruments—spanning initial business application, on-field LMO inspection, automated OCR assistance, digital certificate issuance, and public QR-based authenticity verification.

---

## 🚀 Key Features

* **Digital Instrument Passport**: Centralized lifecycle tracking for every registered weighing and measuring instrument (serial number, location, owner, calibration records, and re-verification deadlines).
* **Field-First LMO Portal**: Mobile-responsive field inspection interface for Legal Metrology Officers (LMOs) to conduct on-site verifications, capture photo evidence, and log outcomes in real-time.
* **Smart OCR Assistance**: Fast Python-powered computer vision microservice using Tesseract OCR to automatically detect and extract serial numbers and plate markings from instrument photographs.
* **Tamper-Resistant Digital Certification**: Instant generation of authentic digital certificates cryptographically linked to the central registry.
* **Public QR Code Authentication**: Instant verification of scale accuracy and certification for consumers and regulatory inspectors by scanning the unique QR code on the certificate or instrument seal.
* **Self-Service Business Portal**: Businesses can register instruments, schedule verification visits, track status in real-time, and download compliance certificates.
* **Proactive Validity & Expiry Tracking**: Automated status tagging (`Verified`, `Pending`, `Expiring Soon`, `Expired`, `Rejected`) to prevent missed annual calibration deadlines.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Radix UI / Shadcn, Lucide Icons, QRCode.react |
| **Backend** | Java 17+, Spring Boot 3, Spring Data JPA, Hibernate, REST API |
| **Database** | PostgreSQL (`udlms_db`), Hibernate DDL |
| **AI / Microservices** | Python 3.10+, FastAPI, Uvicorn, Tesseract OCR, Pillow (PIL), Regex heuristic parsers |
| **DevOps & Tooling** | Windows Batch Script (`launch_udlms.bat`), Maven Wrapper (`mvnw`), Git |

---

## 🏛️ System Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │      Users: Business | LMO Officer | Public   │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │       React 18 + Vite Frontend (Port 5173)   │
                    │         Tailwind CSS / Shadcn / QR Engine     │
                    └──────────────┬───────────────────────────────┘
                                   │
               ┌───────────────────┴───────────────────┐
               ▼                                       ▼
  ┌──────────────────────────────┐     ┌──────────────────────────────┐
  │   Spring Boot REST API       │     │   Python FastAPI AI Service  │
  │   Port 8080                  │     │   Port 8000                  │
  │   • Verification Workflow    │     │   • Tesseract Image OCR      │
  │   • Certificate Management   │     │   • Plate & Stamp Detection  │
  │   • Data Persistence (JPA)   │     │   • Regex Serial Extraction  │
  └──────────────┬───────────────┘     └──────────────────────────────┘
                 ▼
  ┌──────────────────────────────┐
  │   PostgreSQL Database        │
  │   • instruments              │
  │   • inspections              │
  │   • certificates             │
  └──────────────────────────────┘
```

---

## ⚡ Quick Start

### 1. One-Click Launch (Recommended)
Run the root batch script to automatically start all 3 services in separate terminal windows:
```cmd
launch_udlms.bat
```

### 2. Manual Startup

#### A. Frontend (React + Vite)
```bash
npm install
npm run dev
# Running at: http://localhost:5173/UDLMS/
```

#### B. AI OCR Microservice (FastAPI)
```bash
cd ai_service
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# API Docs at: http://localhost:8000/docs
```

#### C. Backend API (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
# REST Endpoints at: http://localhost:8080/api/instruments
```

---

## 👥 Stakeholder Access

* **Landing / Login**: `/UDLMS/`
* **Business Portal**: `/UDLMS/business` (Apply online, view inventory, download certificates)
* **LMO Officer Portal**: `/UDLMS/lmo` (Field inspection queue, photo upload, OCR auto-fill, certify)
* **Public Certificate Verification**: `/UDLMS/certificate/:id` (QR scannable digital certificate)

---

## 📜 Legal & Regulatory Compliance
* **Legal Metrology Act, 2009**
* **Legal Metrology (General) Rules, 2011**
* Enforced by the Department of Consumer Affairs, Government of India.
