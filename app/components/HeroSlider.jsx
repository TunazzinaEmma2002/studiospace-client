"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    episode: "EPISODE 01",
    jp: "撮影",
    title: "Light. Camera. Your Scene.",
    text: "Cyc walls, softboxes and clean backdrops. Book a photo studio by the hour and shoot like it is the opening scene.",
    from: "#1e1b4b", via: "#6d28d9", to: "#f472b6", moon: "#fde68a",
  },
  {
    episode: "EPISODE 02",
    jp: "録音",
    title: "Record Your Next Big Episode",
    text: "Treated podcast lounges and music suites with pro mics. Press record in a room built for sound.",
    from: "#082f49", via: "#0e7490", to: "#a78bfa", moon: "#bae6fd",
  },
  {
    episode: "EPISODE 03",
    jp: "創作",
    title: "Build the World You Imagine",
    text: "Sound stages and art workshops for filmmakers and makers. Host your own space and meet creators nearby.",
    from: "#4c0519", via: "#be185d", to: "#fb923c", moon: "#fecdd3",
  },
];

const buildings = [
  [0, 90, 70], [70, 140, 50], [120, 70, 60], [180, 160, 45], [225, 100, 70],
  [295, 180, 50], [345, 120, 65], [410, 80, 55], [465, 150, 60], [525, 110, 50],
  [575, 170, 60], [635, 90, 70], [705, 140, 55], [760, 100, 60], [820, 160, 50],
  [870, 120, 65], [935, 80, 55], [990, 150, 60], [1050, 110, 50], [1100, 170, 60],
  [1160, 90, 70], [1230, 140, 55], [1285, 100, 60], [1345, 150, 55],
];

const sparkles = [
  { top: "14%", left: "8%", size: 22, delay: "0s" },
  { top: "28%", left: "46%", size: 16, delay: "0.8s" },
  { top: "10%", left: "62%", size: 26, delay: "1.4s" },
  { top: "52%", left: "88%", size: 18, delay: "0.4s" },
  { top: "40%", left: "20%", size: 14, delay: "2s" },
];

function Skyline() {
  return (
    <svg
      viewBox="0 0 1400 200"
      preserveAspectRatio="xMidYMax slice"
      className="absolute bottom-0 left-0 w-full h-40 md:h-56"
      aria-hidden="true"
    >
      <defs>
        <pattern id="windows" width="12" height="16" patternUnits="userSpaceOnUse">
          <rect x="3" y="4" width="5" height="7" fill="#fde68a" opacity="0.75" />
        </pattern>
      </defs>
      {buildings.map(([x, h, w], i) => (
        <g key={i}>
          <rect x={x} y={200 - h} width={w} height={h} fill="#0b0720" />
          <rect x={x} y={200 - h} width={w} height={h} fill="url(#windows)" />
        </g>
      ))}
    </svg>
  );
}

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, EffectFade, Pagination]}
      effect="fade"
      loop
      speed={900}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      className="w-full"
    >
      {slides.map((s) => (
        <SwiperSlide key={s.episode}>
          <section
            className="relative overflow-hidden min-h-[560px] md:min-h-[640px] flex items-center text-white"
            style={{
              background: `linear-gradient(160deg, ${s.from}, ${s.via} 55%, ${s.to})`,
            }}
          >
            {/* glowing moon */}
            <div
              className="absolute rounded-full float"
              style={{
                width: 220, height: 220, right: "12%", top: "10%",
                background: s.moon,
                boxShadow: `0 0 90px 30px ${s.moon}66`,
              }}
            />
            <div className="absolute inset-0 speed-lines" />
            <div className="absolute inset-0 halftone" />

            {sparkles.map((p, i) => (
              <span
                key={i}
                className="sparkle"
                style={{ top: p.top, left: p.left, fontSize: p.size, animationDelay: p.delay }}
              >
                ✦
              </span>
            ))}

            <Skyline />

            {/* vertical japanese text */}
            <div className="hidden md:block absolute right-6 top-10 text-8xl outline-text select-none">
              {s.jp}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
              <span className="episode-tag">{s.episode}</span>
              <h1 className="anime-title text-4xl md:text-6xl font-black mt-5 max-w-3xl leading-tight">
                {s.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg md:text-xl opacity-90">{s.text}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/studios" className="btn btn-neon btn-lg">
                  Explore Studios
                </Link>
                <Link
                  href="/studios"
                  className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-black"
                >
                  Host Your Space
                </Link>
              </div>
            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}