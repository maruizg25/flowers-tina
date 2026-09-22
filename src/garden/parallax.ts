import type { Depth } from '../core/types';

/**
 * Parallax del campo.
 *
 * El truco del teatro de marionetas: cuando el publico se mueve, los
 * telones de atras se corren menos que los de adelante, y el cerebro lee
 * profundidad. Con mouse tomamos la posicion del cursor; en el celular,
 * la inclinacion del aparato.
 */

const FACTOR: Record<Depth, number> = { fondo: 6, medio: 14, frente: 26 };

export function attachParallax(layers: Record<Depth, HTMLElement>): () => void {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame = 0;

  const tick = (): void => {
    // Interpolacion suave: nos acercamos un 8% al objetivo en cada cuadro,
    // asi el movimiento tiene inercia y no se siente pegado al cursor.
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    for (const depth of ['fondo', 'medio', 'frente'] as const) {
      const f = FACTOR[depth];
      layers[depth].style.transform = `translate3d(${(-currentX * f).toFixed(2)}px, ${(-currentY * f * 0.35).toFixed(2)}px, 0)`;
    }

    frame = requestAnimationFrame(tick);
  };

  const onPointer = (event: PointerEvent): void => {
    targetX = (event.clientX / window.innerWidth) * 2 - 1;
    targetY = (event.clientY / window.innerHeight) * 2 - 1;
  };

  const onTilt = (event: DeviceOrientationEvent): void => {
    const gamma = event.gamma ?? 0; // izquierda / derecha
    const beta = event.beta ?? 0; // adelante / atras
    targetX = Math.max(-1, Math.min(1, gamma / 35));
    targetY = Math.max(-1, Math.min(1, (beta - 40) / 40));
  };

  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('deviceorientation', onTilt, { passive: true });
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('deviceorientation', onTilt);
  };
}
