/** @type {import('tailwindcss').Config} */
export default {

  darkMode: ["class", "class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
			keyframes:{
				shimmer: {
					'0%': {backgroundPosition: '-100% 0',
					'100%': {backgroundPosition: '100% 0' }
					}
				},
			},
			animation:{
				shimmer: 'shimmer 1.5s linear infinite'
			},
  		colors: {
  			background: 'hsl(var(--background))',
  			text: {
  				light: '#F2F0EF',
  				dark: '#303B53'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			accent: {
  				light: '#A98376',
  				dark: '#8249F0',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
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
  			},
				signup: 'hsl(var(--signup))',
				sidebarC: 'hsl(var(--sidebarC))',
				sidebarT: 'hsl(var(--sidebarT))',
				back: 'hsl(var(--back))',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  	}
  },
  plugins: [
		require('tailwind-scrollbar'), 
		require("tailwindcss-animate"),
		function({addUtilities}){
			addUtilities({
				'.hide-scrollbar': {
					'&::-webkit-scrollbar':{
						display: 'none',
					},

					'scrollbar-width': 'none',
					'-ms-overflow-style': 'none',
				},
			})
		},
	],
}

