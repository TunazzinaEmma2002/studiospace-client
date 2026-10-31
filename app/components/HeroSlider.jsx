"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import HeroFX from "./HeroFX";

const slides = [
  {
    episode: "EPISODE 01",
    jp: "撮影",
    lines: ["Light. Camera.", "Your Scene."],
    text: "Cyc walls, softboxes and clean backdrops. Book a photo studio by the hour and shoot like it is the opening scene.",
    from: "#1e1b4b", via: "#6d28d9", to: "#f472b6", moon: "#fde68a",
    mode: "sakura", exif: "ISO 400 · F2.8 · 1/125",
  },
  {
    episode: "EPISODE 02",
    jp: "録音",
    lines: ["Record Your", "Next Big Episode"],
    text: "Treated podcast lounges and music suites with pro mics. Press record in a room built for sound.",
    from: "#082f49", via: "#0e7490", to: "#a78bfa", moon: "#bae6fd",
    mode: "rain", exif: "ISO 800 · F1.8 · 1/60",
  },
  {
    episode: "EPISODE 03",
    jp: "創作",
    lines: ["Build the World", "You Imagine"],
    text: "Sound stages and art workshops for filmmakers and makers. Host your own space and meet creators nearby.",
    from: "#4c0519", via: "#be185d", to: "#fb923c", moon: "#fecdd3",
    mode: "embers", exif: "ISO 1600 · F1.4 · 1/30",
  },
];

const sparkles = [
  { top: "14%", left: "8%", size: 22, delay: "0s" },
  { top: "28%", left: "46%", size: 16, delay: "0.8s" },
  { top: "10%", left: "62%", size: 26, delay: "1.4s" },
  { top: "52%", left: "88%", size: 18, delay: "0.4s" },
  { top: "40%", left: "20%", size: 14, delay: "2s" },
];

// Seeded random so server and browser render the same city (no hydration mismatch)
function makeCity(seed, minW, maxW, minH, maxH) {
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const out = [];
  let x = -20;
  while (x < 1620) {
    const w = Math.round(minW + rnd() * (maxW - minW));
    const h = Math.round(minH + rnd() * (maxH - minH));
    out.push({ x, w, h, antenna: rnd() > 0.72, sign: rnd() > 0.8 });
    x += w + Math.round(rnd() * 8);
  }
  return out;
}
const cityBack = makeCity(7, 70, 130, 90, 210);
const cityFront = makeCity(21, 50, 105, 60, 170);

function Skyline({ variant }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const front = variant === "front";
  const city = front ? cityFront : cityBack;
  return (
    <svg
      viewBox="0 0 1600 260"
      preserveAspectRatio="xMidYMax slice"
      className="h-full w-full"
      style={front ? undefined : { filter: "blur(1.5px)" }}
      aria-hidden="true"
    >
      <defs>
        <pattern id={`w${uid}`} width="16" height="20" patternUnits="userSpaceOnUse">
          <rect x="4" y="5" width="6" height="9" fill="#fde68a" opacity="0.8" />
        </pattern>
        <pattern id={`b${uid}`} width="48" height="60" patternUnits="userSpaceOnUse">
          <rect x="20" y="5" width="6" height="9" fill="#22d3ee" />
          <rect x="4" y="25" width="6" height="9" fill="#f0abfc" />
          <rect x="36" y="45" width="6" height="9" fill="#fde68a" />
        </pattern>
      </defs>
      {city.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={260 - b.h} width={b.w} height={b.h} fill={front ? "#0b0720" : "#2a1a66"} opacity={front ? 1 : 0.85} />
          {front && (
            <>
              <rect x={b.x + 4} y={260 - b.h + 8} width={b.w - 8} height={b.h - 8} fill={`url(#w${uid})`} />
              <rect x={b.x + 4} y={260 - b.h + 8} width={b.w - 8} height={b.h - 8} fill={`url(#b${uid})`} className="win-blink" />
              {b.sign && (
                <rect x={b.x + 6} y={260 - b.h - 6} width={b.w - 12} height="4" fill="#f0abfc" style={{ filter: "drop-shadow(0 0 6px #f0abfc)" }} />
              )}
            </>
          )}
          {b.antenna && (
            <>
              <rect x={b.x + b.w / 2 - 1} y={260 - b.h - 28} width="2" height="28" fill={front ? "#0b0720" : "#2a1a66"} />
              <circle cx={b.x + b.w / 2} cy={260 - b.h - 30} r="2.5" fill="#f87171" className="win-blink" />
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

function Moon({ color }) {
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    const r1 = 92;
    const r2 = i % 4 === 0 ? 82 : 87;
    return {
      x1: (100 + Math.cos(a) * r1).toFixed(2),
      y1: (100 + Math.sin(a) * r1).toFixed(2),
      x2: (100 + Math.cos(a) * r2).toFixed(2),
      y2: (100 + Math.sin(a) * r2).toFixed(2),
    };
  });
  return (
    <div
      className="par absolute right-[8%] top-[2%] h-[120px] w-[120px] md:right-[10%] md:top-[9%] md:h-[300px] md:w-[300px]"
      style={{ "--dx": 26, "--dy": 16, "--ps": 120, "--zoom": 0.2 }}
    >
      <div
        className="float absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 30%, #fff, ${color} 55%, ${color}cc)`,
          boxShadow: `0 0 90px 30px ${color}66, 0 0 200px 80px ${color}33`,
        }}
      />
      <svg viewBox="0 0 200 200" className="spin-slow absolute left-[-22%] top-[-22%] h-[144%] w-[144%]" fill="none" stroke="rgba(255,255,255,0.6)" aria-hidden="true">
        <circle cx="100" cy="100" r="96" strokeDasharray="2 6" strokeWidth="1.5" />
        {ticks.map((t, i) => (
          <line key={i} {...t} strokeWidth="1" />
        ))}
      </svg>
      <svg viewBox="0 0 200 200" className="spin-rev absolute left-[-34%] top-[-34%] h-[168%] w-[168%]" fill="none" stroke="rgba(255,255,255,0.45)" aria-hidden="true">
        <circle cx="100" cy="100" r="98" strokeWidth="1.2" strokeDasharray="90 30 10 30 200 40" />
      </svg>
      <span className="flare" />
    </div>
  );
}

function RecTimer() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return <span className="tabular-nums">00:{mm}:{ss}</span>;
}

