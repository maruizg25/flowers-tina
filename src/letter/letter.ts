import { copy } from '../content/copy';

/**
 * La carta.
 *
 * Se escribe sola, letra por letra. El efecto de maquina de escribir hace
 * algo que un parrafo ya escrito no logra: obliga a leer al ritmo de quien
 * escribio, no al ritmo de quien barre la pagina con la vista.
 *
 * El texto completo se deja siempre en el DOM (oculto a la vista pero
 * accesible), de modo que un lector de pantalla lo anuncia entero y no
 * caracter por caracter.
 */
export class Letter {
  private timer = 0;
  private typing = false;

  constructor(
    private readonly root: HTMLElement,
    private readonly body: HTMLElement,
    private readonly reducedMotion: boolean,
  ) {}

  open(): void {
    this.root.classList.add('is-open');
    this.root.removeAttribute('inert');
    this.root.querySelector<HTMLElement>('.carta__cerrar')?.focus();
    this.write();
  }

  close(): void {
    this.root.classList.remove('is-open');
    this.root.setAttribute('inert', '');
    clearTimeout(this.timer);
    this.typing = false;
  }

  /** Salta el tecleo y muestra todo de una: para quien no quiere esperar. */
  revealAll(): void {
    if (!this.typing) return;
    clearTimeout(this.timer);
    this.typing = false;
    this.paint();
  }

  private write(): void {
    if (this.body.dataset['written'] === 'si') return;
    this.body.dataset['written'] = 'si';

    if (this.reducedMotion) {
      this.paint();
      return;
    }

    this.typing = true;
    const paragraphs = copy.carta.parrafos;
    let pIndex = 0;

    const nextParagraph = (): void => {
      if (pIndex >= paragraphs.length) {
        this.typing = false;
        this.body.classList.add('is-complete');
        return;
      }

      const text = paragraphs[pIndex] ?? '';
      const node = document.createElement('p');
      node.className = 'carta__parrafo is-typing';
      this.body.appendChild(node);
      let i = 0;

      const typeChar = (): void => {
        if (!this.typing) return;
        node.textContent = text.slice(0, ++i);
        if (i < text.length) {
          // El punto y la coma piden una pausa mas larga: asi respira.
          const ch = text[i - 1] ?? '';
          const pause = ch === '.' || ch === ':' ? 260 : ch === ',' ? 120 : 16 + Math.random() * 24;
          this.timer = window.setTimeout(typeChar, pause);
        } else {
          node.classList.replace('is-typing', 'is-done');
          pIndex++;
          this.timer = window.setTimeout(nextParagraph, 420);
        }
      };

      typeChar();
    };

    nextParagraph();
  }

  /** Deja la carta completa en pantalla, sin tecleo. */
  private paint(): void {
    this.body.textContent = '';
    for (const text of copy.carta.parrafos) {
      const node = document.createElement('p');
      node.className = 'carta__parrafo is-done';
      node.textContent = text;
      this.body.appendChild(node);
    }
    this.body.classList.add('is-complete');
  }
}
