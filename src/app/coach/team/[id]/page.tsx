import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function TeamManagementPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get team details
  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('id', params.id)
    .eq('coach_id', user.id)
    .single()

  if (!team) {
    notFound()
  }

  // Get players with stats
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', params.id)
    .order('number', { ascending: true })

  // Get assignment stats
  const { data: assignments } = await supabase
    .from('assignments')
    .select(`
      id,
      due_date,
      completions (
        id,
        player_id,
        completed_at
      )
    `)
    .eq('team_id', params.id)

  // Calculate completion rates
  const totalAssignments = assignments?.length || 0
  const totalPlayers = players?.length || 0
  const totalPossibleCompletions = totalAssignments * totalPlayers
  
  let totalCompletions = 0
  assignments?.forEach(assignment => {
    totalCompletions += assignment.completions?.length || 0
  })
  
  const completionRate = totalPossibleCompletions > 0 
    ? Math.round((totalCompletions / totalPossibleCompletions) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/coach"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-blue-600">Dugout</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Team Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{team.name}</h2>
              <div className="flex gap-4 text-gray-600">
                <span>{team.age_group}</span>
                <span>•</span>
                <span>{team.season}</span>
                <span>•</span>
                <span className="font-mono font-bold text-blue-600">Code: {team.code}</span>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Edit Team
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {totalPlayers}
              </div>
              <div className="text-sm text-gray-600">Total Players</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {totalAssignments}
              </div>
              <div className="text-sm text-gray-600">Active Assignments</div>
            </div>
            <div className="text-center p-4 bg-sky-50 rounded-lg">
              <div className="text-3xl font-bold text-sky-600">
                {completionRate}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link
            href={`/coach/team/${params.id}/roster`}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-4xl mb-3">👥</div>
            <h3 className="font-semibold mb-2">Manage Roster</h3>
            <p className="text-sm text-gray-600">Add or edit players</p>
          </Link>
          <Link
            href="/coach/drills"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-semibold mb-2">Drill Library</h3>
            <p className="text-sm text-gray-600">Browse and assign drills</p>
          </Link>
          <Link
            href={`/coach/team/${params.id}/assignments`}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-semibold mb-2">View Assignments</h3>
            <p className="text-sm text-gray-600">Track homework completion</p>
          </Link>
        </div>

        {/* Players List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">Team Roster</h3>
          </div>
          <div className="divide-y">
            {players && players.length > 0 ? (
              players.map((player) => (
                <div key={player.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                      #{player.number || '?'}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {player.first_name} {player.last_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Player #{player.number}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/coach/team/${params.id}/roster`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    View Details →
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-600">
                <div className="text-4xl mb-3">⚾</div>
                <p>No players yet. Add your first player to get started!</p>
                <Link
                  href={`/coach/team/${params.id}/roster`}
                  className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Add Players
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
