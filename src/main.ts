import './styles/base.css';
import './styles/cielo.css';
import './styles/flor.css';
import './styles/ui.css';
import './styles/recuerdos.css';

import type { Depth } from './core/types';
import { computeBudget } from './core/device';
import { Stage, playWhispers, whispersDuration } from './core/stage';
import { Soundtrack } from './core/audio';
import { plantField, renderField, improvisedFlower } from './garden/field';
import { createSunflower } from './garden/sunflower';
import { attachParallax } from './garden/parallax';
import { ParticleLayer } from './effects/particles';
import { Gallery } from './memories/gallery';
import { memories } from './memories/photos';
import { Letter } from './letter/letter';
import { copy } from './content/copy';

/**
 * ═══════════════════════════════════════════════════════════════════
 *  Girasoles para Karlita
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Este archivo es el guion de la obra, y nada mas. No dibuja flores ni
 *  calcula petalos: reparte los textos, arma el campo con las piezas que
 *  vienen de los otros modulos y decide cuando pasa cada cosa.
 *
 *  El recorrido completo:
 *
 *    semilla  ──toca el boton──▶  amanecer  ──13 s o un toque──▶  jardin
 *                                                                   │
 *                            final  ◀──cierra la carta──  carta  ◀──┘
 *                              └──────────volver──────────▶ jardin
 */

