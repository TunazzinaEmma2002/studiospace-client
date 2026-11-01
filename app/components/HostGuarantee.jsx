import Link from "next/link";
import { FaShieldAlt, FaLock, FaTags, FaHeadset } from "react-icons/fa";

const perks = [
  { Icon: FaShieldAlt, title: "Security deposit protection", text: "Every studio lists a clear deposit up front, so hosts and guests know the rules." },
  { Icon: FaLock, title: "No double bookings", text: "Once a slot is confirmed, overlapping requests are blocked automatically." },
  { Icon: FaTags, title: "Transparent pricing", text: "Hourly rate, deposit and total are shown before you ever press confirm." },
  { Icon: FaHeadset, title: "Real reviews only", text: "Only signed-in guests can review, and only once per studio." },
];

export default function HostGuarantee() {
  return (
    <section className="px-4 py-20">
      <div className="glass mx-auto grid max-w-7xl items-center gap-10 p-8 md:p-12 lg:grid-cols-2">
        <div>
          <span className="badge badge-secondary mb-4">Host Guarantee</span>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Your space, <span className="neon-text">protected</span>.
          </h2>
          <p className="mt-4 opacity-80">
            Own a studio, a stage or a spare creative room? List it in minutes, set your own hourly rate and deposit,
            and approve every booking yourself.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/add-studio" className="btn btn-neon">
              Host Your Space
            </Link>
            <Link href="/how-it-works" className="btn btn-outline btn-primary">
              Learn More
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {perks.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-primary/20 p-5">
              <Icon className="mb-3 text-2xl text-primary" />
              <h3 className="font-bold">{title}</h3>
              <p className="mt-1 text-sm opacity-70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}