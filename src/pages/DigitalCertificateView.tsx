import { ShieldCheck, Calendar, FileText, CheckCircle, QrCode } from "lucide-react"
import { useParams, Link } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function DigitalCertificateView() {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg border border-slate-200 overflow-hidden bg-white">
        <CardHeader className="text-center pb-6 border-b border-slate-100 bg-slate-50">
          <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm border border-green-200">
            <ShieldCheck className="w-8 h-8 text-green-700" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Verified Digital Certificate</CardTitle>
          <div className="mt-2">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 shadow-sm border-0"><CheckCircle className="w-3 h-3 mr-1" /> Authentic & Valid</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-8 pb-8 px-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500 flex items-center"><FileText className="w-4 h-4 mr-1 text-slate-400" /> Certificate ID</p>
                <p className="font-semibold text-slate-900">{id || "CERT-2026-8842"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500 flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-400" /> Valid Until</p>
                <p className="font-semibold text-slate-900">10 Sept 2026</p>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Instrument Details</h4>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Name</span>
                  <span className="font-medium text-slate-900">Digital Weighing Scale</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Owner</span>
                  <span className="font-medium text-slate-900">Acme Corp</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location</span>
                  <span className="font-medium text-slate-900 text-right">Downtown Market, District A</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center pt-2">
               <div className="border border-slate-200 p-2 rounded-xl bg-white shadow-sm">
                 <QrCode className="w-24 h-24 text-slate-800" />
               </div>
               <p className="text-xs text-slate-500 mt-2 text-center max-w-[200px]">Scan with UDLMS app to verify authenticity</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-blue-900 text-blue-100 p-4 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>Issued by Dept of Legal Metrology</p>
          <Button variant="link" className="text-white hover:text-blue-200 p-0 h-auto mt-2 sm:mt-0 font-medium" asChild>
            <Link to="/">Go to Portal</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
