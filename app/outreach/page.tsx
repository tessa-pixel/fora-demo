'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'

type Email = {
  id: string
  tag: string
  tagColor: string
  subject: string
  preview: string
  body: string
  resources: { title: string; url: string }[]
  ctas: { label: string; href: string; primary?: boolean }[]
}

const HENLEY_EMAIL: Email = {
  id: 'henley',
  tag: 'From Henley — schedule deviation',
  tagColor: 'bg-fora-indigo text-white',
  subject: 'We noticed you\'ve gotten a little off track — here\'s how we can help',
  preview: 'Hi [Name] — checking in from Fora HQ...',
  body: `Hi [Name],

I'm Henley, one of the co-founders here at Fora. I wanted to reach out personally because I noticed you've drifted a little off your success plan recently — and I know from experience that this moment, right here, is actually the most important one.

Every advisor who's built something meaningful with Fora has had a moment where life got in the way of their plan. The ones who came out the other side didn't do anything dramatic — they just got back on track.

Here are a few resources that other advisors in your situation have found most helpful for getting their momentum back. I've picked them specifically because they're short, practical, and written for exactly where you are right now.

If you need to rearrange your schedule or shift your goal date, you can do that anytime in the Schedule section of your Portal. Your plan is flexible — it's designed to work around your life, not the other way around.

We're rooting for you.

— Henley
Co-founder, Fora`,
  resources: [
    { title: 'How travel advisors communicate value & attract clients', url: 'https://www.foratravel.com/join/resources/how-to-communicate-your-value-as-a-travel-advisor' },
    { title: 'How to close the sale: 8 proven strategies for travel advisors', url: 'https://www.foratravel.com/join/resources/how-to-close-the-sale-8-proven-strategies-for-travel-advisors' },
    { title: 'Is being a travel agent worth it? Pros and cons', url: 'https://www.foratravel.com/join/resources/is-being-a-travel-agent-worth-it' },
  ],
  ctas: [
    { label: 'Adjust my schedule', href: '/calendar', primary: true },
    { label: 'Ask Sidekick', href: 'https://advisor.fora.travel' },
    { label: 'Browse the Forum', href: 'https://advisor.fora.travel' },
  ],
}

