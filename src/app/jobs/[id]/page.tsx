import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function JobDetail({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Frontend Developer Intern</h1>
          <p className="text-xl text-slate-600 mt-2">TechFlow India • Remote</p>
        </div>
        <Link href={`/jobs/${params.id}/apply`}>
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8">Apply Now</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent className="prose">
              <p>We are looking for a passionate Frontend Developer Intern to join our team. You will be working directly with the core product team on our Next.js dashboard.</p>
              <h4>Responsibilities:</h4>
              <ul>
                <li>Develop responsive UIs using Tailwind CSS</li>
                <li>Integrate with Supabase backend APIs</li>
                <li>Write clean, type-safe TypeScript code</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="block text-sm text-slate-500">Salary</span>
                <span className="font-medium">₹10,000 - ₹20,000 / month</span>
              </div>
              <div>
                <span className="block text-sm text-slate-500">Job Type</span>
                <span className="font-medium">Internship</span>
              </div>
              <div>
                <span className="block text-sm text-slate-500">Required Skills</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs">React</span>
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs">TypeScript</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