function Hud({ exif }) {
  const corners = [
    "left-3 top-3 border-l-2 border-t-2",
    "right-3 top-3 border-r-2 border-t-2",
    "bottom-3 left-3 border-b-2 border-l-2",
    "bottom-3 right-3 border-b-2 border-r-2",
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-20 text-white">
      {corners.map((c) => (
        <span key={c} className={`absolute hidden h-8 w-8 border-white/70 sm:block ${c}`} />
      ))}
      <div className="absolute left-5 top-5 flex items-center gap-2 text-xs tracking-[0.25em] sm:left-10 sm:top-8 sm:text-sm">
        <span className="rec-dot h-3 w-3 rounded-full bg-red-500" />
        REC <RecTimer />
      </div>
      <div className="absolute bottom-8 right-10 hidden text-xs tracking-[0.2em] opacity-80 sm:block">
        {exif}
      </div>
      <div className="scroll-cue absolute bottom-8 left-10 hidden flex-col items-start text-[10px] tracking-[0.3em] opacity-80 md:flex">
        SCROLL
        <span className="mt-1 block h-5 w-px bg-white/80" />
      </div>
    </div>
  );
}

export default function HeroSlider() {
  const stageRef = useRef(null);
  const [active, setActive] = useState(0);

  // Mouse + scroll parallax -> CSS variables (--mx, --my, --sp)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, running = false;

    const tick = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      el.style.setProperty("--mx", cx.toFixed(3));
      el.style.setProperty("--my", cy.toFixed(3));
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      start();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      start();
    };
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / r.height));
      el.style.setProperty("--sp", p.toFixed(3));
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={stageRef} className="hero-stage relative overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop
        speed={900}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        onSlideChange={(sw) => setActive(sw.realIndex)}
        className="w-full"
      >
        {slides.map((s) => (
          <SwiperSlide key={s.episode}>
            <section
              className="relative flex min-h-[600px] items-center overflow-hidden text-white md:min-h-[calc(100svh_-_4.5rem)]"
              style={{ background: `linear-gradient(160deg, ${s.from}, ${s.via} 55%, ${s.to})` }}
            >
              <div className="absolute inset-0 speed-lines" />
              <div className="absolute inset-0 halftone" />

              <Moon color={s.moon} />

              {sparkles.map((p, i) => (
                <span key={i} className="sparkle" style={{ top: p.top, left: p.left, fontSize: p.size, animationDelay: p.delay }}>
                  ✦
                </span>
              ))}
              <span className="shooting-star" style={{ top: "6%", right: "8%", animationDelay: "1s" }} />
              <span className="shooting-star" style={{ top: "18%", right: "30%", animationDelay: "4.5s" }} />

              <span className="cloud" style={{ top: "34%", width: 380, animationDelay: "-12s" }} />
              <span className="cloud" style={{ top: "52%", width: 520, animationDelay: "-28s", animationDuration: "52s" }} />

              <div
                className="par pointer-events-none absolute inset-x-[-3%] bottom-0 h-[38%] md:h-[46%]"
                style={{ "--dx": -14, "--dy": -4, "--ps": 60, "--zoom": 0.1, transformOrigin: "50% 100%" }}
              >
                <Skyline variant="back" />
              </div>
              <div
                className="par pointer-events-none absolute inset-x-[-3%] bottom-0 h-[30%] md:h-[38%]"
                style={{ "--dx": -30, "--dy": -8, "--ps": 25, "--zoom": 0.2, transformOrigin: "50% 100%" }}
              >
                <Skyline variant="front" />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0b0720]/70 to-transparent" />

              <div
                className="par absolute right-8 top-12 hidden select-none text-7xl outline-text md:block"
                style={{ "--dx": 10, "--dy": 6, "--ps": 90 }}
              >
                {s.jp}
              </div>

              <div
                className="hero-copy par relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-40 md:py-20"
                style={{ "--dx": 8, "--dy": 5, "--ps": -40 }}
              >
                <span className="episode-tag reveal inline-block" style={{ "--i": 0 }}>
                  {s.episode}
                </span>
                <h1 className="anime-title mt-5 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
                  {s.lines.map((line, li) => (
                    <span key={li} className="reveal block" style={{ "--i": li + 1 }}>
                      {line}
                    </span>
                  ))}
                </h1>
                <p className="reveal mt-5 max-w-xl text-lg opacity-90 md:text-xl" style={{ "--i": 3 }}>
                  {s.text}
                </p>
                <div className="reveal mt-8 flex flex-wrap gap-4" style={{ "--i": 4 }}>
                  <Link href="/studios" className="btn btn-neon btn-lg">
                    Explore Studios
                  </Link>
                  <Link
                    href="/studios"
                    className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-black"
                  >
                    Host Your Space
                  </Link>
                </div>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>

      <HeroFX mode={slides[active].mode} />
      <Hud exif={slides[active].exif} />
      <div className="scanlines pointer-events-none absolute inset-0 z-20" />
    </div>
  );
}