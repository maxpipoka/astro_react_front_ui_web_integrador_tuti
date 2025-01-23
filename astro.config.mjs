import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel"; // Importa el adaptador de Vercel

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'server', // Necesario para adaptadores basados en servidores como Vercel
  adapter: vercel(), // Cambia el adaptador a Vercel
});
