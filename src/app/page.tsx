import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  async function signOut() {
    'use server'
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Welcome to <span className="text-indigo-600">HireFlow</span>
        </h1>
        <p className="text-xl leading-8 text-slate-600">
          The verified, transparent, and skills-first job portal for freshers, internship seekers, startups, and SMEs in Andhra Pradesh and Telangana.
        </p>
        
        {user ? (
          <div className="flex flex-col items-center justify-center gap-4 bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <p className="text-lg font-medium text-indigo-900">
              You are signed in as: <span className="font-bold">{user.email}</span>
            </p>
            <div className="flex gap-4">
              <Link 
                href="/candidate/dashboard" 
                className={buttonVariants({ size: "lg", className: "bg-indigo-600 hover:bg-indigo-700 text-white" })}
              >
                Go to Dashboard
              </Link>
              <form action={signOut}>
                <button type="submit" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link 
              href="/auth/login?role=candidate" 
              className={buttonVariants({ size: "lg", className: "w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white" })}
            >
              I'm looking for a job
            </Link>
            <Link 
              href="/auth/login?role=recruiter" 
              className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto" })}
            >
              I'm hiring
            </Link>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">100% Free Tools</h3>
            <p className="mt-2 text-sm text-slate-500">No hidden costs. Built for scale and affordability.</p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Verified Companies</h3>
            <p className="mt-2 text-sm text-slate-500">No scam employers or ghost jobs. We verify every company.</p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Smart Matching</h3>
            <p className="mt-2 text-sm text-slate-500">Transparent skills-based matching system for freshers.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
