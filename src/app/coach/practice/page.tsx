import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

const categoryEmojis: Record<string, string> = {
  throwing: '🎯',
  catching: '🧤',
  batting: '⚾',
  fielding: '🥎',
  baserunning: '🏃',
}

// Practice plan templates for coach pitch (5-6 year olds)
const practiceTemplates = [
  {
    name: 'Quick 45-Minute Practice',
    duration: 45,
    description: 'Perfect for weeknight practices. Covers fundamentals efficiently.',
    sections: [
      { name: 'Warm-up & Stretch', duration: 5, notes: 'Jog, arm circles, stretches' },
      { name: 'Throwing Pairs', duration: 8, category: 'throwing' },
      { name: 'Ground Ball Station', duration: 10, category: 'fielding' },
      { name: 'Batting Rotations', duration: 15, category: 'batting' },
      { name: 'Base Running', duration: 5, category: 'baserunning' },
      { name: 'Cool Down & Huddle', duration: 2, notes: 'Positive reinforcement, homework' },
    ]
  },
  {
    name: 'Full 90-Minute Practice',
    duration: 90,
    description: 'Comprehensive practice covering all skill areas.',
    sections: [
      { name: 'Dynamic Warm-up', duration: 10, notes: 'Jog, high knees, arm circles' },
      { name: 'Partner Throwing', duration: 10, category: 'throwing' },
      { name: 'Catching Drills', duration: 10, category: 'catching' },
      { name: 'Infield Work', duration: 15, category: 'fielding' },
      { name: 'Batting Station 1 - Tee', duration: 15, category: 'batting' },
      { name: 'Batting Station 2 - Soft Toss', duration: 10, category: 'batting' },
      { name: 'Base Running', duration: 10, category: 'baserunning' },
      { name: 'Game Situations', duration: 5, notes: 'Fun scrimmage or situational play' },
      { name: 'Huddle & Homework', duration: 5, notes: 'Review, assign drills, high fives' },
    ]
  },
  {
    name: 'Batting Focus Practice',
    duration: 60,
    description: 'Heavy emphasis on hitting fundamentals.',
    sections: [
      { name: 'Warm-up', duration: 5, notes: 'Light jog, arm stretches' },
      { name: 'Throwing Warm-up', duration: 5, category: 'throwing' },
      { name: 'Tee Work - Mechanics', duration: 15, category: 'batting' },
      { name: 'Soft Toss Rotations', duration: 15, category: 'batting' },
      { name: 'Front Toss / Live BP', duration: 15, category: 'batting' },
      { name: 'Cool Down', duration: 5, notes: 'Stretch and huddle' },
    ]
  },
  {
    name: 'Fielding Focus Practice',
    duration: 60,
    description: 'Ground balls, fly balls, and throwing mechanics.',
    sections: [
      { name: 'Warm-up', duration: 5, notes: 'Jog and stretch' },
      { name: 'Partner Throwing', duration: 10, category: 'throwing' },
      { name: 'Ready Position Drill', duration: 5, category: 'fielding' },
      { name: 'Ground Ball Stations', duration: 15, category: 'fielding' },
      { name: 'Fly Ball Practice', duration: 10, category: 'catching' },
      { name: 'Throwing to Bases', duration: 10, category: 'throwing' },
      { name: 'Huddle', duration: 5, notes: 'Review key points' },
    ]
  },
  {
    name: 'Pre-Game Warm-up',
    duration: 20,
    description: 'Quick warm-up routine before games.',
    sections: [
      { name: 'Team Jog', duration: 3, notes: 'Around the field together' },
      { name: 'Throwing Lines', duration: 5, category: 'throwing' },
      { name: 'Infield/Outfield', duration: 7, category: 'fielding' },
      { name: 'Quick Swings', duration: 3, category: 'batting' },
      { name: 'Team Huddle', duration: 2, notes: 'Energy and focus!' },
    ]
  },
]

export default async function PracticePlanPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get coach's teams
  const { data: teams } = await supabase
    .from('teams')
    .select('id, name')
    .eq('coach_id', user.id)
    .order('name')

  // Get all drills for suggestions
  const { data: drills } = await supabase
    .from('drills')
    .select('*')
    .order('category')

  // Group drills by category
  const drillsByCategory = drills?.reduce((acc, drill) => {
    if (!acc[drill.category]) acc[drill.category] = []
    acc[drill.category].push(drill)
    return acc
  }, {} as Record<string, typeof drills>)

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
          <h2 className="text-3xl font-bold mb-2">Practice Plans</h2>
          <p className="text-gray-600">
            Ready-to-use practice templates for coach pitch teams
          </p>
        </div>

        {/* Practice Templates */}
        <div className="space-y-6">
          {practiceTemplates.map((template, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Template Header */}
              <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{template.name}</h3>
                    <p className="text-gray-600 text-sm">{template.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {template.duration} min
                    </div>
                    <div className="text-xs text-gray-500">total time</div>
                  </div>
                </div>
              </div>

              {/* Timeline View */}
              <div className="p-6">
                <div className="space-y-3">
                  {template.sections.map((section, sIdx) => (
                    <div 
                      key={sIdx} 
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                    >
                      {/* Time indicator */}
                      <div className="w-16 text-center">
                        <div className="text-lg font-bold text-gray-700">
                          {section.duration}
                        </div>
                        <div className="text-xs text-gray-500">min</div>
                      </div>

                      {/* Progress bar segment */}
                      <div 
                        className={`h-2 rounded-full ${
                          section.category 
                            ? 'bg-blue-400' 
                            : 'bg-gray-300'
                        }`}
                        style={{ width: `${(section.duration / template.duration) * 200}px` }}
                      />

                      {/* Section details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {section.category && (
                            <span className="text-lg">
                              {categoryEmojis[section.category]}
                            </span>
                          )}
                          <span className="font-semibold">{section.name}</span>
                          {section.category && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded capitalize">
                              {section.category}
                            </span>
                          )}
                        </div>
                        {section.notes && (
                          <p className="text-sm text-gray-500 mt-1">{section.notes}</p>
                        )}
                      </div>

                      {/* Suggested drills */}
                      {section.category && drillsByCategory?.[section.category] && (
                        <div className="hidden md:block">
                          <details className="relative">
                            <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                              View drills →
                            </summary>
                            <div className="absolute right-0 top-6 z-10 bg-white rounded-lg shadow-lg border p-3 w-64">
                              <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                                Suggested Drills
                              </div>
                              {drillsByCategory[section.category].slice(0, 4).map((drill: any) => (
                                <Link
                                  key={drill.id}
                                  href={`/coach/drills/${drill.id}`}
                                  className="block text-sm py-1 hover:text-blue-600"
                                >
                                  {drill.title}
                                </Link>
                              ))}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="mt-6 pt-4 border-t flex gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-sm">
                    📋 Copy to Clipboard
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 text-sm">
                    🖨️ Print
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-3">💡 Practice Tips for Coach Pitch</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <strong>Keep it moving:</strong> Short attention spans at this age. Switch activities every 8-10 minutes.</li>
            <li>• <strong>More reps, less lines:</strong> Set up stations so every kid is active. Avoid long lines.</li>
            <li>• <strong>Positive coaching:</strong> Focus on effort and improvement, not results.</li>
            <li>• <strong>Make it fun:</strong> Use games and competitions. "Who can catch 5 in a row?"</li>
            <li>• <strong>Parent helpers:</strong> Assign 2-3 parents to run stations. Brief them before practice.</li>
            <li>• <strong>End strong:</strong> Always finish with something fun and a team huddle.</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
