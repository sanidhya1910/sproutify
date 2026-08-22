import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

// Token definitions live in app/globals.css as HSL triplets; this file only
// wires them into Tailwind's scale so `bg-primary/10` style opacity modifiers
// work. Content globs must keep matching .js/.jsx — legacy pages survive
// until their rebuild phase and their classes must not be purged.
const config: Config = {
    darkMode: ['class'],
    content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
  	container: {
  		center: true,
  		padding: {
  			DEFAULT: '1.25rem',
  			md: '2rem'
  		},
  		screens: {
  			'2xl': '1200px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			sans: [
  				'var(--font-inter)',
                    ...defaultTheme.fontFamily.sans
                ]
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			surface: {
  				DEFAULT: 'hsl(var(--surface))',
  				sunken: 'hsl(var(--surface-sunken))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			subtle: {
  				foreground: 'hsl(var(--subtle-foreground))'
  			},
  			primary: {
  				'50': 'hsl(var(--primary-50))',
  				'100': 'hsl(var(--primary-100))',
  				'200': 'hsl(var(--primary-200))',
  				'300': 'hsl(var(--primary-300))',
  				'400': 'hsl(var(--primary-400))',
  				'500': 'hsl(var(--primary-500))',
  				'600': 'hsl(var(--primary-600))',
  				'700': 'hsl(var(--primary-700))',
  				'800': 'hsl(var(--primary-800))',
  				'900': 'hsl(var(--primary-900))',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))',
  				subtle: 'hsl(var(--accent-subtle))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))',
  				subtle: 'hsl(var(--destructive-subtle))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))',
  				subtle: 'hsl(var(--warning-subtle))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))',
  				subtle: 'hsl(var(--success-subtle))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--surface))',
  				foreground: 'hsl(var(--foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--surface))',
  				foreground: 'hsl(var(--foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--surface-sunken))',
  				foreground: 'hsl(var(--foreground))'
  			}
  		},
  		borderRadius: {
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',
  			xl: 'calc(var(--radius) + 4px)',
  			'2xl': 'calc(var(--radius) + 10px)'
  		},
  		fontSize: {
  			'display-2xl': [
  				'3.75rem',
  				{
  					lineHeight: '1.05',
  					letterSpacing: '-0.03em',
  					fontWeight: '600'
  				}
  			],
  			'display-xl': [
  				'3rem',
  				{
  					lineHeight: '1.08',
  					letterSpacing: '-0.028em',
  					fontWeight: '600'
  				}
  			],
  			'display-lg': [
  				'2.25rem',
  				{
  					lineHeight: '1.15',
  					letterSpacing: '-0.022em',
  					fontWeight: '600'
  				}
  			],
  			h1: [
  				'1.875rem',
  				{
  					lineHeight: '1.2',
  					letterSpacing: '-0.02em',
  					fontWeight: '600'
  				}
  			],
  			h2: [
  				'1.5rem',
  				{
  					lineHeight: '1.3',
  					letterSpacing: '-0.016em',
  					fontWeight: '600'
  				}
  			],
  			h3: [
  				'1.25rem',
  				{
  					lineHeight: '1.4',
  					letterSpacing: '-0.01em',
  					fontWeight: '600'
  				}
  			],
  			h4: [
  				'1.125rem',
  				{
  					lineHeight: '1.45',
  					letterSpacing: '-0.008em',
  					fontWeight: '600'
  				}
  			],
  			'body-lg': [
  				'1.0625rem',
  				{
  					lineHeight: '1.65'
  				}
  			],
  			body: [
  				'0.9375rem',
  				{
  					lineHeight: '1.6'
  				}
  			],
  			'body-sm': [
  				'0.8125rem',
  				{
  					lineHeight: '1.55'
  				}
  			],
  			label: [
  				'0.8125rem',
  				{
  					lineHeight: '1.25',
  					letterSpacing: '0.005em',
  					fontWeight: '500'
  				}
  			],
  			caption: [
  				'0.75rem',
  				{
  					lineHeight: '1.35',
  					letterSpacing: '0.02em',
  					fontWeight: '500'
  				}
  			],
  			overline: [
  				'0.6875rem',
  				{
  					lineHeight: '1.2',
  					letterSpacing: '0.09em',
  					fontWeight: '600'
  				}
  			]
  		},
  		boxShadow: {
  			xs: '0 1px 2px 0 hsl(144 20% 10% / 0.04)',
  			sm: '0 1px 3px 0 hsl(144 20% 10% / 0.06), 0 1px 2px -1px hsl(144 20% 10% / 0.04)',
  			md: '0 4px 12px -2px hsl(144 20% 10% / 0.08), 0 2px 4px -2px hsl(144 20% 10% / 0.04)',
  			lg: '0 12px 32px -8px hsl(144 20% 10% / 0.12)',
  			overlay: '0 24px 48px -12px hsl(144 25% 8% / 0.18)',
  			focus: '0 0 0 3px hsl(var(--ring) / 0.18)'
  		},
  		spacing: {
  			section: '5rem',
  			'section-lg': '7rem'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'fade-up': {
  				from: {
  					opacity: '0',
  					transform: 'translateY(8px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'none'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-up': 'fade-up .45s cubic-bezier(.16,1,.3,1) both'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
