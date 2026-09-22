import type { Sunflower, Depth, RenderBudget, Memory } from '../core/types';
import { seeded, between, intBetween } from '../core/random';
import { createSunflower } from './sunflower';

/**
 * Composicion del campo.
 *
 * Sembrar al azar puro sale mal: quedan tres flores encimadas y un hueco
 * vacio al lado. Lo que hacemos es muestreo estratificado, que es la version
 * matematica de como siembra un jardinero: dividir el terreno en surcos
 * iguales, poner una flor por surco, y recien ahi darle a cada una un
 * empujoncito al azar para que la fila no parezca militar.
 */

interface Layer {
  depth: Depth;
  share: number;
  height: [number, number];
  scale: [number, number];
}

/** Reparto de flores por plano y sus rangos de tamano, en pantalla ancha. */
const LAYERS_WIDE: readonly Layer[] = [
  { depth: 'fondo', share: 0.42, height: [22, 34], scale: [0.3, 0.44] },
  { depth: 'medio', share: 0.35, height: [36, 52], scale: [0.52, 0.72] },
  { depth: 'frente', share: 0.23, height: [54, 78], scale: [0.86, 1.22] },
];

/**
 * En el celular el campo se disena aparte, no se encoge el de escritorio:
 * flores mas bajas para dejar cielo y titulo a la vista, y cabezas menos
 * grandes para que no se tapen entre si en una pantalla angosta.
 */
const LAYERS_COMPACT: readonly Layer[] = [
  { depth: 'fondo', share: 0.4, height: [19, 28], scale: [0.36, 0.5] },
  { depth: 'medio', share: 0.35, height: [30, 43], scale: [0.6, 0.8] },
  { depth: 'frente', share: 0.25, height: [44, 60], scale: [0.95, 1.22] },
];

/** Umbral por debajo del cual usamos la composicion compacta. */
export const COMPACT_WIDTH = 640;

/** Semilla fija: la composicion del campo esta cuidada, no sorteada. */
const FIELD_SEED = 210921;

export function plantField(budget: RenderBudget, memories: readonly Memory[]): Sunflower[] {
  const rnd = seeded(FIELD_SEED);
  const flowers: Sunflower[] = [];
  const layers = window.innerWidth < COMPACT_WIDTH ? LAYERS_COMPACT : LAYERS_WIDE;

  for (const layer of layers) {
    const count = Math.max(3, Math.round(budget.flowers * layer.share));
    const lane = 100 / count;

    for (let i = 0; i < count; i++) {
      // Un surco por flor, con hasta media franja de desvio a cada lado.
      const x = lane * i + lane * between(rnd, 0.12, 0.88);

      flowers.push({
        id: `${layer.depth}-${i}`,
        depth: layer.depth,
        x: Number(x.toFixed(2)),
        height: Number(between(rnd, layer.height[0], layer.height[1]).toFixed(2)),
        scale: Number(between(rnd, layer.scale[0], layer.scale[1]).toFixed(3)),
        petals: intBetween(rnd, 16, 22),
        lean: Number(between(rnd, -5, 5).toFixed(2)),
        // Las del fondo brotan primero: el amanecer avanza hacia la camara.
        delay: Number(between(rnd, 0, 1.1).toFixed(2)) + (layer.depth === 'fondo' ? 0 : layer.depth === 'medio' ? 0.5 : 1),
        swayDuration: Number(between(rnd, 4.5, 8.5).toFixed(2)),
        hueShift: Number(between(rnd, -16, 14).toFixed(1)),
      });
    }
  }

  return assignMemories(flowers, memories);
}

/**
 * Reparte los recuerdos entre las flores mas visibles y bien separadas.
 *
 * Solo el plano del frente y el medio pueden guardar un recuerdo (en el
 * fondo la flor es demasiado chica para tocarla con el dedo), y exigimos
 * distancia entre una y otra para que no queden dos corazones pegados.
 */
