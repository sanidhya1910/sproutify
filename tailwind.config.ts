import type { Config } from 'tailwindcss';

// Dark mode / shadcn design-token wiring was removed here — the app renders
// through MUI's theme (see lib/theme.js + app/providers.tsx), and dark mode
// was never actually provided (next-themes had no provider mounted). Tailwind
// itself is kept since several admin/volunteer pages use plain utility classes.
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'teal-gold-gradient': 'linear-gradient(to right, rgb(1, 211, 178, 0.4), rgb(255, 192, 0, 0.4))',
        'gold-teal-gradient': 'linear-gradient(to left, rgb(1, 211, 178, 0.4), rgb(255, 192, 0, 0.4))',
      },
    },
  },
  plugins: [],
};
export default config;
