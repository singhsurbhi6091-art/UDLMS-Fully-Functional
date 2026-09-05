import { useState, useEffect } from "react"
import { Camera, MapPin, Search, CheckCircle2, AlertTriangle, User, ArrowRight, ClipboardCheck, Loader2, Sparkles, ExternalLink, FileCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getTasks, submitVerification, performOCR, type InspectionTask } from "@/lib/api"

export default function LMODashboard() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<InspectionTask[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Active Verification Modal State
  const [activeTask, setActiveTask] = useState<InspectionTask | null>(null)
  const [inspectionResult, setInspectionResult] = useState<"Pass (Verified)" | "Fail (Needs Repair)" | "Confiscated">("Pass (Verified)")
  const [remarks, setRemarks] = useState("")
  const [capturedSerial, setCapturedSerial] = useState("")
  const [isScanningOCR, setIsScanningOCR] = useState(false)
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState<string | null>(null)

  // Certificate Success Modal State
  const [generatedCertId, setGeneratedCertId] = useState<string | null>(null)

  useEffect(() => {
    setTasks(getTasks())
  }, [])

  const handleOpenVerify = (task: InspectionTask) => {
    setActiveTask(task)
    setInspectionResult("Pass (Verified)")
    setRemarks("")
    setCapturedSerial(task.instId)
    setOcrSuccessMsg(null)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, forTask?: InspectionTask) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (forTask && (!activeTask || activeTask.id !== forTask.id)) {
      handleOpenVerify(forTask)
    }

    setIsScanningOCR(true)
    setOcrSuccessMsg(null)

    try {
      const ocrResult = await performOCR(file)
      setCapturedSerial(ocrResult.detected_serial)
      setOcrSuccessMsg(`AI OCR Detected: ${ocrResult.detected_serial}`)
    } catch (err) {
      console.error(err)
    } finally {
      setIsScanningOCR(false)
    }
  }

  const handleSubmit = () => {
    if (!activeTask) return

    const { certId } = submitVerification(
      activeTask.id,
      inspectionResult,
      remarks || "Verified conforming to Legal Metrology General Rules, 2011",
      capturedSerial
    )

    setTasks(getTasks())
    setActiveTask(null)

    if (certId) {
      setGeneratedCertId(certId)
    }
  }

  const filteredTasks = tasks.filter(t =>
    t.instId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.business.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pendingTasks = filteredTasks.filter(t => t.status === "Pending" || t.status === "Overdue")
  const completedTasks = filteredTasks.filter(t => t.status === "Completed")

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-blue-900 text-white sticky top-0 z-20 shadow-md">
        <div className="px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded">
               <ClipboardCheck className="w-5 h-5 text-blue-900" />
            </div>
            <span className="font-bold text-lg tracking-wide">UDLMS | LMO Field Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-200 hidden sm:inline">Inspector V. K. Verma</span>
            <Button variant="ghost" size="icon" className="text-blue-100 hover:text-white hover:bg-blue-800 rounded-full" onClick={() => navigate("/")}>
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto p-4 space-y-4 animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Assigned Inspections</h1>
            <p className="text-sm text-slate-500 mt-0.5">Field stamping schedule for Central District</p>
          </div>
          <div className="text-right">
            <Badge className="bg-blue-100 text-blue-800 shadow-sm border-0 font-bold px-3 py-1">
              {pendingTasks.length} Active
            </Badge>
          </div>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input 
            type="search" 
            placeholder="Search tasks, ID, business, location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white border border-slate-200 shadow-sm rounded-lg text-base" 
          />
        </div>

        <Tabs defaultValue="pending" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-slate-200 p-1 rounded-lg">
            <TabsTrigger value="pending" className="font-medium rounded-md">
              Pending Tasks ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="font-medium rounded-md">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4 mt-4">
            {pendingTasks.length === 0 ? (
              <div className="p-10 text-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <h3 className="font-bold text-slate-800">All Tasks Completed!</h3>
                <p className="text-sm mt-1">No pending verification inspections in queue.</p>
              </div>
            ) : (
              pendingTasks.map((task) => (
                <Card key={task.id} className="shadow-sm border border-slate-200 bg-white overflow-hidden">
                  <div className={`h-1 w-full ${task.status === 'Overdue' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                  <CardHeader className="pb-3 pt-4 px-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-bold text-slate-800">{task.business}</CardTitle>
                        <CardDescription className="flex items-center mt-1 text-slate-600 text-sm">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {task.location} <span className="mx-1.5">•</span> <span className="font-medium text-blue-700">{task.distance}</span>
                        </CardDescription>
                      </div>
                      {task.status === 'Overdue' ? (
                        <Badge variant="destructive" className="bg-red-100 text-red-800 border-0 font-semibold px-2 py-0.5"><AlertTriangle className="w-3 h-3 mr-1"/> {task.status}</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-0 font-semibold px-2 py-0.5">{task.status}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4 px-4">
                    <p className="text-sm text-slate-600 bg-slate-50 inline-block px-3 py-1.5 rounded border border-slate-100">
                      Instrument ID: <span className="font-bold text-slate-900 ml-1">{task.instId}</span>
                    </p>
                  </CardContent>
                  <CardFooter className="bg-slate-50 p-3 flex gap-3 border-t border-slate-100">
                    <label className="flex-1">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, task)} 
                      />
                      <Button 
                        type="button"
                        variant="outline" 
                        className="w-full bg-white border-slate-200 shadow-sm hover:bg-slate-100 h-10 font-medium pointer-events-none"
                      >
                        <Camera className="w-4 h-4 mr-2 text-slate-500" /> Photo / OCR
                      </Button>
                    </label>
                    
                    <Button 
                      className="flex-1 bg-blue-700 hover:bg-blue-800 shadow-sm h-10 font-semibold"
                      onClick={() => handleOpenVerify(task)}
                    >
                      Verify <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3 mt-4">
            {completedTasks.length === 0 ? (
              <div className="p-10 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
                <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">Queue Empty</h3>
                <p className="text-sm">No completed tasks yet today.</p>
              </div>
            ) : (
              completedTasks.map((t) => (
                <Card key={t.id} className="p-4 bg-white border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{t.business}</span>
                      <Badge className="bg-green-100 text-green-800 border-0 text-xs py-0.5">
                        {t.result || "Pass (Verified)"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Instrument: {t.instId} • Serial: {t.capturedSerial || t.instId}</p>
                    {t.remarks && <p className="text-xs text-slate-600 italic mt-0.5">"{t.remarks}"</p>}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-blue-700 border-blue-200 hover:bg-blue-50 text-xs"
                    onClick={() => navigate(`/certificate/${t.instId === 'WS-458923' ? 'CERT-2026-8842' : 'CERT-2026-' + t.instId.replace(/\D/g, '').slice(0, 4)}`)}
                  >
                    View Cert <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Active Inspection Dialog */}
        <Dialog open={!!activeTask} onOpenChange={(open) => !open && setActiveTask(null)}>
          <DialogContent className="sm:max-w-[425px] w-[95%]">
            <DialogHeader>
              <DialogTitle>Field Inspection & Verification</DialogTitle>
              <DialogDescription>
                Submit observation results for {activeTask?.instId} at {activeTask?.business}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 flex-shrink-0">
                    {isScanningOCR ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Instrument Serial / Stamp Capture</p>
                    <label className="text-blue-700 text-xs font-semibold cursor-pointer hover:underline inline-block mt-0.5">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                      />
                      {isScanningOCR ? "AI OCR Processing..." : "📸 Tap to capture / upload plate photo"}
                    </label>
                  </div>
                </div>

                {ocrSuccessMsg && (
                  <div className="bg-green-100 text-green-800 text-xs p-2 rounded flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-green-700" />
                    <span>{ocrSuccessMsg}</span>
                  </div>
                )}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="captured-serial" className="text-xs font-semibold text-slate-700">Serial Number (OCR Confirmed)</Label>
                <Input 
                  id="captured-serial" 
                  value={capturedSerial}
                  onChange={(e) => setCapturedSerial(e.target.value)}
                  placeholder="e.g. EW-50K-8821" 
                  className="bg-white border-slate-300 font-mono text-sm"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="status" className="text-xs font-semibold text-slate-700">Inspection Verdict</Label>
                <select 
                  id="status" 
                  value={inspectionResult}
                  onChange={(e) => setInspectionResult(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 font-medium"
                >
                  <option value="Pass (Verified)">Pass (Verified & Stamped)</option>
                  <option value="Fail (Needs Repair)">Fail (Needs Repair / Recalibration)</option>
                  <option value="Confiscated">Confiscated (Tampered / Non-compliant)</option>
                </select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="remarks" className="text-xs font-semibold text-slate-700">Inspector Observations</Label>
                <Input 
                  id="remarks" 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Standard weights checked; lead seal applied." 
                  className="bg-white border-slate-300 text-sm"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setActiveTask(null)}>Cancel</Button>
              <Button className="bg-blue-700 hover:bg-blue-800 font-semibold" onClick={handleSubmit}>
                Submit Verification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Certificate Generated Success Dialog */}
        <Dialog open={!!generatedCertId} onOpenChange={(open) => !open && setGeneratedCertId(null)}>
          <DialogContent className="sm:max-w-[400px] text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-700 shadow-sm border border-green-200">
              <FileCheck className="w-8 h-8" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">Verification Complete!</DialogTitle>
            <DialogDescription className="text-sm text-slate-600 mt-1">
              Official QR-enabled Digital Certificate <span className="font-bold text-slate-900">{generatedCertId}</span> has been issued and registered on the central ledger.
            </DialogDescription>
            <div className="pt-4 flex flex-col gap-2">
              <Button 
                className="bg-blue-700 hover:bg-blue-800 font-semibold"
                onClick={() => {
                  const id = generatedCertId
                  setGeneratedCertId(null)
                  navigate(`/certificate/${id}`)
                }}
              >
                View Digital Certificate & QR →
              </Button>
              <Button variant="outline" onClick={() => setGeneratedCertId(null)}>
                Done (Back to Queue)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
