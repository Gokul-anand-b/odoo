/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./screens/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          950: '#150913',
          900: '#23101E',
          850: '#2E1527',
          800: '#3D1C34',
          700: '#532747',
          600: '#6C335D',
          500: '#8A4276',
        },
        gold: {
          200: '#F5E4BE',
          300: '#E8D09B',
          400: '#D7BA78',
          500: '#C59B51', // Swatch Antique Gold
          600: '#A88039',
          700: '#8A6628',
          800: '#694B1B',
        },
        ivory: {
          50: '#FCF9F5',
          100: '#FAF3EA', // Swatch Warm Cream
          200: '#EFE5D6',
          300: '#DFCDB8',
          400: '#BAA58E',
          500: '#94806A',
        },
        mauve: {
          300: '#E5BAC5',
          400: '#D1A0AC', // Swatch Dusty Mauve
          500: '#B6808E',
          600: '#9B6673',
        },
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-plus-jakarta)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(197, 155, 81, 0.35)',
        'gold-subtle': '0 4px 20px -2px rgba(197, 155, 81, 0.15)',
        'plum-deep': '0 10px 40px -10px rgba(15, 6, 13, 0.8)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E8D09B 0%, #C59B51 50%, #A88039 100%)',
        'plum-gradient': 'linear-gradient(145deg, #3D1C34 0%, #23101E 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(61, 28, 52, 0.7) 0%, rgba(35, 16, 30, 0.85) 100%)',
      },
    },
  },
  plugins: [],
}
