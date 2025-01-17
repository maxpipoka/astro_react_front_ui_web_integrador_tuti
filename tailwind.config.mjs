/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        custom: {
          background: 'rgb(243, 234, 230)',
          primary: 'rgb(206, 232, 221)',
          secondary: 'rgb(1, 0, 1)',
          accent: 'rgb(232, 161, 59)',
          text: 'rgb(1, 0, 1)'
        }
      }
    },
  },
  plugins: [],
}