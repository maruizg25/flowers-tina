/**
 * Azar reproducible.
 *
 * Un jardin que cambia en cada recarga se siente aleatorio; uno que siempre
 * es identico se siente disenado. Usamos una semilla fija para el campo
 * (asi la composicion esta cuidada y no sale nunca un hueco feo) y azar
 * libre solo para lo efimero: las luciernagas y los petalos que caen.
 */

/** Generador mulberry32: rapido, determinista, suficiente para decorar. */
export function seeded(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** Numero real dentro de un rango. */
export function between(rnd: () => number, min: number, max: number): number {
  return min + rnd() * (max - min);
}

/** Entero dentro de un rango, ambos extremos incluidos. */
export function intBetween(rnd: () => number, min: number, max: number): number {
  return Math.floor(between(rnd, min, max + 1));
}

/** Elemento al azar de una lista no vacia. */
export function pick<T>(rnd: () => number, items: readonly T[]): T {
  const item = items[Math.floor(rnd() * items.length)];
  if (item === undefined) throw new Error('pick() recibio una lista vacia');
  return item;
}
