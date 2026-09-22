import { defineConfig } from 'vite';

export default defineConfig({
  // Rutas relativas: el sitio funciona igual en GitHub Pages (/repo/),
  // en Netlify (/) o abriendo el dist/ directamente.
  base: './',
  build: {
    target: 'es2022',
    assetsInlineLimit: 4096,
  },
  server: { host: true, port: 5173 },
});
