/**
 * Musica de fondo.
 *
 * Los navegadores no dejan que una pagina suene sola: hace falta que la
 * persona toque algo primero. Por eso la cancion no arranca al cargar, sino
 * en el mismo gesto que abre el jardin. Y no entra de golpe: sube de
 * volumen en unos segundos, como cuando alguien abre despacio una puerta.
 */
export class Soundtrack {
  private fade = 0;
  private target = 0;

  constructor(
    private readonly audio: HTMLAudioElement,
    private readonly maxVolume = 0.55,
  ) {
    this.audio.volume = 0;
    this.audio.loop = true;
    this.audio.preload = 'auto';
  }

  get playing(): boolean {
    return !this.audio.paused;
  }

  /** Debe llamarse dentro del gesto de la persona, o el navegador lo bloquea. */
  async play(): Promise<boolean> {
    try {
      await this.audio.play();
      this.fadeTo(this.maxVolume);
      return true;
    } catch {
      // Autoplay bloqueado o archivo ausente: el jardin funciona igual,
      // solo en silencio. Nunca es motivo para romper la experiencia.
      return false;
    }
  }

  pause(): void {
    this.fadeTo(0, () => this.audio.pause());
  }

  async toggle(): Promise<boolean> {
    if (this.playing) {
      this.pause();
      return false;
    }
    return this.play();
  }

  /** Baja el volumen sin cortar: para cuando se lee la carta. */
  duck(): void {
    if (this.playing) this.fadeTo(this.maxVolume * 0.35);
  }

  unduck(): void {
    if (this.playing) this.fadeTo(this.maxVolume);
  }

  /**
   * Lleva el volumen a un valor en un fundido corto y despues avisa.
   *
   * Cuidado con iOS: Safari no deja cambiar el volumen desde codigo (la
   * propiedad se escribe pero no cambia), y un fundido que "espera a
   * llegar" a cero no llegaria nunca, con lo que la pausa no ocurriria
   * jamas. Por eso hay dos salidas de emergencia: si el volumen no
   * responde, o si el fundido lleva demasiado tiempo, se corta y se llama
   * a done() igual. Apagar de golpe es mejor que no apagar.
   */
  private fadeTo(volume: number, done?: () => void): void {
    this.target = Math.max(0, Math.min(1, volume));
    cancelAnimationFrame(this.fade);

    const started = performance.now();
    const MAX_MS = 1800;

    const finish = (): void => {
      // Si el volumen es de solo lectura esta asignacion no hace nada,
      // y no importa: lo que cuenta es que done() (la pausa) si corre.
      this.audio.volume = this.target;
      done?.();
    };

    const step = (): void => {
      const before = this.audio.volume;
      const diff = this.target - before;

      if (Math.abs(diff) < 0.01 || performance.now() - started > MAX_MS) {
        finish();
        return;
      }

      this.audio.volume = Math.max(0, Math.min(1, before + diff * 0.08));

      // El volumen no se movio: este navegador no lo deja tocar.
      if (this.audio.volume === before) {
        finish();
        return;
      }

      this.fade = requestAnimationFrame(step);
    };

    this.fade = requestAnimationFrame(step);
  }
}
