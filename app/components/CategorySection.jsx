import Link from "next/link";
import { FaCamera, FaFilm, FaMicrophoneAlt, FaMusic, FaPalette } from "react-icons/fa";

const categories = [
  { label: "Photo Studios", value: "Photo Studio", Icon: FaCamera, text: "Cyc walls, strobes and clean backdrops." },
  { label: "Sound Stages", value: "Sound Stage", Icon: FaFilm, text: "Big open stages for film and video." },
  { label: "Podcast Rooms", value: "Podcast Room", Icon: FaMicrophoneAlt, text: "Treated rooms with pro microphones." },
  { label: "Music Suites", value: "Music Suite", Icon: FaMusic, text: "Rehearse, record and mix in comfort." },
  { label: "Art Workshops", value: "Art Workshop", Icon: FaPalette, text: "Bright, messy-friendly creative spaces." },
];

export default function CategorySection() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="section-title">Browse by Category</h2>
        <p className="section-sub">Whatever you create, there is a room built for it.</p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(({ label, value, Icon, text }) => (
            <Link
              key={value}
              href={`/studios?category=${encodeURIComponent(value)}`}
              className="glass group flex h-full flex-col items-center p-6 text-center transition duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_0_28px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]"
            >
              <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-3xl text-primary transition group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-content">
                <Icon />
              </span>
              <h3 className="text-lg font-bold">{label}</h3>
              <p className="mt-2 text-sm opacity-70">{text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}