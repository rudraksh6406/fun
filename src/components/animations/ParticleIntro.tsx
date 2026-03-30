"use client";

import { useEffect, useRef, useCallback } from "react";

export default function ParticleIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const cw = () => canvas.offsetWidth;
    const ch = () => canvas.offsetHeight;

    // Floating particles
    const particleCount = 60;
    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; hue: number; alpha: number; pulse: number; speed: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * cw(),
        y: Math.random() * ch(),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 1 + Math.random() * 2.5,
        hue: 260 + Math.random() * 60, // purple to pink range
        alpha: 0.1 + Math.random() * 0.4,
        pulse: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      });
    }

    // Nebula blobs
    const nebulae = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * cw(),
      y: Math.random() * ch(),
      radius: 80 + Math.random() * 150,
      hue: [260, 280, 300, 200, 330][i],
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const draw = () => {
      time += 0.008;
      const w = cw();
      const h = ch();

      ctx.clearRect(0, 0, w, h);

      // Draw nebula blobs
      for (const neb of nebulae) {
        neb.x += neb.vx;
        neb.y += neb.vy;
        neb.phase += 0.005;
        if (neb.x < -neb.radius) neb.x = w + neb.radius;
        if (neb.x > w + neb.radius) neb.x = -neb.radius;
        if (neb.y < -neb.radius) neb.y = h + neb.radius;
        if (neb.y > h + neb.radius) neb.y = -neb.radius;

        const pulse = 1 + Math.sin(neb.phase) * 0.2;
        const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.radius * pulse);
        grad.addColorStop(0, `hsla(${neb.hue}, 60%, 50%, 0.04)`);
        grad.addColorStop(0.5, `hsla(${neb.hue}, 50%, 40%, 0.02)`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(neb.x - neb.radius * 2, neb.y - neb.radius * 2, neb.radius * 4, neb.radius * 4);
      }

      // Draw connections between nearby particles
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Mouse interaction — gentle repulsion
        const dmx = p.x - mx;
        const dmy = p.y - my;
        const distMouse = Math.sqrt(dmx * dmx + dmy * dmy);
        if (distMouse < 150) {
          const force = (150 - distMouse) / 150 * 0.8;
          p.vx += (dmx / distMouse) * force;
          p.vy += (dmy / distMouse) * force;
        }

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const alpha = (1 - dist / 80) * 0.08;
            const avgHue = (p.hue + q.hue) / 2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `hsla(${avgHue}, 50%, 65%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Update & draw particles
      for (const p of particles) {
        p.pulse += 0.02 * p.speed;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99; // friction
        p.vy *= 0.99;
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy += (Math.random() - 0.5) * 0.05;

        // Wrap around
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const pulseAlpha = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);
        const pulseSize = p.size * (0.8 + Math.sin(p.pulse * 0.7) * 0.3);

        // Glow
        const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseSize * 4);
        glowGrad.addColorStop(0, `hsla(${p.hue}, 60%, 65%, ${pulseAlpha * 0.3})`);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(p.x - pulseSize * 4, p.y - pulseSize * 4, pulseSize * 8, pulseSize * 8);

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${pulseAlpha})`;
        ctx.fill();
      }

      // Mouse glow
      if (mx > 0 && my > 0) {
        const mouseGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        mouseGrad.addColorStop(0, "hsla(280, 60%, 65%, 0.06)");
        mouseGrad.addColorStop(1, "transparent");
        ctx.fillStyle = mouseGrad;
        ctx.fillRect(mx - 80, my - 80, 160, 160);
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: "transparent" }}
    />
  );
}
