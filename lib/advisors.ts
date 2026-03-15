import { Advisor } from './types'

export const MOCK_ADVISORS: Advisor[] = [
  {
    id: 1, name: 'Maya Rodriguez', initials: 'MR', track: 'A',
    trackLabel: 'Track A — client acquisition',
    daysSinceJoin: 22, daysSinceLogin: 9, scheduleAdherence: 30, quotesSent: 0, bookings: 0,
  },
  {
    id: 2, name: 'James Okafor', initials: 'JO', track: 'B',
    trackLabel: 'Track B — platform confidence',
    daysSinceJoin: 18, daysSinceLogin: 3, scheduleAdherence: 80, quotesSent: 1, bookings: 0,
  },
  {
    id: 3, name: 'Sophie Chen', initials: 'SC', track: 'C',
    trackLabel: 'Track C — pricing confidence',
    daysSinceJoin: 35, daysSinceLogin: 4, scheduleAdherence: 90, quotesSent: 3, bookings: 0,
  },
  {
    id: 4, name: 'David Park', initials: 'DP', track: 'A',
    trackLabel: 'Track A — client acquisition',
    daysSinceJoin: 41, daysSinceLogin: 10, scheduleAdherence: 15, quotesSent: 0, bookings: 0,
  },
  {
    id: 5, name: 'Priya Nair', initials: 'PN', track: 'B',
    trackLabel: 'Track B — platform confidence',
    daysSinceJoin: 12, daysSinceLogin: 1, scheduleAdherence: 75, quotesSent: 2, bookings: 1,
  },
  {
    id: 6, name: 'Tom Alvarez', initials: 'TA', track: 'C',
    trackLabel: 'Track C — pricing confidence',
    daysSinceJoin: 28, daysSinceLogin: 5, scheduleAdherence: 100, quotesSent: 5, bookings: 0,
  },
  {
    id: 7, name: 'Elena Vasquez', initials: 'EV', track: 'D',
    trackLabel: 'Track D — supplier relationships',
    daysSinceJoin: 32, daysSinceLogin: 8, scheduleAdherence: 55, quotesSent: 2, bookings: 0,
  },
]

export function getRiskLevel(a: Advisor): 'high' | 'medium' | 'low' {
  // Booking made — always low risk
  if (a.bookings > 0) return 'low'

  // Primary signal 1: schedule adherence
  // Primary signal 2: login gap (haven't shown up in a week)
  const offSchedule  = a.scheduleAdherence < 50
  const goneQuiet    = a.daysSinceLogin >= 7

  // Both signals firing = high risk
  if (offSchedule && goneQuiet) return 'high'

  // Either signal firing = medium risk
  if (offSchedule || goneQuiet) return 'medium'

  return 'low'
}
