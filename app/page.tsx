'use client'
import Link from 'next/link'
import Nav from '@/components/Nav'

export default function Home() {
  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-14">
          <p className="text-xs tracking-[0.25em] uppercase text-fora-stone font-medium mb-4">
            Wolf Graduate Program · Case Study
          </p>
          <h1 className="font-display text-5xl font-normal leading-[1.1] text-fora-ink mb-4">
            Tessa Grosso<br />
            <span className="italic text-fora-crimson">Advisor Success Playbook</span>
          </h1>
          <p className="text-fora-stone text-sm tracking-wide">March 2026</p>
        </div>

        {/* The prompt */}
        <div className="bg-fora-linen border border-fora-sand rounded-2xl p-7 mb-14">
          <div className="text-xs tracking-[0.2em] uppercase text-fora-stone font-medium mb-4">The prompt</div>
          <div className="space-y-4 text-fora-charcoal leading-relaxed text-sm">
            <p>
              <span className="font-semibold text-fora-ink">The challenge:</span> Our data shows that advisors who don't make their first booking within 60 days have an <span className="font-semibold text-fora-crimson">80% churn rate</span>. Currently, we have limited proactive intervention — most support is reactive when advisors reach out with questions.
            </p>
            <p>
              <span className="font-semibold text-fora-ink">The task:</span> Design a comprehensive system to identify at-risk advisors early and deliver targeted support that helps them achieve first-booking success.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                ['30,000 advisors', 'on the platform today'],
                ['45 days', 'avg. time to first booking (successful)'],
                ['90+ days', 'avg. time to first booking (churned)'],
                ['80% churn', 'for advisors with no booking in 60 days'],
              ].map(([num, label]) => (
                <div key={num} className="bg-fora-white border border-fora-sand rounded-xl p-4">
                  <div className="font-display text-xl font-semibold text-fora-indigo">{num}</div>
                  <div className="text-xs text-fora-stone mt-0.5 leading-snug">{label}</div>
                </div>
              ))}
            </div>
            <div className="pt-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-fora-stone mb-2">Main barriers to first booking</div>
              <div className="flex flex-wrap gap-2">
                {[
                  ['Client acquisition', '40%'],
                  ['Booking system complexity', '25%'],
                  ['Pricing confidence', '20%'],
                  ['Supplier relationships', '15%'],
                ].map(([barrier, pct]) => (
                  <span key={barrier} className="text-xs px-3 py-1.5 rounded-full bg-fora-white border border-fora-sand text-fora-charcoal">
                    {barrier} <span className="font-semibold text-fora-indigo">{pct}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3-step solution */}
        <div className="mb-14">
          <div className="text-xs tracking-[0.2em] uppercase text-fora-stone font-medium mb-6">My solution</div>
          <div className="grid grid-cols-3 gap-5">
            {[
              {
                num: '01',
                title: 'Smart sorting',
                subtitle: 'The quiz',
                desc: 'Every advisor answers 4 questions on Day 1. Based on their answers — do they have a client? are they tech-comfortable? — they\'re automatically sorted into one of three support tracks. No generic onboarding.',
                color: 'text-fora-indigo',
                border: 'border-fora-indigo',
                bg: 'bg-fora-white',
                href: '/quiz',
                cta: 'See the quiz →',
              },
              {
                num: '02',
                title: 'Personal plans',
                subtitle: 'Track-specific training',
                desc: 'Each track gets a week-by-week plan tailored to their barrier — client acquisition, platform mastery, or pricing confidence. Schedules adapt to their goal date and available hours.',
                color: 'text-fora-crimson',
                border: 'border-fora-crimson',
                bg: 'bg-fora-white',
                href: '/plan',
                cta: 'See the plans →',
              },
              {
                num: '03',
                title: 'Detection agent',
                subtitle: 'Proactive intervention',
                desc: 'An AI agent monitors behavioral signals across all 30,000 advisors in real time. When risk is detected, it surfaces track-matched resources and triggers personalised outreach — automatically.',
                color: 'text-fora-olive',
                border: 'border-fora-olive',
                bg: 'bg-fora-white',
                href: '/agent',
                cta: 'See the agent →',
              },
            ].map(s => (
              <div key={s.num} className={`${s.bg} border-2 ${s.border} rounded-2xl p-6 flex flex-col`}>
                <div className={`font-display text-4xl font-light ${s.color} mb-1 leading-none`}>{s.num}</div>
                <div className="font-display text-xl font-semibold text-fora-ink mb-0.5">{s.title}</div>
                <div className={`text-xs font-medium uppercase tracking-wider ${s.color} mb-3`}>{s.subtitle}</div>
                <p className="text-sm text-fora-charcoal leading-relaxed flex-1">{s.desc}</p>
                <Link href={s.href} className={`mt-5 text-xs font-medium ${s.color} hover:opacity-70 transition-opacity`}>
                  {s.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Flow diagram */}
        <div className="bg-fora-white border border-fora-sand rounded-2xl p-7 mb-14">
          <div className="text-xs tracking-[0.2em] uppercase text-fora-stone font-medium mb-6">How it works end to end</div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {[
              { label: 'Advisor joins', sub: 'Day 1' },
              null,
              { label: 'Day 1 quiz', sub: '4 questions' },
              null,
              { label: 'Track assigned', sub: 'A / B / C' },
              null,
              { label: 'Personal plan', sub: 'AI-generated' },
              null,
              { label: 'Calendar sync', sub: 'optional' },
              null,
              { label: 'Agent monitors', sub: 'continuous' },
              null,
              { label: 'Booking #1', sub: '< 60 days' },
            ].map((item, i) =>
              item === null ? (
                <span key={i} className="text-fora-sand text-lg font-light">→</span>
              ) : (
                <div key={i} className="text-center px-3 py-2 bg-fora-linen border border-fora-sand rounded-xl">
                  <div className="text-xs font-semibold text-fora-ink">{item.label}</div>
                  <div className="text-xs text-fora-stone">{item.sub}</div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Demo nav */}
        <div className="text-center">
          <p className="text-sm text-fora-stone mb-5">Explore each component of the system</p>
          <div className="flex gap-3 justify-center flex-wrap">
            {[
              { href: '/quiz',      label: 'Take the quiz',         style: 'bg-fora-indigo text-white hover:bg-fora-indigo-dark' },
              { href: '/plan',      label: 'View training plans',   style: 'border border-fora-sand-med text-fora-charcoal hover:bg-fora-linen' },
              { href: '/agent',     label: 'Run the agent',         style: 'border border-fora-sand-med text-fora-charcoal hover:bg-fora-linen' },
              { href: '/outreach',  label: 'See outreach mockups',  style: 'border border-fora-sand-med text-fora-charcoal hover:bg-fora-linen' },
            ].map(b => (
              <Link key={b.href} href={b.href}
                className={`text-sm font-medium px-6 py-2.5 rounded-full transition-all ${b.style}`}>
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
