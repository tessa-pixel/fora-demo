'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { Track } from '@/lib/types'

const EXPERIENCE = [
  { value: 'new',         label: 'Brand new to travel',    sub: 'I\'ve never worked in travel before.' },
  { value: 'some',        label: 'Some experience',        sub: 'I\'ve planned trips but not professionally.' },
  { value: 'experienced', label: 'Travel professional',    sub: 'I\'m switching platforms or adding Fora to my work.' },
]

function today() { return new Date().toISOString().split('T')[0] }
function maxDate() {
  const d = new Date(); d.setDate(d.getDate() + 60)
  return d.toISOString().split('T')[0]
}
function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - new Date(today()).getTime()) / (1000 * 60 * 60 * 24))
}

// Steps:
// 0 = name
// 1 = experience
// 2 = has client?  → No → Track A → skip to 5
// 3 = tech comfort? → Not comfortable → Track B → skip to 5
// 4 = pricing vs suppliers? → Pricing → Track C / Suppliers → Track D → go to 5
// 5 = goal date + calendar

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep]           = useState(0)
  const [name, setName]           = useState('')
  const [experience, setExp]      = useState('')
  const [hasClient, setHasClient] = useState<boolean | null>(null)
  const [techComfort, setTech]    = useState<'low' | 'high' | null>(null)
  const [focusArea, setFocus]     = useState<'pricing' | 'suppliers' | null>(null)
  const [hours, setHours]         = useState(5)
  const [goalDate, setGoalDate]   = useState('')
  const [calConnected, setCal]    = useState<'none' | 'google' | 'apple'>('none')

  function getTrack(): Track {
    if (hasClient === false) return 'A'
    if (techComfort === 'low') return 'B'
    if (focusArea === 'pricing') return 'C'
    return 'D'
  }

  function next() {
    if (step === 2 && hasClient === false) { setStep(5); return }
    if (step === 3 && techComfort === 'low') { setStep(5); return }
    setStep(s => s + 1)
  }
  function back() {
    if (step === 5 && hasClient === false) { setStep(2); return }
    if (step === 5 && techComfort === 'low') { setStep(3); return }
    setStep(s => s - 1)
  }

  function finish() {
    const answers = { name, barrier: getTrack(), experience, hoursPerWeek: hours, goalDate, calConnected }
    localStorage.setItem('foraQuiz', JSON.stringify(answers))
    router.push('/plan')
  }

  // Work out how many steps the user actually sees
  const skippedTech = hasClient === false
  const skippedFocus = hasClient === false || techComfort === 'low'
  const displayTotal = skippedTech ? 4 : skippedFocus ? 5 : 6
  const displayStep  = step === 5
    ? displayTotal
    : step + 1

  const canContinue = ([
    name.trim().length > 0,   // 0
    experience !== '',         // 1
    hasClient !== null,        // 2
    techComfort !== null,      // 3
    focusArea !== null,        // 4
    goalDate !== '',           // 5
  ] as boolean[])[step] ?? false

  const progressPct = (step / 5) * 100

  return (
    <>
      <Nav />
      <main className="max-w-xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="flex justify-between text-xs text-fora-stone mb-2 font-medium tracking-wide uppercase">
            <span>Question {displayStep} of {displayTotal}</span>
            <span>{Math.round(progressPct)}% complete</span>
          </div>
          <div className="h-0.5 bg-fora-sand rounded-full overflow-hidden">
            <div className="h-full bg-fora-crimson rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* STEP 0: Name */}
        {step === 0 && (
          <div className="animate-slide-up">
            <p className="text-xs tracking-[0.2em] uppercase text-fora-stone mb-3">Welcome to Fora</p>
            <h2 className="font-display text-3xl font-normal text-fora-ink mb-2 leading-snug">Let's personalise your journey.</h2>
            <p className="text-fora-charcoal mb-8 leading-relaxed">Answer a few quick questions and we'll build a success plan designed specifically for you.</p>
            <label className="block text-sm font-medium text-fora-charcoal mb-2">Your first name</label>
            <input type="text" placeholder="e.g. Sarah" value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canContinue && next()}
              className="w-full border border-fora-sand-med rounded-xl px-4 py-3 text-fora-ink bg-fora-white focus:outline-none focus:border-fora-indigo text-base" />
          </div>
        )}

        {/* STEP 1: Experience */}
        {step === 1 && (
          <div className="animate-slide-up">
            <p className="text-xs tracking-[0.2em] uppercase text-fora-stone mb-3">Step 2</p>
            <h2 className="font-display text-3xl font-normal text-fora-ink mb-2 leading-snug">Great, {name}. What's your background in travel?</h2>
            <p className="text-fora-charcoal mb-8 leading-relaxed">This helps us calibrate how much foundational training to include.</p>
            <div className="flex flex-col gap-3">
              {EXPERIENCE.map(e => (
                <button key={e.value} onClick={() => setExp(e.value)}
                  className={`text-left px-5 py-4 rounded-xl border transition-all ${experience === e.value ? 'border-fora-indigo bg-fora-indigo text-white' : 'border-fora-sand bg-fora-white text-fora-ink hover:bg-fora-linen'}`}>
                  <div className="font-medium text-sm">{e.label}</div>
                  <div className={`text-xs mt-0.5 ${experience === e.value ? 'text-blue-200' : 'text-fora-stone'}`}>{e.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Do you have a client in mind? */}
        {step === 2 && (
          <div className="animate-slide-up">
            <p className="text-xs tracking-[0.2em] uppercase text-fora-stone mb-3">Step 3</p>
            <h2 className="font-display text-3xl font-normal text-fora-ink mb-2 leading-snug">Hi {name}! Do you already have someone in mind who wants to travel?</h2>
            <p className="text-fora-charcoal mb-8 leading-relaxed">Think about friends, family, or colleagues who've mentioned wanting to take a trip.</p>
            <div className="flex flex-col gap-3">
              {[
                { val: true,  label: 'Yes — I have someone in mind',             sub: 'A friend, family member, or colleague I could book for.' },
                { val: false, label: 'Not yet — I\'m not sure who to approach',  sub: 'I need help finding and approaching my first client.' },
              ].map(opt => (
                <button key={String(opt.val)} onClick={() => setHasClient(opt.val)}
                  className={`text-left px-5 py-4 rounded-xl border transition-all ${hasClient === opt.val ? 'border-fora-indigo bg-fora-indigo text-white' : 'border-fora-sand bg-fora-white text-fora-ink hover:bg-fora-linen'}`}>
                  <div className="font-medium text-sm">{opt.label}</div>
                  <div className={`text-xs mt-0.5 ${hasClient === opt.val ? 'text-blue-200' : 'text-fora-stone'}`}>{opt.sub}</div>
                </button>
              ))}
            </div>
            {hasClient === false && (
              <div className="mt-4 bg-fora-linen border border-fora-sand rounded-xl px-4 py-3 text-sm text-fora-charcoal animate-fade-in">
                Your plan will focus on <strong>client acquisition</strong> — we'll help you find and land your first client.
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Tech comfort */}
        {step === 3 && (
          <div className="animate-slide-up">
            <p className="text-xs tracking-[0.2em] uppercase text-fora-stone mb-3">Step 4</p>
            <h2 className="font-display text-3xl font-normal text-fora-ink mb-2 leading-snug">How comfortable are you with booking technology?</h2>
            <p className="text-fora-charcoal mb-8 leading-relaxed">There's no wrong answer — this shapes how much platform guidance we include.</p>
            <div className="flex flex-col gap-3">
              {[
                { val: 'low',  label: 'Not very comfortable',  sub: 'Technology can feel overwhelming — I need step-by-step guidance.' },
                { val: 'high', label: 'Pretty comfortable',    sub: 'I pick up new tools quickly and want to focus on the business side.' },
              ].map(opt => (
                <button key={opt.val} onClick={() => setTech(opt.val as 'low' | 'high')}
                  className={`text-left px-5 py-4 rounded-xl border transition-all ${techComfort === opt.val ? 'border-fora-indigo bg-fora-indigo text-white' : 'border-fora-sand bg-fora-white text-fora-ink hover:bg-fora-linen'}`}>
                  <div className="font-medium text-sm">{opt.label}</div>
                  <div className={`text-xs mt-0.5 ${techComfort === opt.val ? 'text-blue-200' : 'text-fora-stone'}`}>{opt.sub}</div>
                </button>
              ))}
            </div>
            {techComfort === 'low' && (
              <div className="mt-4 bg-fora-linen border border-fora-sand rounded-xl px-4 py-3 text-sm text-fora-charcoal animate-fade-in">
                Your plan will focus on <strong>mastering the Fora platform</strong> — guided walkthroughs, simple steps, no overwhelm.
              </div>
            )}
            {techComfort === 'high' && (
              <div className="mt-4 bg-fora-linen border border-fora-sand rounded-xl px-4 py-3 text-sm text-fora-charcoal animate-fade-in">
                One more question to find the right focus for you.
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Pricing vs Supplier focus (only if tech-comfortable) */}
        {step === 4 && (
          <div className="animate-slide-up">
            <p className="text-xs tracking-[0.2em] uppercase text-fora-stone mb-3">Step 5</p>
            <h2 className="font-display text-3xl font-normal text-fora-ink mb-2 leading-snug">Where do you want to focus your energy first?</h2>
            <p className="text-fora-charcoal mb-8 leading-relaxed">
              Both matter — but most advisors have a stronger footing in one area. Pick the one that feels most uncertain right now.
            </p>
            <div className="flex flex-col gap-3">
              {[
                {
                  val: 'pricing',
                  label: 'Pricing confidence',
                  sub: 'I\'m unsure how to price trips, quote fees, or know what to charge clients.',
                  note: 'Best for: advisors with a client ready but hesitant to send a number.',
                },
                {
                  val: 'suppliers',
                  label: 'Supplier relationships',
                  sub: 'I want to build deeper partnerships with hotels, operators, and preferred suppliers.',
                  note: 'Best for: experienced advisors looking to unlock better commissions and perks.',
                },
              ].map(opt => (
                <button key={opt.val} onClick={() => setFocus(opt.val as 'pricing' | 'suppliers')}
                  className={`text-left px-5 py-4 rounded-xl border transition-all ${focusArea === opt.val ? 'border-fora-indigo bg-fora-indigo text-white' : 'border-fora-sand bg-fora-white text-fora-ink hover:bg-fora-linen'}`}>
                  <div className="font-medium text-sm">{opt.label}</div>
                  <div className={`text-xs mt-0.5 leading-snug ${focusArea === opt.val ? 'text-blue-200' : 'text-fora-stone'}`}>{opt.sub}</div>
                  <div className={`text-xs mt-1.5 font-medium ${focusArea === opt.val ? 'text-blue-100' : 'text-fora-stone'}`}>{opt.note}</div>
                </button>
              ))}
            </div>
            {focusArea === 'suppliers' && (
              <div className="mt-4 bg-fora-linen border border-fora-sand rounded-xl px-4 py-3 text-sm text-fora-charcoal animate-fade-in">
                Track D is our most advanced track — focused on building the supplier relationships that separate good advisors from great ones.
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Goal date + calendar */}
        {step === 5 && (
          <div className="animate-slide-up">
            <p className="text-xs tracking-[0.2em] uppercase text-fora-stone mb-3">Step {displayTotal} — The most important question</p>
            <h2 className="font-display text-3xl font-normal text-fora-ink mb-2 leading-snug">When do you want to make your first booking?</h2>
            <div className="bg-fora-indigo text-white rounded-xl px-5 py-4 mb-5">
              <div className="text-xs tracking-[0.15em] uppercase opacity-60 mb-1">Research shows</div>
              <p className="text-sm leading-relaxed opacity-90">
                Advisors who set a <strong>specific, measurable goal date</strong> are{' '}
                <strong>3× more likely</strong> to make their first booking on time. The act of committing to a date transforms intention into action.
              </p>
            </div>
            <label className="block text-sm font-medium text-fora-charcoal mb-1.5">Set your target date — up to 60 days from today</label>
            <input type="date" min={today()} max={maxDate()} value={goalDate}
              onChange={e => setGoalDate(e.target.value)}
              className="w-full border border-fora-sand-med rounded-xl px-4 py-3 text-fora-ink bg-fora-white focus:outline-none focus:border-fora-indigo text-base mb-4" />
            {goalDate && (
              <div className="bg-fora-linen border border-fora-sand rounded-xl px-5 py-4 mb-5 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-display font-semibold text-fora-crimson">{daysUntil(goalDate)}</div>
                  <div>
                    <div className="text-sm font-medium text-fora-ink">days to your first booking</div>
                    <div className="text-xs text-fora-stone mt-0.5">
                      We'll build your entire plan around {new Date(goalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="mb-6">
              <label className="block text-sm font-medium text-fora-charcoal mb-2">
                Hours per week available: <span className="text-fora-indigo font-semibold">{hours}h</span>
              </label>
              <input type="range" min={1} max={20} value={hours} onChange={e => setHours(Number(e.target.value))} className="w-full" />
              <div className="flex justify-between text-xs text-fora-stone mt-1"><span>1h (side hustle)</span><span>20h (full-time)</span></div>
            </div>
            <div className="border border-fora-sand rounded-xl p-5 bg-fora-white">
              <div className="text-sm font-medium text-fora-ink mb-0.5">Connect your calendar
                <span className="text-fora-stone font-normal text-xs ml-2">optional</span>
              </div>
              <p className="text-xs text-fora-stone mb-4 leading-relaxed">Add all your training sessions directly to your calendar.</p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setCal(calConnected === 'google' ? 'none' : 'google')}
                  className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-full border transition-all ${calConnected === 'google' ? 'bg-fora-indigo text-white border-fora-indigo' : 'border-fora-sand-med text-fora-charcoal hover:bg-fora-linen'}`}>
                  <span>📅</span>{calConnected === 'google' ? '✓ Google Calendar connected' : 'Connect Google Calendar'}
                </button>
                <button onClick={() => setCal(calConnected === 'apple' ? 'none' : 'apple')}
                  className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-full border transition-all ${calConnected === 'apple' ? 'bg-fora-indigo text-white border-fora-indigo' : 'border-fora-sand-med text-fora-charcoal hover:bg-fora-linen'}`}>
                  <span>🍎</span>{calConnected === 'apple' ? '✓ Apple Calendar connected' : 'Connect Apple Calendar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          {step > 0 ? (
            <button onClick={back} className="text-sm text-fora-stone hover:text-fora-charcoal transition-colors">← Back</button>
          ) : <div />}
          {step < 5 ? (
            <button onClick={next} disabled={!canContinue}
              className="bg-fora-indigo text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-fora-indigo-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Continue →
            </button>
          ) : (
            <button onClick={finish} disabled={!canContinue}
              className="bg-fora-crimson text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-fora-crimson-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Build my plan →
            </button>
          )}
        </div>
      </main>
    </>
  )
}
