/**
 * ─────────────────────────────────────────────────────────────────────
 *  TODOS LOS TEXTOS VIVEN AQUI.  Cambia lo que quieras, no toques nada mas.
 *  Nada de esto es codigo delicado: son solo palabras entre comillas.
 * ─────────────────────────────────────────────────────────────────────
 */

export const copy = {
  /** Como se llama ella. Aparece en varios lugares. */
  ella: 'Tina',

  /** Pestana del navegador y vista previa al compartir el enlace. */
  meta: {
    titulo: 'Girasoles para Tina 🌻',
    descripcion:
      'Hoy es 21 de septiembre y no encontre flores amarillas suficientes, ' +
      'asi que te sembre un campo entero.',
  },

  /** Primera pantalla: oscuridad, una semilla de luz, y una invitacion. */
  semilla: {
    fecha: '21 de septiembre',
    titulo: 'Ma Chérie Tina',
    linea:
      'Dicen que hoy se regalan flores amarillas.\n' +
      'No me alcanzo con un ramo,\n' +
      'asi que te sembre un campo entero.',
    boton: 'Abre los ojos 🌻',
    pista: 'sube el volumen, esto tiene musica',
  },

  /** Frases que van apareciendo mientras el campo florece. */
  amanecer: [
    'Primero hubo que esperar a que saliera el sol...',
    'Los girasoles no buscan la luz.\nLa reconocen.',
    'Yo hice lo mismo el dia que te vi.',
  ],

  /** Lo que se lee cuando el jardin ya esta completo. */
  jardin: {
    titulo: 'Un campo entero, y todos te miran a ti',
    subtitulo: 'toca donde quieras y va a crecer uno mas',
    pistaRecuerdos: 'los girasoles con el corazon dorado guardan un recuerdo nuestro',
    botonCarta: 'Leeme algo bonito',
    botonMusica: 'musica',
    /** Se muestra sobre los botones. El archivo va en public/audio/cancion.mp3 */
    cancion: '♪ One and Only — Adele',
  },

  /**
   * La carta. Cada string es un parrafo y se escribe solo, como en una
   * maquina de escribir. Agrega o quita parrafos con total libertad.
   */
  carta: {
    encabezado: 'Para ti, que floreces sin pedir permiso',
    parrafos: [
      'Ma Chérie Tina:',
      'Hay una razon por la que el girasol es mi flor favorita, y no es el color.',
      'Es que hace algo que yo entiendo perfectamente: pasa el dia entero girando la cabeza para no perderse ni un minuto de luz. No lo hace por costumbre. Lo hace porque sin esa luz no sabe crecer.',
      'Yo giro asi contigo. Cuando te rees, cuando te enojas por cosas chiquitas, cuando me cuentas algo con esa urgencia tuya de contarlo todo al mismo tiempo. Giro y me acomodo para que me de de lleno.',
      'Y hay algo mas que casi nadie sabe de los girasoles: cuando ya estan grandes y cargados de semillas, dejan de girar y se quedan mirando al oriente. Fijos. Esperando el amanecer siempre desde el mismo lugar.',
      'Eso es lo que quiero contigo. Ya no ando buscando por donde sale la luz. Ya se para donde mirar.',
      'Feliz dia de las flores amarillas, mi amor. Este campo no se marchita: vive en internet y en el codigo que lo dibuja, y va a seguir floreciendo cada vez que abras este enlace.',
      'Tuyo, girando,',
    ],
    firma: 'Mau 🌻',
    boton: 'cerrar la carta',
  },

  /** Lo ultimo, despues de la carta: lluvia de petalos. */
  final: {
    titulo: 'Te amo',
    linea: 'y me quedo mirando al oriente.',
    boton: 'volver al jardin',
  },

  /** Marco de foto cuando todavia no hay imagen. */
  placeholder: {
    titulo: 'Aqui va una foto nuestra',
    ayuda: 'suelta la imagen en /public/fotos y nombrala como dice el README',
  },
} as const;
