/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        custom: {
          background: 'rgb(243, 234, 230)',
          primary: 'rgb(206, 232, 221)',
          secondary: 'rgb(1, 0, 1)',
          accent: 'rgb(232, 161, 59)',
          text: 'rgb(1, 0, 1)',
          lightblue:'rgb(55, 65, 81)'
        }
      }
    },
  },
  plugins: [],
}