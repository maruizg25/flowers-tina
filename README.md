# 🌻 Girasoles para Karlita

Un campo de girasoles que florece cada vez que se abre el enlace.
Hecho con TypeScript, CSS y luz. Sin frameworks, sin dependencias en producción:
la página completa pesa menos de 20 KB (más la canción y las fotos).

**Móvil primero.** Está pensado para abrirse desde un celular; en pantalla
grande se agranda, no al revés.

---

## Lo único que tienes que hacer tú

### 1. Poner las fotos

1. Copia cada foto a la carpeta **`public/fotos/`**.
2. Abre **`src/memories/photos.ts`** y, por cada foto, escribe un bloque como
   los que ya están (nombre de archivo, título y dedicatoria).

Mientras una foto no exista, en su lugar aparece un marco bonito con el nombre
del archivo que espera. Nada se rompe.

> Consejo: si una foto pesa más de 2 MB, bájale el tamaño antes (en el iPhone:
> compartir → *Opciones* → tamaño *Mediano*). Cargará mucho más rápido en 4G.

### 2. Poner la canción

Copia el archivo de **One and Only — Adele** a **`public/audio/cancion.mp3`**
(reemplazando el que hay). Tiene que ser `.mp3`. El nombre que se muestra en
pantalla se cambia en `src/content/copy.ts` → `jardin.cancion`.

### 3. Cambiar los textos

Todo lo que se lee vive en **`src/content/copy.ts`**: la carta, las frases del
amanecer, los botones. Son solo palabras entre comillas; edítalas con libertad.

---

## Verlo en tu computador

```bash
npm install
npm run dev
```

Abre la dirección que imprime (normalmente `http://localhost:5173`). Para verlo
en el celular estando en la misma wifi, usa la dirección `Network:` que aparece
al lado.

## Publicarlo (GitHub Pages)

1. Sube el repo a GitHub.
2. En el repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada `git push` a `main` publica solo. El enlace queda en
   `https://<tu-usuario>.github.io/<nombre-del-repo>/`.

También funciona en Netlify o Vercel sin configurar nada: comando `npm run build`,
carpeta `dist`.

---

## Cómo está armado

La metáfora guía el código: un jardín tiene un **cielo** que amanece, una
**tierra** donde crecen **girasoles**, y algunos girasoles guardan un
**recuerdo** en el corazón.

```
src/
├── main.ts              El guion: qué pasa y cuándo. No dibuja nada.
├── content/copy.ts      Todos los textos.               ← edita esto
├── memories/photos.ts   Lista de fotos con dedicatoria. ← y esto
│
├── core/
│   ├── types.ts         Vocabulario del dominio (Sunflower, Memory, Scene…)
│   ├── stage.ts         Máquina de escenas: semilla → amanecer → jardín → carta → final
│   ├── audio.ts         Música con fundido; respeta el bloqueo de autoplay
│   ├── device.ts        Cuántas flores aguanta este aparato sin trabarse
│   └── random.ts        Azar con semilla fija: el campo siempre está bien compuesto
│
├── garden/
│   ├── sunflower.ts     Generador procedural: pétalos en anillo, semillas con el ángulo áureo
│   ├── field.ts         Composición del campo en tres planos de profundidad
│   └── parallax.ts      Mouse o inclinación del celular mueven los planos
│
├── effects/particles.ts Polen, luciérnagas y la lluvia de pétalos (canvas)
├── memories/gallery.ts  Las polaroids con las fotos
├── letter/letter.ts     La carta que se escribe sola
└── styles/              Un archivo por capa: cielo, flor, ui, recuerdos
```

### Detalles que vale la pena conocer

- **Las flores se generan, no se dibujan.** Cada girasol es un SVG armado en
  `sunflower.ts` con la misma receta que usa la naturaleza: pétalos repartidos
  en círculo y semillas colocadas girando 137,5° cada una (el ángulo áureo).
  Ninguna flor es igual a otra.
- **El crecimiento es puro CSS.** El tallo se estira y la cabeza sube con dos
  animaciones que comparten duración y curva; por eso la cabeza queda pegada
  a la punta sin calcular nada cuadro a cuadro.
- **Se adapta al aparato.** Un celular modesto recibe menos flores y sin
  partículas; nadie ve la animación a tirones.
- **Respeta `prefers-reduced-motion`.** Quien tiene esa opción activa ve el
  jardín con luz y desvanecidos en vez de vaivenes.
- **Secretos.** Tocar cualquier parte del campo siembra un girasol nuevo.
  Tocar el sol tres veces trae el atardecer.

---

Hecho el 21 de septiembre, día de las flores amarillas.
