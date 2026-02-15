'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, Home } from 'lucide-react'

interface RuleSection {
  id: string
  title: string
  icon: string
  rules: { title: string; description: string }[]
}

const ruleSections: RuleSection[] = [
  {
    id: 'game',
    title: 'Game Rules',
    icon: '⚾',
    rules: [
      {
        title: 'Game Length',
        description: '6 innings is a standard game. 4 innings constitutes an official game if weather or time requires early stoppage.',
      },
      {
        title: 'Runs Per Inning',
        description: 'Maximum of 5 runs per inning. Once a team scores 5 runs, the half-inning ends and teams switch.',
      },
      {
        title: 'Mercy Rules',
        description: 'Game ends early if one team leads by 11+ runs after 4 complete innings, or by 6+ runs after 5 complete innings.',
      },
      {
        title: 'Time Limits',
        description: 'No new inning starts after 1 hour 45 minutes. Hard stop at 2 hours regardless of inning. Games in progress when time expires are considered complete.',
      },
    ],
  },
  {
    id: 'batting',
    title: 'Batting Rules',
    icon: '🏏',
    rules: [
      {
        title: 'Pitch Count',
        description: '6 pitches maximum per at-bat. If the 6th pitch is fouled off, the batter continues until a fair ball, strike, or walk.',
      },
      {
        title: 'Batting Order',
        description: 'Continuous batting order - all players on the roster bat in rotation, regardless of fielding positions. No traditional lineup card needed.',
      },
      {
        title: 'No Bunting',
        description: 'Bunting is not allowed in coach pitch. Batters must take full swings at the ball.',
      },
      {
        title: 'On-Deck Circle',
        description: 'There is no on-deck circle. Only the current batter may handle a bat. All other players must stay in the dugout until their turn.',
      },
      {
        title: 'Sliding',
        description: 'Head-first sliding results in an automatic out (except when diving back to a base already occupied). Players must slide feet-first when advancing bases.',
      },
    ],
  },
  {
    id: 'pitching',
    title: 'Pitching Rules',
    icon: '🎯',
    rules: [
      {
        title: 'Coach Pitcher',
        description: 'A coach from the batting team pitches to their own players. Must pitch overhand from at least 30 feet away.',
      },
      {
        title: 'Pitching Form',
        description: 'Coaches should preferably pitch from one knee. Use "dart-like" pitches - firm and accurate, not slow lobs.',
      },
      {
        title: 'Hit by Batted Ball',
        description: 'If the coach pitcher is hit by a batted ball, it\'s a dead ball. The batter is awarded first base and all runners advance one base.',
      },
    ],
  },
  {
    id: 'baserunning',
    title: 'Base Running',
    icon: '🏃',
    rules: [
      {
        title: 'No Leading Off',
        description: 'Runners must stay on their base until the ball is hit by the batter. Leaving early results in the runner being called out.',
      },
      {
        title: 'No Stealing',
        description: 'Base runners cannot steal bases in coach pitch. Runners advance only on batted balls or awarded bases.',
      },
      {
        title: 'Sliding or Avoiding',
        description: 'When a fielder with the ball is attempting a tag, runners must either slide OR make a clear attempt to avoid contact. Failure to do so may result in an out call.',
      },
    ],
  },
  {
    id: 'equipment',
    title: 'Equipment Requirements',
    icon: '🛡️',
    rules: [
      {
        title: 'Bats - USABat Standard',
        description: 'All bats must meet USA Baseball\'s USABat standard (marked with USA Baseball logo). Non-compliant bats are not allowed.',
      },
      {
        title: 'Helmets',
        description: 'Helmets are required for all batters and base runners at all times. Helmets must be worn properly and remain on until the play is over.',
      },
      {
        title: 'Cleats',
        description: 'Metal cleats are not allowed. Players must wear molded rubber or plastic cleats, or athletic shoes.',
      },
      {
        title: 'Catcher Protection',
        description: 'Male catchers must wear a protective cup. All catchers must have a throat protector attached to or built into their mask.',
      },
    ],
  },
]

export default function RulesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['game', 'batting', 'pitching', 'baserunning', 'equipment']))

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections)
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId)
    } else {
      newOpenSections.add(sectionId)
    }
    setOpenSections(newOpenSections)
  }

  const toggleAll = () => {
    if (openSections.size === ruleSections.length) {
      setOpenSections(new Set())
    } else {
      setOpenSections(new Set(ruleSections.map(s => s.id)))
    }
  }

  const filteredSections = ruleSections.map(section => ({
    ...section,
    rules: section.rules.filter(
      rule =>
        rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.description.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(section => section.rules.length > 0 || searchTerm === '')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Home size={20} />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <button
              onClick={toggleAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {openSections.size === ruleSections.length ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Coach Pitch Rules Reference
          </h1>
          <p className="text-gray-600">Quick reference guide for coaches, parents, and players</p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-500">
              Found {filteredSections.reduce((sum, section) => sum + section.rules.length, 0)} matching rules
            </p>
          )}
        </div>
      </div>

      {/* Rules Sections */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{section.icon}</span>
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                  <span className="text-sm text-gray-500 ml-2">
                    ({section.rules.length} {section.rules.length === 1 ? 'rule' : 'rules'})
                  </span>
                </div>
                <ChevronDown
                  className={`text-gray-400 transition-transform ${
                    openSections.has(section.id) ? 'rotate-180' : ''
                  }`}
                  size={24}
                />
              </button>

              {openSections.has(section.id) && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <div className="space-y-4 pt-4">
                    {section.rules.map((rule, index) => (
                      <div
                        key={index}
                        className="pb-4 last:pb-0 last:border-0 border-b border-gray-100"
                      >
                        <h3 className="font-semibold text-gray-900 mb-1 flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>{rule.title}</span>
                        </h3>
                        <p className="text-gray-600 ml-4 leading-relaxed">{rule.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No rules match your search.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <span>💡</span> Quick Tips for Coaches
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Keep a printed copy of these rules in your coaching bag for quick reference during games.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Review base running rules with players before each game to prevent confusion.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Communicate time limits and mercy rules to parents so they understand game scheduling.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Check all equipment before games to ensure compliance with safety requirements.</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t bg-white mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Dugout
            </Link>
          </p>
          <p className="text-sm">&copy; 2026 Dugout. Built for coaches, parents, and players.</p>
        </div>
      </footer>
    </div>
  )
}
