'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { QuizAnswers, Track } from '@/lib/types'

const ALL_STAMPS = [
  { id: 'joined',    icon: '✈',  name: 'Joined Fora'       },
  { id: 'trained',   icon: '📚', name: 'Essentials done'   },
  { id: 'certified', icon: '🏅', name: 'Fora Certified'    },
  { id: 'reviewed',  icon: '⭐', name: 'First review'      },
  { id: 'advanced',  icon: '🌟', name: 'Fora Advanced'     },
  { id: 'pro',       icon: '💳', name: 'Fora Pro'          },
  { id: 'club300',   icon: '🥂', name: '$300K Club'        },
  { id: 'foraX',     icon: '✦',  name: 'Fora X'            },
]

const ALL_STOPS = [
  { name: 'Join Fora',                      sub: 'Account created',                  key: 'joined'    },
  { name: 'Complete essentials training',   sub: 'Required for Certified status',     key: 'trained'   },
  { name: 'Make your first booking',        sub: 'Earns Certified badge',             key: 'certified' },
  { name: 'Reach $40k · 5 clients',        sub: 'Fora Advanced unlocked',            key: 'advanced'  },
  { name: '$100k in a calendar year',       sub: 'Fora Pro · IATA card · FAM trips',  key: 'pro'       },
]

const STAGES = [
  {
    btnLabel: 'Just joined',
    earned: ['joined'],
    status: 'Pre-departure', statusClass: 'text-fora-olive',
    bookings: 0, revenue: '$0', clients: 0,
    eta: 'ETA: ~45 days to Certified · On the runway',
    goalDest: 'Fora Certified',
    goalReqs: ['Complete essentials training', 'Make your first booking'],
    goalUnlocks: ['Certified badge on your advisor profile', 'Increased trust from travel partners'],
    fee: 0, feePct: 0,
    quote: '"Every Fora Pro started exactly where you are right now."',
  },
  {
    btnLabel: 'Training done',
    earned: ['joined', 'trained'],
    status: 'Essentials complete', statusClass: 'text-fora-olive',
    bookings: 0, revenue: '$0', clients: 0,
    eta: 'ETA: ~30 days to Certified · Training cleared',
    goalDest: 'Fora Certified',
    goalReqs: ['Make your first booking'],
    goalUnlocks: ['Certified badge on your advisor profile', 'Increased trust from travel partners'],
    fee: 0, feePct: 0,
    quote: '"Training done. One booking stands between you and Certified."',
  },
  {
    btnLabel: 'Certified ✦',
    earned: ['joined', 'trained', 'certified', 'reviewed'],
    status: 'Fora Certified ✦', statusClass: 'text-fora-crimson',
    bookings: 1, revenue: '$8k', clients: 2,
    eta: 'Certified · Next stop: Fora Advanced',
    goalDest: 'Fora Advanced',
    goalReqs: ['Reach $40k in bookings', 'Complete advanced training', 'Book 5 clients', 'Publish 2 reviews'],
    goalUnlocks: ['Advanced badge on your profile', 'Recognition in community forums'],
    fee: 120, feePct: 40,
    quote: '"Certified. Your badge is live on your profile."',
  },
  {
    btnLabel: 'Advanced ✦',
    earned: ['joined', 'trained', 'certified', 'reviewed', 'advanced'],
    status: 'Fora Advanced ✦', statusClass: 'text-fora-crimson',
    bookings: 18, revenue: '$40k', clients: 9,
    eta: 'Advanced · Next stop: Fora Pro',
    goalDest: 'Fora Pro',
    goalReqs: ['$100k in bookings in a calendar year', '10 clients booked', '5 client reviews received'],
    goalUnlocks: ['Pro badge on your profile', 'IATA card + CLIA membership', 'FAM trip eligibility'],
    fee: 299, feePct: 100,
    quote: '"Advanced badge earned. Your IATA card is in sight."',
  },
  {
    btnLabel: 'Fora X ✦',
    earned: ['joined', 'trained', 'certified', 'reviewed', 'advanced', 'pro', 'club300', 'foraX'],
    status: 'Fora X ✦', statusClass: 'text-fora-crimson',
    bookings: 90, revenue: '$300k+', clients: 45,
    eta: 'Fora X · Invite-only · Elite advisor',
    goalDest: 'Fora X — You\'ve arrived',
    goalReqs: ['Invite only'],
    goalUnlocks: ['80/20 commission split', 'Fora X retreats', 'Custom perks for elite advisors'],
    fee: 299, feePct: 100,
    quote: '"Welcome to Fora X. You\'ve built something exceptional."',
  },
]

