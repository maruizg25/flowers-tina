/**
 * Modelo de dominio del jardin.
 *
 * La metafora guia todo el codigo: un jardin tiene un cielo que amanece,
 * una tierra donde crecen girasoles, y algunos de esos girasoles guardan
 * un recuerdo en el corazon. Los tipos de aqui son ese vocabulario.
 */

/** Momentos por los que pasa la experiencia, en orden. */
export type Scene = 'semilla' | 'amanecer' | 'jardin' | 'carta' | 'final';

/**
 * Capa de profundidad. El jardin se dibuja en tres planos para dar
 * sensacion de campo: el fondo es pequeno y borroso, el frente es grande
 * y nitido, y cada plano se mueve distinto con el parallax.
 */
export type Depth = 'fondo' | 'medio' | 'frente';

/** Calidad de render que el dispositivo puede sostener sin trabarse. */
export type PerfTier = 'alta' | 'media' | 'baja';

/** Un girasol concreto, ya con todos sus rasgos decididos. */
export interface Sunflower {
  readonly id: string;
  readonly depth: Depth;
  /** Posicion horizontal en porcentaje del viewport (0-100). */
  readonly x: number;
  /** Cuanto sube el tallo desde la base, en vh. */
  readonly height: number;
  /** Escala final de la cabeza (los del fondo son mas chicos). */
  readonly scale: number;
  readonly petals: number;
  /** Desfase del giro del tallo, para que no todos miren igual. */
  readonly lean: number;
  /** Segundos de retardo antes de empezar a crecer. */
  readonly delay: number;
  /** Duracion del vaiven con el viento, en segundos. */
  readonly swayDuration: number;
  /** Corrimiento de tono de los petalos, en grados (-18 a 18). */
  readonly hueShift: number;
  /** Si lleva un recuerdo, este es su id; si no, no guarda ninguno. */
  readonly memoryId?: string;
}

/** Una foto nuestra con su dedicatoria. */
export interface Memory {
  readonly id: string;
  /** Ruta relativa a /public, p.ej. 'fotos/primera-cita.jpg'. */
  readonly src: string;
  readonly titulo: string;
  readonly dedicatoria: string;
  /** Texto alternativo para lectores de pantalla. */
  readonly alt: string;
  /** Fecha o lugar, opcional, se muestra en chico bajo la foto. */
  readonly fecha?: string;
}

/** Ajustes de render derivados del dispositivo y las preferencias. */
export interface RenderBudget {
  readonly tier: PerfTier;
  readonly flowers: number;
  readonly fireflies: number;
  readonly seedsPerHead: number;
  readonly reducedMotion: boolean;
}