const RISK_EMAILS: Email[] = [
  {
    id: 'track-a',
    tag: 'Track A — client acquisition',
    tagColor: 'bg-fora-crimson text-white',
    subject: 'Your first client is closer than you think',
    preview: 'Hi [Name] — we see you haven\'t made your first booking yet...',
    body: `Hi [Name],

We noticed you haven't made your first booking yet, and we want to make sure you have everything you need to get there.

The most common reason new advisors get stuck at this stage isn't the platform or the training — it's knowing where to find that first client. The good news: you almost certainly already know someone who wants to travel.

We've put together the three resources below specifically for advisors in your situation. They're short, practical, and written by people who've been exactly where you are.

If you have questions that these don't answer, Sidekick is available 24/7 inside your Portal, our Forum community has thousands of advisors ready to help, or you can reach our team directly at advisorsupport@foratravel.com.

You can also reschedule any sessions in the Schedule section of your Portal — your plan is built to flex around your life.

We're here for you.

— The Fora Team`,
    resources: [
      { title: 'Top 3 strategies for how to get clients as a travel agent', url: 'https://www.foratravel.com/join/resources/how-do-travel-agents-get-clients' },
      { title: 'How travel advisors communicate value & attract clients', url: 'https://www.foratravel.com/join/resources/how-to-communicate-your-value-as-a-travel-advisor' },
      { title: 'How to close the sale: 8 proven strategies for travel advisors', url: 'https://www.foratravel.com/join/resources/how-to-close-the-sale-8-proven-strategies-for-travel-advisors' },
    ],
    ctas: [
      { label: 'Ask Sidekick', href: 'https://advisor.fora.travel', primary: true },
      { label: 'Adjust my schedule', href: '/calendar' },
      { label: 'Email Fora HQ', href: 'mailto:advisorsupport@foratravel.com' },
    ],
  },
  {
    id: 'track-b',
    tag: 'Track B — platform confidence',
    tagColor: 'bg-fora-indigo text-white',
    subject: 'A few resources to help you feel at home in the Portal',
    preview: 'Hi [Name] — we noticed you haven\'t sent a quote yet...',
    body: `Hi [Name],

We noticed you haven't sent a quote yet, and we want to make sure the platform isn't getting in the way of your first booking.

The Fora Portal is powerful, but we know it can feel like a lot at first. The advisors who get comfortable with it fastest are usually the ones who take 20 minutes to watch a walkthrough before diving in.

The resources below are the ones our team recommends most for advisors who are still getting their footing in the platform. They're designed to get you from "I'm not sure where to start" to "I just sent my first bookable quote" as quickly as possible.

As always, Sidekick is available inside your Portal to answer any question in real time. Our Forum is also full of advisors who've navigated exactly the same learning curve. Or reach us directly at advisorsupport@foratravel.com.

You can rearrange any sessions in the Schedule section of your Portal anytime — your plan works around you.

— The Fora Team`,
    resources: [
      { title: 'New Portal features: maps, leads, sort by price & more', url: 'https://www.foratravel.com/join/resources/new-booking-platform-features-august-2024' },
      { title: "Fora's training curriculum: an overview & what to expect", url: 'https://www.foratravel.com/join/resources/travel-advisor-training-curriculum' },
      { title: 'Life as a remote travel agent: Fora\'s complete guide', url: 'https://www.foratravel.com/join/resources/remote-travel-agent' },
    ],
    ctas: [
      { label: 'Ask Sidekick', href: 'https://advisor.fora.travel', primary: true },
      { label: 'Browse the Forum', href: 'https://advisor.fora.travel' },
      { label: 'Adjust my schedule', href: '/calendar' },
    ],
  },
  {
    id: 'track-c',
    tag: 'Track C — pricing confidence',
    tagColor: 'bg-fora-olive text-white',
    subject: 'You\'re sending quotes — here\'s how to start converting them',
    preview: 'Hi [Name] — you\'ve done the hard work of sending quotes...',
    body: `Hi [Name],

You've done the hard work: your training is complete and you've been sending quotes. That puts you further along than most new advisors at this stage.

The gap between "sending quotes" and "making bookings" almost always comes down to one thing: pricing confidence. Specifically, the moment a client hesitates — and knowing exactly what to say next.

The resources below are the ones we point advisors to when they're right where you are. They're practical, specific, and short.

Remember: Sidekick inside your Portal can help you think through pricing for a specific trip in real time. The Forum has advisors who've faced the exact same moment and can share what worked. Or email us directly at advisorsupport@foratravel.com.

If you need to shift sessions around, the Schedule section of your Portal is always there.

One booking changes everything. You're close.

— The Fora Team`,
    resources: [
      { title: 'Travel agent commission: how it works & how much you earn', url: 'https://www.foratravel.com/join/resources/travel-agent-commission' },
      { title: 'How to close the sale: 8 proven strategies for travel advisors', url: 'https://www.foratravel.com/join/resources/how-to-close-the-sale-8-proven-strategies-for-travel-advisors' },
      { title: 'How do travel agents get paid?', url: 'https://www.foratravel.com/join/resources/how-do-travel-agents-get-paid' },
    ],
    ctas: [
      { label: 'Ask Sidekick', href: 'https://advisor.fora.travel', primary: true },
      { label: 'Browse the Forum', href: 'https://advisor.fora.travel' },
      { label: 'Email Fora HQ', href: 'mailto:advisorsupport@foratravel.com' },
    ],
  },
  {
    id: 'track-d',
    tag: 'Track D — supplier relationships',
    tagColor: 'bg-purple-800 text-white',
    subject: 'Your supplier relationships are your competitive edge — let\'s build them',
    preview: 'Hi [Name] — we noticed you\'ve gotten off track on your supplier plan...',
    body: `Hi [Name],

We noticed you've drifted a little from your supplier relationships plan, and we wanted to reach out before the momentum slips.

You chose Track D because you're ready to go beyond the basics — and that instinct is right. The advisors who build deep supplier relationships early are the ones who can offer clients things no one else can: room upgrades, early check-in, hotel credits, and access to properties that aren't even available to the public.

That advantage only compounds over time. But it starts with the work you're doing right now.

The resources below are the most practical ones we have for advisors at exactly your stage. They'll help you understand how Fora's preferred supplier network works and how to start activating those relationships for real bookings.

As always, Sidekick in your Portal can help you navigate a specific supplier question in real time. The Forum is full of experienced advisors who've built exactly the kind of supplier network you're aiming for. Or reach us directly at advisorsupport@foratravel.com.

You can adjust any sessions in the Schedule section of your Portal anytime.

The foundation you're building now pays off every single booking.

— The Fora Team`,
    resources: [
      { title: 'Fora Reserve: exclusive perks and how to unlock them for clients', url: 'https://www.foratravel.com/join/resources/new-booking-platform-features-august-2024' },
      { title: 'Travel agent commission: how it works & how much you earn', url: 'https://www.foratravel.com/join/resources/travel-agent-commission' },
      { title: 'Travelport x Fora: a tech-enabled supplier partnership', url: 'https://www.foratravel.com/join/resources/travelport-fora-partnership' },
    ],
    ctas: [
      { label: 'Ask Sidekick', href: 'https://advisor.fora.travel', primary: true },
      { label: 'Browse the Forum', href: 'https://advisor.fora.travel' },
      { label: 'Email Fora HQ', href: 'mailto:advisorsupport@foratravel.com' },
    ],
  },
]

