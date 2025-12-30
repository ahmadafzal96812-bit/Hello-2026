import React, { useRef, useEffect } from 'react';
import { ParticleColor } from '../types';

const FireworksCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Helper to get random range
    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
      decay: number;
    }

    interface Firework {
      x: number;
      y: number;
      tx: number;
      ty: number;
      vx: number;
      vy: number;
      color: string;
      exploded: boolean;
      particles: Particle[];
    }

    let fireworks: Firework[] = [];
    const colors = [
      ParticleColor.GOLD,
      ParticleColor.SILVER,
      ParticleColor.RED,
      ParticleColor.BLUE,
      ParticleColor.PURPLE
    ];

    const createFirework = (targetX?: number, targetY?: number) => {
      const x = random(width * 0.1, width * 0.9);
      const y = height;
      const tx = targetX || x + random(-100, 100);
      const ty = targetY || random(height * 0.1, height * 0.4);
      const color = colors[Math.floor(random(0, colors.length))];
      
      const firework: Firework = {
        x,
        y,
        tx,
        ty,
        vx: (tx - x) / (targetX ? 80 : 100),
        vy: (ty - y) / (targetY ? 80 : 100),
        color,
        exploded: false,
        particles: []
      };
      
      fireworks.push(firework);
    };

    const createParticles = (x: number, y: number, color: string) => {
      const particleCount = 80;
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        const angle = random(0, Math.PI * 2);
        const speed = random(1, 6);
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: random(1, 3),
          decay: random(0.01, 0.02)
        });
      }
      return particles;
    };

    // Custom Event Listener for manual triggers from other components
    const handleTrigger = (e: Event) => {
        const customEvent = e as CustomEvent;
        const count = customEvent.detail?.count || 5;
        for(let i=0; i<count; i++) {
            setTimeout(() => {
                createFirework(
                    customEvent.detail?.x || random(width * 0.2, width * 0.8),
                    customEvent.detail?.y || random(height * 0.2, height * 0.5)
                );
            }, i * 200);
        }
    };
    window.addEventListener('trigger-fireworks', handleTrigger);

    const loop = () => {
      // Clear with trail effect
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      // Randomly spawn fireworks (auto mode)
      if (Math.random() < 0.03) {
        createFirework();
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];

        if (!fw.exploded) {
          fw.x += fw.vx;
          fw.y += fw.vy;

          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.fill();

          // Distance check for explosion
          if (Math.abs(fw.y - fw.ty) < 10) {
            fw.exploded = true;
            fw.particles = createParticles(fw.x, fw.y, fw.color);
          }
        } else {
          for (let j = fw.particles.length - 1; j >= 0; j--) {
            const p = fw.particles[j];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
              fw.particles.splice(j, 1);
            } else {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.alpha;
              ctx.fill();
              ctx.globalAlpha = 1;
            }
          }

          if (fw.particles.length === 0) {
            fireworks.splice(i, 1);
          }
        }
      }

      requestAnimationFrame(loop);
    };

    const animId = requestAnimationFrame(loop);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('trigger-fireworks', handleTrigger);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default FireworksCanvas;