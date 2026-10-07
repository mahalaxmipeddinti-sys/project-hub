"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function ApplyJob({ params }: { params: { id: string } }) {
  const router = useRouter()

  const handleApply = () => {
    // Application submit logic here
    alert("Application submitted successfully!")
    router.push("/candidate/profile")
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Apply for Frontend Developer Intern</CardTitle>
          <CardDescription>TechFlow India is reviewing applications on a rolling basis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-center justify-between">
            <div>
              <p className="font-bold text-indigo-900">Your profile score is 70%</p>
              <p className="text-sm text-indigo-700">You meet the minimum requirements for 1-click apply!</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/candidate/profile")}>Edit Profile</Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Screening Questions</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Are you available for 6 months full-time?</label>
              <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>

          <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleApply}>
            Submit Application
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
