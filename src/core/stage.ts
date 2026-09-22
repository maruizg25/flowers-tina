import type { Scene } from './types';

/**
 * Maquina de escenas.
 *
 * Toda la coreografia visual vive en CSS y se dispara con una clase en el
 * <body>. Este objeto es el unico que tiene permiso de cambiarla, de modo
 * que nunca quedan dos escenas peleando ni clases sueltas de una anterior.
 *
 * Es el director de escena: no mueve los telones, solo dice cual toca.
 */
export class Stage {
  private current: Scene = 'semilla';
  private readonly listeners = new Set<(scene: Scene, previous: Scene) => void>();

  constructor(private readonly body: HTMLElement) {
    this.body.classList.add(`escena--${this.current}`);
  }

  get scene(): Scene {
    return this.current;
  }

  goTo(scene: Scene): void {
    if (scene === this.current) return;
    const previous = this.current;
    this.body.classList.remove(`escena--${previous}`);
    this.body.classList.add(`escena--${scene}`);
    this.current = scene;
    for (const listener of this.listeners) listener(scene, previous);
  }

  onChange(listener: (scene: Scene, previous: Scene) => void): void {
    this.listeners.add(listener);
  }
}

/**
 * Secuencia de frases con tiempos.
 *
 * Muestra un texto, lo deja respirar, lo apaga, y pasa al siguiente. Se
 * puede cancelar a mitad de camino: si alguien se apura y abre la carta,
 * los susurros no siguen apareciendo encima.
 */
export function playWhispers(
  node: HTMLElement,
  lines: readonly string[],
  options: { visible: number; gap: number },
): () => void {
  let cancelled = false;
  const timers: number[] = [];

  const at = (delay: number, fn: () => void): void => {
    timers.push(window.setTimeout(fn, delay));
  };

  let clock = 0;
  for (const line of lines) {
    at(clock, () => {
      if (cancelled) return;
      node.textContent = line;
      node.classList.add('is-visible');
    });
    clock += options.visible;

    at(clock, () => {
      if (cancelled) return;
      node.classList.remove('is-visible');
    });
    clock += options.gap;
  }

  return () => {
    cancelled = true;
    for (const timer of timers) clearTimeout(timer);
    node.classList.remove('is-visible');
  };
}

/** Duracion total que ocupa una secuencia de susurros, en milisegundos. */
export function whispersDuration(count: number, options: { visible: number; gap: number }): number {
  return count * (options.visible + options.gap);
}
