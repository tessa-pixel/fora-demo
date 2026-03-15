'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { QuizAnswers, TRACK_META, Track } from '@/lib/types'

function addDays(base: Date, n: number) {
  const d = new Date(base)
  d.setDate(d.getDate() + n)
  return d
}
function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
function fmtDay(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}

const SESSION_TEMPLATES: Record<Track, { title: string; type: string; duration: string }[]> = {
  A: [
    { title: 'Warm network mapping',         type: 'training', duration: '45 min' },
    { title: 'Client outreach scripts',      type: 'training', duration: '30 min' },
    { title: 'Social media content block',   type: 'action',   duration: '60 min' },
    { title: 'First outreach emails sent',   type: 'action',   duration: '30 min' },
    { title: 'Self-review: assess progress', type: 'checkin',  duration: '15 min' },
    { title: 'Lead follow-up review',        type: 'action',   duration: '30 min' },
    { title: 'Discovery call practice',      type: 'training', duration: '45 min' },
    { title: 'First booking attempt',        type: 'action',   duration: '60 min' },
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

type CalSession = {
  id: string
  title: string
  date: Date
  duration: string
  type: string
  completed: boolean
}

export default function CalendarPage() {
  const router = useRouter()
  const [quiz, setQuiz] = useState<QuizAnswers | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [sessions, setSessions] = useState<CalSession[]>([])
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [skipped, setSkipped] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('foraQuiz')
    if (raw) {
      const q = JSON.parse(raw) as QuizAnswers
      setQuiz(q)
      buildSessions(q)
    }
  }, [])

  function buildSessions(q: QuizAnswers) {
    const track = q.barrier as Track
    const templates = SESSION_TEMPLATES[track]
    const start = new Date()
    const generated: CalSession[] = templates.map((t, i) => ({
      id: `s-${i}`,
      title: t.title,
      date: addDays(start, Math.floor(i * 5.5) + 1),
      duration: t.duration,
      type: t.type,
      completed: false,
    }))
    setSessions(generated)
  }

  function connectCalendar() {
    setConnecting(true)
    setTimeout(() => { setConnecting(false); setConnected(true) }, 1800)
  }

  function toggleComplete(id: string) {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s))
  }

  function moveSession(id: string, days: number) {
    setSessions(prev => prev.map(s => {
      if (s.id !== id) return s
      const newDate = addDays(s.date, days)
      return { ...s, date: newDate }
    }))
  }

  const typeStyle: Record<string, string> = {
    training: 'bg-blue-50 text-blue-700 border-blue-100',
    action:   'bg-fora-olive-light text-fora-olive border-fora-sand',
    checkin:  'bg-pink-50 text-pink-700 border-pink-100',
  }

  const completedCount = sessions.filter(s => s.completed).length
  const track = (quiz?.barrier || 'A') as Track
  const meta = TRACK_META[track]

  if (skipped) {
    return (
      <>
        <Nav />
        <main className="max-w-xl mx-auto px-6 py-24 text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="font-display text-2xl font-semibold text-fora-ink mb-3">No problem — you can connect later.</h2>
          <p className="text-fora-charcoal mb-8">Your training plan is ready. You'll receive email reminders instead.</p>
          <button onClick={() => router.push('/journey')} className="bg-fora-indigo text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-fora-indigo-dark">
            View my journey →
          </button>
        </main>
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* ── Progress bar towards first booking ── */}
        {quiz?.goalDate && (() => {
          const totalDays = 45
          const daysLeft  = Math.max(0, Math.ceil((new Date(quiz.goalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
          const pct       = Math.round(((totalDays - daysLeft) / totalDays) * 100)
          const onTrack   = daysLeft / totalDays > 0.6
          const slightOff = daysLeft / totalDays > 0.3
          const status    = onTrack
            ? { label: 'On track',           color: 'text-fora-olive',   dot: 'bg-fora-olive',   action: false }
            : slightOff
            ? { label: 'Slightly off track — do you need support?', color: 'text-amber-600', dot: 'bg-amber-500', action: true }
            : { label: 'Needs attention',    color: 'text-fora-crimson', dot: 'bg-fora-crimson', action: true }
          return (
            <div className="bg-fora-white border border-fora-sand rounded-2xl p-5 mb-8">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
                <div>
                  <span className="text-xs tracking-[0.15em] uppercase text-fora-stone font-medium">Progress towards first booking</span>
                  <span className="ml-3 text-xs text-fora-stone">
                    Goal: {new Date(quiz.goalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} · {daysLeft} days left
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
                <div className="h-full bg-fora-crimson rounded-full transition-all duration-700" style={{ width: `${Math.max(pct, 3)}%` }} />
              </div>
              <div className="flex justify-between text-xs text-fora-stone mt-1.5">
                <span>Joined Fora</span>
                <span>{pct}% of the way there</span>
                <span>First booking</span>
              </div>
            </div>
          )
        })()}

        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-fora-stone mb-3">Schedule</p>
          <h1 className="font-display text-4xl font-normal text-fora-ink leading-tight">
            Your 60-day success schedule
          </h1>
          <p className="text-fora-charcoal mt-2">
            Sessions tailored to <span className="font-medium" style={{ color: meta.color }}>{meta.barrier}</span> —{' '}
            {quiz?.hoursPerWeek}h/week · goal by{' '}
            {quiz?.goalDate && new Date(quiz.goalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Calendar connect banner */}
        {!connected ? (
          <div className="bg-fora-indigo text-white rounded-2xl p-6 mb-8 flex items-center justify-between gap-6">
            <div>
              <div className="font-display text-xl font-semibold mb-1">Connect Google Calendar</div>
              <p className="text-sm opacity-80 leading-relaxed">
                Add all sessions directly to your calendar — editable, moveable, and with reminders.
                Advisors who schedule specific sessions are <strong>2× more likely</strong> to complete their plan.
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={connectCalendar}
                disabled={connecting}
                className="bg-white text-fora-indigo text-sm font-medium px-6 py-2.5 rounded-full hover:bg-fora-cream transition-all disabled:opacity-60 whitespace-nowrap"
              >
                {connecting ? 'Connecting...' : '+ Connect Google Calendar'}
              </button>
              <button onClick={() => setSkipped(true)} className="text-xs opacity-50 hover:opacity-80 text-center transition-opacity">
                Skip for now
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-fora-olive-light border border-fora-sand rounded-2xl p-4 mb-8 flex items-center gap-3">
            <span className="text-fora-olive text-lg">✓</span>
            <div>
              <div className="text-sm font-medium text-fora-ink">Google Calendar connected</div>
              <div className="text-xs text-fora-stone">{sessions.length} sessions added · reminders set · all sessions are editable in your calendar</div>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { num: sessions.length,  label: 'sessions planned',  color: 'text-fora-indigo' },
            { num: completedCount,   label: 'completed',          color: 'text-fora-olive' },
            { num: sessions.length - completedCount, label: 'remaining', color: 'text-fora-crimson' },
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
            <div className="font-display text-base font-semibold text-fora-ink">Session schedule</div>
            <div className="text-xs text-fora-stone">
              {connected ? 'Click ± to reschedule' : 'Connect calendar to enable rescheduling'}
            </div>
          </div>
          <div className="divide-y divide-fora-sand">
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-4 px-6 py-3.5 transition-all ${
                  s.completed ? 'opacity-50' : ''
                } ${dragOver === s.id ? 'bg-fora-linen' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(s.id) }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => setDragOver(null)}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(s.id)}
                  className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
                    s.completed
                      ? 'bg-fora-olive border-fora-olive text-white'
                      : 'border-fora-sand-med hover:border-fora-olive'
                  }`}
                >
                  {s.completed && <span className="text-white text-xs">✓</span>}
                </button>

                {/* Date */}
                <div className="w-20 shrink-0 text-center">
                  <div className="text-xs font-medium text-fora-charcoal">{fmtDay(s.date)}</div>
                  <div className="text-xs text-fora-stone">{fmtDate(s.date)}</div>
                </div>

                {/* Title */}
                <div className="flex-1">
                  <span className={`text-sm ${s.completed ? 'line-through text-fora-stone' : 'text-fora-ink'}`}>
                    {s.title}
                  </span>
                </div>

                {/* Duration */}
                <span className="text-xs text-fora-stone shrink-0">{s.duration}</span>

                {/* Type badge */}
                <span className={`text-xs px-2.5 py-0.5 rounded-full border shrink-0 ${typeStyle[s.type]}`}>
                  {s.type}
                </span>

                {/* Reschedule buttons (only if connected) */}
                {connected && (
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => moveSession(s.id, -1)}
                      className="w-6 h-6 rounded-full border border-fora-sand text-xs text-fora-stone hover:bg-fora-linen transition-all"
                      title="Move 1 day earlier"
                    >−</button>
                    <button
                      onClick={() => moveSession(s.id, 1)}
                      className="w-6 h-6 rounded-full border border-fora-sand text-xs text-fora-stone hover:bg-fora-linen transition-all"
                      title="Move 1 day later"
                    >+</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => router.push('/journey')}
            className="bg-fora-crimson text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-fora-crimson-dark transition-all"
          >
            View my journey →
          </button>
        </div>
      </main>
    </>
  )
}
