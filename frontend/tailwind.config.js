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
        // Deep Warm Bronze & Royal Espresso (Replaces the purple/burgundy)
        wedding: {
          950: '#0F0B08', // Deepest Royal Night Bronze
          900: '#17110C', // Dark Rich Espresso
          850: '#201811', // Warm Dark Bronze Card
          800: '#2A1F17', // Elevated Surface
          750: '#35271E', // Border & Hover
          700: '#433227', // Subtle Contrast
          600: '#5C4536',
        },
        // Radiant Imperial & Antique Gold Palette
        gold: {
          100: '#FCF6E8',
          200: '#F5E4BE', // Light Champagne Silk
          300: '#E8D09B', // Bright Warm Gold
          400: '#D7BA78', // Classic Golden Radiance
          500: '#C59B51', // True Antique Gold
          600: '#A88039', // Deep Burnished Gold
          700: '#8A6628', // Dark Heritage Gold
          800: '#684C1C',
        },
        // Royal Silk Cream & Warm Ivory
        cream: {
          50: '#FFFEFA',
          100: '#FAF6EE', // Silk Cream
          200: '#F3ECE0',
          300: '#E7DEC9',
          400: '#CFC2A7',
        },
        // Auspicious Royal Vermillion Wedding Accent
        vermillion: {
          400: '#E25C43',
          500: '#C84B31',
          600: '#A83A22',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        crest: ['Cinzel', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 30px -5px rgba(215, 186, 120, 0.35)',
        'gold-subtle': '0 4px 20px -2px rgba(197, 155, 81, 0.22)',
        'gold-card': '0 12px 36px -8px rgba(15, 11, 8, 0.8)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5E4BE 0%, #D7BA78 45%, #A88039 100%)',
        'gold-gradient-subtle': 'linear-gradient(135deg, rgba(245, 228, 190, 0.15) 0%, rgba(215, 186, 120, 0.05) 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(32, 24, 17, 0.85) 0%, rgba(23, 17, 12, 0.95) 100%)',
        'hero-gold': 'radial-gradient(ellipse at top, rgba(215, 186, 120, 0.18) 0%, rgba(15, 11, 8, 0.98) 75%)',
      },
    },
  },
  plugins: [],
}
