import { NextRequest, NextResponse } from 'next/server'

const MOCK_PLANS: Record<string, object> = {
  A: {
    firstWin: "Send your first warm outreach message to someone in your network who loves to travel.",
    keyMilestone: "By the end of week 4, you'll have spoken to at least 10 potential clients and sent your first bookable quote.",
    weeks: [
      {
        week: 1, theme: "Map your network",
        sessions: [
          { day: "Mon", title: "Warm network mapping exercise", duration: "45 min", type: "training" },
          { day: "Wed", title: "Write your first client pitch", duration: "30 min", type: "training" },
          { day: "Fri", title: "Send 5 personalised outreach messages", duration: "30 min", type: "action" },
        ]
      },
      {
        week: 2, theme: "Build your pipeline",
        sessions: [
          { day: "Mon", title: "Social media content — travel post", duration: "45 min", type: "action" },
          { day: "Wed", title: "Follow up on week 1 outreach", duration: "20 min", type: "action" },
          { day: "Fri", title: "Discovery call practice with Sidekick", duration: "30 min", type: "training" },
        ]
      },
      {
        week: 3, theme: "First booking attempt",
        sessions: [
          { day: "Mon", title: "Build your first bookable quote", duration: "45 min", type: "action" },
          { day: "Wed", title: "Self-review: assess your progress", duration: "15 min", type: "checkin" },
          { day: "Fri", title: "Send quote to a real lead", duration: "30 min", type: "action" },
        ]
      },
      {
        week: 4, theme: "Close your first booking",
        sessions: [
          { day: "Mon", title: "Follow-up scripts for warm leads", duration: "30 min", type: "training" },
          { day: "Thu", title: "Complete first booking", duration: "60 min", type: "action" },
        ]
      },
    ]
  },
  B: {
    firstWin: "Complete your first full booking simulation in the Portal without any help.",
    keyMilestone: "By week 3 you'll have sent a real bookable quote to a client and understand every major Portal feature.",
    weeks: [
      {
        week: 1, theme: "Portal orientation",
        sessions: [
          { day: "Mon", title: "Full Portal walkthrough", duration: "60 min", type: "training" },
          { day: "Wed", title: "Sidekick 2.0 deep dive", duration: "30 min", type: "training" },
          { day: "Fri", title: "Build your first bookable quote", duration: "45 min", type: "action" },
        ]
      },
      {
        week: 2, theme: "Quote and propose",
        sessions: [
          { day: "Mon", title: "Send your first proposal to a test client", duration: "30 min", type: "action" },
          { day: "Wed", title: "Sidekick 2.0 booking walkthrough", duration: "30 min", type: "checkin" },
          { day: "Fri", title: "Commission dashboard walkthrough", duration: "20 min", type: "training" },
        ]
      },
      {
        week: 3, theme: "First real booking",
        sessions: [
          { day: "Mon", title: "Advanced quote features", duration: "45 min", type: "training" },
          { day: "Wed", title: "Price drop monitor setup", duration: "20 min", type: "training" },
          { day: "Fri", title: "Complete your first real booking", duration: "60 min", type: "action" },
        ]
      },
    ]
  },
  C: {
    firstWin: "Complete the fee calculator with a real trip scenario and feel confident in the number you land on.",
    keyMilestone: "By week 4 you'll have a fully-priced proposal sent to a real client and your first supplier relationship established.",
    weeks: [
      {
        week: 1, theme: "Pricing fundamentals",
        sessions: [
          { day: "Mon", title: "Travel pricing fundamentals", duration: "45 min", type: "training" },
          { day: "Wed", title: "Supplier commission structures", duration: "30 min", type: "training" },
          { day: "Fri", title: "Fee calculator workshop", duration: "30 min", type: "action" },
        ]
      },
      {
        week: 2, theme: "Supplier relationships",
        sessions: [
          { day: "Mon", title: "Preferred supplier introductions", duration: "45 min", type: "training" },
          { day: "Wed", title: "Pricing confidence session", duration: "30 min", type: "checkin" },
          { day: "Fri", title: "Rate negotiation scripts", duration: "30 min", type: "training" },
        ]
      },
      {
        week: 3, theme: "Build your first proposal",
        sessions: [
          { day: "Mon", title: "Build a fully-priced itinerary proposal", duration: "60 min", type: "action" },
          { day: "Thu", title: "Send proposal to a real lead", duration: "30 min", type: "action" },
        ]
      },
      {
        week: 4, theme: "Close the booking",
        sessions: [
          { day: "Mon", title: "Objection handling scripts", duration: "30 min", type: "training" },
          { day: "Fri", title: "Complete first booking", duration: "60 min", type: "action" },
        ]
      },
    ]
  }
}

export async function POST(req: NextRequest) {
  const { track } = await req.json()
  await new Promise(r => setTimeout(r, 1200))
  const plan = MOCK_PLANS[track] || MOCK_PLANS['A']
  return NextResponse.json(plan)
}