/** Busca un elemento obligatorio. Si falta, es un error de plantilla. */
function need<T extends Element>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Falta el elemento "${selector}" en index.html`);
  return el;
}

/** Cuanto se ve y cuanto descansa cada frase del amanecer. */
const WHISPER_TIMING = { visible: 3200, gap: 900 } as const;

/** Tope de flores sembradas a dedo, para que el DOM no crezca sin fin. */
const MAX_BROTES = 28;

function boot(): void {
  const body = document.body;
  const budget = computeBudget();
  if (budget.reducedMotion) body.classList.add('sin-movimiento');

  const stage = new Stage(body);
  const soundtrack = new Soundtrack(need<HTMLAudioElement>('.cancion'));

  const layers: Record<Depth, HTMLElement> = {
    fondo: need('[data-capa="fondo"]'),
    medio: need('[data-capa="medio"]'),
    frente: need('[data-capa="frente"]'),
  };

  // ── Los textos ──────────────────────────────────────────────────
  // Todo lo que se lee sale de copy.ts, asi que cambiar una palabra
  // nunca obliga a tocar el HTML ni el CSS.
  document.title = copy.meta.titulo;
  need('.semilla__fecha').textContent = copy.semilla.fecha;
  need('.semilla__titulo').textContent = copy.semilla.titulo;
  need('.semilla__linea').textContent = copy.semilla.linea;
  need('.semilla__boton').textContent = copy.semilla.boton;
  need('.semilla__pista').textContent = copy.semilla.pista;
  need('.titular__texto').textContent = copy.jardin.titulo;
  need('.titular__pista').textContent = memories.length > 0
    ? copy.jardin.pistaRecuerdos
    : copy.jardin.subtitulo;
  need('.carta__encabezado').textContent = copy.carta.encabezado;
  need('.carta__firma').textContent = copy.carta.firma;
  need('.carta__boton').textContent = copy.carta.boton;
  need('.final__titulo').textContent = copy.final.titulo;
  need('.final__linea').textContent = copy.final.linea;
  need('[data-accion="volver"]').textContent = copy.final.boton;
  need('[data-accion="carta"]').textContent = copy.jardin.botonCarta;
  need('[data-accion="musica"] .boton__texto').textContent = copy.jardin.botonMusica;
  need('.hud__cancion').textContent = copy.jardin.cancion;

  // ── El campo ────────────────────────────────────────────────────
  // Se siembra desde el arranque, con las animaciones en pausa (lo hace
  // el CSS mientras la escena sea "semilla"). Asi cuando llega el
  // amanecer no hay que construir nada: solo darle play.
  const field = plantField(budget, memories);
  renderField(layers, field, budget, memories);

  const particles = new ParticleLayer(need<HTMLCanvasElement>('.particulas'), budget);
  const gallery = new Gallery(need('.visor'), memories, () => soundtrack.unduck());
  const letter = new Letter(need('.carta'), need('.carta__cuerpo'), budget.reducedMotion);

  let detachParallax: (() => void) | null = null;
  let stopWhispers: (() => void) | null = null;
  let jardinTimer = 0;
  let cartaLeida = false;
  let brotes = 0;
  let solTaps = 0;

  // ── Pasar de la semilla al amanecer ─────────────────────────────
  const despertar = (): void => {
    if (stage.scene !== 'semilla') return;

    // La musica tiene que arrancar aqui mismo, dentro del gesto: si lo
    // dejamos para un setTimeout el navegador lo toma como autoplay y lo
    // bloquea. No esperamos la promesa para no frenar la animacion.
    void soundtrack.play().then((ok) => {
      need<HTMLButtonElement>('[data-accion="musica"]').setAttribute('aria-pressed', String(ok));
    });

    stage.goTo('amanecer');

    if (!budget.reducedMotion) detachParallax = attachParallax(layers);
    // Las luciernagas entran cuando el cielo ya tiene algo de luz; sobre
    // negro puro se verian como ruido.
    window.setTimeout(() => particles.start(), 2200);

    const susurro = need<HTMLElement>('.susurro');
    stopWhispers = playWhispers(susurro, copy.amanecer, WHISPER_TIMING);
    jardinTimer = window.setTimeout(alJardin, whispersDuration(copy.amanecer.length, WHISPER_TIMING));
  };

  /** Termina el amanecer. Se puede llamar antes de tiempo para saltearlo. */
  const alJardin = (): void => {
    if (stage.scene !== 'amanecer') return;
    clearTimeout(jardinTimer);
    stopWhispers?.();
    stopWhispers = null;
    stage.goTo('jardin');
  };

  // ── La carta y el final ─────────────────────────────────────────
  const abrirCarta = (): void => {
    stage.goTo('carta');
    soundtrack.duck();
    letter.open();
  };

  const cerrarCarta = (): void => {
    letter.close();
    soundtrack.unduck();

    if (cartaLeida) {
      stage.goTo('jardin');
      return;
    }

    // La primera vez que se cierra la carta viene el final, que es el
    // premio de todo el recorrido. Despues ya no, para no atrapar a nadie.
    cartaLeida = true;
    stage.goTo('final');
    particles.rain(budget.tier === 'baja' ? 60 : 160);
  };

  // ── Un solo escucha para todos los botones ──────────────────────
  // Delegacion de eventos: en vez de un listener por boton, uno solo en
  // el documento que lee data-accion. Las flores que nacen despues
  // quedan cubiertas sin tener que volver a suscribir nada.
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const accion = target.closest<HTMLElement>('[data-accion]')?.dataset['accion'];
    const recuerdo = target.closest<HTMLElement>('[data-memory]');

    if (recuerdo) {
      const id = recuerdo.dataset['memory'];
      if (id) {
        soundtrack.duck();
        gallery.show(id, recuerdo);
      }
      return;
    }

    switch (accion) {
      case 'empezar':
        despertar();
        return;
      case 'carta':
        abrirCarta();
        return;
      case 'cerrar-carta':
        cerrarCarta();
        return;
      case 'saltar-carta':
        // Un toque sobre la hoja muestra la carta entera: quien ya la
        // leyo, o no quiere esperar al tecleo, no tiene por que hacerlo.
        letter.revealAll();
        return;
      case 'volver':
        stage.goTo('jardin');
        return;
      case 'musica':
        void soundtrack.toggle().then((playing) => {
          target.closest<HTMLElement>('[data-accion="musica"]')?.setAttribute('aria-pressed', String(playing));
        });
        return;
      case 'atardecer':
        // Huevo de pascua: tres toques al sol y el campo se va al
        // atardecer. Quien lo encuentra, lo encuentra.
        solTaps++;
        if (solTaps >= 3) {
          body.classList.toggle('luz--atardecer');
          solTaps = 0;
        }
        return;
      default:
        break;
    }

    // Toque en el campo: nace un girasol ahi mismo.
    if (stage.scene === 'jardin' && target.closest('.campo')) {
      sembrar(event.clientX, event.clientY);
    }
  });

  /** Siembra una flor donde toco el dedo o el cursor. */
  const sembrar = (clientX: number, clientY: number): void => {
    const x = (clientX / window.innerWidth) * 100;
    const y = (clientY / window.innerHeight) * 100;
    // Arriba del horizonte no crece nada: seria una flor flotando.
    if (y < 34) return;

    const flower = improvisedFlower(x, y, brotes++);
    const el = createSunflower(flower, budget.seedsPerHead);
    el.classList.add('bloom--brote');
    layers[flower.depth].appendChild(el);

    // Cuando se pasa del tope, se va la mas vieja. El jardin no crece
    // para siempre: la pagina tiene que seguir yendo fluida.
    const sembradas = document.querySelectorAll('.bloom--brote');
    if (sembradas.length > MAX_BROTES) sembradas[0]?.remove();
  };

  // ── Teclado ─────────────────────────────────────────────────────
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && stage.scene === 'carta') {
      cerrarCarta();
      return;
    }
    if (event.key !== 'Enter' && event.key !== ' ') return;

    // Enter o espacio sobre un boton ya lo activa el navegador; aqui solo
    // atendemos el caso de empezar sin haber enfocado nada.
    if (stage.scene === 'semilla' && !(event.target as HTMLElement).closest('button')) {
      event.preventDefault();
      despertar();
    }
  });

  // Saltar el amanecer: quien no quiere esperar los susurros, no espera.
  const saltar = (event: Event): void => {
    if (stage.scene !== 'amanecer') return;
    if ((event.target as HTMLElement).closest('button')) return;
    alJardin();
  };
  document.addEventListener('pointerdown', saltar);
  document.addEventListener('keydown', saltar);

  // ── Limpieza ────────────────────────────────────────────────────
  window.addEventListener('pagehide', () => {
    detachParallax?.();
    particles.destroy();
  });
}

// Si el DOM ya esta listo arrancamos de una; si no, esperamos. El script es
// type="module", asi que en la practica siempre corre despues del parseo.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
