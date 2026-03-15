import { NextRequest, NextResponse } from 'next/server'

const RESOURCES: Record<string, { title: string; url: string; desc: string }[]> = {
  A: [
    { title: 'Top 3 strategies for how to get clients as a travel agent', url: 'https://www.foratravel.com/join/resources/how-do-travel-agents-get-clients', desc: 'Proven tactics for building your client base from your personal network outward.' },
    { title: 'How travel advisors communicate value & attract clients', url: 'https://www.foratravel.com/join/resources/how-to-communicate-your-value-as-a-travel-advisor', desc: 'Learn to articulate what makes a Fora Advisor different — and worth it.' },
    { title: 'How to close the sale: 8 proven strategies for travel advisors', url: 'https://www.foratravel.com/join/resources/how-to-close-the-sale-8-proven-strategies-for-travel-advisors', desc: 'Turn warm leads into confirmed bookings with these field-tested techniques.' },
  ],
  B: [
    { title: 'New Portal features: maps, leads, sort by price & more', url: 'https://www.foratravel.com/join/resources/new-booking-platform-features-august-2024', desc: 'A walkthrough of every major Portal feature — great for getting up to speed fast.' },
    { title: "Fora's training curriculum: an overview & what to expect", url: 'https://www.foratravel.com/join/resources/travel-advisor-training-curriculum', desc: 'Understand the full learning path and what each module unlocks.' },
    { title: 'Life as a remote travel agent: Fora\'s guide', url: 'https://www.foratravel.com/join/resources/remote-travel-agent', desc: 'Day-to-day workflows, tools, and habits that make remote advising work.' },
  ],
  C: [
    { title: 'Travel agent commission: how it works & how much you earn', url: 'https://www.foratravel.com/join/resources/travel-agent-commission', desc: 'Everything you need to know about commission structures, splits, and maximising earnings.' },
    { title: 'How do travel agents get paid?', url: 'https://www.foratravel.com/join/resources/how-do-travel-agents-get-paid', desc: 'A clear breakdown of when and how commissions are paid out — with Fora specifics.' },
    { title: 'How to close the sale: 8 proven strategies for travel advisors', url: 'https://www.foratravel.com/join/resources/how-to-close-the-sale-8-proven-strategies-for-travel-advisors', desc: 'Build pricing confidence and convert quotes into confirmed bookings.' },
  ],
  D: [
    { title: 'Fora Reserve: exclusive perks and how to unlock them for clients', url: 'https://www.foratravel.com/join/resources/new-booking-platform-features-august-2024', desc: 'How Fora\'s preferred supplier program works and how to leverage it for every booking.' },
    { title: 'Travel agent commission: how it works & how much you earn', url: 'https://www.foratravel.com/join/resources/travel-agent-commission', desc: 'Understand supplier commission structures and how to maximise your earnings per booking.' },
    { title: 'Travelport x Fora: a tech-enabled supplier partnership', url: 'https://www.foratravel.com/join/resources/travelport-fora-partnership', desc: 'How Fora\'s technology connects advisors with suppliers to unlock better rates and content.' },
  ],
}

const RISK_REASONS: Record<number, string> = {
  1: "Maya is on day 22 with only 30% schedule adherence and a 9-day login gap — she has fallen behind on her plan and gone quiet, which together signal medium-to-high risk in the activation window.",
  2: "James is on day 18 with 80% schedule adherence and a quote sent — he is actively following his plan and on pace. No intervention needed.",
  3: "Sophie is on day 35 with 90% schedule adherence and 3 quotes sent but no booking — she's following her plan well but stuck at the close. A pricing confidence resource could unlock her first booking.",
  4: "David is on day 41 with only 15% schedule adherence and a 10-day login gap — he has significantly fallen off his plan and gone quiet, the highest risk combination in this cohort.",
  5: "Priya made her first booking on day 12 and has 75% schedule adherence — fully on track. No intervention needed.",
  6: "Tom is on day 28 with 100% schedule adherence and 5 quotes but zero bookings — he is following his plan perfectly but not converting. A closing strategy resource could make the difference.",
  7: "Elena is on day 32 with 55% schedule adherence and an 8-day login gap — she has drifted from her supplier relationships track and is at risk of losing momentum before her first booking.",
}

export async function POST(req: NextRequest) {
  const { advisor } = await req.json()
  await new Promise(r => setTimeout(r, 900))

  const resources  = RESOURCES[advisor.track] || RESOURCES['A']
  const riskReason = RISK_REASONS[advisor.id] || RISK_REASONS[1]

  return NextResponse.json({ riskReason, resources })
}
