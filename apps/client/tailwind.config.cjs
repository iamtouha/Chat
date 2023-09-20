/* eslint-env node */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('@innomarkt/configs/ui/tailwind.preset.cjs')],
  plugins: [require('tailwindcss-animate')],
};
