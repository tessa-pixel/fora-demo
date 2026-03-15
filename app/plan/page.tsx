'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Track, TRACK_META, QuizAnswers } from '@/lib/types'

// ── Helpers ──────────────────────────────────────────────
function addDays(base: Date, n: number) {
  const d = new Date(base); d.setDate(d.getDate() + n); return d
}
function fmtDate(d: Date) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
function fmtDay(d: Date)  { return d.toLocaleDateString('en-US', { weekday: 'short' }) }
function daysUntilGoal(goalDate: string) {
  return Math.max(0, Math.ceil((new Date(goalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
}

// ── Static plan content ──────────────────────────────────
const ESSENTIALS = [
  'Fora platform orientation',
  'Commission structure overview',
  'How to build a bookable quote',
  'Client communication fundamentals',
  'Compliance and booking best practices',
]

const TRACK_STATIC: Record<Track, { headline: string; desc: string; week1: string[]; unlocks: string[] }> = {
  A: {
    headline: 'Client acquisition track',
    desc: 'Learn to identify warm leads, craft outreach messages that convert, and build a referral engine from day one.',
    week1: ['Warm network mapping exercise', 'Writing your first client pitch', '10 personalised outreach templates', 'Sending your first discovery message'],
    unlocks: ['Client script library', 'Referral tracking tools', 'Social media content templates', 'Lead pipeline in Portal CRM'],
  },
  B: {
    headline: 'Platform confidence track',
    desc: 'Step-by-step walkthrough of every Fora tool — from your first bookable quote to reading your commission dashboard.',
    week1: ['Portal orientation (full walkthrough)', 'Building your first bookable quote', 'Sidekick 2.0 deep dive', 'Sending your first proposal'],
    unlocks: ['Booking simulations', 'Sidekick 2.0 prompt library', 'Quote builder cheat sheet', 'On-demand video guides'],
  },
  C: {
    headline: 'Pricing confidence track',
    desc: 'Build the confidence to name your price, structure fees, and convert quotes into confirmed bookings.',
    week1: ['Travel pricing fundamentals', 'Fee calculator workshop', 'Quote-to-booking conversion scripts', 'Handling client price objections'],
    unlocks: ['Fora rate comparison tool', 'Fee calculator', 'Pricing confidence scripts', 'Commission structure overview'],
  },
  D: {
    headline: 'Supplier relationships track',
    desc: 'For experienced advisors ready to go deeper — build preferred supplier partnerships that unlock better commissions, exclusive perks, and client upgrades.',
    week1: ['Mapping your current supplier relationships', 'How Fora Reserve partnerships work', 'Introduction to preferred supplier network', 'Unlocking hotel perks for clients'],
    unlocks: ['Fora Reserve access', 'Preferred supplier directory', 'Supplier negotiation playbook', 'VIP perks and upgrade pipeline'],
  },
}

// ── Session templates ─────────────────────────────────────
const SESSION_TEMPLATES: Record<Track, { title: string; type: string; duration: string }[]> = {
  A: [
    { title: 'Warm network mapping',       type: 'training', duration: '45 min' },
    { title: 'Client outreach scripts',    type: 'training', duration: '30 min' },
    { title: 'Social media content block', type: 'action',   duration: '60 min' },
    { title: 'First outreach emails sent', type: 'action',   duration: '30 min' },
    { title: 'Self-review: assess progress', type: 'checkin', duration: '15 min' },
    { title: 'Lead follow-up review',      type: 'action',   duration: '30 min' },
    { title: 'Discovery call practice',    type: 'training', duration: '45 min' },
    { title: 'First booking attempt',      type: 'action',   duration: '60 min' },
  ],
  B: [
    { title: 'Portal orientation walkthrough', type: 'training', duration: '60 min' },
    { title: 'Build first bookable quote',     type: 'action',   duration: '45 min' },
    { title: 'Sidekick 2.0 deep dive',         type: 'training', duration: '30 min' },
    { title: 'Send first proposal',            type: 'action',   duration: '30 min' },
    { title: 'On-demand booking guide',        type: 'checkin',  duration: '30 min' },
    { title: 'Commission dashboard review',    type: 'training', duration: '20 min' },
    { title: 'Advanced quote features',        type: 'training', duration: '45 min' },
    { title: 'Complete first booking',         type: 'action',   duration: '60 min' },
  ],
  C: [
    { title: 'Travel pricing fundamentals',    type: 'training', duration: '45 min' },
    { title: 'Fee calculator workshop',        type: 'action',   duration: '30 min' },
    { title: 'Quote-to-booking scripts',       type: 'training', duration: '30 min' },
    { title: 'Handling price objections',      type: 'training', duration: '30 min' },
    { title: 'Self-review: pricing confidence',type: 'checkin',  duration: '20 min' },
    { title: 'Build a fully-priced proposal',  type: 'action',   duration: '60 min' },
    { title: 'Send proposal to real lead',     type: 'action',   duration: '30 min' },
    { title: 'Complete first booking',         type: 'action',   duration: '60 min' },
  ],
  D: [
    { title: 'Map your supplier relationships', type: 'training', duration: '45 min' },
    { title: 'Fora Reserve: how it works',      type: 'training', duration: '30 min' },
    { title: 'Preferred supplier introductions',type: 'training', duration: '45 min' },
    { title: 'Unlock client perks + upgrades',  type: 'action',   duration: '30 min' },
    { title: 'Self-review: supplier pipeline',  type: 'checkin',  duration: '20 min' },
    { title: 'Negotiate first supplier deal',   type: 'action',   duration: '45 min' },
    { title: 'Build a perk-enhanced proposal',  type: 'action',   duration: '60 min' },
    { title: 'Complete first booking with perks',type: 'action',  duration: '60 min' },
  ],
}

type Week = { week: number; theme: string; sessions: { day: string; title: string; duration: string; type: string }[] }
type CalSession = { id: string; title: string; date: Date; duration: string; type: string; completed: boolean }

const typeColor: Record<string, string> = {
  training: 'bg-blue-50 text-blue-700 border-blue-200',
  action:   'bg-fora-olive-light text-fora-olive border-fora-sand',
  checkin:  'bg-pink-50 text-pink-700 border-pink-200',
}

// ── Component ─────────────────────────────────────────────
export default function PlanSchedulePage() {
  const [quiz, setQuiz]           = useState<QuizAnswers | null>(null)
  const [activeTrack, setActive]  = useState<Track>('A')
  const [plan, setPlan]           = useState<{ weeks: Week[]; keyMilestone: string; firstWin: string } | null>(null)
  const [loading, setLoading]     = useState(false)
  const [genTrack, setGenTrack]   = useState<Track | null>(null)
  const [calAdded, setCalAdded]   = useState(false)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [sessions, setSessions]   = useState<CalSession[]>([])

  useEffect(() => {
    const raw = localStorage.getItem('foraQuiz')
    if (raw) {
      const q = JSON.parse(raw) as QuizAnswers
      setQuiz(q)
      setActive(q.barrier as Track)
      buildSessions(q)
    }
  }, [])

  useEffect(() => {
    if (quiz && activeTrack === quiz.barrier && genTrack !== activeTrack) generatePlan(activeTrack)
  }, [quiz, activeTrack])

  function buildSessions(q: QuizAnswers) {
    const track = q.barrier as Track
    const templates = SESSION_TEMPLATES[track]
    const start = new Date()
    setSessions(templates.map((t, i) => ({
      id: `s-${i}`, title: t.title,
      date: addDays(start, Math.floor(i * 5.5) + 1),
      duration: t.duration, type: t.type, completed: false,
    })))
  }

  async function generatePlan(track: Track) {
    if (!quiz) return
    setLoading(true); setPlan(null)
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: quiz.name, track, experience: quiz.experience, hoursPerWeek: quiz.hoursPerWeek, goalDate: quiz.goalDate, daysUntilGoal: daysUntilGoal(quiz.goalDate) }),
      })
      const data = await res.json()
      setPlan(data); setGenTrack(track)
    } catch { /* silent */ }
    setLoading(false)
  }

  function connectCalendar() {
    setConnecting(true)
    setTimeout(() => { setConnecting(false); setConnected(true) }, 1500)
  }

  function toggleComplete(id: string) {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s))
  }

  function moveSession(id: string, days: number) {
    setSessions(prev => prev.map(s => s.id !== id ? s : { ...s, date: addDays(s.date, days) }))
  }

  const meta = TRACK_META[activeTrack]
  const completedCount = sessions.filter(s => s.completed).length

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Progress bar ── */}
        {quiz?.goalDate && (() => {
          const sessionPct = sessions.length > 0 ? Math.round((completedCount / sessions.length) * 100) : 0
          const daysLeft   = daysUntilGoal(quiz.goalDate)
          const offSchedule = sessions.length > 0 && completedCount / sessions.length < 0.5 && daysLeft < 30
          const status = sessionPct >= 60
            ? { label: 'On track', color: 'text-fora-olive', dot: 'bg-fora-olive', action: false }
            : offSchedule
            ? { label: 'Slightly off track — do you need support?', color: 'text-amber-600', dot: 'bg-amber-500', action: true }
            : { label: 'Getting started', color: 'text-fora-indigo', dot: 'bg-fora-indigo', action: false }
          return (
            <div className="bg-fora-white border border-fora-sand rounded-2xl p-5 mb-8">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
                <div>
                  <span className="text-xs tracking-[0.15em] uppercase text-fora-stone font-medium">Progress towards first booking</span>
                  <span className="ml-3 text-xs text-fora-stone">
                    {completedCount} of {sessions.length} sessions completed · Goal: {new Date(quiz.goalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} · {daysLeft} days left
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                  <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                  {status.action && (
                    <a href="https://advisor.fora.travel" target="_blank" rel="noopener noreferrer"
                      className="text-xs bg-fora-indigo text-white px-3 py-1 rounded-full hover:bg-fora-indigo-dark transition-all">
                      Get support from Sidekick →
                    </a>
                  )}
                </div>
              </div>
              <div className="h-2 bg-fora-linen rounded-full overflow-hidden">
                <div className="h-full bg-fora-crimson rounded-full transition-all duration-700" style={{ width: `${Math.max(sessionPct, 3)}%` }} />
              </div>
              <div className="flex justify-between text-xs text-fora-stone mt-1.5">
                <span>0 sessions</span><span>{sessionPct}% complete</span><span>{sessions.length} sessions total</span>
              </div>
            </div>
          )
        })()}

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-fora-stone mb-2">Plan + Schedule</p>
          <h1 className="font-display text-4xl font-normal text-fora-ink leading-tight">
            {quiz?.name ? `${quiz.name}'s training plan` : 'Your training plan'}
          </h1>
        </div>

        {/* ── Essentials banner ── */}
        <div className="bg-fora-indigo text-white rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-2xl mt-0.5">📚</div>
            <div className="flex-1">
              <div className="text-xs tracking-[0.15em] uppercase opacity-60 mb-1">Required for all advisors</div>
              <div className="font-display text-lg font-semibold mb-2">Essentials training</div>
              <p className="text-sm opacity-80 mb-3 leading-relaxed">Every advisor completes essentials training first — ~2 hours total, required to unlock your Certified badge.</p>
              <div className="grid grid-cols-2 gap-1.5">
                {ESSENTIALS.map(e => (
                  <div key={e} className="flex items-center gap-2 text-sm opacity-90">
                    <span className="opacity-50">◆</span> {e}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Track toggle ── */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {(['A', 'B', 'C', 'D'] as Track[]).map(t => {
            const m = TRACK_META[t]
            const isActive = activeTrack === t
            const isRec = quiz?.barrier === t
            return (
              <button key={t} onClick={() => { setActive(t); if (t !== genTrack) generatePlan(t) }}
                className={`relative text-left p-5 rounded-2xl border transition-all ${isActive ? 'border-2 shadow-md' : 'border border-fora-sand bg-fora-white hover:bg-fora-linen'}`}
                style={isActive ? { borderColor: m.color, backgroundColor: m.bg } : {}}>
                {isRec && (
                  <span className="absolute -top-2.5 left-4 text-xs font-medium px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: m.color }}>
                    Recommended for you
                  </span>
                )}
                <div className="text-xs font-semibold tracking-[0.15em] uppercase mb-1" style={{ color: m.color }}>{m.label}</div>
                <div className="font-display text-base font-semibold text-fora-ink mb-1">{m.barrier}</div>
                <div className="text-xs text-fora-stone">{m.pct} of new advisors</div>
              </button>
            )
          })}
        </div>

        {/* ── Plan + Schedule side by side ── */}
        <div className="grid grid-cols-5 gap-6 mb-8">

          {/* Left: track info */}
          <div className="col-span-2 space-y-4">
            <div className="bg-fora-white border border-fora-sand rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold text-fora-ink mb-3">{TRACK_STATIC[activeTrack].headline}</h2>
              <p className="text-sm text-fora-charcoal leading-relaxed mb-5">{TRACK_STATIC[activeTrack].desc}</p>
              <div className="text-xs font-semibold tracking-[0.15em] uppercase text-fora-stone mb-2">Week 1 highlights</div>
              <ul className="space-y-2">
                {TRACK_STATIC[activeTrack].week1.map(w => (
                  <li key={w} className="flex items-start gap-2 text-sm text-fora-charcoal">
                    <span className="text-fora-olive mt-0.5">◆</span> {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-fora-linen border border-fora-sand rounded-2xl p-5">
              <div className="text-xs font-semibold tracking-[0.15em] uppercase text-fora-stone mb-2">What you unlock</div>
              <ul className="space-y-2">
                {TRACK_STATIC[activeTrack].unlocks.map(u => (
                  <li key={u} className="flex items-start gap-2 text-sm text-fora-charcoal">
                    <span className="text-fora-crimson mt-0.5">→</span> {u}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: AI plan */}
          <div className="col-span-3">
            <div className="bg-fora-white border border-fora-sand rounded-2xl overflow-hidden h-full flex flex-col">
              <div className="px-6 py-4 border-b border-fora-sand flex items-center justify-between">
                <div>
                  <div className="text-xs tracking-[0.15em] uppercase text-fora-stone">Week-by-week schedule</div>
                  <div className="font-display text-base font-semibold text-fora-ink mt-0.5">Your personalised plan</div>
                </div>
                <button onClick={() => generatePlan(activeTrack)} className="text-xs text-fora-stone hover:text-fora-indigo transition-colors">↺ Regenerate</button>
              </div>
              <div className="p-6 flex-1">
                {loading && (
                  <div className="space-y-3 animate-pulse">
                    {[1,2,3].map(i => <div key={i} className="h-16 bg-fora-linen rounded-xl" />)}
                    <p className="text-center text-xs text-fora-stone italic mt-4">Building your personalised plan...</p>
                  </div>
                )}
                {!loading && plan && genTrack === activeTrack && (
                  <div className="animate-fade-in">
                    {plan.firstWin && (
                      <div className="bg-fora-indigo text-white rounded-xl px-4 py-3 mb-5 text-sm">
                        <span className="opacity-60 text-xs uppercase tracking-wider block mb-0.5">Your first win</span>
                        {plan.firstWin}
                      </div>
                    )}
                    <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                      {plan.weeks.map(w => (
                        <div key={w.week}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: TRACK_META[activeTrack].color }}>Week {w.week}</span>
                            <span className="text-xs font-medium text-fora-charcoal">{w.theme}</span>
                          </div>
                          <div className="space-y-1.5 ml-1">
                            {w.sessions.map((s, i) => (
                              <div key={i} className="flex items-center gap-3 py-2 px-3 bg-fora-cream rounded-lg border border-fora-sand">
                                <span className="text-xs text-fora-stone font-medium w-8 shrink-0">{s.day}</span>
                                <span className="text-sm text-fora-ink flex-1">{s.title}</span>
                                <span className="text-xs text-fora-stone shrink-0">{s.duration}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${typeColor[s.type] || typeColor.training}`}>{s.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {plan.keyMilestone && (
                      <div className="mt-4 border-t border-fora-sand pt-4 text-sm text-fora-charcoal italic">🎯 {plan.keyMilestone}</div>
                    )}
                  </div>
                )}
                {!loading && (!plan || genTrack !== activeTrack) && (
                  <div className="text-center py-10">
                    <button onClick={() => generatePlan(activeTrack)} className="bg-fora-indigo text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-fora-indigo-dark transition-all">
                      Generate plan for Track {activeTrack}
                    </button>
                    <p className="text-xs text-fora-stone mt-3">Personalised to your barrier and schedule</p>
                  </div>
                )}
              </div>
              {plan && genTrack === activeTrack && (
                <div className="px-6 pb-5 flex gap-3 flex-wrap border-t border-fora-sand pt-4">
                  <button onClick={() => generatePlan(activeTrack)}
                    className="flex items-center gap-2 text-sm border border-fora-sand-med text-fora-charcoal px-5 py-2.5 rounded-full hover:bg-fora-linen transition-all">
                    ✏️ Modify my plan
                  </button>
                  <button onClick={() => setCalAdded(true)}
                    className={`flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-all ${calAdded ? 'bg-fora-olive text-white border-fora-olive border' : 'bg-fora-indigo text-white hover:bg-fora-indigo-dark'}`}>
                    {calAdded ? '✓ Added to calendar' : '📅 Add plan to calendar'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Schedule section ── */}
        <div className="border-t border-fora-sand pt-8">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-fora-ink">Session schedule</h2>
              <p className="text-sm text-fora-charcoal mt-1">
                {sessions.length} sessions · {completedCount} completed · goal by{' '}
                {quiz?.goalDate && new Date(quiz.goalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </p>
            </div>
            {!connected ? (
              <button onClick={connectCalendar} disabled={connecting}
                className="flex items-center gap-2 text-sm bg-fora-indigo text-white px-5 py-2.5 rounded-full hover:bg-fora-indigo-dark transition-all disabled:opacity-60">
                {connecting ? 'Connecting...' : '📅 Connect Google Calendar'}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-sm text-fora-olive">
                <span>✓</span> Google Calendar connected · sessions editable
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { num: sessions.length,                label: 'Sessions planned',  color: 'text-fora-indigo' },
              { num: completedCount,                 label: 'Completed',          color: 'text-fora-olive'  },
              { num: sessions.length - completedCount, label: 'Remaining',       color: 'text-fora-crimson'},
            ].map(s => (
              <div key={s.label} className="bg-fora-white border border-fora-sand rounded-xl p-4 text-center">
                <div className={`font-display text-3xl font-semibold ${s.color}`}>{s.num}</div>
                <div className="text-xs text-fora-stone mt-1 tracking-wide uppercase">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Session list */}
          <div className="bg-fora-white border border-fora-sand rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-fora-sand flex items-center justify-between">
              <div className="font-display text-base font-semibold text-fora-ink">Your sessions</div>
              <div className="text-xs text-fora-stone">{connected ? 'Click ± to reschedule' : 'Connect calendar to enable rescheduling'}</div>
            </div>
            <div className="divide-y divide-fora-sand">
              {sessions.map(s => (
                <div key={s.id} className={`flex items-center gap-4 px-6 py-3.5 transition-all ${s.completed ? 'opacity-50' : ''}`}>
                  <button onClick={() => toggleComplete(s.id)}
                    className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${s.completed ? 'bg-fora-olive border-fora-olive text-white' : 'border-fora-sand-med hover:border-fora-olive'}`}>
                    {s.completed && <span className="text-white text-xs">✓</span>}
                  </button>
                  <div className="w-20 shrink-0 text-center">
                    <div className="text-xs font-medium text-fora-charcoal">{fmtDay(s.date)}</div>
                    <div className="text-xs text-fora-stone">{fmtDate(s.date)}</div>
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm ${s.completed ? 'line-through text-fora-stone' : 'text-fora-ink'}`}>{s.title}</span>
                  </div>
                  <span className="text-xs text-fora-stone shrink-0">{s.duration}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border shrink-0 ${typeColor[s.type]}`}>{s.type}</span>
                  {connected && (
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => moveSession(s.id, -1)} className="w-6 h-6 rounded-full border border-fora-sand text-xs text-fora-stone hover:bg-fora-linen transition-all">−</button>
                      <button onClick={() => moveSession(s.id, 1)}  className="w-6 h-6 rounded-full border border-fora-sand text-xs text-fora-stone hover:bg-fora-linen transition-all">+</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
