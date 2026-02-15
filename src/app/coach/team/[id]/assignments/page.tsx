import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function AssignmentsPage({ 
  params,
  searchParams 
}: { 
  params: { id: string }
  searchParams: { drill?: string }
}) {
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

  // Get all drills for the assignment form
  const { data: drills } = await supabase
    .from('drills')
    .select('*')
    .order('name')

  // Get assignments with drill details and completion counts
  const { data: assignments } = await supabase
    .from('assignments')
    .select(`
      *,
      drills (
        id,
        name,
        category,
        difficulty,
        duration_minutes
      ),
      completions (
        id,
        player_id,
        completed_at
      )
    `)
    .eq('team_id', params.id)
    .order('due_date', { ascending: true })

  // Get players count
  const { count: playerCount } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', params.id)

  const handleCreateAssignment = async (formData: FormData) => {
    'use server'
    const supabase = await createClient()
    
    const drillId = formData.get('drillId') as string
    const dueDate = formData.get('dueDate') as string
    const notes = formData.get('notes') as string

    await supabase
      .from('assignments')
      .insert({
        team_id: params.id,
        drill_id: drillId,
        due_date: dueDate,
        notes: notes || null,
      })

    revalidatePath(`/coach/team/${params.id}/assignments`)
    redirect(`/coach/team/${params.id}/assignments`)
  }

  const handleDeleteAssignment = async (assignmentId: string) => {
    'use server'
    const supabase = await createClient()
    
    // Delete completions first (foreign key constraint)
    await supabase
      .from('completions')
      .delete()
      .eq('assignment_id', assignmentId)
    
    // Then delete the assignment
    await supabase
      .from('assignments')
      .delete()
      .eq('id', assignmentId)

    revalidatePath(`/coach/team/${params.id}/assignments`)
  }

  const categoryEmojis: Record<string, string> = {
    throwing: '🎯',
    catching: '🧤',
    batting: '⚾',
    fielding: '🥎',
    baserunning: '🏃',
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
          <h2 className="text-3xl font-bold mb-2">Assignments</h2>
          <p className="text-gray-600">{team.name} • {team.age_group}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Create Assignment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Create Assignment</h3>
              <form action={handleCreateAssignment} className="space-y-4">
                <div>
                  <label htmlFor="drillId" className="block text-sm font-semibold mb-2">
                    Select Drill *
                  </label>
                  <select
                    id="drillId"
                    name="drillId"
                    required
                    defaultValue={searchParams.drill || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a drill...</option>
                    {drills?.map((drill) => (
                      <option key={drill.id} value={drill.id}>
                        {drill.name} ({drill.category})
                      </option>
                    ))}
                  </select>
                  <Link
                    href="/coach/drills"
                    className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block"
                  >
                    Browse drill library →
                  </Link>
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-semibold mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-semibold mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Add any special instructions..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
                >
                  + Create Assignment
                </button>
              </form>
            </div>
          </div>

          {/* Assignments List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">Active Assignments</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {assignments?.length || 0} assignment{assignments?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
              <div className="divide-y">
                {assignments && assignments.length > 0 ? (
                  assignments.map((assignment) => {
                    const drill = assignment.drills
                    const completionCount = assignment.completions?.length || 0
                    const totalPlayers = playerCount || 0
                    const completionRate = totalPlayers > 0 
                      ? Math.round((completionCount / totalPlayers) * 100)
                      : 0
                    
                    const dueDate = new Date(assignment.due_date)
                    const isOverdue = dueDate < new Date()
                    const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

                    return (
                      <div key={assignment.id} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-4">
                            <div className="text-4xl">
                              {drill && categoryEmojis[drill.category]}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold mb-1">{drill?.name}</h4>
                              <div className="flex gap-2 items-center text-sm text-gray-600">
                                <span className="capitalize px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                  {drill?.category}
                                </span>
                                <span className="capitalize px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                  {drill?.difficulty}
                                </span>
                                <span>⏱️ {drill?.duration_minutes} min</span>
                              </div>
                            </div>
                          </div>
                          <form action={handleDeleteAssignment.bind(null, assignment.id)}>
                            <button
                              type="submit"
                              className="text-red-600 hover:text-red-700 text-sm"
                              onClick={(e) => {
                                if (!confirm('Delete this assignment? This cannot be undone.')) {
                                  e.preventDefault()
                                }
                              }}
                            >
                              Delete
                            </button>
                          </form>
                        </div>

                        {assignment.notes && (
                          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
                            <span className="font-semibold">Note:</span> {assignment.notes}
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="text-sm">
                              <span className="font-semibold">Due: </span>
                              <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                                {dueDate.toLocaleDateString()}
                              </span>
                              {!isOverdue && daysUntilDue >= 0 && (
                                <span className="text-gray-600 ml-2">
                                  ({daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''})
                                </span>
                              )}
                              {isOverdue && (
                                <span className="text-red-600 ml-2 font-semibold">
                                  (Overdue)
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">
                                {completionRate}%
                              </div>
                              <div className="text-xs text-gray-600">
                                {completionCount}/{totalPlayers} completed
                              </div>
                            </div>
                            <div className="w-16 h-16 relative">
                              <svg className="w-16 h-16 transform -rotate-90">
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke="#e5e7eb"
                                  strokeWidth="8"
                                  fill="none"
                                />
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke="#3b82f6"
                                  strokeWidth="8"
                                  fill="none"
                                  strokeDasharray={`${completionRate * 1.76} 176`}
                                  strokeLinecap="round"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-12 text-center text-gray-600">
                    <div className="text-6xl mb-4">📋</div>
                    <h4 className="text-lg font-semibold mb-2">No assignments yet</h4>
                    <p className="text-sm">Create your first assignment using the form on the left!</p>
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
