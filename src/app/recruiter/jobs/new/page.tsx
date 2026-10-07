"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { jobSchema, type JobFormData } from "@/schemas/job"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function PostJob() {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      type: 'full-time',
      mode: 'on-site',
      expiry_days: 30
    }
  })

  const onSubmit = async (data: JobFormData) => {
    console.log("Posting job...", data)
    // Server action will go here
    alert("Job posted successfully!")
    router.push("/recruiter/dashboard")
  }

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Post a New Job</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Posts automatically expire after a set duration (max 60 days) to prevent stale listings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" placeholder="e.g. Frontend Developer Intern" {...register("title")} />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <textarea 
                id="description" 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe the role and responsibilities..."
                {...register("description")} 
              />
              {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <select 
                  id="type"
                  className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                  {...register("type")}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
                {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mode">Work Mode</Label>
                <select 
                  id="mode"
                  className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                  {...register("mode")}
                >
                  <option value="on-site">On-site</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote</option>
                </select>
                {errors.mode && <p className="text-red-500 text-xs">{errors.mode.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g. Hyderabad, TS" {...register("location")} />
              {errors.location && <p className="text-red-500 text-xs">{errors.location.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary_min">Min Salary (Optional)</Label>
                <Input id="salary_min" type="number" {...register("salary_min")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_max">Max Salary (Optional)</Label>
                <Input id="salary_max" type="number" {...register("salary_max")} />
                {errors.salary_max && <p className="text-red-500 text-xs">{errors.salary_max.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills (Comma separated)</Label>
              <Input id="skills" placeholder="React, TypeScript, Next.js" onChange={(e) => {
                // Mock skill parsing for UI
                const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                // In a real setup, we'd use a multi-select component here. 
                // For MVP, just pushing to RHF:
                // ... (requires more complex RHF wiring)
              }} />
              <p className="text-xs text-slate-500">For MVP, assume these are properly registered in the state.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry_days">Expiry Duration (Days)</Label>
              <Input id="expiry_days" type="number" min="1" max="60" {...register("expiry_days")} />
              {errors.expiry_days && <p className="text-red-500 text-xs">{errors.expiry_days.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700">
              Publish Job Post
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