function EmailCard({ email, expanded, onToggle }: { email: Email; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="bg-fora-white border border-fora-sand rounded-2xl overflow-hidden">
      <button onClick={onToggle} className="w-full text-left px-6 py-5 flex items-start gap-4 hover:bg-fora-linen transition-all">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${email.tagColor}`}>{email.tag}</span>
          </div>
          <div className="font-display text-base font-semibold text-fora-ink leading-snug mb-1">{email.subject}</div>
          <div className="text-xs text-fora-stone">{email.preview}</div>
        </div>
        <span className="text-fora-stone text-sm mt-1 flex-shrink-0">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="border-t border-fora-sand animate-fade-in">
          <div className="px-6 py-4 bg-fora-linen border-b border-fora-sand">
            <div className="grid grid-cols-[60px_1fr] gap-y-1 text-xs text-fora-charcoal">
              <span className="text-fora-stone font-medium">From:</span>
              <span>Henley Vazquez &lt;henley@foratravel.com&gt;</span>
              <span className="text-fora-stone font-medium">To:</span>
              <span>[Advisor Name] &lt;advisor@email.com&gt;</span>
              <span className="text-fora-stone font-medium">Subject:</span>
              <span className="font-medium text-fora-ink">{email.subject}</span>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="max-w-2xl">
              <div className="font-display text-lg font-semibold tracking-[0.15em] uppercase text-fora-ink mb-6">Fora</div>
              <div className="text-sm text-fora-charcoal leading-[1.8] whitespace-pre-wrap mb-6">{email.body}</div>

              {email.resources.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs font-semibold tracking-[0.12em] uppercase text-fora-stone mb-3">Resources for you</div>
                  <div className="space-y-2">
                    {email.resources.map((r, i) => (
                      <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-fora-linen border border-fora-sand rounded-xl hover:border-fora-indigo transition-all group">
                        <span className="w-5 h-5 rounded-full bg-fora-indigo text-white text-xs flex items-center justify-center flex-shrink-0">{i + 1}</span>
                        <span className="text-sm text-fora-indigo group-hover:underline flex-1">{r.title}</span>
                        <span className="text-fora-stone text-xs">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 flex-wrap pt-2 border-t border-fora-sand">
                {email.ctas.map((c, i) => (
                  <a key={i} href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className={`text-sm font-medium px-5 py-2.5 rounded-full transition-all ${c.primary ? 'bg-fora-indigo text-white hover:bg-fora-indigo-dark' : 'border border-fora-sand-med text-fora-charcoal hover:bg-fora-linen'}`}>
                    {c.label}
                  </a>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-fora-sand text-xs text-fora-stone leading-relaxed">
                <p>You're receiving this because you're a Fora Advisor. Questions? Email us at <a href="mailto:advisorsupport@foratravel.com" className="text-fora-indigo hover:underline">advisorsupport@foratravel.com</a></p>
                <p className="mt-1">Fora Travel · 115 W 30th St, New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OutreachPage() {
  const [expanded, setExpanded] = useState<string | null>('henley')
  function toggle(id: string) { setExpanded(prev => prev === id ? null : id) }

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-fora-stone mb-3">Outreach system</p>
          <h1 className="font-display text-4xl font-normal text-fora-ink leading-tight">Outreach mockups</h1>
          <p className="text-fora-charcoal mt-2 leading-relaxed">
            Automated emails sent when advisors veer from their plan or show at-risk signals — each tailored to their track with real Fora resource links.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { step: '1', label: 'Agent detects risk', desc: 'Behavioural signals trigger when an advisor misses sessions or goes quiet.' },
            { step: '2', label: 'Track-matched email sent', desc: 'The right email fires automatically based on their risk profile and barrier type.' },
            { step: '3', label: 'Advisor chooses support', desc: 'Sidekick, Forum, or email HQ — the advisor picks what works for them.' },
          ].map(s => (
            <div key={s.step} className="bg-fora-white border border-fora-sand rounded-xl p-4">
              <div className="font-display text-2xl font-semibold text-fora-indigo mb-1">{s.step}</div>
              <div className="text-sm font-medium text-fora-ink mb-1">{s.label}</div>
              <div className="text-xs text-fora-stone leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <div className="text-xs font-semibold tracking-[0.15em] uppercase text-fora-stone mb-3">From Henley — schedule deviation trigger</div>
          <EmailCard email={HENLEY_EMAIL} expanded={expanded === 'henley'} onToggle={() => toggle('henley')} />
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-fora-sand" />
          <span className="text-xs text-fora-stone uppercase tracking-wider">Track-specific risk emails</span>
          <div className="flex-1 h-px bg-fora-sand" />
        </div>

        <div className="space-y-3">
          {RISK_EMAILS.map(email => (
            <EmailCard key={email.id} email={email} expanded={expanded === email.id} onToggle={() => toggle(email.id)} />
          ))}
        </div>

        <div className="mt-10 bg-fora-linen border border-fora-sand rounded-2xl p-6">
          <div className="text-xs font-semibold tracking-[0.15em] uppercase text-fora-stone mb-4">All emails offer three support paths</div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: '✦', label: 'Ask Sidekick', desc: 'AI assistant available 24/7 inside the Portal — answers specific questions in real time.' },
              { icon: '💬', label: 'Browse the Forum', desc: 'Community of 30,000+ advisors. Search existing threads or ask a new question.' },
              { icon: '✉️', label: 'Email Fora HQ', desc: 'Reach the team directly at advisorsupport@foratravel.com for anything that needs a human.' },
            ].map(s => (
              <div key={s.label} className="bg-fora-white border border-fora-sand rounded-xl p-4">
                <div className="text-xl mb-2">{s.icon}</div>
                <div className="text-sm font-medium text-fora-ink mb-1">{s.label}</div>
                <div className="text-xs text-fora-stone leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
