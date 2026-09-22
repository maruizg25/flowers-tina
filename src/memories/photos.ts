/**
 * ─────────────────────────────────────────────────────────────────────
 *  NUESTRAS FOTOS
 * ─────────────────────────────────────────────────────────────────────
 *
 *  Como agregar una foto, en dos pasos:
 *
 *  1. Copia la imagen a la carpeta  public/fotos/
 *     Ej: public/fotos/primera-cita.jpg
 *
 *  2. Escribe su bloque aqui abajo, copiando cualquiera de los que ya estan.
 *     El campo "src" es la ruta SIN el "public/":  'fotos/primera-cita.jpg'
 *
 *  Eso es todo. Cada foto de esta lista se convierte en un girasol con el
 *  corazon dorado dentro del campo. Si la imagen todavia no existe, en su
 *  lugar aparece un marco bonito en vez de un icono roto, asi que puedes
 *  dejar los bloques escritos desde ya.
 *
 *  Formatos: .jpg, .jpeg, .png, .webp  (webp pesa menos, carga mas rapido)
 *  Consejo: si la foto pesa mas de 2 MB, bajale el tamano antes de subirla.
 */

import type { Memory } from '../core/types';

export const memories: readonly Memory[] = [
  {
    id: 'primera-vez',
    src: 'fotos/01-primera-vez.jpg',
    titulo: 'La primera vez',
    dedicatoria:
      'Aqui todavia no sabiamos nada. Mirate: ya me estabas cambiando la vida y ni cuenta.',
    alt: 'Nosotros dos la primera vez que salimos juntos',
    fecha: 'donde empezo todo',
  },
  {
    id: 'tu-risa',
    src: 'fotos/02-tu-risa.jpg',
    titulo: 'Esa risa',
    dedicatoria:
      'Le tome esta foto sin avisarte, y por eso salio perfecta. Asi te ves cuando nadie te esta mirando.',
    alt: 'Ella riendose sin darse cuenta de la camara',
  },
  {
    id: 'viaje',
    src: 'fotos/03-nuestro-viaje.jpg',
    titulo: 'Nuestro viaje',
    dedicatoria:
      'Mucho camino, poco plan, y contigo de copiloto. Volveria a manejar todas esas horas.',
    alt: 'Los dos de viaje juntos',
    fecha: 'kilometros que valieron la pena',
  },
  {
    id: 'domingo',
    src: 'fotos/04-un-domingo.jpg',
    titulo: 'Un domingo cualquiera',
    dedicatoria:
      'Nada especial pasaba ese dia. Por eso lo guardo: contigo los dias comunes tampoco son comunes.',
    alt: 'Un momento tranquilo de los dos en casa',
  },
  {
    id: 'abrazo',
    src: 'fotos/05-el-abrazo.jpg',
    titulo: 'El abrazo',
    dedicatoria: 'Mi lugar favorito del mundo no es un lugar. Es este.',
    alt: 'Los dos abrazados',
  },
  {
    id: 'hoy',
    src: 'fotos/06-hoy.jpg',
    titulo: 'Y mirate hoy',
    dedicatoria:
      'Sigues siendo la mejor noticia que me ha dado la vida. Cada 21 de septiembre y cada dia del medio.',
    alt: 'Nosotros dos hoy',
    fecha: 'lo que viene es todavia mejor',
  },
];
