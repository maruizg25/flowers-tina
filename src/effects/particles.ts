import type { RenderBudget } from '../core/types';

/**
 * Capa de particulas.
 *
 * Todo lo que flota en el aire vive en un solo canvas y se mueve con un
 * solo bucle de animacion. Hacerlo con divs y CSS tambien funciona, pero a
 * partir de unas cincuenta particulas el navegador empieza a sufrir; un
 * canvas dibuja quinientas sin pestanear.
 *
 * Hay dos habitantes:
 *  - motas: polen y luciernagas, siempre presentes, suben y se apagan.
 *  - petalos: la lluvia del final, caen girando y se acumulan en la nada.
 */

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** Fase del parpadeo, para que cada una brille en su propio tiempo. */
  phase: number;
  speed: number;
  warm: boolean;
}

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  spin: number;
  angle: number;
  size: number;
  hue: number;
}

export class ParticleLayer {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly motes: Mote[] = [];
  private readonly petals: Petal[] = [];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private frame = 0;
  private last = 0;
  private time = 0;
  private wind = 0;
  private running = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly budget: RenderBudget,
  ) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('No se pudo abrir el contexto 2D del canvas');
    this.ctx = ctx;
    this.resize();
    window.addEventListener('resize', this.resize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  /** Empieza a soltar motas y arranca el bucle. */
  start(): void {
    if (this.running || this.budget.fireflies === 0) return;
    this.running = true;
    for (let i = 0; i < this.budget.fireflies; i++) this.motes.push(this.spawnMote(true));
    this.last = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  /** Lluvia de petalos para el final. */
  rain(count: number): void {
    const total = Math.round(count * (this.budget.tier === 'baja' ? 0.35 : 1));
    for (let i = 0; i < total; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: -Math.random() * this.height * 0.8 - 40,
        vx: (Math.random() - 0.5) * 22,
        vy: 45 + Math.random() * 70,
        spin: (Math.random() - 0.5) * 2.4,
        angle: Math.random() * Math.PI * 2,
        size: 7 + Math.random() * 9,
        hue: 40 + Math.random() * 14,
      });
    }
    if (!this.running) {
      this.running = true;
      this.last = performance.now();
      this.frame = requestAnimationFrame(this.tick);
    }
  }

  destroy(): void {
    this.running = false;
    cancelAnimationFrame(this.frame);
    window.removeEventListener('resize', this.resize);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  private readonly onVisibility = (): void => {
    // Si la pestana se va al fondo, paramos: no tiene sentido gastar
    // bateria animando algo que nadie esta viendo.
    if (document.hidden) {
      cancelAnimationFrame(this.frame);
    } else if (this.running) {
      this.last = performance.now();
      this.frame = requestAnimationFrame(this.tick);
    }
  };

  private readonly resize = (): void => {
    // Tope de 2 en la densidad de pixeles: en pantallas 3x el costo se
    // multiplica por nueve y a ojo no se nota la diferencia.
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  };

  private spawnMote(anywhere: boolean): Mote {
    return {
      x: Math.random() * this.width,
      y: anywhere ? Math.random() * this.height : this.height + 10,
      vx: (Math.random() - 0.5) * 9,
      vy: -(5 + Math.random() * 16),
      r: 0.9 + Math.random() * 2.1,
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.6,
      // Una de cada cinco es luciernaga: mas grande y mas calida.
      warm: Math.random() < 0.2,
    };
  }

  private readonly tick = (now: number): void => {
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.time += dt;
    // Viento lento que respira, hecho con dos senos de distinto periodo
    // para que nunca se repita de forma obvia.
    this.wind = Math.sin(this.time * 0.22) * 10 + Math.sin(this.time * 0.07) * 6;

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawMotes(dt);
    this.drawPetals(dt);

    if (this.running) this.frame = requestAnimationFrame(this.tick);
  };

  private drawMotes(dt: number): void {
    const ctx = this.ctx;
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < this.motes.length; i++) {
      const m = this.motes[i];
      if (!m) continue;

      m.x += (m.vx + this.wind * 0.35) * dt;
      m.y += m.vy * dt;
      m.phase += dt * m.speed;

      if (m.y < -20 || m.x < -30 || m.x > this.width + 30) {
        this.motes[i] = this.spawnMote(false);
        continue;
      }

      // Parpadeo: un seno llevado al cuadrado da pulsos suaves que se
      // quedan mas tiempo apagados que encendidos, como una luciernaga.
      const pulse = Math.pow((Math.sin(m.phase) + 1) / 2, 2);
      const alpha = (m.warm ? 0.75 : 0.4) * (0.25 + pulse * 0.75);
      const radius = m.r * (m.warm ? 1.7 : 1);
      const glow = radius * 6;

      const gradient = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, glow);
      const color = m.warm ? '255, 226, 120' : '255, 245, 205';
      gradient.addColorStop(0, `rgba(${color}, ${alpha})`);
      gradient.addColorStop(0.35, `rgba(${color}, ${alpha * 0.28})`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(m.x, m.y, glow, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  private drawPetals(dt: number): void {
    const ctx = this.ctx;

    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i];
      if (!p) continue;

      p.angle += p.spin * dt;
      p.x += (p.vx + this.wind) * dt + Math.sin(p.angle) * 14 * dt;
      p.y += p.vy * dt;

      if (p.y > this.height + 40) {
        this.petals.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      // El petalo se dibuja como una elipse que se aplasta al girar, lo
      // que simula que va dando vueltas en el aire en tres dimensiones.
      const squash = Math.abs(Math.cos(p.angle * 1.3)) * 0.75 + 0.25;
      ctx.fillStyle = `hsla(${p.hue}, 95%, ${58 + squash * 12}%, 0.92)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.42, p.size * squash, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
