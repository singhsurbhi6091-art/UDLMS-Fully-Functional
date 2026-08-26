import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Scale, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LandingPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (role: string) => {
    if (role === "business") {
      navigate("/business")
    } else if (role === "lmo") {
      navigate("/lmo")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="w-full bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-blue-800">
          <Scale className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">Dept. of Legal Metrology</span>
        </div>
        <div className="text-sm font-medium text-slate-500 hidden sm:block">
          Smart India Hackathon 2026
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 gap-12 max-w-7xl mx-auto w-full">
        <div className="flex-1 flex flex-col items-start text-left max-w-2xl animate-in fade-in duration-700 slide-in-from-left-8">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-6 px-3 py-1 text-sm font-semibold border-0 shadow-sm">
            UDLMS Portal
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl mb-6 text-slate-900 leading-tight">
            Unified Digital <br />
            <span className="text-blue-700">Legal Metrology</span> System
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
            A secure, centralized ecosystem to verify, certify, and track weighing and measuring instruments. Ensuring transparency and trust for businesses and consumers alike.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
              <div className="bg-green-100 p-2 rounded-full text-green-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Secure Verification</h4>
                <p className="text-sm text-slate-500">End-to-end encryption</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md animate-in fade-in duration-700 slide-in-from-right-8 delay-150">
          <Card className="shadow-lg border border-slate-200 bg-white">
            <CardHeader className="space-y-2 pb-6 pt-8 border-b border-slate-100">
              <CardTitle className="text-2xl text-center font-bold text-slate-900">Portal Access</CardTitle>
              <CardDescription className="text-center text-slate-500">
                Authenticate to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-6">
              <Tabs defaultValue="business" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-slate-100 rounded-lg">
                  <TabsTrigger value="business" className="font-semibold rounded-md">Business</TabsTrigger>
                  <TabsTrigger value="lmo" className="font-semibold rounded-md">Officer</TabsTrigger>
                </TabsList>
                
                <TabsContent value="business" className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">Business Email</Label>
                    <Input id="email" type="email" placeholder="contact@business.com" value={email} onChange={(e: any) => setEmail(e.target.value)} className="h-11 border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} className="h-11 border-slate-300" />
                  </div>
                  <Button className="w-full h-11 text-base font-semibold bg-blue-700 hover:bg-blue-800 shadow-sm mt-2" onClick={() => handleLogin("business")}>
                    Sign In as Business
                  </Button>
                </TabsContent>
                
                <TabsContent value="lmo" className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="lmo-email" className="text-slate-700 font-medium">Officer ID</Label>
                    <Input id="lmo-email" type="email" placeholder="officer@lmo.gov.in" className="h-11 border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lmo-password" className="text-slate-700 font-medium">Password</Label>
                    <Input id="lmo-password" type="password" className="h-11 border-slate-300" />
                  </div>
                  <Button className="w-full h-11 text-base font-semibold bg-blue-900 hover:bg-blue-950 text-white shadow-sm mt-2" onClick={() => handleLogin("lmo")}>
                    Secure Login
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-slate-100 py-4 bg-slate-50">
              <p className="text-xs font-medium text-slate-500">
                Unauthorized access is strictly prohibited.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
