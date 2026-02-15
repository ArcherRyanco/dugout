import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-blue-600">Dugout</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            The simple way for youth baseball and softball coaches to manage teams 
            and assign skill-building homework to players and parents.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/join"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Join Your Team
            </Link>
            <Link 
              href="/login"
              className="w-full sm:w-auto px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Coach Login
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Built for Youth Sports</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚾</div>
              <h3 className="text-xl font-semibold mb-2">Team Management</h3>
              <p className="text-gray-600">
                Organize your roster, track player info, and connect with parents
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Drill Library</h3>
              <p className="text-gray-600">
                Access curated drills for every skill level and position
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Homework Assignments</h3>
              <p className="text-gray-600">
                Assign practice drills and track completion by parents
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 Dugout. Built for coaches, parents, and players.</p>
        </div>
      </footer>
    </div>
  )
}
