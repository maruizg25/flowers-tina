/**
 * ─────────────────────────────────────────────────────────────────────
 *  NUESTRAS FOTOS
 * ─────────────────────────────────────────────────────────────────────
 *
 *  Cada bloque es una foto de public/fotos/ con su dedicatoria. El orden
 *  de esta lista es el orden en que se recorren con las flechas.
 *
 *  Para cambiar un texto, edita las palabras entre comillas. Para quitar
 *  una foto, borra su bloque. Para agregar una, copia cualquier bloque y
 *  cambia el "src" (ruta sin el "public/").
 *
 *  Las primeras de la lista son las que aparecen como girasoles con
 *  corazón dorado en el campo; el resto se llega con las flechas.
 */

import type { Memory } from "../core/types";

export const memories: readonly Memory[] = [
  {
    id: "quito-de-dia",
    src: "fotos/img_3523.jpg",
    titulo: "Nuestra ciudad",
    dedicatoria:
      "Nuestra caminata, usted haciendo la señal de la paz y yo con esa cara de que no me cabía la felicidad en los lentes. Así se ve caminar con usted.",
    alt: "Los dos sonriendo en una calle del centro histórico de Quito",
    fecha: "centro histórico, Quito",
  },
  {
    id: "quito-de-noche",
    src: "fotos/img_3557.jpg",
    titulo: "La misma calle, otra luz",
    dedicatoria:
      "Se hizo de noche y seguíamos ahí. Con usted las calles no se acaban: se recorren dos veces.",
    alt: "Los dos en la misma calle de Quito al anochecer",
    fecha: "centro histórico, Quito",
  },
  {
    id: "beso-en-la-calle",
    src: "fotos/img_3562.jpg",
    titulo: "A mitad de la calle",
    dedicatoria:
      "No importaba quién pasara. Cuando está cerca, se me olvida que hay más gente en el mundo.",
    alt: "Los dos dándose un beso en una calle del centro de Quito",
  },
  {
    id: "luces-de-fiesta",
    src: "fotos/img_3043.jpg",
    titulo: "Bajo las luces",
    dedicatoria:
      "Todo el mundo miraba las luces del teleférico haha y yo solo tenía ojos para usted. Así empiezan las noches que uno no olvida.",
    alt: "Beso de noche frente al panecillo",
  },
  {
    id: "playa",
    src: "fotos/img_3428.jpg",
    titulo: "Sal y sol",
    dedicatoria:
      "El mar de fondo, sus lentes de estrella de cine, y yo robándole un beso en la mejilla. La playa era lo de menos.",
    alt: "Él besando su mejilla en la playa, ambos con lentes de sol",
    fecha: "Tonsupa",
  },
  {
    id: "hamaca",
    src: "fotos/img_3478.jpg",
    titulo: "Tarde sin apuro",
    dedicatoria:
      "Techo de caña, pulseras de hotel y nada que hacer más que estar. Mi tipo favorito de plan: ninguno, con usted.",
    alt: "Los mejores batidos de coco",
  },
  {
    id: "tu-cara",
    src: "fotos/img_3500.jpg",
    titulo: "Esa cara",
    dedicatoria:
      'El amor de mi vida, con cara de modeloo <3',
    alt: "Ella con gorra y lentes de sol grandes, haciendo un gesto a la cámara",
  },
  {
    id: "espejo",
    src: "fotos/img_3454.jpg",
    titulo: "Chiquitos en el espejo",
    dedicatoria:
      "Fotitos en el mismo espejo con nuestros diferentes outfits, te amooo",
    alt: "Los dos reflejados pequeños en un espejo de pared",
  },
  {
    id: "espejo-dos",
    src: "fotos/img_3464.jpg",
    titulo: "Y otra vez",
    dedicatoria:
      "Porque la primera no nos convenció. Con usted siempre hay una segunda toma.",
    alt: "Segunda foto de los dos reflejados en el mismo espejo",
  },
  {
    id: "lenguas",
    src: "fotos/img_3469.jpg",
    titulo: "Con la lengua afuera",
    dedicatoria:
      "Esto es lo que somos cuando nadie nos ve: dos que no pueden estar serios ni para una foto en el espejo.",
    alt: "Selfie en el espejo con los dos sacando la lengua",
  },
  {
    id: "muecas",
    src: "fotos/img_3709.jpg",
    titulo: "Usted riéndose de mí",
    dedicatoria:
      "Yo haciendo el ridículo y usted riéndose conmigo. Esa risa suya es mi cosa favorita de este mundo.",
    alt: "Él sacando la lengua con gorra y ella riéndose a su lado",
  },
  {
    id: "paz-y-amor",
    src: "fotos/img_4549.jpg",
    titulo: "Paz, amor y lengua afuera",
    dedicatoria:
      "Usted tranquila atrás, con su gorrita, aguantándome. Gracias por aguantarme siempre.",
    alt: "Selfie de los dos al aire libre, él haciendo la señal de la paz",
  },
  {
    id: "beso-en-el-restaurante",
    src: "fotos/img_3656.jpg",
    titulo: "Un beso entre plato y plato",
    dedicatoria: "Lo mejor de salir a comer con usted nunca ha sido la comida.",
    alt: "Ella besando su mejilla en un restaurante con techo de madera",
  },
  {
    id: "termas",
    src: "fotos/img_3661.jpg",
    titulo: "Agua caliente, noche fría",
    dedicatoria:
      "Metidos en el agua, de noche, usted con esa risa y yo pegadito. Si pudiera vivir en un momento, elegiría uno parecido a este.",
    alt: "Los dos dentro de una piscina de aguas termales de noche",
    fecha:"Papallacta"
  },
  {
    id: "cena",
    src: "fotos/img_4447.jpg",
    titulo: "La cena de aquella noche",
    dedicatoria:
      "Una tabla enorme, una Coca-Cola, y el jacuzzi esperando atrás. Ocupados siendo felices.",
    alt: "Una tabla de comida y una bebida frente a un jacuzzi",
    fecha:"Liv haha"
  },
  {
    id: "buenas-vibras",
    src: "fotos/img_4529.jpg",
    titulo: "Cien por ciento buenas vibras",
    dedicatoria:
      "Lo decía el espejo y tenía razón. Usted es mi cien por ciento.",
    alt: "Los dos reflejados en un espejo decorado con la frase 100% good vibes",
  },
  {
    id: "ventana",
    src: "fotos/img_4554.jpg",
    titulo: "Usted, la ciudad y una vela",
    dedicatoria:
      "Le tomé esta sin que se diera cuenta. La ciudad entera atrás y usted, sin hacer nada, siendo lo más lindo del cuadro.",
    alt: "Ella sentada junto a una ventana con vista a la ciudad y un cóctel",
  },
  {
    id: "carrera",
    src: "fotos/img_4499.jpg",
    titulo: "Mi campeona",
    dedicatoria:
      "Entrando a la pista de noche, de rosado, saludando como si fuera la meta olímpica. Fan #1 de ustedcita.",
    alt: "Ella corriendo en la pista de un estadio de noche, saludando a la cámara",
    fecha: "En el atahualpa",
  },
  {
    id: "mirador-beso",
    src: "fotos/img_4713.jpg",
    titulo: "Un beso con vista",
    dedicatoria:
      "Todo el valle abajo, las montañas al fondo, yo dándole un besito. Adivine qué parte del paisaje me gustó más.",
    alt: "Ella besando su mejilla en un mirador con montañas de fondo",
    fecha: "Mirador de Guápulo",
  },
  {
    id: "mirador-risa",
    src: "fotos/img_4716.jpg",
    titulo: "La misma vista, la misma risa",
    dedicatoria:
      "Ya me había dado el beso y seguía sonriendo así. Con usted la sonrisa no se va: se queda.",
    alt: "Los dos sonriendo en el mismo mirador con el valle detrás",
  },
  {
    id: "hoy",
    src: "fotos/img_4827.jpg",
    titulo: "Y mírese hoy",
    dedicatoria:
      "Amo la manera en la que siempre me mira, me siento vivo con usted.",
    alt: "Los dos juntos en un mirador al atardecer con la ciudad al fondo",
    fecha: "lo que viene es todavía mejor",
  },
];
