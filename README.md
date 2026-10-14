# Coffee Cocoa — web (EN / AR)

Web estática para la cafetería Coffee Cocoa (Dubái), en inglés y árabe (RTL).
Astro + GSAP + Lenis. Fuentes autoalojadas (Cormorant Garamond, Manrope, Noto Kufi Arabic, IBM Plex Sans Arabic).

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera /dist
```

## Publicar (Vercel o Netlify)

Importa el repo. Framework: **Astro**. Build: `npm run build`. Carpeta de salida: `dist`.

## Dónde se cambia cada cosa

| Qué | Archivo |
| --- | --- |
| WhatsApp, teléfono, Instagram, Google Maps, dominio (coffecocoa.com) | `src/config.js` (y `site` en `astro.config.mjs`) |
| Textos en inglés / árabe, carta, horarios | `src/i18n/en.json` · `src/i18n/ar.json` |
| Precios | añade `"price": "28"` a cualquier producto en los JSON |
| Imágenes | `public/images/` |
| Colores y estilos | `src/styles/global.css` (variables en `:root`) |
| Animaciones | `src/scripts/main.js` |

## Pendiente antes de publicar

- [ ] Número real de WhatsApp, teléfono, Instagram y enlace de Google Maps (`src/config.js`)
- [ ] Dirección y horario reales (`visit` en los JSON)
- [x] Dominio: coffecocoa.com
- [ ] Revisión del texto árabe por un hablante nativo
- [ ] Sustituir los renders por fotos reales cuando abra el local
- [ ] Confirmar nombre de marca en logo/título ("COCOA" vs "Coffee Cocoa")

## Notas

- La animación de entrada se muestra una vez por sesión y se puede saltar. Con "reducir movimiento" activado en el sistema no hay animaciones.
- `/` redirige a `/ar/` si el navegador está en árabe, y a `/en/` en otro caso.
