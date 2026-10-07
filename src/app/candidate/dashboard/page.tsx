export default function CandidateDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Candidate Dashboard</h1>
      <p className="text-slate-600">Welcome to your dashboard! From here you can manage your profile, view saved jobs, and track your applications.</p>
      
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Applied Jobs</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">0</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Saved Jobs</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">0</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Profile Completion</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">25%</p>
        </div>
      </div>
    </div>
  )
}
