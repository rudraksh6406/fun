"use client";

import { useEffect, useRef } from "react";

export default function DrivingScene() {
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

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    let time = 0;

    interface RoadLine { z: number; }
    const roadLines: RoadLine[] = [];
    for (let i = 0; i < 20; i++) {
      roadLines.push({ z: i * 50 });
    }

    const stars: { x: number; y: number; speed: number; brightness: number; hue: number }[] = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random() * 0.5,
        speed: 0.0005 + Math.random() * 0.002,
        brightness: Math.random(),
        hue: 200 + Math.random() * 120,
      });
    }

    interface Tree { z: number; side: number; }
    const trees: Tree[] = [];
    for (let i = 0; i < 30; i++) {
      trees.push({ z: i * 35, side: Math.random() > 0.5 ? 1 : -1 });
    }

    const draw = () => {
      time += 0.016;
      const cw = w();
      const ch = h();
      ctx.clearRect(0, 0, cw, ch);

      const horizon = ch * 0.4;
      const vanishX = cw / 2 + Math.sin(time * 0.3) * 30;

      // Sky — deep indigo to purple
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
      skyGrad.addColorStop(0, "rgba(15, 10, 40, 1)");
      skyGrad.addColorStop(1, "rgba(30, 15, 50, 1)");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, cw, horizon);

      // Stars — colorful twinkle
      stars.forEach((star) => {
        star.x -= star.speed;
        if (star.x < 0) star.x = 1;
        const twinkle = Math.sin(time * 3 + star.brightness * 10) * 0.5 + 0.5;
        ctx.fillStyle = `hsla(${star.hue}, 60%, 75%, ${0.1 + twinkle * star.brightness * 0.4})`;
        ctx.beginPath();
        ctx.arc(star.x * cw, star.y * ch, 1, 0, Math.PI * 2);
        ctx.fill();
      });

      // Moon — warm amber glow
      ctx.fillStyle = "rgba(251, 191, 36, 0.08)";
      ctx.beginPath();
      ctx.arc(cw * 0.8, ch * 0.15, 30, 0, Math.PI * 2);
      ctx.fill();
      const moonGlow = ctx.createRadialGradient(cw * 0.8, ch * 0.15, 0, cw * 0.8, ch * 0.15, 80);
      moonGlow.addColorStop(0, "rgba(251, 191, 36, 0.06)");
      moonGlow.addColorStop(1, "rgba(251, 191, 36, 0)");
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(cw * 0.8, ch * 0.15, 80, 0, Math.PI * 2);
      ctx.fill();

      // Ground — dark purple
      const groundGrad = ctx.createLinearGradient(0, horizon, 0, ch);
      groundGrad.addColorStop(0, "rgba(20, 12, 30, 1)");
      groundGrad.addColorStop(1, "rgba(12, 10, 18, 1)");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizon, cw, ch - horizon);

      const roadTopW = 40;
      const roadBotW = cw * 0.6;

      const project = (z: number, xOff: number) => {
        const t = Math.max(0.01, z / 1000);
        const screenY = horizon + (ch - horizon) * (1 - Math.pow(1 - t, 2));
        const roadW = roadTopW + (roadBotW - roadTopW) * t;
        const screenX = vanishX + xOff * roadW;
        return { x: screenX, y: screenY, w: roadW };
      };

      // Road surface
      ctx.fillStyle = "rgba(25, 18, 40, 0.8)";
      ctx.beginPath();
      ctx.moveTo(vanishX - roadTopW / 2, horizon);
      ctx.lineTo(vanishX + roadTopW / 2, horizon);
      ctx.lineTo(cw / 2 + roadBotW / 2, ch);
      ctx.lineTo(cw / 2 - roadBotW / 2, ch);
      ctx.closePath();
      ctx.fill();

      // Road edges — purple tint
      ctx.strokeStyle = "rgba(168, 85, 247, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(vanishX - roadTopW / 2, horizon);
      ctx.lineTo(cw / 2 - roadBotW / 2, ch);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(vanishX + roadTopW / 2, horizon);
      ctx.lineTo(cw / 2 + roadBotW / 2, ch);
      ctx.stroke();

      // Road dashes — amber
      roadLines.forEach((line) => {
        line.z -= 1.5;
        if (line.z < 0) line.z += 1000;
        const p = project(line.z, 0);
        const dashLen = Math.max(1, 8 * (p.w / roadBotW));
        ctx.fillStyle = `rgba(251, 191, 36, ${0.04 + (p.w / roadBotW) * 0.1})`;
        ctx.fillRect(p.x - 1, p.y, 2, dashLen);
      });

      // Trees — teal silhouettes
      trees.forEach((tree) => {
        tree.z -= 1.5;
        if (tree.z < 0) tree.z += 1000;
        const p = project(tree.z, tree.side * 0.7);
        const scale = p.w / roadBotW;
        const treeH = 20 + scale * 40;
        const treeW = 2 + scale * 4;

        ctx.fillStyle = `rgba(56, 189, 248, ${0.03 + scale * 0.05})`;
        ctx.fillRect(p.x - treeW / 4, p.y - treeH, treeW / 2, treeH);

        ctx.beginPath();
        ctx.moveTo(p.x, p.y - treeH - treeW * 2);
        ctx.lineTo(p.x - treeW, p.y - treeH * 0.4);
        ctx.lineTo(p.x + treeW, p.y - treeH * 0.4);
        ctx.closePath();
        ctx.fill();
      });

      // Dashboard
      ctx.fillStyle = "rgba(5, 5, 12, 0.9)";
      ctx.beginPath();
      ctx.moveTo(0, ch);
      ctx.lineTo(0, ch - 30);
      ctx.quadraticCurveTo(cw * 0.3, ch - 50, cw * 0.5, ch - 35);
      ctx.quadraticCurveTo(cw * 0.7, ch - 50, cw, ch - 30);
      ctx.lineTo(cw, ch);
      ctx.closePath();
      ctx.fill();

      // Steering wheel — subtle purple
      ctx.strokeStyle = "rgba(168, 85, 247, 0.06)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cw / 2, ch + 10, 45, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();

      // Headlight glow — warm amber
      const hlGlow = ctx.createRadialGradient(cw / 2, ch - 40, 0, cw / 2, ch * 0.6, cw * 0.4);
      hlGlow.addColorStop(0, "rgba(251, 191, 36, 0.03)");
      hlGlow.addColorStop(1, "rgba(251, 191, 36, 0)");
      ctx.fillStyle = hlGlow;
      ctx.fillRect(0, horizon, cw, ch - horizon);

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: "transparent" }}
    />
  );
}
