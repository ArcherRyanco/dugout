import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ParentDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get parent record
  const { data: parent } = await supabase
    .from('parents')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get players linked to this parent
  const { data: playerLinks } = await supabase
    .from('player_parents')
    .select(`
      player_id,
      players (
        id,
        first_name,
        last_name,
        number,
        team_id,
        teams (
          name,
          code
        )
      )
    `)
    .eq('parent_id', parent?.id || '')

  const players = playerLinks?.map(link => link.players).filter(Boolean) || []

  // Get assignments for these players
  const playerIds = players.map((p: any) => p.id)
  
  const { data: assignments } = await supabase
    .from('assignments')
    .select(`
      *,
      drills (
        title,
        description,
        category,
        difficulty,
        duration_minutes
      ),
      completions (
        id,
        completed_at,
        player_id
      )
    `)
    .or(
      playerIds.length > 0
        ? `target_player_id.in.(${playerIds.join(',')}),and(assigned_to.eq.team,team_id.in.(${players.map((p: any) => p.team_id).join(',')}))`
        : 'id.eq.00000000-0000-0000-0000-000000000000' // No results if no players
    )
    .order('created_at', { ascending: false })

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
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Parent Dashboard</h2>
          <p className="text-gray-600">
            View homework assignments and track your player's progress
          </p>
        </div>

        {/* Players Section */}
        {players.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">⚾</div>
            <h3 className="text-xl font-semibold mb-2">No Players Linked</h3>
            <p className="text-gray-600 mb-6">
              You haven't been linked to any players yet. Ask your coach to add you to the team roster.
            </p>
            <Link
              href="/join"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Join a Team
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {players.map((player: any) => (
                <div key={player.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">
                        {player.first_name} {player.last_name}
                      </h3>
                      {player.number && (
                        <span className="text-gray-500">#{player.number}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Team:</strong> {player.teams?.name}</p>
                    <p><strong>Team Code:</strong> {player.teams?.code}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Assignments Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold">Homework Assignments</h3>
              </div>
              
              {!assignments || assignments.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No assignments yet. Check back later!</p>
                </div>
              ) : (
                <div className="divide-y">
                  {assignments.map((assignment: any) => {
                    const isCompleted = assignment.completions?.some(
                      (c: any) => playerIds.includes(c.player_id)
                    )
                    
                    return (
                      <div key={assignment.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-lg font-semibold">
                                {assignment.drills?.title}
                              </h4>
                              {isCompleted && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                  ✓ Completed
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {assignment.drills?.description}
                            </p>
                            <div className="flex gap-4 text-sm text-gray-500">
                              <span>📂 {assignment.drills?.category}</span>
                              <span>⏱️ {assignment.drills?.duration_minutes} min</span>
                              {assignment.due_date && (
                                <span>📅 Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                              )}
                            </div>
                            {assignment.notes && (
                              <p className="mt-2 text-sm italic text-gray-600">
                                Coach's note: {assignment.notes}
                              </p>
                            )}
                          </div>
                          {!isCompleted && (
                            <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap">
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
