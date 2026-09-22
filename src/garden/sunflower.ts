import type { Sunflower, Depth } from '../core/types';

/**
 * Generador de girasoles.
 *
 * Cada flor se dibuja con un SVG que se arma aqui, en texto. La idea es la
 * misma que usa la naturaleza: no hay un dibujo de girasol guardado en
 * ninguna parte, hay una receta. Petalos repartidos en circulo, semillas
 * colocadas con el angulo dorado, y unas cuantas variaciones al azar para
 * que ninguna flor sea gemela de otra.
 */

/**
 * 137.508 grados: el angulo aureo. Es el mismo que usan los girasoles de
 * verdad para acomodar sus semillas sin dejar huecos. Colocar cada semilla
 * girando esta cantidad respecto a la anterior produce las dos espirales
 * cruzadas que uno ve en el centro de la flor.
 */
const GOLDEN_ANGLE = 137.508;

/** Cuantas semillas dibuja cada plano. El fondo no las necesita. */
const SEED_RATIO: Record<Depth, number> = { fondo: 0, medio: 0.35, frente: 1 };

/** Radio donde arranca el petalo (el borde del disco de semillas). */
const DISC_RADIUS = 31;

/**
 * Centro de la flor dentro del viewBox.
 *
 * El viewBox arranca en (0,0) y la flor vive en (100,100) a proposito.
 * Con un viewBox centrado en cero (-100 -100 200 200) seria mas comodo
 * escribir las coordenadas, pero Chromium calcula mal el transform-origin
 * de los petalos cuando el viewBox tiene origen negativo: los hace girar
 * alrededor de una esquina y la flor explota. Sumar 100 a todo cuesta una
 * linea y funciona igual en todos los navegadores.
 */
const C = 100;

/** Desplaza al centro todas las coordenadas de un path con comandos absolutos. */
function centered(path: string): string {
  return path.replace(/-?\d+(?:\.\d+)?/g, (n) => String(Math.round((Number(n) + C) * 100) / 100));
}

/**
 * Silueta de un petalo, en coordenadas del viewBox (centro en 0,0 y
 * apuntando hacia arriba). Nace ANCHO y por dentro del disco, que se dibuja
 * encima y lo tapa: asi el petalo se ve pegado a la flor y no flotando al
 * lado. Se ensancha a media altura y termina en punta.
 */
function petalPath(reach: number, width: number): string {
  const base = DISC_RADIUS - 8;
  const baseHalf = width * 0.5;
  const span = reach - base;
  const belly = -(base + span * 0.46);
  return [
    `M${-baseHalf} ${-base}`,
    `C${-width * 0.98} ${-base - span * 0.18} ${-width} ${belly} ${-width * 0.36} ${-reach * 0.94}`,
    `C${-width * 0.13} ${-reach} ${width * 0.13} ${-reach} ${width * 0.36} ${-reach * 0.94}`,
    `C${width} ${belly} ${width * 0.98} ${-base - span * 0.18} ${baseHalf} ${-base}`,
    'Z',
  ].join(' ');
}

/** Un anillo completo de petalos, ya con su retardo escalonado. */
function petalRing(
  count: number,
  reach: number,
  width: number,
  offsetDeg: number,
  cssClass: string,
  delayStep: number,
): string {
  const path = centered(petalPath(reach, width));
  let out = '';
  for (let i = 0; i < count; i++) {
    const angle = (360 / count) * i + offsetDeg;
    // El retardo sigue el orden angular: los petalos se abren dando la
    // vuelta al reloj, no todos de golpe.
    const delay = (i * delayStep).toFixed(3);
    out += `<path class="petalo ${cssClass}" d="${path}" style="--a:${angle.toFixed(2)}deg;--pd:${delay}s"/>`;
  }
  return out;
}

