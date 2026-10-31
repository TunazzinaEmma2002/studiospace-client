"use client";
import { useEffect, useRef } from "react";

const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ01<>/";

// Canvas particle layer. mode: "sakura" | "rain" | "embers"
export default function HeroFX({ mode = "sakura" }) {
  const canvasRef = useRef(null);
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let petals = [];
    let embers = [];
    let cols = [];
    const fade = { sakura: 0, rain: 0, embers: 0 };
    const rand = (a, b) => a + Math.random() * (b - a);
    const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

    const build = () => {
      const n = Math.max(24, Math.min(70, Math.round((w * h) / 22000)));
      petals = Array.from({ length: n }, () => ({
        x: rand(0, w), y: rand(-h, h), s: rand(5, 11),
        vx: rand(0.4, 1.2), vy: rand(0.6, 1.6),
        rot: rand(0, 6.28), vr: rand(-0.03, 0.03), ph: rand(0, 6.28), hue: rand(328, 350),
      }));
      embers = Array.from({ length: n }, () => ({
        x: rand(0, w), y: rand(0, h), r: rand(1.2, 3.6),
        vy: rand(0.3, 1.1), ph: rand(0, 6.28), sway: rand(0.2, 0.8),
      }));
      const step = 26;
      cols = Array.from({ length: Math.ceil(w / step) }, (_, i) => ({
        x: i * step + 6, y: rand(-h, 0), v: rand(1.2, 3.4), len: Math.round(rand(6, 14)),
        chars: Array.from({ length: 14 }, glyph),
      }));
    };

    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const drawSakura = (a) => {
      ctx.globalAlpha = a * 0.9;
      for (const p of petals) {
        p.x += p.vx + Math.sin(p.ph) * 0.5;
        p.y += p.vy;
        p.rot += p.vr;
        p.ph += 0.02;
        if (p.y > h + 20 || p.x > w + 20) {
          p.x = rand(-40, w);
          p.y = -20;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.ph)));
        ctx.fillStyle = `hsl(${p.hue} 90% 80%)`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    const drawRain = (a) => {
      ctx.font = "16px monospace";
      ctx.textBaseline = "top";
      for (const c of cols) {
        c.y += c.v;
        if (c.y - c.len * 18 > h) {
          c.y = rand(-200, 0);
          c.v = rand(1.2, 3.4);
        }
        if (Math.random() < 0.04) c.chars[Math.floor(Math.random() * c.chars.length)] = glyph();
        for (let i = 0; i < c.len; i++) {
          const y = c.y - i * 18;
          if (y < -18 || y > h) continue;
          const alpha = (1 - i / c.len) * a * 0.9;
          ctx.fillStyle = i === 0 ? `rgba(255,255,255,${a * 0.9})` : `rgba(103,232,249,${alpha})`;
          ctx.fillText(c.chars[i % c.chars.length], c.x, y);
        }
      }
    };

    const drawEmbers = (a) => {
      ctx.globalCompositeOperation = "lighter";
      for (const e of embers) {
        e.y -= e.vy;
        e.x += Math.sin(e.ph) * e.sway;
        e.ph += 0.03;
        if (e.y < -10) {
          e.y = h + 10;
          e.x = rand(0, w);
        }
        ctx.fillStyle = `rgba(251,146,60,${0.14 * a})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(253,186,116,${0.9 * a})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const k in fade) {
        const target = modeRef.current === k ? 1 : 0;
        fade[k] += (target - fade[k]) * 0.05;
      }
      if (fade.sakura > 0.02) drawSakura(fade.sakura);
      if (fade.rain > 0.02) drawRain(fade.rain);
      if (fade.embers > 0.02) drawEmbers(fade.embers);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      aria-hidden="true"
    />
  );
}