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
        'elevated': 'rgb(26, 26, 26)',
      },
      backgroundColor: {
        'elevated': 'rgb(26, 26, 26)',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
