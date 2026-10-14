import { defineConfig } from 'astro/config';

// Dominio propio: https://coffeecocoa.ae (servido por GitHub Pages)
export default defineConfig({
  site: process.env.SITE || 'https://coffeecocoa.ae',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
});
