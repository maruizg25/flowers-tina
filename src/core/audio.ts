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

  private fadeTo(volume: number, done?: () => void): void {
    this.target = volume;
    cancelAnimationFrame(this.fade);

    const step = (): void => {
      const diff = this.target - this.audio.volume;
      if (Math.abs(diff) < 0.01) {
        this.audio.volume = Math.max(0, Math.min(1, this.target));
        done?.();
        return;
      }
      this.audio.volume = Math.max(0, Math.min(1, this.audio.volume + diff * 0.06));
      this.fade = requestAnimationFrame(step);
    };

    this.fade = requestAnimationFrame(step);
  }
}
