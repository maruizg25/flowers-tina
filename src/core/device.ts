import type { RenderBudget, PerfTier } from './types';

/**
 * Presupuesto de render.
 *
 * Es como servir la mesa segun quien viene: en un desktop potente ponemos
 * el jardin completo; en un celular modesto servimos menos flores para que
 * la animacion no tartamudee. Un regalo que va a 12 fps no impresiona.
 */

function detectTier(): PerfTier {
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const narrow = Math.min(window.innerWidth, window.innerHeight) < 480;

  if (cores <= 3 || memory <= 2) return 'baja';
  if (narrow || cores <= 5) return 'media';
  return 'alta';
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function computeBudget(): RenderBudget {
  const reducedMotion = prefersReducedMotion();
  const tier = detectTier();

  const table: Record<PerfTier, Omit<RenderBudget, 'tier' | 'reducedMotion'>> = {
    alta: { flowers: 46, fireflies: 54, seedsPerHead: 90 },
    media: { flowers: 32, fireflies: 32, seedsPerHead: 54 },
    baja: { flowers: 20, fireflies: 0, seedsPerHead: 0 },
  };

  const base = table[tier];
  // Una pantalla angosta no tiene sitio para cuarenta flores: se ven
  // apelotonadas y ademas cuestan bateria. El celular es la pantalla
  // principal de este regalo, asi que este recorte esta pensado primero.
  const narrowScreen = window.innerWidth < 640;
  if (narrowScreen) {
    const compact = { ...base, flowers: Math.min(base.flowers, 26), fireflies: Math.min(base.fireflies, 30) };
    return reducedMotion
      ? { tier, reducedMotion, flowers: Math.min(compact.flowers, 18), fireflies: 0, seedsPerHead: compact.seedsPerHead }
      : { tier, reducedMotion, ...compact };
  }
  return reducedMotion
    ? { tier, reducedMotion, flowers: Math.min(base.flowers, 24), fireflies: 0, seedsPerHead: base.seedsPerHead }
    : { tier, reducedMotion, ...base };
}

/** True si el dispositivo se maneja con el dedo y no con mouse. */
export function isTouch(): boolean {
  return window.matchMedia('(hover: none)').matches;
}
