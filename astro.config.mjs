import { defineConfig } from 'astro/config';

// Dominio propio: https://coffecocoa.com (servido por GitHub Pages)
export default defineConfig({
  site: process.env.SITE || 'https://coffecocoa.com',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
});
