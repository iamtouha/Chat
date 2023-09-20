import tailwindAnimate from 'tailwindcss-animate';
import preset from '@innomarkt/configs/ui/tailwind.preset.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [preset],
  plugins: [tailwindAnimate],
};
