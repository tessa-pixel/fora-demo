import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fora: {
          indigo:        '#34387F',
          'indigo-dark': '#272B63',
          crimson:       '#8C0A14',
          'crimson-dark':'#6B0710',
          olive:         '#78742B',
          'olive-light': '#F4F2E6',
          cream:         '#FAF8F3',
          linen:         '#F0EDE6',
          sand:          '#E4DFD4',
          'sand-med':    '#D4CEC3',
          ink:           '#1A1A1A',
          charcoal:      '#4A4A44',
          stone:         '#9A9690',
          white:         '#FFFFFF',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Public Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease forwards',
        'slide-up':  'slideUp 0.5s ease forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: '0' },                    to: { opacity: '1' } },
        slideUp:  { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
      }
    },
  },
  plugins: [],
}
export default config
