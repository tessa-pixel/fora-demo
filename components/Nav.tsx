'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/',          label: 'Home'             },
  { href: '/quiz',      label: 'Quiz'             },
  { href: '/plan',      label: 'Plan + Schedule'  },
  { href: '/agent',     label: 'Agent'            },
  { href: '/outreach',  label: 'Outreach'         },
  { href: '/journey',   label: 'Bonus: My Journey' },
]

export default function Nav() {
  const path = usePathname()
  return (
    <nav className="border-b border-fora-sand bg-fora-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold tracking-[0.15em] uppercase text-fora-ink">
          Fora
        </Link>
        <div className="flex items-center gap-1 flex-wrap">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap ${
                path === l.href
                  ? 'bg-fora-indigo text-white'
                  : l.href === '/journey'
                  ? 'text-fora-olive border border-fora-sand hover:bg-fora-olive-light'
                  : 'text-fora-charcoal hover:bg-fora-linen'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
