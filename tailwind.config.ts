import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		fontFamily: {
			satoshi: ['Satoshi', 'sans-serif'],
			inter: ['Inter', 'sans-serif'],
			// Steep — editorial display serif + utility sans
			signifier: ['Fraunces', 'Source Serif Pro', 'Georgia', 'serif'],
			sohne: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
		  },
  		colors: {
			'main':'#dbeafe',
			'primary-orange': '#FF5722',
			// Steep palette
			'ink': '#17191c',
			'pure-white': '#ffffff',
			'fog': '#f7f7f8',
			'ash': '#4c4c4c',
			'graphite': '#777b86',
			'dove': '#a3a6af',
			'rust': '#5d2a1a',
			'apricot-wash': '#fbe1d1',
			'sky-wash': '#d3e3fc',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			// Steep signature three-layer card shadow
  			'steep': 'rgba(4, 23, 43, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px',
  			'steep-soft': 'rgba(4, 23, 43, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 10px 20px -10px, rgba(0, 0, 0, 0.04) 0px 4px 8px -6px',
  		},
  		keyframes: {
  			'fade-up': {
  				'0%': { opacity: '0', transform: 'translateY(6px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' },
  			},
  			'blink': {
  				'0%, 100%': { opacity: '1' },
  				'50%': { opacity: '0.25' },
  			},
  		},
  		animation: {
  			'fade-up': 'fade-up 0.3s ease-out both',
  			'blink': 'blink 1.2s ease-in-out infinite',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
