import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecruiterDashboard() {
  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Recruiter Dashboard</h1>
          <p className="text-slate-500">TechFlow India</p>
        </div>
        <Link href="/recruiter/jobs/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700">Post New Job</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Interviews Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mb-4 text-slate-900">Your Postings</h2>
      <div className="space-y-4">
        {/* Mock Job Listing */}
        <Card className="hover:border-indigo-200 transition-colors">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Frontend Developer Intern</h3>
              <p className="text-sm text-slate-500 mt-1">Hyderabad (Remote) • Expires in 28 days</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">View Applicants (12)</Button>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
