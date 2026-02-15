import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const categories = [
  'throwing',
  'catching',
  'batting',
  'fielding',
  'baserunning',
]

const categoryEmojis: Record<string, string> = {
  throwing: '🎯',
  catching: '🧤',
  batting: '⚾',
  fielding: '🥎',
  baserunning: '🏃',
}

export default async function DrillLibraryPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user's teams for assignment dropdown
  const { data: teams } = await supabase
    .from('teams')
    .select('id, name')
    .eq('coach_id', user.id)
    .order('name')

  // Get drills, filtered by category if provided
  let query = supabase
    .from('drills')
    .select('*')
    .order('name')

  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }

  const { data: drills } = await query

  const selectedCategory = searchParams.category || 'all'

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
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Drill Library</h2>
          <p className="text-gray-600">Browse and assign drills to your teams</p>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-semibold mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/coach/drills"
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Drills
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/coach/drills?category=${category}`}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoryEmojis[category]} {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Drills Grid */}
        {drills && drills.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drills.map((drill) => (
              <div key={drill.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{categoryEmojis[drill.category]}</div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full capitalize">
                        {drill.category}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full capitalize">
                        {drill.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{drill.name}</h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {drill.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{drill.duration_minutes} min</span>
                    </div>
                    {drill.equipment && (
                      <div className="flex items-center gap-1">
                        <span>🎒</span>
                        <span className="truncate">{drill.equipment}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    {teams && teams.length > 0 ? (
                      <details className="group">
                        <summary className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 text-center list-none">
                          <span className="group-open:hidden">+ Assign to Team</span>
                          <span className="hidden group-open:inline">Select Team ↓</span>
                        </summary>
                        <div className="mt-2 space-y-2">
                          {teams.map((team) => (
                            <Link
                              key={team.id}
                              href={`/coach/team/${team.id}/assignments?drill=${drill.id}`}
                              className="block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-semibold text-center"
                            >
                              {team.name}
                            </Link>
                          ))}
                        </div>
                      </details>
                    ) : (
                      <div className="text-center text-sm text-gray-500">
                        Create a team first
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No drills found</h3>
            <p className="text-gray-600 mb-6">
              {selectedCategory !== 'all' 
                ? `No drills in the ${selectedCategory} category yet.`
                : 'The drill library is empty.'}
            </p>
            {selectedCategory !== 'all' && (
              <Link
                href="/coach/drills"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                View All Drills
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
