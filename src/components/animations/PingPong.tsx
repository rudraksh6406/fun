"use client";

import { useEffect, useRef } from "react";

export default function PingPong() {
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

    let bx = w() / 2, by = h() / 2;
    let bvx = 3.5, bvy = 2.2;
    const ballR = 5;

    const paddleW = 6, paddleH = 60;
    let leftY = h() / 2, rightY = h() / 2;

    const trail: { x: number; y: number; age: number }[] = [];
    let scoreL = 0, scoreR = 0;

    const draw = () => {
      const cw = w();
      const ch = h();
      ctx.clearRect(0, 0, cw, ch);

      // Center line — amber
      ctx.setLineDash([4, 8]);
      ctx.strokeStyle = "rgba(251, 146, 60, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cw / 2, 0);
      ctx.lineTo(cw / 2, ch);
      ctx.stroke();
      ctx.setLineDash([]);

      // Score — warm orange
      ctx.fillStyle = "rgba(251, 146, 60, 0.06)";
      ctx.font = "60px 'Helvetica Neue', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${scoreL}`, cw / 2 - 60, 70);
      ctx.fillText(`${scoreR}`, cw / 2 + 60, 70);

      // AI paddles
      leftY += (by - leftY) * 0.06;
      rightY += (by - rightY) * 0.08;

      bx += bvx;
      by += bvy;

      if (by - ballR < 0 || by + ballR > ch) {
        bvy *= -1;
        by = by - ballR < 0 ? ballR : ch - ballR;
      }

      const margin = 30;
      if (bx - ballR < margin + paddleW && by > leftY - paddleH / 2 && by < leftY + paddleH / 2 && bvx < 0) {
        bvx = Math.abs(bvx) * 1.02;
        bvy += ((by - leftY) / (paddleH / 2)) * 2;
      }
      if (bx + ballR > cw - margin - paddleW && by > rightY - paddleH / 2 && by < rightY + paddleH / 2 && bvx > 0) {
        bvx = -Math.abs(bvx) * 1.02;
        bvy += ((by - rightY) / (paddleH / 2)) * 2;
      }

      const speed = Math.sqrt(bvx * bvx + bvy * bvy);
      if (speed > 8) {
        bvx = (bvx / speed) * 8;
        bvy = (bvy / speed) * 8;
      }

      if (bx < 0) {
        scoreR++;
        bx = cw / 2; by = ch / 2;
        bvx = 3.5; bvy = 2.2;
      }
      if (bx > cw) {
        scoreL++;
        bx = cw / 2; by = ch / 2;
        bvx = -3.5; bvy = -2.2;
      }

      trail.push({ x: bx, y: by, age: 0 });
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age++;
        if (trail[i].age > 20) trail.splice(i, 1);
      }

      // Trail — warm orange fade
      trail.forEach((t) => {
        const alpha = (1 - t.age / 20) * 0.25;
        ctx.fillStyle = `rgba(251, 146, 60, ${alpha})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, ballR * (1 - t.age / 20), 0, Math.PI * 2);
        ctx.fill();
      });

      // Paddles — amber
      ctx.fillStyle = "rgba(251, 146, 60, 0.5)";
      ctx.fillRect(margin, leftY - paddleH / 2, paddleW, paddleH);
      ctx.fillRect(cw - margin - paddleW, rightY - paddleH / 2, paddleW, paddleH);

      // Ball — bright orange
      ctx.fillStyle = "rgba(251, 146, 60, 0.9)";
      ctx.beginPath();
      ctx.arc(bx, by, ballR, 0, Math.PI * 2);
      ctx.fill();

      // Ball glow
      const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, 25);
      gradient.addColorStop(0, "rgba(251, 146, 60, 0.15)");
      gradient.addColorStop(1, "rgba(251, 146, 60, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(bx, by, 25, 0, Math.PI * 2);
      ctx.fill();

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
