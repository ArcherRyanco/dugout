'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function JoinPage() {
  const [teamCode, setTeamCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    
    // Verify team code exists
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, name')
      .eq('code', teamCode.toUpperCase())
      .single()

    if (teamError || !team) {
      setError('Team code not found. Please check and try again.')
      setLoading(false)
      return
    }

    // Store team code in session storage for use after auth
    sessionStorage.setItem('teamCode', teamCode.toUpperCase())
    
    // Redirect to login with team context
    router.push(`/login?team=${teamCode.toUpperCase()}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Join Your Team</h1>
          <p className="text-gray-600 text-center mb-8">
            Enter the 6-character team code from your coach
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="teamCode" className="block text-sm font-medium text-gray-700 mb-2">
                Team Code
              </label>
              <input
                type="text"
                id="teamCode"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest uppercase"
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
              disabled={loading || teamCode.length !== 6}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">Are you a coach?</p>
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Coach Login →
          </Link>
        </div>
      </div>
    </div>
  )
}
