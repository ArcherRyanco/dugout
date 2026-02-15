import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-green-50 px-4 py-20 md:py-32">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6 text-6xl">⚾🥎</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900">
            Your Team&apos;s Digital Dugout
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Skill-building homework for players. Practice planning for coaches. All in one app.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/join">
              <Button 
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
              >
                Join Your Team
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 text-lg border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-green-50"
              >
                I&apos;m a Coach
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Everything Your Team Needs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-5xl mb-4">📋</div>
                <CardTitle className="text-2xl">Player Homework</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  Assign drills, track progress, build fundamentals
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-5xl mb-4">🎯</div>
                <CardTitle className="text-2xl">Drill Library</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  Curated drills for throwing, catching, batting & more
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-5xl mb-4">📊</div>
                <CardTitle className="text-2xl">Team Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  Rosters, practice plans, all in one place
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2E7D32] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Coach creates team</h3>
              <p className="text-gray-600 text-sm">Gets a unique team code</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#2E7D32] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Parents join with code</h3>
              <p className="text-gray-600 text-sm">Magic link login, no passwords</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#2E7D32] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Coach assigns homework</h3>
              <p className="text-gray-600 text-sm">Parents see drills instantly</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#2E7D32] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-lg mb-2">Kids practice</h3>
              <p className="text-gray-600 text-sm">Mark complete, build skills</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Powerful Features
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3 p-4">
              <div className="text-2xl">🎓</div>
              <div>
                <h3 className="font-semibold mb-1">Age-appropriate drills</h3>
                <p className="text-gray-600 text-sm">T-Ball to Majors</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4">
              <div className="text-2xl">🎥</div>
              <div>
                <h3 className="font-semibold mb-1">Video tutorials & guides</h3>
                <p className="text-gray-600 text-sm">Visual learning for kids</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4">
              <div className="text-2xl">📈</div>
              <div>
                <h3 className="font-semibold mb-1">Progress tracking</h3>
                <p className="text-gray-600 text-sm">See improvement over time</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4">
              <div className="text-2xl">📅</div>
              <div>
                <h3 className="font-semibold mb-1">Practice planning</h3>
                <p className="text-gray-600 text-sm">Organize efficient practices</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4">
              <div className="text-2xl">📱</div>
              <div>
                <h3 className="font-semibold mb-1">Mobile-first design</h3>
                <p className="text-gray-600 text-sm">Works great on any device</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4">
              <div className="text-2xl">📖</div>
              <div>
                <h3 className="font-semibold mb-1">Rules reference</h3>
                <p className="text-gray-600 text-sm">Quick access to rule guides</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-[#8D6E63]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
            Built by coaches, for coaches
          </h2>
          <Card className="bg-white">
            <CardContent className="pt-6">
              <blockquote className="text-lg md:text-xl text-gray-600 italic mb-4">
                &ldquo;Dugout has transformed how we run our team. Parents love the drill assignments, 
                and I can actually see kids improving between practices.&rdquo;
              </blockquote>
              <p className="text-gray-500">— Coach testimonial coming soon</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <Link href="/rules" className="text-gray-600 hover:text-[#2E7D32] transition-colors">
                Rules
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-[#2E7D32] transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-[#2E7D32] transition-colors">
                Contact
              </Link>
            </div>
            <div className="text-gray-600">
              Built with ❤️ for youth baseball
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-gray-500">
            &copy; 2026 Dugout. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
