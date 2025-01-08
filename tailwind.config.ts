import type { Config } from "tailwindcss";

export default {
	mode: 'jit',
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist: [
		'text-[16px]',
		'text-[17px]',
		'text-[18px]',
		'text-[19px]',
		'text-[20px]',
		'text-[21px]',
		'text-[22px]',
		'text-[23px]',
		'text-[24px]',
		'text-[25px]',
		'text-[26px]',
		'text-[27px]',
		'text-[28px]',
		'text-[29px]',
		'text-[30px]',
		'text-[31px]',
		'text-[32px]',
		'text-[33px]',
		'text-[34px]',
		'text-[35px]',
		'font-montserrat',
		'font-lora',
		'font-raleway',
		'font-playfair',
		'font-ubuntu',
		'font-nunito',
		'font-poppins',
		'font-firaSans',
		'font-caveat',
		'font-delius',
		'font-fontdiner',
		'font-indie',
		'font-kaushan',
		'font-meow',
		'font-molle',
		'font-monsieur',
		'font-mountains',
		'font-mrsSaint',
		'font-pacifico',
		'font-shadows',
		'font-sourGummy',
		'font-tinos',
	],
	theme: {
		extend: {
			fontFamily: {
				montserrat: ['Montserrat', 'sans-serif'],
				lora: ['Lora', 'serif'],
				raleway: ['Raleway', 'sans-serif'],
				playfair: ['Playfair Display', 'serif'],
				ubuntu: ['Ubuntu', 'sans-serif'],
				nunito: ['Nunito', 'sans-serif'],
				poppins: ['Poppins', 'sans-serif'],
				firaSans: ['Fira Sans', 'sans-serif'],
				caveat: ['Caveat', 'cursive'],
				delius: ['Delius', 'cursive'],
				fontdiner: ['Fontdiner Swanky', 'cursive'],
				indie: ['Indie Flower', 'cursive'],
				kaushan: ['Kaushan Script', 'cursive'],
				meow: ['Meow Script', 'cursive'],
				molle: ['Molle', 'cursive'],
				monsieur: ['Monsieur La Doulaise', 'cursive'],
				mountains: ['Mountains of Christmas', 'cursive'],
				mrsSaint: ['Mrs Saint Delafield', 'cursive'],
				pacifico: ['Pacifico', 'cursive'],
				shadows: ['Shadows Into Light', 'cursive'],
				sourGummy: ['Sour Gummy', 'sans-serif'],
				tinos: ['Tinos', 'serif'],
			},
			colors: {
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
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
