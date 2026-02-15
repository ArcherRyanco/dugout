import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user is a coach (has teams)
        const { data: teams } = await supabase
          .from('teams')
          .select('id')
          .eq('coach_id', user.id)
          .limit(1)
        
        const isCoach = teams && teams.length > 0
        
        if (isCoach) {
          // Redirect coaches to coach dashboard
          return NextResponse.redirect(new URL('/coach', request.url))
        } else {
          // Check if parent record exists for this user
          const { data: parent } = await supabase
            .from('parents')
            .select('id')
            .eq('user_id', user.id)
            .single()
          
          if (!parent) {
            // Create parent record if it doesn't exist
            await supabase
              .from('parents')
              .insert({
                email: user.email!,
                user_id: user.id,
              })
          }
          
          // Redirect parents to parent dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/auth/error', request.url))
}
