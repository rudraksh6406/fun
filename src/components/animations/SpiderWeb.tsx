"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

export default function SpiderWeb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const spiderRef = useRef<Point>({ x: 0, y: 0 });
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

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    const rings = 8;
    const spokes = 16;
    const cx = () => w() / 2;
    const cy = () => h() / 2;

    spiderRef.current = { x: cx(), y: cy() };

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", handleMouse);

    let time = 0;

    const draw = () => {
      time += 0.008;
      ctx.clearRect(0, 0, w(), h());

      const centerX = cx();
      const centerY = cy();
      const maxR = Math.min(w(), h()) * 0.42;

      const spider = spiderRef.current;
      spider.x += (mouseRef.current.x - spider.x) * 0.03;
      spider.y += (mouseRef.current.y - spider.y) * 0.03;

      // Spokes — teal/cyan
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.lineWidth = 0.5;
      for (let s = 0; s < spokes; s++) {
        const angle = (s / spokes) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * maxR,
          centerY + Math.sin(angle) * maxR
        );
        ctx.stroke();
      }

      // Rings — gradient from cyan to purple
      for (let r = 1; r <= rings; r++) {
        const baseR = (r / rings) * maxR;
        const t = r / rings;
        const red = Math.round(56 + t * 112);
        const green = Math.round(189 - t * 50);
        const blue = Math.round(248 - t * 10);
        ctx.strokeStyle = `rgba(${red},${green},${blue},${0.04 + r * 0.012})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let s = 0; s <= spokes; s++) {
          const angle = (s / spokes) * Math.PI * 2;
          const px = centerX + Math.cos(angle) * baseR;
          const py = centerY + Math.sin(angle) * baseR;
          const dx = spider.x - px;
          const dy = spider.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pull = Math.max(0, 1 - dist / 200) * 15;
          const wave = Math.sin(time * 2 + angle * 3 + r) * 3;

          const fx = px + (dx / (dist || 1)) * pull;
          const fy = py + (dy / (dist || 1)) * pull + wave;

          if (s === 0) ctx.moveTo(fx, fy);
          else ctx.lineTo(fx, fy);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Spider body — teal accent
      const spiderSize = 8;
      // Abdomen
      ctx.fillStyle = "rgba(56, 189, 248, 0.5)";
      ctx.beginPath();
      ctx.ellipse(spider.x, spider.y + 4, spiderSize * 0.9, spiderSize * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.fillStyle = "rgba(99, 220, 255, 0.6)";
      ctx.beginPath();
      ctx.arc(spider.x, spider.y - 6, spiderSize * 0.65, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.beginPath();
      ctx.arc(spider.x - 2.5, spider.y - 7, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(spider.x + 2.5, spider.y - 7, 1.5, 0, Math.PI * 2);
      ctx.fill();
      // Spider glow
      const spiderGlow = ctx.createRadialGradient(spider.x, spider.y, 0, spider.x, spider.y, 40);
      spiderGlow.addColorStop(0, "rgba(56, 189, 248, 0.1)");
      spiderGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = spiderGlow;
      ctx.beginPath();
      ctx.arc(spider.x, spider.y, 40, 0, Math.PI * 2);
      ctx.fill();

      // Spider legs — cyan
      ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
      ctx.lineWidth = 1.2;
      for (let leg = 0; leg < 8; leg++) {
        const side = leg < 4 ? -1 : 1;
        const idx = leg % 4;
        const baseAngle = (idx / 4) * Math.PI * 0.8 - Math.PI * 0.15;
        const legAngle = side * baseAngle + (side > 0 ? 0 : Math.PI);
        const walk = Math.sin(time * 4 + leg * 1.5) * 4;
        const legLen = 28 + walk;
        const kneeLen = legLen * 0.55;

        const kneeX = spider.x + Math.cos(legAngle) * kneeLen;
        const kneeY = spider.y + Math.sin(legAngle) * kneeLen - 8 - Math.abs(walk);
        const footX = spider.x + Math.cos(legAngle) * legLen;
        const footY = spider.y + Math.sin(legAngle) * legLen * 0.3 + 6;

        ctx.beginPath();
        ctx.moveTo(spider.x, spider.y);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();
      }

      // Dew drops — teal glow
      for (let r = 2; r <= rings; r += 2) {
        for (let s = 0; s < spokes; s += 3) {
          const angle = (s / spokes) * Math.PI * 2;
          const baseR2 = (r / rings) * maxR;
          const dx2 = centerX + Math.cos(angle) * baseR2;
          const dy2 = centerY + Math.sin(angle) * baseR2;
          const glow = Math.sin(time * 3 + r + s) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(56, 189, 248, ${0.08 + glow * 0.15})`;
          ctx.beginPath();
          ctx.arc(dx2, dy2, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair"
      style={{ background: "transparent" }}
    />
  );
}
