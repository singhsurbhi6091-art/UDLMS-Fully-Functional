import { Camera, MapPin, Search, CheckCircle2, AlertTriangle, User, ArrowRight, ClipboardCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const mockTasks = [
  { id: "T-8842", instId: "WS-458923", business: "Acme Corp", location: "Downtown Market", status: "Pending", distance: "1.2 km" },
  { id: "T-8845", instId: "FD-992101", business: "Star Fuel Station", location: "Highway 14", status: "Overdue", distance: "4.5 km" },
]

export default function LMODashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-blue-900 text-white sticky top-0 z-20 shadow-md">
        <div className="px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded">
               <ClipboardCheck className="w-5 h-5 text-blue-900" />
            </div>
            <span className="font-bold text-lg tracking-wide">LMO Field Portal</span>
          </div>
          <Button variant="ghost" size="icon" className="text-blue-100 hover:text-white hover:bg-blue-800 rounded-full" onClick={() => navigate("/")}>
            <User className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto p-4 space-y-4 animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Inspections</h1>
            <p className="text-sm text-slate-500 mt-0.5">Assigned schedule for today</p>
          </div>
          <div className="text-right">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 shadow-sm border-0 font-bold px-3 py-1">2 Active</Badge>
          </div>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input type="search" placeholder="Search tasks or locations..." className="pl-10 h-11 bg-white border border-slate-200 shadow-sm rounded-lg text-base" />
        </div>

        <Tabs defaultValue="pending" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-slate-200 p-1 rounded-lg">
            <TabsTrigger value="pending" className="font-medium rounded-md">Pending Tasks</TabsTrigger>
            <TabsTrigger value="completed" className="font-medium rounded-md">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4 mt-4">
            {mockTasks.map((task) => (
              <Card key={task.id} className="shadow-sm border border-slate-200 bg-white overflow-hidden">
                <div className={`h-1 w-full ${task.status === 'Overdue' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                <CardHeader className="pb-3 pt-4 px-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-800">{task.business}</CardTitle>
                      <CardDescription className="flex items-center mt-1 text-slate-600 text-sm">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {task.location} <span className="mx-1.5">•</span> <span className="font-medium">{task.distance}</span>
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
                  <p className="text-sm text-slate-600 bg-slate-50 inline-block px-3 py-1.5 rounded border border-slate-100">Instrument ID: <span className="font-bold text-slate-900 ml-1">{task.instId}</span></p>
                </CardContent>
                <CardFooter className="bg-slate-50 p-3 flex gap-3 border-t border-slate-100">
                  <Button variant="outline" className="flex-1 bg-white border-slate-200 shadow-sm hover:bg-slate-100 h-10 font-medium">
                    <Camera className="w-4 h-4 mr-2 text-slate-500" /> Photo / OCR
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex-1 bg-blue-700 hover:bg-blue-800 shadow-sm h-10 font-semibold">
                        Verify <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] w-[95%]">
                      <DialogHeader>
                        <DialogTitle>Verification Details</DialogTitle>
                        <DialogDescription>
                          Submit verification results for {task.instId} at {task.business}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                           <div className="w-16 h-16 bg-slate-200 flex items-center justify-center rounded overflow-hidden">
                             <Camera className="w-6 h-6 text-slate-400" />
                           </div>
                           <div className="flex-1">
                             <p className="text-sm font-medium text-slate-700">Serial No. Capture</p>
                             <p className="text-xs text-slate-500">No image uploaded</p>
                             <label className="text-blue-700 mt-1 text-sm font-medium cursor-pointer hover:underline inline-block relative overflow-hidden">
                               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" accept="image/*" />
                               Upload Image
                             </label>
                           </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="status">Inspection Result</Label>
                          <select id="status" className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                            <option>Pass (Verified)</option>
                            <option>Fail (Needs Repair)</option>
                            <option>Confiscated</option>
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="remarks">Inspector Remarks</Label>
                          <Input id="remarks" placeholder="Optional notes about the condition" />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogTrigger asChild>
                           <Button variant="outline">Cancel</Button>
                        </DialogTrigger>
                        <DialogTrigger asChild>
                           <Button className="bg-blue-700 hover:bg-blue-800">Submit Verification</Button>
                        </DialogTrigger>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="completed" className="p-10 text-center text-slate-500">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Queue Empty</h3>
            <p className="text-sm">No completed tasks yet for today.</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
