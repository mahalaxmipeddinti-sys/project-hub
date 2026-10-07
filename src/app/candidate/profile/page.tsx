"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { candidateProfileSchema, type CandidateProfileFormData } from "@/schemas/candidate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CandidateProfile() {
  const [uploading, setUploading] = useState(false)
  const [score, setScore] = useState(20) // Mock completion score

  const { register, handleSubmit, formState: { errors } } = useForm<CandidateProfileFormData>({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues: {
      locations: ["Hyderabad"], // Default mock location
      is_public: false
    }
  })

  const onSubmit = async (data: CandidateProfileFormData) => {
    console.log("Saving profile...", data)
    // Server action call will go here
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert("File must be less than 2MB")
      return
    }

    setUploading(true)
    // Resume upload to Supabase storage logic here
    setTimeout(() => {
      setUploading(false)
      setScore(70) // Boost score on resume upload
      alert("Resume uploaded and parsed successfully!")
    }, 1500)
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Your Profile</h1>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-600">Profile Completion</span>
          <span className="text-sm font-bold text-indigo-600">{score}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all" style={{ width: `${score}%` }}></div>
        </div>
        {score < 70 && (
          <p className="text-xs text-amber-600 mt-2">Reach 70% to enable 1-click apply. Add your resume next!</p>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
            <CardDescription>Upload your PDF or DOCX (Max 2MB). We will automatically extract your skills!</CardDescription>
          </CardHeader>
          <CardContent>
            <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={uploading} />
            {uploading && <p className="text-sm text-indigo-600 mt-2">Uploading and parsing...</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input id="first_name" {...register("first_name")} />
                  {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input id="last_name" {...register("last_name")} />
                  {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...register("phone")} />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Save Profile</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
