import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Temporarily disable the auth fetch so it doesn't freeze the page for 25 seconds if local Supabase is off
  /*
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Temporarily disabling route protection for MVP UI building phase
  
  // Protect routes based on role (fetch role from public.users table)
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // Role-based routing rules
    if (request.nextUrl.pathname.startsWith('/candidate') && role !== 'candidate') {
      return NextResponse.redirect(new URL('/auth/unauthorized', request.url))
    }
    if (request.nextUrl.pathname.startsWith('/recruiter') && role !== 'recruiter' && role !== 'hiring_manager') {
      return NextResponse.redirect(new URL('/auth/unauthorized', request.url))
    }
    if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/unauthorized', request.url))
    }
  } else {
    // If not logged in and trying to access a protected route
    if (
      request.nextUrl.pathname.startsWith('/candidate') ||
      request.nextUrl.pathname.startsWith('/recruiter') ||
      request.nextUrl.pathname.startsWith('/admin')
    ) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }
  */

  return supabaseResponse
}
