import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CoachDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get teams for this coach
  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .eq('coach_id', user.id)
    .order('created_at', { ascending: false })

  // If no teams, redirect to create team flow (to be built later)
  const hasTeams = teams && teams.length > 0

  // Get player count for each team
  const teamStats = await Promise.all(
    (teams || []).map(async (team) => {
      const { count: playerCount } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', team.id)

      const { count: assignmentCount } = await supabase
        .from('assignments')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', team.id)

      return {
        ...team,
        playerCount: playerCount || 0,
        assignmentCount: assignmentCount || 0,
      }
    })
  )

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Dugout</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.email}</span>
            <form action={handleSignOut}>
              <button
                type="submit"
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Coach Dashboard</h2>
            <p className="text-gray-600">
              Manage your teams, players, and assignments
            </p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            + Create Team
          </button>
        </div>

        {/* Teams Section */}
        {!hasTeams ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">⚾</div>
            <h3 className="text-xl font-semibold mb-2">Welcome to Dugout!</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first team. You'll be able to add players, 
              assign drills, and track progress.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              Create Your First Team
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {teamStats.map((team) => (
              <div key={team.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{team.name}</h3>
                      <p className="text-sm text-gray-600">
                        {team.age_group} • {team.season}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-mono font-bold rounded">
                        {team.code}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {team.playerCount}
                      </div>
                      <div className="text-sm text-gray-600">Players</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {team.assignmentCount}
                      </div>
                      <div className="text-sm text-gray-600">Assignments</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link 
                      href={`/coach/team/${team.id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold text-center"
                    >
                      Manage Team
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      ⚙️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {hasTeams && teamStats.length > 0 && (
          <div className="mt-8 grid md:grid-cols-4 gap-6">
            <Link 
              href="/coach/drills"
              className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-semibold mb-2">Drill Library</h3>
              <p className="text-sm text-gray-600">Browse and assign drills</p>
            </Link>
            <Link 
              href="/coach/practice"
              className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-semibold mb-2">Practice Plans</h3>
              <p className="text-sm text-gray-600">Ready-to-use templates</p>
            </Link>
            <Link 
              href={`/coach/team/${teamStats[0].id}/roster`}
              className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">👥</div>
              <h3 className="font-semibold mb-2">Manage Roster</h3>
              <p className="text-sm text-gray-600">Add or edit players</p>
            </Link>
            <Link 
              href={`/coach/team/${teamStats[0].id}/assignments`}
              className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">📋</div>
              <h3 className="font-semibold mb-2">View Assignments</h3>
              <p className="text-sm text-gray-600">Track homework completion</p>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
