/**
 * ─────────────────────────────────────────────────────────────────────
 *  TODOS LOS TEXTOS VIVEN AQUI.  Cambia lo que quieras, no toques nada mas.
 *  Nada de esto es codigo delicado: son solo palabras entre comillas.
 * ─────────────────────────────────────────────────────────────────────
 */

export const copy = {
  /** Como se llama ella. Aparece en varios lugares. */
  ella: 'Karlita',

  /** Pestana del navegador y vista previa al compartir el enlace. */
  meta: {
    titulo: 'Girasoles para Karlita 🌻',
    descripcion:
      'Hoy es 21 de septiembre y no encontré flores amarillas suficientes, ' +
      'así que le sembré un campo entero.',
  },

  /** Primera pantalla: oscuridad, una semilla de luz, y una invitacion. */
  semilla: {
    fecha: '21 de septiembre',
    titulo: 'Karlita, mi amor',
    linea:
      'Dicen que hoy se regalan flores amarillas.\n' +
      'No me alcanzó con un ramo,\n' +
      'así que le sembré un campo entero.',
    boton: 'Abra los ojos 🌻',
    pista: 'sube el volumen, esto tiene música',
  },

  /** Frases que van apareciendo mientras el campo florece. */
  amanecer: [
    'Primero hubo que esperar a que saliera el sol...',
    'Los girasoles no buscan la luz.\nLa reconocen.',
    'Yo hice lo mismo el día que la vi.',
  ],

  /** Lo que se lee cuando el jardin ya esta completo. */
  jardin: {
    titulo: 'Un campo entero, y todos la miran a usted',
    subtitulo: 'toque donde quiera y va a crecer uno más',
    pistaRecuerdos: 'los girasoles con el corazón dorado guardan un recuerdo nuestro',
    botonCarta: 'Léame algo bonito',
    botonMusica: 'música',
    botonSilenciar: 'silenciar',
    /** Se muestra sobre los botones. El archivo va en public/audio/cancion.mp3 */
    cancion: '♪ One and Only — Adele',
  },

  /**
   * La carta. Cada string es un parrafo y se escribe solo, como en una
   * maquina de escribir. Agrega o quita parrafos con total libertad.
   */
  carta: {
    encabezado: 'Para Karlita, que florece sin pedir permiso',
    parrafos: [
      'Karlita, mi amor:',
      'Hay una razón por la que el girasol es mi flor favorita, y no es el color.',
      'Es que hace algo que yo entiendo perfectamente: pasa el día entero girando la cabeza para no perderse ni un minuto de luz. No lo hace por costumbre. Lo hace porque sin esa luz no sabe crecer.',
      'Yo giro así con usted. Cuando se ríe, cuando se enoja por cosas chiquitas, cuando me cuenta algo con esa urgencia suya de contarlo todo al mismo tiempo. Giro y me acomodo para que me dé de lleno.',
      'Y hay algo más que casi nadie sabe de los girasoles: cuando ya están grandes y cargados de semillas, dejan de girar y se quedan mirando al oriente. Fijos. Esperando el amanecer siempre desde el mismo lugar.',
      'Eso es lo que quiero con usted. Ya no ando buscando por dónde sale la luz. Ya sé para dónde mirar.',
      'Feliz día de las flores amarillas, mi amor. Este campo no se marchita: vive en internet y en el código que lo dibuja, y va a seguir floreciendo cada vez que abra este enlace.',
      'Suyo, girando,',
    ],
    firma: 'Mau 🌻',
    boton: 'cerrar la carta',
  },

  /** Lo ultimo, despues de la carta: lluvia de petalos. */
  final: {
    titulo: 'La amo',
    linea: 'y me quedo mirando al oriente.',
    boton: 'volver al jardín',
  },

  /** Marco de foto cuando todavia no hay imagen. */
  placeholder: {
    titulo: 'Aquí va una foto nuestra',
    ayuda: 'suelta la imagen en /public/fotos y nómbrala como dice el README',
  },
} as const;