/** Semillas del centro, colocadas con el angulo dorado. */
function seedDots(count: number): string {
  if (count <= 0) return '';
  let out = '';
  // Constante de separacion: r = c * sqrt(i) reparte las semillas con
  // densidad uniforme en lugar de apelotonarlas en el centro.
  const c = DISC_RADIUS / Math.sqrt(count);
  for (let i = 1; i <= count; i++) {
    const r = c * Math.sqrt(i);
    if (r > DISC_RADIUS - 1.6) break;
    const theta = (i * GOLDEN_ANGLE * Math.PI) / 180;
    const x = (C + r * Math.cos(theta)).toFixed(2);
    const y = (C + r * Math.sin(theta)).toFixed(2);
    // Las de afuera se ven mas grandes, como en una flor real.
    const size = (0.9 + (r / DISC_RADIUS) * 0.85).toFixed(2);
    const tone = i % 3 === 0 ? 'semilla-punto semilla-punto--clara' : 'semilla-punto';
    out += `<circle class="${tone}" cx="${x}" cy="${y}" r="${size}"/>`;
  }
  return out;
}

/** El corazon dorado que marca a las flores que guardan un recuerdo. */
function heartMark(): string {
  const heart = centered(
    'M0 11.5 C-9.5 4.5 -14 -0.5 -14 -5.6 C-14 -10.4 -10.3 -13.6 -6.2 -13.6 C-3.2 -13.6 -0.9 -11.9 0 -9.8 ' +
      'C0.9 -11.9 3.2 -13.6 6.2 -13.6 C10.3 -13.6 14 -10.4 14 -5.6 C14 -0.5 9.5 4.5 0 11.5 Z',
  );
  return `
    <g class="corazon" aria-hidden="true">
      <circle class="corazon__aura" cx="${C}" cy="${C}" r="20"/>
      <path class="corazon__forma" d="${heart}"/>
    </g>`;
}

/** Hoja del tallo: nace pegada al tronco y se abre hacia un costado. */
function leaf(side: 'izq' | 'der', atPercent: number, delaySeconds: number): string {
  return `<span class="hoja hoja--${side}" style="--at:${atPercent}%;--hd:${delaySeconds.toFixed(2)}s"></span>`;
}

/**
 * Convierte la descripcion de una flor en su elemento del DOM.
 *
 * El crecimiento se reparte en dos animaciones distintas que comparten
 * duracion y curva de tiempo: el tallo se estira (scaleY) y la cabeza sube
 * (translateY). Al usar exactamente el mismo ritmo, la cabeza queda pegada
 * a la punta del tallo durante todo el recorrido sin necesidad de calcular
 * nada cuadro por cuadro.
 */
export function createSunflower(flower: Sunflower, seedBudget: number): HTMLElement {
  const outerPetals = flower.petals;
  const innerPetals = Math.max(8, Math.round(outerPetals * 0.72));
  const seeds = Math.round(seedBudget * SEED_RATIO[flower.depth]);

  // Las hojas asoman cuando el tallo ya paso por su altura.
  const growth = 1.9;
  const leafA = flower.delay + growth * 0.42;
  const leafB = flower.delay + growth * 0.62;

  const el = document.createElement('div');
  el.className = `bloom bloom--${flower.depth}`;
  el.dataset.id = flower.id;
  el.style.cssText =
    `--x:${flower.x}%;--h:${flower.height}vh;--s:${flower.scale};` +
    `--delay:${flower.delay.toFixed(2)}s;--sway:${flower.swayDuration.toFixed(2)}s;` +
    `--lean:${flower.lean.toFixed(2)}deg;--hue:${flower.hueShift.toFixed(1)}`;

  const pick = flower.memoryId
    ? `<button class="bloom__pick" type="button" data-memory="${flower.memoryId}"></button>`
    : '';

  el.innerHTML = `
    <div class="bloom__stalk">
      <span class="bloom__stem"></span>
      ${leaf('izq', 34, leafA)}
      ${leaf('der', 56, leafB)}
      <div class="bloom__head">
        <div class="bloom__head-sway">
          <span class="bloom__glow"></span>
          <svg class="bloom__svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
            <g class="bloom__petals bloom__petals--inner">
              ${petalRing(innerPetals, 80, 12.5, 360 / innerPetals / 2, 'petalo--interno', 0.02)}
            </g>
            <g class="bloom__petals bloom__petals--outer">
              ${petalRing(outerPetals, 97, 11, 0, 'petalo--externo', 0.024)}
            </g>
            <circle class="bloom__disc" cx="${C}" cy="${C}" r="${DISC_RADIUS}"/>
            <g class="bloom__seeds">${seeds > 0 ? seedDots(seeds) : ''}</g>
            ${flower.memoryId ? heartMark() : ''}
          </svg>
          ${pick}
        </div>
      </div>
    </div>`;

  return el;
}
