import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8000ff',
        secondary: '#E5006E',
        accent: '#088229',
        gray: {
          400: '#999',
          500: '#666',
          600: '#444',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        text: ['var(--font-text)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config