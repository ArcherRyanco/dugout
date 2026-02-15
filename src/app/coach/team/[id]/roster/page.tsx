import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function RosterManagementPage({ params }: { params: { id: string } }) {
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

  // Get players
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', params.id)
    .order('number', { ascending: true })

  const handleAddPlayer = async (formData: FormData) => {
    'use server'
    const supabase = await createClient()
    
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const number = formData.get('number') as string

    await supabase
      .from('players')
      .insert({
        team_id: params.id,
        first_name: firstName,
        last_name: lastName,
        number: number ? parseInt(number) : null,
      })

    revalidatePath(`/coach/team/${params.id}/roster`)
  }

  const handleDeletePlayer = async (playerId: string) => {
    'use server'
    const supabase = await createClient()
    
    await supabase
      .from('players')
      .delete()
      .eq('id', playerId)

    revalidatePath(`/coach/team/${params.id}/roster`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href={`/coach/team/${params.id}`}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Team
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-blue-600">Dugout</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Roster Management</h2>
          <p className="text-gray-600">{team.name} • {team.age_group}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Add Player Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Add New Player</h3>
              <form action={handleAddPlayer} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label htmlFor="number" className="block text-sm font-semibold mb-2">
                    Jersey Number
                  </label>
                  <input
                    type="number"
                    id="number"
                    name="number"
                    min="0"
                    max="99"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
                >
                  + Add Player
                </button>
              </form>
            </div>
          </div>

          {/* Players List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Current Roster</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {players?.length || 0} player{players?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="divide-y">
                {players && players.length > 0 ? (
                  players.map((player) => (
                    <div key={player.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-lg">
                          #{player.number || '?'}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">
                            {player.first_name} {player.last_name}
                          </div>
                          <div className="text-sm text-gray-600">
                            Added {new Date(player.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <form action={handleDeletePlayer.bind(null, player.id)}>
                          <button
                            type="submit"
                            className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                            onClick={(e) => {
                              if (!confirm(`Remove ${player.first_name} ${player.last_name} from the roster?`)) {
                                e.preventDefault()
                              }
                            }}
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-600">
                    <div className="text-6xl mb-4">⚾</div>
                    <h4 className="text-lg font-semibold mb-2">No players yet</h4>
                    <p className="text-sm">Use the form on the left to add your first player!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