export default function JourneyPage() {
  const [quiz, setQuiz]      = useState<QuizAnswers | null>(null)
  const [stageIdx, setStage] = useState(0)

  useEffect(() => {
    const raw = localStorage.getItem('foraQuiz')
    if (raw) setQuiz(JSON.parse(raw))
  }, [])

  const s = STAGES[stageIdx]

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-12">

        <div className="mb-6">
          <p className="text-xs tracking-[0.2em] uppercase text-fora-stone mb-3">Bonus demo</p>
          <h1 className="font-display text-4xl font-normal text-fora-ink">
            {quiz?.name ? `${quiz.name}'s advisor journey` : 'Your advisor journey'}
          </h1>
          <p className="text-fora-charcoal mt-2 text-sm">
            A live dashboard showing tier progression — click through each stage to see the journey unfold.
          </p>
        </div>

        {/* Simulation buttons */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <span className="text-xs text-fora-stone font-medium uppercase tracking-wider mr-1">Simulate:</span>
          {STAGES.map((st, i) => (
            <button key={i} onClick={() => setStage(i)}
              className={`text-xs font-medium px-4 py-2 rounded-full border transition-all ${
                stageIdx === i
                  ? 'bg-fora-indigo text-white border-fora-indigo'
                  : 'border-fora-sand-med text-fora-charcoal hover:bg-fora-linen'
              }`}>
              {st.btnLabel}
            </button>
          ))}
        </div>

        {/* Top row: passport + itinerary */}
        <div className="grid grid-cols-5 gap-5 mb-5">

          {/* Passport */}
          <div className="col-span-2 rounded-2xl overflow-hidden border border-fora-sand shadow-sm">
            <div className="bg-fora-indigo passport-texture p-5">
              <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center mb-3 text-white text-lg">✈</div>
              <div className="text-white/50 text-xs tracking-[0.2em] uppercase mb-1">Fora Travel Network</div>
              <div className="font-display text-3xl font-light text-white/95 leading-tight mb-1">Advisor<br/>Passport</div>
              <div className="font-display text-xs italic text-white/40">Travel Advisory License</div>
            </div>
            <div className="bg-fora-white p-4 space-y-3">
              {[
                ['Advisor name', quiz?.name || 'New Advisor'],
                ['Member since', new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })],
                ['Status',       s.status],
                ['Bookings',     String(s.bookings)],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="text-xs tracking-[0.15em] uppercase text-fora-stone mb-0.5">{label}</div>
                  <div className={`font-display text-sm transition-all ${label === 'Status' ? s.statusClass : 'text-fora-ink'}`}>{value}</div>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-fora-sand font-mono text-[7px] text-fora-stone leading-relaxed tracking-wide">
                P&lt;FORA&lt;{(quiz?.name || 'ADVISOR').toUpperCase().replace(' ', '&lt;&lt;')}&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
                ADV000001&lt;9USA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div className="col-span-3 bg-fora-white border border-fora-sand rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-fora-sand">
              <div className="text-xs tracking-[0.2em] uppercase text-fora-stone mb-1">Your itinerary</div>
              <div className="font-display text-xl font-semibold text-fora-ink">The Advisor Journey</div>
              <div className="font-display text-xs italic text-fora-crimson mt-1 transition-all">{s.eta}</div>
            </div>

            <div className="px-5 py-4">
              {ALL_STOPS.map((stop, i) => {
                const done  = s.earned.includes(stop.key)
                const isNow = !done && (i === 0 || s.earned.includes(ALL_STOPS[i - 1]?.key || ''))
                return (
                  <div key={i} className="flex gap-3 mb-3 relative">
                    {i < ALL_STOPS.length - 1 && (
                      <div className="absolute left-3 top-6 bottom-[-12px] w-px bg-fora-sand" />
                    )}
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs z-10 border transition-all ${
                      done ? 'bg-fora-crimson border-fora-crimson text-white'
                           : isNow ? 'border-fora-crimson text-fora-crimson'
                           : 'border-fora-sand-med text-fora-stone bg-fora-white'
                    }`}>
                      {done ? '✓' : i + 1}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className={`text-xs font-medium ${!done && !isNow ? 'text-fora-stone' : 'text-fora-ink'}`}>{stop.name}</div>
                      <div className={`text-xs mt-0.5 ${isNow ? 'text-fora-crimson' : 'text-fora-stone'}`}>
                        {isNow ? '→ current stop' : stop.sub}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Stats + progress */}
            <div className="mx-5 mb-5 bg-fora-linen rounded-xl p-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs uppercase tracking-wider text-fora-stone">Progress to next tier</span>
                <span className="text-xs font-medium text-fora-crimson">{s.revenue}</span>
              </div>
              <div className="h-0.5 bg-fora-sand-med rounded-full mb-4">
                <div className="h-full bg-fora-crimson rounded-full transition-all duration-500"
                  style={{ width: ['0%','5%','20%','40%','100%'][stageIdx] }} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[[s.revenue,'Revenue'],[String(s.bookings),'Bookings'],[String(s.clients),'Clients']].map(([n,l]) => (
                  <div key={l} className="bg-fora-white border border-fora-sand rounded-lg p-2 text-center">
                    <div className="font-display text-lg font-semibold text-fora-ink">{n}</div>
                    <div className="text-xs text-fora-stone tracking-wide uppercase mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
              {/* Membership payoff */}
              <div className="mt-4 pt-3 border-t border-fora-sand">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs uppercase tracking-wider text-fora-stone">Membership fee payoff</span>
                  <span className={`text-xs font-medium ${s.fee >= 299 ? 'text-fora-crimson' : 'text-fora-olive'}`}>${s.fee} / $299</span>
                </div>
                <div className="h-0.5 bg-fora-sand-med rounded-full">
                  <div className={`h-full rounded-full transition-all duration-500 ${s.fee >= 299 ? 'bg-fora-crimson' : 'bg-fora-olive'}`}
                    style={{ width: `${s.feePct}%` }} />
                </div>
                <p className="text-xs text-fora-stone italic mt-1.5">
                  {s.fee >= 299 ? 'Membership paid off. Every booking is pure upside.' : 'Make your first booking to start earning back your membership.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: stamps + goal */}
        <div className="grid grid-cols-2 gap-5">

          {/* Stamps */}
          <div className="bg-fora-white border border-fora-sand rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-fora-sand flex justify-between items-baseline">
              <div className="font-display text-base font-semibold text-fora-ink">Tier badges</div>
              <div className="text-xs text-fora-stone">{s.earned.length} / 8 earned</div>
            </div>
            <div className="grid grid-cols-4 gap-3 p-5">
              {ALL_STAMPS.map(st => {
                const on = s.earned.includes(st.id)
                return (
                  <div key={st.id} className="flex flex-col items-center gap-1.5">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl border transition-all ${
                      on ? 'border-fora-olive bg-fora-olive-light' : 'border-dashed border-fora-sand-med bg-fora-linen grayscale opacity-30'
                    }`}>
                      {st.icon}
                    </div>
                    <div className={`text-xs text-center leading-tight ${on ? 'text-fora-charcoal' : 'text-fora-stone'}`}>
                      {st.name}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Current goal */}
          <div className="bg-fora-white border border-fora-sand rounded-2xl p-5">
            <div className="text-xs tracking-[0.2em] uppercase text-fora-stone mb-3">Current destination</div>
            <div className="font-display text-2xl font-bold text-fora-ink mb-4 transition-all">{s.goalDest}</div>
            <div className="h-px bg-fora-sand mb-4" />
            <div className="text-xs font-semibold tracking-[0.15em] uppercase text-fora-stone mb-2">What you need</div>
            <div className="space-y-2 mb-4">
              {s.goalReqs.map(r => (
                <div key={r} className="flex items-start gap-2 text-sm text-fora-charcoal">
                  <div className="w-1.5 h-1.5 rounded-full bg-fora-crimson mt-1.5 flex-shrink-0" />{r}
                </div>
              ))}
            </div>
            <div className="h-px bg-fora-sand mb-4" />
            <div className="text-xs font-semibold tracking-[0.15em] uppercase text-fora-stone mb-2">What you unlock</div>
            <div className="space-y-2 mb-5">
              {s.goalUnlocks.map(u => (
                <div key={u} className="flex items-start gap-2 text-sm text-fora-charcoal">
                  <div className="w-1.5 h-1.5 rounded-full bg-fora-olive mt-1.5 flex-shrink-0" />{u}
                </div>
              ))}
            </div>
            <div className="bg-fora-linen border border-fora-sand rounded-xl px-4 py-3 font-display italic text-sm text-fora-charcoal text-center transition-all">
              {s.quote}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
