'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [teamName, setTeamName] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const teamCode = searchParams.get('team')

  useEffect(() => {
    // If coming from team join flow, fetch team name
    if (teamCode) {
      const supabase = createClient()
      supabase
        .from('teams')
        .select('name')
        .eq('code', teamCode)
        .single()
        .then(({ data }) => {
          if (data) setTeamName(data.name)
        })
    }
  }, [teamCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    
    // Get the redirect URL
    const redirectTo = `${window.location.origin}/auth/callback`

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // If this is a parent joining a team, store the team code
    if (teamCode) {
      sessionStorage.setItem('teamCode', teamCode)
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-gray-600 mb-6">
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Click the link in the email to complete your login. 
              You can close this window.
            </p>
            <button
              onClick={() => {
                setSent(false)
                setEmail('')
              }}
              className="text-blue-600 hover:underline"
            >
              Try a different email
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            {teamName ? `Join ${teamName}` : 'Login'}
          </h1>
          <p className="text-gray-600 text-center mb-8">
            {teamName 
              ? "Enter your email to receive a magic link" 
              : "We'll send you a magic link to login"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>

        {!teamName && (
          <div className="mt-8 text-center text-gray-600">
            <p className="mb-2">Looking to join a team?</p>
            <Link href="/join" className="text-blue-600 font-semibold hover:underline">
              Enter Team Code →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
