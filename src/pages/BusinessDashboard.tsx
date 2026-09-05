import { useState, useEffect } from "react"
import { Plus, Search, LogOut, CheckCircle2, Clock, AlertTriangle, FileText, Upload, Check, ExternalLink } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getInstruments, createApplication, type Instrument } from "@/lib/api"

export default function BusinessDashboard() {
  const navigate = useNavigate()
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewAppOpen, setIsNewAppOpen] = useState(false)
  const [submittedAlert, setSubmittedAlert] = useState<string | null>(null)

  // Form State
  const [instName, setInstName] = useState("")
  const [capacity, setCapacity] = useState("")
  const [location, setLocation] = useState("")
  const [fileName, setFileName] = useState("")

  useEffect(() => {
    setInstruments(getInstruments())
  }, [])

  const handleLogout = () => {
    navigate("/")
  }

  const handleApply = () => {
    if (!instName.trim()) return

    const newInst = createApplication({
      name: instName,
      capacity: capacity || "50kg",
      location: location || "Downtown Warehouse"
    })

    setInstruments(getInstruments())
    setIsNewAppOpen(false)
    setInstName("")
    setCapacity("")
    setLocation("")
    setFileName("")

    setSubmittedAlert(`Application submitted for ${newInst.name} (${newInst.id})! Inspection scheduled in LMO Queue.`)
    setTimeout(() => setSubmittedAlert(null), 5000)
  }

  const filteredInstruments = instruments.filter(inst =>
    inst.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pendingCount = instruments.filter(i => i.status === "Pending").length
  const verifiedCount = instruments.filter(i => i.status === "Verified").length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0"><CheckCircle2 className="w-3 h-3 mr-1" /> {status}</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-0"><Clock className="w-3 h-3 mr-1" /> {status}</Badge>
      case "Expiring Soon":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0"><AlertTriangle className="w-3 h-3 mr-1" /> {status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-blue-800 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded">
              <FileText className="w-6 h-6 text-blue-800" />
            </div>
            <span className="font-bold text-lg tracking-wide">UDLMS | Business Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium hidden md:block">
              Acme Corp (ID: BIZ-0941)
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-blue-100 hover:text-white hover:bg-blue-700">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-500">
        {submittedAlert && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">{submittedAlert}</span>
            </div>
            <Button size="sm" variant="outline" className="text-green-800 border-green-300 hover:bg-green-100 h-8" onClick={() => navigate("/lmo")}>
              View in Officer Portal →
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Instruments & Applications</h1>
            <p className="text-slate-500 mt-1">Manage weighing & measuring devices under Legal Metrology Act compliance.</p>
          </div>
          
          <Dialog open={isNewAppOpen} onOpenChange={setIsNewAppOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-blue-700 hover:bg-blue-800 font-semibold shadow-sm">
                <Plus className="w-5 h-5 mr-2" /> Apply for Verification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Verification Application</DialogTitle>
                <DialogDescription>
                  Register a new commercial measuring instrument for official inspection and stamping.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="inst-name">Instrument Name / Type *</Label>
                  <Input 
                    id="inst-name" 
                    placeholder="e.g. Counter Scale, Heavy Platform Scale, Fuel Dispenser" 
                    value={instName}
                    onChange={(e) => setInstName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacity / Specification *</Label>
                  <Input 
                    id="capacity" 
                    placeholder="e.g. 50kg, 500kg, 60L/min" 
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Physical Installation Location *</Label>
                  <Input 
                    id="location" 
                    placeholder="e.g. Warehouse A, Downtown Market" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Supporting Purchase Invoice / Spec Sheet</Label>
                  <label className="border-2 border-dashed border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer relative overflow-hidden">
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                      accept="image/*,.pdf" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFileName(e.target.files[0].name)
                        }
                      }}
                    />
                    <Upload className="w-7 h-7 mb-2 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">
                      {fileName ? fileName : "Click or drag invoice document"}
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5">PDF or Image (Max 10MB)</span>
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewAppOpen(false)}>Cancel</Button>
                <Button className="bg-blue-700 hover:bg-blue-800 font-semibold" onClick={handleApply} disabled={!instName.trim()}>
                  Submit Application
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardDescription className="font-medium text-slate-500">Registered Instruments</CardDescription>
              <CardTitle className="text-3xl text-slate-900">{instruments.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardDescription className="font-medium text-slate-500">Pending Inspections</CardDescription>
              <CardTitle className="text-3xl text-amber-600">{pendingCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardDescription className="font-medium text-slate-500">Verification Rate</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {instruments.length > 0 ? `${Math.round((verifiedCount / instruments.length) * 100)}% Valid` : "100%"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">Application & Compliance Status</CardTitle>
              <CardDescription className="text-slate-500 font-medium mt-1">Live inventory of measuring instruments and verification validity.</CardDescription>
            </div>
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                type="search" 
                placeholder="Search ID, name, status..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 shadow-sm" 
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[140px] font-semibold text-slate-600">Instrument ID</TableHead>
                  <TableHead className="font-semibold text-slate-600">Type / Name</TableHead>
                  <TableHead className="font-semibold text-slate-600">Capacity</TableHead>
                  <TableHead className="font-semibold text-slate-600">Valid Until</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600 pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstruments.map((inst) => (
                  <TableRow key={inst.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                    <TableCell className="font-medium text-blue-700">{inst.id}</TableCell>
                    <TableCell className="text-slate-700 font-medium">{inst.name}</TableCell>
                    <TableCell className="text-slate-500">{inst.capacity}</TableCell>
                    <TableCell className="text-slate-500 font-medium">{inst.expiry}</TableCell>
                    <TableCell>
                      {getStatusBadge(inst.status)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {inst.status === "Verified" ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-700 hover:text-blue-900 hover:bg-blue-50 font-medium text-xs"
                          onClick={() => navigate(`/certificate/${inst.id === 'WS-458923' ? 'CERT-2026-8842' : 'CERT-2026-' + inst.id.replace(/\D/g, '').slice(0, 4)}`)}
                        >
                          Certificate <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">Awaiting LMO</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
