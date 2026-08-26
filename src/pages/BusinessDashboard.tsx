import { useState } from "react"
import { Plus, Search, LogOut, CheckCircle2, Clock, AlertTriangle, FileText, Upload } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const mockInstruments = [
  { id: "WS-458923", name: "Digital Weighing Scale", capacity: "50kg", status: "Verified", expiry: "10/09/2026" },
  { id: "FD-992101", name: "Fuel Dispenser Unit", capacity: "N/A", status: "Pending", expiry: "-" },
  { id: "PS-334120", name: "Platform Scale", capacity: "500kg", status: "Expiring Soon", expiry: "25/09/2026" },
]

export default function BusinessDashboard() {
  const navigate = useNavigate()
  const [isNewAppOpen, setIsNewAppOpen] = useState(false)

  const handleLogout = () => {
    navigate("/")
  }

  const handleApply = () => {
    setIsNewAppOpen(false)
    // Add logic here to submit application
  }

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
              Acme Corp
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-blue-100 hover:text-white hover:bg-blue-700">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your instruments and verification applications.</p>
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
                  Register a new measuring instrument for legal verification.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="inst-name">Instrument Name / Type</Label>
                  <Input id="inst-name" placeholder="e.g. Digital Weighing Scale" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacity / Specification</Label>
                  <Input id="capacity" placeholder="e.g. 50kg" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Physical Location</Label>
                  <Input id="location" placeholder="e.g. Warehouse A, Downtown" />
                </div>
                <div className="grid gap-2">
                  <Label>Supporting Documents</Label>
                  <label className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer relative overflow-hidden">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" accept="image/*,.pdf" />
                    <Upload className="w-8 h-8 mb-2 text-slate-400" />
                    <span className="text-sm font-medium">Click to upload purchase receipt</span>
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewAppOpen(false)}>Cancel</Button>
                <Button className="bg-blue-700 hover:bg-blue-800" onClick={handleApply}>Submit Application</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardDescription className="font-medium text-slate-500">Registered Instruments</CardDescription>
              <CardTitle className="text-3xl text-slate-900">1,248</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardDescription className="font-medium text-slate-500">Pending Applications</CardDescription>
              <CardTitle className="text-3xl text-slate-900">14</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardDescription className="font-medium text-slate-500">Verification Rate</CardDescription>
              <CardTitle className="text-3xl text-green-600">98% Valid</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">Application Status</CardTitle>
              <CardDescription className="text-slate-500 font-medium mt-1">View the status of your recently registered measuring instruments.</CardDescription>
            </div>
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input type="search" placeholder="Search ID..." className="pl-10 bg-slate-50 border-slate-200 shadow-sm" />
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
                  <TableHead className="text-right font-semibold text-slate-600 pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInstruments.map((inst) => (
                  <TableRow key={inst.id} className="hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100">
                    <TableCell className="font-medium text-blue-700">{inst.id}</TableCell>
                    <TableCell className="text-slate-700">{inst.name}</TableCell>
                    <TableCell className="text-slate-500">{inst.capacity}</TableCell>
                    <TableCell className="text-slate-500 font-medium">{inst.expiry}</TableCell>
                    <TableCell className="text-right pr-6">
                      {getStatusBadge(inst.status)}
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
