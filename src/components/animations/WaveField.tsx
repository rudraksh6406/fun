"use client";

import { useEffect, useRef } from "react";

export default function WaveField({ color = "white" }: { color?: "white" | "dark" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    const isDark = color === "dark";

    // Colorful wave palette
    const waveColors = isDark
      ? [
          { r: 168, g: 85, b: 247 },  // purple
          { r: 139, g: 92, b: 246 },   // violet
          { r: 99, g: 102, b: 241 },   // indigo
          { r: 56, g: 189, b: 248 },   // cyan
          { r: 244, g: 114, b: 182 },  // pink
        ]
      : [
          { r: 168, g: 85, b: 247 },   // purple
          { r: 59, g: 130, b: 246 },    // blue
          { r: 236, g: 72, b: 153 },    // pink
          { r: 14, g: 165, b: 233 },    // sky
          { r: 139, g: 92, b: 246 },    // violet
        ];

    const draw = () => {
      time += 0.01;
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      const layers = 5;
      for (let l = 0; l < layers; l++) {
        const baseY = ch * 0.3 + l * (ch * 0.12);
        const amp = 15 + l * 8;
        const freq = 0.008 - l * 0.001;
        const speed = 0.5 + l * 0.2;
        const alpha = isDark ? 0.03 + l * 0.012 : 0.04 + l * 0.015;
        const c = waveColors[l % waveColors.length];

        ctx.beginPath();
        ctx.moveTo(0, ch);
        for (let x = 0; x <= cw; x += 5) {
          const y = baseY +
            Math.sin(x * freq + time * speed) * amp +
            Math.sin(x * freq * 2.3 + time * speed * 0.7) * (amp * 0.4) +
            Math.cos(x * freq * 0.5 + time * speed * 1.3) * (amp * 0.3);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(cw, ch);
        ctx.lineTo(0, ch);
        ctx.closePath();

        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: "transparent" }}
    />
  );
}
