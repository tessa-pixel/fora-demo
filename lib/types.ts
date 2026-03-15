export type Track = 'A' | 'B' | 'C' | 'D'

export interface QuizAnswers {
  name: string
  barrier: Track
  experience: 'new' | 'some' | 'experienced'
  hoursPerWeek: number
  goalDate: string
}

export interface Advisor {
  id: number
  name: string
  initials: string
  track: Track
  trackLabel: string
  daysSinceJoin: number
  daysSinceLogin: number
  scheduleAdherence: number  // 0–100, % of scheduled sessions completed on time
  quotesSent: number
  bookings: number
}

export interface TrainingWeek {
  week: number
  theme: string
  sessions: { day: string; title: string; duration: string; type: 'training' | 'action' | 'checkin' }[]
}

export const TRACK_META: Record<Track, { label: string; barrier: string; color: string; bg: string; border: string; pct: string }> = {
  A: { label: 'Track A', barrier: 'Client acquisition',      color: '#8C0A14', bg: '#FBF0F1', border: '#E8B4B8', pct: '40%' },
  B: { label: 'Track B', barrier: 'Platform confidence',     color: '#34387F', bg: '#EEEFFE', border: '#B4B7E8', pct: '25%' },
  C: { label: 'Track C', barrier: 'Pricing confidence',      color: '#78742B', bg: '#F4F2E6', border: '#C8C49A', pct: '20%' },
  D: { label: 'Track D', barrier: 'Supplier relationships',  color: '#5C3A6B', bg: '#F5F0F8', border: '#C9B8D4', pct: '15%' },
}
