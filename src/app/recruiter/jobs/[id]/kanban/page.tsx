import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function KanbanBoard({ params }: { params: { id: string } }) {
  // Hardcoded stages for the state machine logic
  const stages = [
    { id: 'applied', title: 'New Applied' },
    { id: 'screening', title: 'Screening' },
    { id: 'shortlisted', title: 'Shortlisted' },
    { id: 'interview', title: 'Interview' },
    { id: 'offered', title: 'Offered' },
    { id: 'rejected', title: 'Rejected' },
  ]

  return (
    <div className="container mx-auto py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Applicant Pipeline</h1>
        <p className="text-slate-500">Frontend Developer Intern</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-8 snap-x">
        {stages.map(stage => (
          <div key={stage.id} className="w-[300px] shrink-0 snap-start">
            <div className="bg-slate-100 rounded-lg p-3 min-h-[500px]">
              <h3 className="font-semibold text-slate-700 mb-3 uppercase text-xs tracking-wider px-1">{stage.title}</h3>
              
              {/* Mock Applicant Card */}
              {stage.id === 'applied' && (
                <Card className="mb-3 cursor-grab hover:ring-2 hover:ring-indigo-400">
                  <CardContent className="p-4">
                    <p className="font-bold text-slate-900">Rahul Sharma</p>
                    <p className="text-xs text-slate-500 mb-2">B.Tech CS • 2024</p>
                    <div className="flex items-center justify-between">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">85% Match</span>
                      <span className="text-xs text-slate-400">2h ago</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
