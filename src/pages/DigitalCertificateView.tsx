import { useState } from "react"
import { ShieldCheck, Calendar, FileText, CheckCircle, Printer, Copy, Check } from "lucide-react"
import { useParams, Link } from "react-router-dom"
import { QRCodeSVG } from "qrcode.react"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getCertificateById } from "@/lib/api"

export default function DigitalCertificateView() {
  const { id } = useParams()
  const certId = id || "CERT-2026-8842"
  const cert = getCertificateById(certId)
  const [copied, setCopied] = useState(false)

  const currentUrl = typeof window !== "undefined" ? window.location.href : `https://234-maker.github.io/UDLMS/certificate/${certId}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 print:p-0 print:bg-white">
      <Card className="w-full max-w-lg shadow-xl border border-slate-200 overflow-hidden bg-white print:shadow-none print:border-0">
        <CardHeader className="text-center pb-6 border-b border-slate-100 bg-slate-50 print:bg-white">
          <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm border border-green-200">
            <ShieldCheck className="w-8 h-8 text-green-700" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Verified Digital Certificate</CardTitle>
          <div className="mt-2 flex items-center justify-center gap-2">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 shadow-sm border-0 font-semibold px-3 py-1">
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Authentic & Valid Under Law
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-2">Legal Metrology Act, 2009 & General Rules, 2011</p>
        </CardHeader>
        
        <CardContent className="pt-6 pb-6 px-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 flex items-center"><FileText className="w-3.5 h-3.5 mr-1 text-slate-400" /> CERTIFICATE ID</p>
                <p className="font-bold text-slate-900 text-sm tracking-wide">{cert.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> VALID UNTIL</p>
                <p className="font-bold text-green-700 text-sm">{cert.validUntil}</p>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Instrument Specifications</h4>
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Instrument Type</span>
                  <span className="font-medium text-slate-900">{cert.instrumentName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Capacity / Class</span>
                  <span className="font-medium text-slate-900">{cert.capacity}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Registered Owner</span>
                  <span className="font-medium text-slate-900">{cert.owner}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Location</span>
                  <span className="font-medium text-slate-900 text-right">{cert.location}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Verified By</span>
                  <span className="font-medium text-blue-900 text-right">{cert.issuedBy}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Scannable QR Code */}
            <div className="flex flex-col items-center justify-center pt-2">
               <div className="border-2 border-slate-200 p-3 rounded-2xl bg-white shadow-md">
                 <QRCodeSVG 
                   value={currentUrl} 
                   size={130}
                   level="H"
                   includeMargin={false}
                 />
               </div>
               <p className="text-xs font-semibold text-slate-600 mt-2 text-center">
                 Scan with any camera to verify authenticity
               </p>
               <p className="text-[11px] text-slate-400 text-center mt-0.5">
                 Cryptographically bound to UDLMS central registry
               </p>
            </div>

            <div className="flex gap-2 print:hidden">
              <Button variant="outline" size="sm" className="flex-1 text-slate-700" onClick={handleCopyLink}>
                {copied ? <Check className="w-4 h-4 mr-1 text-green-600" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? "Link Copied!" : "Copy Link"}
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-slate-700" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-1" /> Print Certificate
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-blue-900 text-blue-100 p-4 flex flex-col sm:flex-row justify-between items-center text-sm print:hidden">
          <p className="text-xs">Govt. of India • Dept. of Legal Metrology</p>
          <Button variant="link" className="text-white hover:text-blue-200 p-0 h-auto mt-2 sm:mt-0 font-medium text-xs" asChild>
            <Link to="/">← Back to UDLMS Portal</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
