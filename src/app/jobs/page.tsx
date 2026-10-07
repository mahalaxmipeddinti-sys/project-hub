import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function JobSearch() {
  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Find Your Next Job</h1>
      
      <div className="flex gap-4 mb-8">
        <Input placeholder="Search job titles or keywords..." className="flex-1" />
        <Input placeholder="Location (e.g. Hyderabad)" className="w-1/3" />
        <Button className="bg-indigo-600 hover:bg-indigo-700">Search</Button>
      </div>

      <div className="space-y-4">
        {/* Mock Job Listing */}
        <Card className="hover:border-indigo-200 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Frontend Developer Intern</h3>
                <p className="text-slate-600 font-medium mt-1">TechFlow India</p>
                <div className="flex gap-3 mt-3 text-sm text-slate-500">
                  <span className="bg-slate-100 px-2 py-1 rounded">Remote</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">Internship</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">₹10k - ₹20k / month</span>
                </div>
              </div>
              <Link href="/jobs/j0000000-0000-0000-0000-000000000001">
                <Button className="bg-indigo-600 hover:bg-indigo-700">View Details</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
