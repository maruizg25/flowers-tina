import type { Memory } from '../core/types';
import { copy } from '../content/copy';

/**
 * Galeria de recuerdos.
 *
 * Cada foto se presenta como una polaroid que se abre girando: entra
 * inclinada y se endereza, igual que cuando uno saca una foto de una caja de
 * zapatos y la acomoda para verla bien.
 *
 * Detalle importante: si la imagen todavia no existe en /public/fotos, en su
 * lugar aparece un marco dibujado con CSS con el nombre del recuerdo. Asi el
 * jardin se puede compartir antes de tener las fotos listas y nunca se ve el
 * icono roto del navegador.
 */
export class Gallery {
  private index = 0;
  private open = false;
  private lastFocus: HTMLElement | null = null;

  constructor(
    private readonly root: HTMLElement,
    private readonly memories: readonly Memory[],
    private readonly onClose?: () => void,
  ) {
    this.root.addEventListener('click', this.onRootClick);
    document.addEventListener('keydown', this.onKey);
  }

  show(memoryId: string, trigger?: HTMLElement): void {
    const found = this.memories.findIndex((m) => m.id === memoryId);
    if (found < 0) return;
    this.index = found;
    this.lastFocus = trigger ?? null;
    this.open = true;
    this.render();
    this.root.classList.add('is-open');
    this.root.removeAttribute('inert');
    this.root.querySelector<HTMLElement>('.recuerdo__cerrar')?.focus();
  }

  close(): void {
    if (!this.open) return;
    this.open = false;
    this.root.classList.remove('is-open');
    this.root.setAttribute('inert', '');
    this.lastFocus?.focus();
    this.onClose?.();
  }

  private move(delta: number): void {
    const total = this.memories.length;
    this.index = (this.index + delta + total) % total;
    this.render();
  }

  private render(): void {
    const memory = this.memories[this.index];
    if (!memory) return;

    const multiple = this.memories.length > 1;
    this.root.innerHTML = `
      <div class="recuerdo" role="dialog" aria-modal="true" aria-label="${escape(memory.titulo)}">
        <button class="recuerdo__cerrar" type="button" data-action="cerrar" aria-label="Cerrar recuerdo">&times;</button>
        <figure class="polaroid">
          <div class="polaroid__marco">
            <img class="polaroid__foto" src="${escape(memory.src)}" alt="${escape(memory.alt)}" loading="eager" decoding="async"/>
            <div class="polaroid__vacio" aria-hidden="true">
              <span class="polaroid__girasol"></span>
              <strong>${escape(copy.placeholder.titulo)}</strong>
              <small>${escape(memory.src)}</small>
            </div>
          </div>
          <figcaption class="polaroid__pie">
            <h3>${escape(memory.titulo)}</h3>
            <p>${escape(memory.dedicatoria)}</p>
            ${memory.fecha ? `<span class="polaroid__fecha">${escape(memory.fecha)}</span>` : ''}
          </figcaption>
        </figure>
        ${
          multiple
            ? `<nav class="recuerdo__nav">
                 <button type="button" data-action="prev" aria-label="Recuerdo anterior">&#8249;</button>
                 <span class="recuerdo__cuenta">${this.index + 1} / ${this.memories.length}</span>
                 <button type="button" data-action="next" aria-label="Siguiente recuerdo">&#8250;</button>
               </nav>`
            : ''
        }
      </div>`;

    const img = this.root.querySelector<HTMLImageElement>('.polaroid__foto');
    const frame = this.root.querySelector<HTMLElement>('.polaroid__marco');
    if (img && frame) {
      // El marco toma la orientacion de la foto: una vertical no se
      // recorta a la fuerza en un marco horizontal (se comia las caras).
      // Se acota el ratio para que ni una panoramica ni una tira muy alta
      // desarmen la polaroid en pantalla chica.
      const fitFrame = (): void => {
        if (img.naturalWidth === 0) return;
        const ratio = Math.min(1.5, Math.max(0.8, img.naturalWidth / img.naturalHeight));
        frame.style.aspectRatio = String(ratio);
      };
      // Si la foto no carga, el marco cambia de cara en vez de romperse.
      const markMissing = (): void => frame.classList.add('sin-foto');
      img.addEventListener('load', fitFrame, { once: true });
      img.addEventListener('error', markMissing, { once: true });
      // Si venia de cache ya esta resuelta y los eventos no se disparan.
      if (img.complete) {
        if (img.naturalWidth === 0) markMissing();
        else fitFrame();
      }
    }
  }

  private readonly onRootClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const action = target.closest<HTMLElement>('[data-action]')?.dataset['action'];

    if (action === 'cerrar' || target === this.root) {
      this.close();
    } else if (action === 'prev') {
      this.move(-1);
    } else if (action === 'next') {
      this.move(1);
    }
  };

  private readonly onKey = (event: KeyboardEvent): void => {
    if (!this.open) return;
    if (event.key === 'Escape') this.close();
    else if (event.key === 'ArrowLeft') this.move(-1);
    else if (event.key === 'ArrowRight') this.move(1);
  };
}

/** Evita que un texto con < o & rompa el HTML que armamos a mano. */
function escape(value: string): string {
  return value.replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return map[c] ?? c;
  });
}
