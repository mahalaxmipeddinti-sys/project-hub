import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-10 max-w-6xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard - God Mode</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Total Users</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">1,402</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Pending Companies</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-amber-600">8</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Active Jobs</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">142</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Spam Reports</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-red-600">3</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Verification Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <p className="font-bold text-slate-900">NextGen Solutions Pvt Ltd</p>
                <p className="text-xs text-slate-500">Reg No: U72900TS2022PTC123456</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                <Button size="sm" variant="destructive">Reject</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">
              <p className="font-bold">Duplicate IP Alert</p>
              <p className="text-sm">3 Recruiter accounts created from identical IP in the last hour.</p>
              <Button size="sm" variant="outline" className="mt-3 border-red-300 text-red-700 hover:bg-red-100">Investigate</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
