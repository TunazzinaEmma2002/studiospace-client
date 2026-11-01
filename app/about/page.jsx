import Link from "next/link";
import { FaBolt, FaHandshake, FaEye } from "react-icons/fa";

export const metadata = { title: "About Us | StudioSpace" };

const values = [
  { Icon: FaBolt, title: "Fast by design", text: "Finding and booking a room should take minutes, not a week of emails." },
  { Icon: FaHandshake, title: "Fair to both sides", text: "Hosts approve every request and guests see every cost before they commit." },
  { Icon: FaEye, title: "Honest and clear", text: "Real reviews, clear pricing and no hidden steps between you and the shoot." },
];

export default function AboutPage() {
  return (
    <>
      <section className="grid-bg px-4 py-20 text-center">
        <h1 className="section-title">About StudioSpace</h1>
        <p className="section-sub !mb-0">
          StudioSpace is a peer-to-peer marketplace that connects creators with photo studios, sound stages, podcast
          rooms, music suites and art workshops, rented by the hour.
        </p>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="section-title">What We Believe</h2>
          <p className="section-sub">Great work starts in the right room.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map(({ Icon, title, text }) => (
              <div key={title} className="glass h-full p-7 text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-2xl text-primary">
                  <Icon />
                </span>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm opacity-75">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid-bg px-4 py-16">
        <div className="glass mx-auto max-w-3xl p-10 text-center">
          <h2 className="text-2xl font-bold">Ready for your next session?</h2>
          <p className="mb-6 mt-2 opacity-75">Book a studio today, or turn your own space into income.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/studios" className="btn btn-neon">
              Explore Studios
            </Link>
            <Link href="/add-studio" className="btn btn-outline btn-primary">
              Host Your Space
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}