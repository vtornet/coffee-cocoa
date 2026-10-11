import { defineConfig } from 'astro/config';

// En GitHub Pages la web vive en https://vtornet.github.io/coffee-cocoa/
// Con dominio propio, deja SITE y BASE_PATH vacíos (o cámbialos aquí).
export default defineConfig({
  site: process.env.SITE || 'https://coffeecocoa.ae', // TODO: dominio definitivo
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
});
