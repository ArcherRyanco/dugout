import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Bold with diamond pattern background */}
      <section className="relative overflow-hidden bg-[#1e3a5f] px-4 py-20 md:py-28">
        {/* Baseball diamond pattern background */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.3) 35px, rgba(255,255,255,0.3) 70px)`,
          }}></div>
        </div>
        
        {/* Grass texture strip at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-[#4ade80] via-[#22c55e] to-[#4ade80] opacity-80"></div>
        <div className="absolute bottom-4 left-0 right-0 h-2 bg-gradient-to-r from-[#16a34a] via-[#15803d] to-[#16a34a] opacity-60"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Logo with glow effect */}
          <div className="mb-8 flex justify-center relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-75"></div>
            <Image 
              src="/logo.png" 
              alt="Dugout Team Manager" 
              width={280}
              height={280}
              priority
              className="w-56 h-56 md:w-80 md:h-80 drop-shadow-2xl relative z-10 hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white tracking-tight">
            Your Team&apos;s Digital Dugout
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Skill-building homework for players. Practice planning for coaches. All in one app.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link href="/join" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="w-full sm:w-auto px-10 py-7 text-xl bg-[#4ade80] hover:bg-[#22c55e] text-[#1e3a5f] font-bold shadow-2xl hover:shadow-[#4ade80]/50 transition-all duration-300 rounded-2xl hover:scale-105 border-4 border-[#22c55e]"
              >
                🚀 Join Your Team
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="w-full sm:w-auto px-10 py-7 text-xl bg-white hover:bg-white/90 text-[#1e3a5f] font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl hover:scale-105 border-4 border-white/20"
              >
                👨‍🏫 I&apos;m a Coach
              </Button>
            </Link>
          </div>

          {/* Trust signal */}
          <div className="mt-12 text-white/70 text-sm font-medium">
            ✓ Free for recreational teams  •  ✓ No credit card required  •  ✓ Setup in 5 minutes
          </div>
        </div>
      </section>

      {/* Value Props Section - Strong visual blocks */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#1e3a5f]">
              Everything Your Team Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built by coaches who know what works on and off the field
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden group hover:-translate-y-2 bg-gradient-to-br from-white to-[#87ceeb]/5">
              <div className="h-2 bg-gradient-to-r from-[#87ceeb] to-[#4ade80]"></div>
              <CardHeader className="pb-4">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">📋</div>
                <CardTitle className="text-2xl font-bold text-[#1e3a5f]">Player Homework</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-700 leading-relaxed">
                  Assign drills, track progress, and build fundamentals between practices
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden group hover:-translate-y-2 bg-gradient-to-br from-white to-[#4ade80]/5">
              <div className="h-2 bg-gradient-to-r from-[#4ade80] to-[#22c55e]"></div>
              <CardHeader className="pb-4">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
                <CardTitle className="text-2xl font-bold text-[#1e3a5f]">Drill Library</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-700 leading-relaxed">
                  Curated drills for throwing, catching, batting, fielding & more
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden group hover:-translate-y-2 bg-gradient-to-br from-white to-[#1e3a5f]/5">
              <div className="h-2 bg-gradient-to-r from-[#1e3a5f] to-[#87ceeb]"></div>
              <CardHeader className="pb-4">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
                <CardTitle className="text-2xl font-bold text-[#1e3a5f]">Team Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-700 leading-relaxed">
                  Rosters, practice plans, and communication all in one place
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section - Navy background with contrast */}
      <section className="relative py-24 px-4 bg-[#1e3a5f] overflow-hidden">
        {/* Subtle baseball stitching pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, white 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-20 text-white">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: 1, title: "Coach creates team", desc: "Gets a unique team code" },
              { num: 2, title: "Parents join with code", desc: "Magic link login, no passwords" },
              { num: 3, title: "Coach assigns homework", desc: "Parents see drills instantly" },
              { num: 4, title: "Kids practice", desc: "Mark complete, build skills" }
            ].map((step) => (
              <div key={step.num} className="text-center group">
                <div className="relative mb-6 inline-block">
                  <div className="absolute inset-0 bg-[#4ade80] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-[#4ade80] to-[#22c55e] text-[#1e3a5f] rounded-full flex items-center justify-center text-3xl font-black mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    {step.num}
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 text-white">{step.title}</h3>
                <p className="text-white/80 text-base">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid - Clean white with green accent */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#1e3a5f]">
              Powerful Features
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-[#4ade80] to-[#22c55e] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🎓", title: "Age-appropriate drills", desc: "T-Ball to Majors" },
              { icon: "🎥", title: "Video tutorials & guides", desc: "Visual learning for kids" },
              { icon: "📈", title: "Progress tracking", desc: "See improvement over time" },
              { icon: "📅", title: "Practice planning", desc: "Organize efficient practices" },
              { icon: "📱", title: "Mobile-first design", desc: "Works great on any device" },
              { icon: "📖", title: "Rules reference", desc: "Quick access to rule guides" }
            ].map((feature) => (
              <div 
                key={feature.title}
                className="flex items-start space-x-4 p-6 hover:bg-gradient-to-br hover:from-[#87ceeb]/10 hover:to-[#4ade80]/10 rounded-2xl transition-all duration-300 group border-2 border-transparent hover:border-[#87ceeb]/30 hover:shadow-lg"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-[#1e3a5f]">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Redesigned with real testimonial feel */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#87ceeb]/20 via-white to-[#4ade80]/10 relative overflow-hidden">
        {/* Subtle diamond pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 50px, #1e3a5f 50px, #1e3a5f 100px)`,
          }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#1e3a5f]">
              Built by Coaches, For Coaches
            </h2>
            <p className="text-xl text-gray-600">
              Designed by someone who&apos;s been in the third-base coach&apos;s box
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Testimonial 1 */}
            <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden hover:shadow-[#87ceeb]/30 hover:shadow-3xl transition-all duration-300">
              <div className="h-2 bg-gradient-to-r from-[#4ade80] to-[#22c55e]"></div>
              <CardContent className="pt-8 pb-8 px-8">
                <div className="text-5xl mb-4 text-[#4ade80]">★★★★★</div>
                <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                  &ldquo;Finally, a tool that actually helps kids practice at home. Parents know what to work on, and I can see the difference at practice.&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-[#87ceeb] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    M
                  </div>
                  <div>
                    <p className="font-bold text-[#1e3a5f]">Coach Mike R.</p>
                    <p className="text-sm text-gray-500">10U Travel Team</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden hover:shadow-[#87ceeb]/30 hover:shadow-3xl transition-all duration-300">
              <div className="h-2 bg-gradient-to-r from-[#87ceeb] to-[#1e3a5f]"></div>
              <CardContent className="pt-8 pb-8 px-8">
                <div className="text-5xl mb-4 text-[#4ade80]">★★★★★</div>
                <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                  &ldquo;Love that it&apos;s free for rec teams. The drill library alone is worth it - saves me hours of planning.&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-[#4ade80] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    S
                  </div>
                  <div>
                    <p className="font-bold text-[#1e3a5f]">Coach Sarah T.</p>
                    <p className="text-sm text-gray-500">8U Rec League</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-600 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>Setup in Minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💯</span>
              <span>Free for Rec Teams</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📱</span>
              <span>Mobile Friendly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Bold and unmissable */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#1e3a5f] to-[#0f1f3a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)`,
          }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
            Ready to Level Up Your Team?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join coaches using Dugout to build better players, one drill at a time.
          </p>
          
          <Link href="/join">
            <Button 
              size="lg"
              className="px-12 py-8 text-2xl bg-[#4ade80] hover:bg-[#22c55e] text-[#1e3a5f] font-black shadow-2xl hover:shadow-[#4ade80]/50 transition-all duration-300 rounded-2xl hover:scale-110 border-4 border-[#22c55e]"
            >
              Get Started Free →
            </Button>
          </Link>

          <p className="mt-6 text-white/60 text-sm">
            No credit card required • Setup takes 5 minutes • Free for recreational teams
          </p>
        </div>
      </section>

      {/* Footer - Clean and minimal */}
      <footer className="py-12 px-4 bg-white border-t-4 border-[#87ceeb]/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex space-x-8">
              <Link href="/rules" className="text-gray-600 hover:text-[#1e3a5f] transition-colors font-semibold hover:underline">
                Rules
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-[#1e3a5f] transition-colors font-semibold hover:underline">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-[#1e3a5f] transition-colors font-semibold hover:underline">
                Contact
              </Link>
            </div>
            <div className="text-gray-600 flex items-center gap-2 font-medium">
              Built with <span className="text-red-500 text-xl">❤️</span> for youth baseball & softball
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-gray-500">
            &copy; 2026 Dugout Team Manager. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