/**
 * Cuántos girasoles con corazón puede haber como máximo. Si cada flor
 * tuviera uno, dejaría de ser especial encontrarlos; los demás recuerdos
 * se recorren con las flechas desde cualquiera de estos.
 */
const MAX_HEARTS = 8;

function assignMemories(flowers: Sunflower[], allMemories: readonly Memory[]): Sunflower[] {
  const memories = allMemories.slice(0, MAX_HEARTS);
  if (memories.length === 0) return flowers;

  const MIN_GAP = 9; // en % del ancho de pantalla
  const candidates = flowers
    .filter((f) => f.depth !== 'fondo')
    .sort((a, b) => a.x - b.x);

  const chosen = new Map<string, string>();
  let taken: number[] = [];
  let m = 0;

  // Primera pasada exigiendo separacion; si sobran recuerdos, se relaja.
  for (const gap of [MIN_GAP, MIN_GAP / 2, 0]) {
    for (const f of candidates) {
      if (m >= memories.length) break;
      if (chosen.has(f.id)) continue;
      if (taken.some((x) => Math.abs(x - f.x) < gap)) continue;
      const memory = memories[m];
      if (!memory) break;
      chosen.set(f.id, memory.id);
      taken.push(f.x);
      m++;
    }
    if (m >= memories.length) break;
  }

  return flowers.map((f) => {
    const memoryId = chosen.get(f.id);
    return memoryId ? { ...f, memoryId } : f;
  });
}

/** Dibuja el campo completo dentro del contenedor de cada plano. */
export function renderField(
  layers: Record<Depth, HTMLElement>,
  flowers: readonly Sunflower[],
  budget: RenderBudget,
  memories: readonly Memory[],
): void {
  const byId = new Map(memories.map((m) => [m.id, m]));
  const fragments: Record<Depth, DocumentFragment> = {
    fondo: document.createDocumentFragment(),
    medio: document.createDocumentFragment(),
    frente: document.createDocumentFragment(),
  };

  for (const flower of flowers) {
    const el = createSunflower(flower, budget.seedsPerHead);
    if (flower.memoryId) {
      const memory = byId.get(flower.memoryId);
      const button = el.querySelector<HTMLButtonElement>('.bloom__pick');
      if (button && memory) {
        button.setAttribute('aria-label', `Abrir recuerdo: ${memory.titulo}`);
        button.title = memory.titulo;
      }
    }
    fragments[flower.depth].appendChild(el);
  }

  for (const depth of ['fondo', 'medio', 'frente'] as const) {
    layers[depth].appendChild(fragments[depth]);
  }
}

/**
 * Una flor extra, sembrada donde la persona toco la pantalla.
 *
 * Nace ya crecida en su sitio (delay cero) y con el tallo corto, como un
 * brote que se apura por alcanzar a los demas.
 */
export function improvisedFlower(xPercent: number, yPercent: number, index: number): Sunflower {
  const rnd = seeded(Date.now() + index);
  // Mas abajo en la pantalla = mas cerca de la camara = mas grande.
  const closeness = Math.min(1, Math.max(0, (yPercent - 35) / 55));
  return {
    id: `brote-${index}-${Date.now()}`,
    depth: closeness > 0.55 ? 'frente' : 'medio',
    x: Number(xPercent.toFixed(2)),
    height: Number((100 - yPercent).toFixed(2)),
    scale: Number((window.innerWidth < COMPACT_WIDTH ? 0.4 + closeness * 0.55 : 0.4 + closeness * 0.7).toFixed(3)),
    petals: intBetween(rnd, 16, 22),
    lean: Number(between(rnd, -6, 6).toFixed(2)),
    delay: 0,
    swayDuration: Number(between(rnd, 4.5, 8).toFixed(2)),
    hueShift: Number(between(rnd, -14, 14).toFixed(1)),
  };
}
