'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import { MOCK_ADVISORS, getRiskLevel } from '@/lib/advisors'
import { Track, TRACK_META } from '@/lib/types'

type Resource = { title: string; url: string; desc: string }
type AgentResult = { riskReason: string; resources: Resource[] }
type AdvisorState = { loading: boolean; result: AgentResult | null; error: boolean }

const avStyle: Record<Track, string> = {
  A: 'bg-red-50 text-red-700',
  B: 'bg-blue-50 text-blue-700',
  C: 'bg-amber-50 text-amber-700',
  D: 'bg-purple-50 text-purple-700',
}

const riskColors = {
  high:   { dot: 'bg-red-500',   badge: 'bg-red-50 text-red-700 border-red-200',       border: 'border-red-200'   },
  medium: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200', border: 'border-amber-200' },
  low:    { dot: 'bg-green-500', badge: 'bg-green-50 text-green-700 border-green-200', border: 'border-green-100' },
}

export default function AgentPage() {
  const [states, setStates]   = useState<Record<number, AdvisorState>>({})
  const [running, setRunning] = useState(false)

  const highCount = MOCK_ADVISORS.filter(a => getRiskLevel(a) === 'high').length
  const medCount  = MOCK_ADVISORS.filter(a => getRiskLevel(a) === 'medium').length
  const sentCount = Object.values(states).filter(s => s.result).length

  async function runAgent() {
    setRunning(true)
    const toProcess = MOCK_ADVISORS.filter(a => getRiskLevel(a) !== 'low')
    for (const advisor of toProcess) {
      setStates(prev => ({ ...prev, [advisor.id]: { loading: true, result: null, error: false } }))
      try {
        const res  = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ advisor }),
        })
        const data = await res.json()
        setStates(prev => ({ ...prev, [advisor.id]: { loading: false, result: data, error: false } }))
      } catch {
        setStates(prev => ({ ...prev, [advisor.id]: { loading: false, result: null, error: true } }))
      }
      await new Promise(r => setTimeout(r, 300))
    }
    setRunning(false)
  }

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-fora-stone mb-2">Admin view</p>
          <h1 className="font-display text-4xl font-normal text-fora-ink">Churn detection agent</h1>
          <p className="text-fora-charcoal mt-1.5 text-sm leading-relaxed">
            An AI agent that monitors all new advisors before their first booking, scores their risk level based on schedule adherence, and delivers personalised resource recommendations automatically.
          </p>
        </div>

        {/* ── How it works ── */}
        <div className="bg-fora-white border border-fora-sand rounded-2xl p-7 mb-8">
          <div className="text-xs tracking-[0.2em] uppercase text-fora-stone font-medium mb-6">How the agent works</div>

          <div className="grid grid-cols-3 gap-5 mb-8">
            {[
              {
                step: '01',
                title: 'Data ingestion',
                color: 'text-fora-indigo',
                items: [
                  'Days since last portal login',
                  'Schedule adherence % (sessions completed on time)',
                  'Quotes sent',
                  'Bookings made',
                  'Days since joining Fora',
                  'Track assignment (A / B / C / D)',
                  'Calendar sessions marked complete',
                ],
              },
              {
                step: '02',
                title: 'Risk scoring',
                color: 'text-fora-crimson',
                items: [
                  'Goal: first booking within 60 days',
                  '─── Days 1–20: departure window ───',
                  'No risk for zero bookings — too early',
                  '7+ days no login + <10% training → medium',
                  '10+ days no login → medium',
                  '─── Days 21–45: activation window ───',
                  'Login gap 10d + no quotes + <30% training → high',
                  'Login gap 7d OR no quotes after day 30 → medium',
                  '─── Days 46–55: final approach ───',
                  'No quote ever sent → high',
                  'Quotes sent, no booking → medium',
                  '─── Days 56–60: critical window ───',
                  'Gone dark OR no quotes → high',
                  'Active with quotes → medium',
                  'Booking made → always low',
                ],
              },
              {
                step: '03',
                title: 'What it triggers',
                color: 'text-fora-olive',
                items: [
                  'Low risk → no action, continue monitoring',
                  'Medium risk → track-matched resource pack surfaced',
                  'High risk → resource pack + escalation flag',
                  'Resources matched to advisor\'s barrier (A/B/C)',
                  'Three support paths offered: Sidekick · Forum · HQ',
                  'Outreach email drafted automatically',
                  'All actions logged for Fora team review',
                ],
              },
            ].map(col => (
              <div key={col.step}>
                <div className={`font-display text-3xl font-light ${col.color} mb-2 leading-none`}>{col.step}</div>
                <div className="font-display text-base font-semibold text-fora-ink mb-3">{col.title}</div>
                <ul className="space-y-1.5">
                  {col.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-fora-charcoal leading-snug">
                      <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${col.color.replace('text-', 'bg-')}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Risk tier explainer */}
          <div className="border-t border-fora-sand pt-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-fora-stone mb-3">Risk tiers</div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Low risk', dot: 'bg-green-500', badge: 'bg-green-50 text-green-700 border-green-200', desc: 'Advisor is active and on trajectory — or has already made their first booking. In the first 20 days, almost everyone is low risk. No intervention needed.' },
                { label: 'Medium risk', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200', desc: 'Engagement is slowing or a key milestone is overdue for their window — e.g. no quotes by day 30, or login gaps appearing. Agent surfaces track-matched resources.' },
                { label: 'High risk', dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200', desc: 'Requires BOTH a time signal AND disengagement signal in their window — e.g. 10+ day login gap with no quotes and low training. In days 46–60, no quote sent at all triggers high risk.' },
              ].map(tier => (
                <div key={tier.label} className={`border rounded-xl p-4 ${tier.badge.split(' ')[0] === 'bg-green-50' ? 'border-green-100' : tier.badge.split(' ')[0] === 'bg-amber-50' ? 'border-amber-100' : 'border-red-100'} ${tier.badge.split(' ')[0]}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${tier.dot}`} />
                    <span className={`text-xs font-semibold ${tier.badge.split(' ').slice(1).join(' ')}`}>{tier.label}</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${tier.badge.split(' ').slice(1).join(' ')} opacity-80`}>{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Live simulation ── */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
          <div>
            <div className="font-display text-xl font-semibold text-fora-ink">Live simulation</div>
            <div className="text-sm text-fora-stone mt-0.5">6 mock advisors with real behavioral signals — click Run agent to watch it work</div>
          </div>
          <div className="flex gap-3">
            {sentCount > 0 && (
              <button onClick={() => setStates({})}
                className="text-sm text-fora-stone hover:text-fora-charcoal border border-fora-sand px-4 py-2.5 rounded-full transition-all">
                ↺ Reset
              </button>
            )}
            <button onClick={runAgent} disabled={running}
              className={`flex items-center gap-2 text-sm font-medium px-6 py-2.5 rounded-full transition-all ${running ? 'bg-fora-indigo/80 text-white cursor-not-allowed' : 'bg-fora-indigo text-white hover:bg-fora-indigo-dark'}`}>
              {running
                ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Running agent...</>
                : <>▶ Run agent</>}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { num: MOCK_ADVISORS.length, label: 'Advisors monitored', color: 'text-fora-indigo' },
            { num: highCount,            label: 'High risk',           color: 'text-red-600'     },
            { num: medCount,             label: 'Medium risk',         color: 'text-amber-600'   },
            { num: sentCount,            label: 'Resources surfaced',  color: 'text-fora-olive'  },
          ].map(s => (
            <div key={s.label} className="bg-fora-white border border-fora-sand rounded-xl p-4 text-center">
              <div className={`font-display text-3xl font-semibold ${s.color}`}>{s.num}</div>
              <div className="text-xs text-fora-stone mt-1 tracking-wide uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Advisor cards */}
        <div className="space-y-3">
          {MOCK_ADVISORS.map(advisor => {
            const risk   = getRiskLevel(advisor)
            const state  = states[advisor.id]
            const colors = riskColors[risk]

            return (
              <div key={advisor.id} className={`bg-fora-white border rounded-2xl overflow-hidden transition-all ${colors.border}`}>
                <div className="flex items-center gap-4 px-5 py-4 flex-wrap">
                  <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold ${avStyle[advisor.track]}`}>
                    {advisor.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-fora-ink">{advisor.name}</div>
                    <div className="text-xs text-fora-stone mt-0.5">{advisor.trackLabel} · Day {advisor.daysSinceJoin}</div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { label: `${advisor.daysSinceLogin}d no login`,  bad: advisor.daysSinceLogin > 7 },
                      { label: `${advisor.quotesSent} quotes`,          bad: advisor.quotesSent === 0 },
                      { label: `Schedule ${advisor.scheduleAdherence}%`,  bad: advisor.scheduleAdherence < 50 },
                      { label: `${advisor.bookings} booking${advisor.bookings !== 1 ? 's' : ''}`, bad: advisor.bookings === 0 && advisor.daysSinceJoin > 20 },
                    ].map(sig => (
                      <span key={sig.label} className={`text-xs px-2.5 py-0.5 rounded-full border ${sig.bad ? 'bg-red-50 text-red-600 border-red-200' : 'bg-fora-linen text-fora-stone border-fora-sand'}`}>
                        {sig.label}
                      </span>
                    ))}
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full border flex items-center gap-1.5 flex-shrink-0 ${colors.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                    {risk} risk
                  </span>
                </div>

                {state?.loading && (
                  <div className="border-t border-fora-sand bg-fora-linen px-5 py-4 flex items-center gap-3">
                    <span className="w-4 h-4 border-2 border-fora-indigo/30 border-t-fora-indigo rounded-full animate-spin flex-shrink-0" />
                    <span className="text-sm text-fora-charcoal italic">Agent analysing {advisor.name}...</span>
                  </div>
                )}

                {state?.result && (
                  <div className="border-t border-fora-sand bg-fora-linen px-5 py-5 animate-fade-in">
                    <p className="text-xs text-fora-charcoal mb-4 leading-relaxed">
                      <span className="font-semibold text-fora-crimson">Why at risk: </span>
                      {state.result.riskReason}
                    </p>
                    <div className="mb-4">
                      <div className="text-xs font-semibold tracking-[0.12em] uppercase text-fora-stone mb-1">
                        Recommended resources for {advisor.name}
                      </div>
                      <p className="text-xs text-fora-stone mb-3 leading-relaxed">
                        These will be <span className="font-medium text-fora-indigo">emailed to {advisor.name}</span> and <span className="font-medium text-fora-indigo">surfaced on their Portal homepage</span> the next time they log in.
                      </p>
                      <div className="space-y-2">
                        {state.result.resources.map((r, i) => (
                          <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-start gap-3 bg-fora-white border border-fora-sand rounded-xl px-4 py-3 hover:border-fora-indigo transition-all group">
                            <span className="text-fora-indigo font-semibold text-xs w-4 flex-shrink-0 mt-0.5">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-fora-indigo group-hover:underline leading-snug">{r.title}</div>
                              <div className="text-xs text-fora-stone mt-0.5 leading-relaxed">{r.desc}</div>
                            </div>
                            <span className="text-fora-stone text-xs flex-shrink-0 mt-0.5">→</span>
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-fora-sand pt-4">
                      <div className="text-xs font-semibold tracking-[0.12em] uppercase text-fora-stone mb-2">Get additional support</div>
                      <div className="flex gap-2 flex-wrap">
                        <a href="https://advisor.fora.travel" target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-fora-indigo text-white hover:bg-fora-indigo-dark transition-all">
                          <span>✦</span> Ask Sidekick
                        </a>
                        <a href="https://advisor.fora.travel" target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-fora-sand-med text-fora-charcoal bg-fora-white hover:bg-fora-linen transition-all">
                          <span>💬</span> Browse the Forum
                        </a>
                        <a href="mailto:advisorsupport@foratravel.com"
                          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-fora-sand-med text-fora-charcoal bg-fora-white hover:bg-fora-linen transition-all">
                          <span>✉️</span> Email Fora HQ
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {state?.error && (
                  <div className="border-t border-fora-sand bg-red-50 px-5 py-3 text-xs text-red-600">
                    Could not reach API — check your connection.
                  </div>
                )}

                {risk === 'low' && !state && (
                  <div className="border-t border-fora-sand bg-fora-linen px-5 py-2.5">
                    <span className="text-xs text-fora-stone italic">On track — no intervention needed.</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
