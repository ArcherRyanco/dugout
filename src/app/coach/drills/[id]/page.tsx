import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

const categoryEmojis: Record<string, string> = {
  throwing: '🎯',
  catching: '🧤',
  batting: '⚾',
  fielding: '🥎',
  baserunning: '🏃',
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

export default async function DrillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get drill details
  const { data: drill } = await supabase
    .from('drills')
    .select('*')
    .eq('id', id)
    .single()

  if (!drill) {
    notFound()
  }

  // Get coach's teams for assignment
  const { data: teams } = await supabase
    .from('teams')
    .select('id, name')
    .eq('coach_id', user.id)
    .order('name')

  // Get related drills in same category
  const { data: relatedDrills } = await supabase
    .from('drills')
    .select('id, title, difficulty')
    .eq('category', drill.category)
    .neq('id', drill.id)
    .limit(4)

  // Extract YouTube video ID if present
  const getYouTubeId = (url: string | null) => {
    if (!url) return null
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
    return match ? match[1] : null
  }

  const videoId = getYouTubeId(drill.video_url)

  // Parse instructions if stored as JSON or newline-separated
  const parseInstructions = (instructions: string | null): string[] => {
    if (!instructions) return []
    try {
      const parsed = JSON.parse(instructions)
      return Array.isArray(parsed) ? parsed : [instructions]
    } catch {
      return instructions.split('\n').filter(Boolean)
    }
  }

  const instructionSteps = parseInstructions(drill.instructions)

  // Parse equipment
  const parseEquipment = (equipment: any): string[] => {
    if (!equipment) return []
    if (Array.isArray(equipment)) return equipment
    if (typeof equipment === 'string') {
      try {
        return JSON.parse(equipment)
      } catch {
        return equipment.split(',').map((e: string) => e.trim())
      }
    }
    return []
  }

  const equipmentList = parseEquipment(drill.equipment)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/coach/drills"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Drills
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-blue-600">Dugout</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Drill Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{categoryEmojis[drill.category]}</div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{drill.title}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full capitalize">
                  {drill.category}
                </span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${difficultyColors[drill.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                  {drill.difficulty}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                  ⏱️ {drill.duration_minutes} min
                </span>
              </div>
              <p className="text-gray-600">{drill.description}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Section */}
            {videoId ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={drill.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            ) : drill.image_url ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <img 
                  src={drill.image_url} 
                  alt={drill.title}
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-gray-500">Video coming soon</p>
              </div>
            )}

            {/* Instructions */}
            {instructionSteps.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">How to Do This Drill</h3>
                <ol className="space-y-3">
                  {instructionSteps.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Coaching Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">💡 Coaching Tips</h3>
              <ul className="space-y-2 text-sm">
                <li>• Focus on proper form over speed with young players</li>
                <li>• Give specific, positive feedback ("Great follow-through!")</li>
                <li>• Demonstrate the drill yourself first</li>
                <li>• Keep groups small for more reps per player</li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Equipment */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-3">🎒 Equipment Needed</h3>
              {equipmentList.length > 0 ? (
                <ul className="space-y-2">
                  {equipmentList.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-blue-400 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  Basic equipment: glove, ball, bat (if batting drill)
                </p>
              )}
            </div>

            {/* Assign to Team */}
            {teams && teams.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-3">📋 Assign as Homework</h3>
                <div className="space-y-2">
                  {teams.map((team) => (
                    <Link
                      key={team.id}
                      href={`/coach/team/${team.id}/assignments?drill=${drill.id}`}
                      className="block w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-semibold text-center"
                    >
                      Assign to {team.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Drills */}
            {relatedDrills && relatedDrills.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-3">More {drill.category} Drills</h3>
                <div className="space-y-2">
                  {relatedDrills.map((related) => (
                    <Link
                      key={related.id}
                      href={`/coach/drills/${related.id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="font-semibold text-sm">{related.title}</div>
                      <div className="text-xs text-gray-500 capitalize">{related.difficulty}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
