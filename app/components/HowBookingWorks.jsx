import { FaSearch, FaCalendarCheck, FaUserCheck, FaVideo } from "react-icons/fa";

const steps = [
  { Icon: FaSearch, title: "Find your space", text: "Search by category, price and location, then check the gallery, amenities and reviews." },
  { Icon: FaCalendarCheck, title: "Pick a time slot", text: "Choose a date, start time and duration. You see the full price before you confirm." },
  { Icon: FaUserCheck, title: "Host confirms", text: "The host reviews your request. Confirmed slots are locked, so nobody can double-book you." },
  { Icon: FaVideo, title: "Show up and create", text: "Arrive, plug in and shoot, record or make. Leave a review when you wrap." },
];

export default function HowBookingWorks({ id = "how-booking-works" }) {
  return (
    <section id={id} className="grid-bg px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="section-title">How Booking Works</h2>
        <p className="section-sub">From search to the first take in four simple steps.</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ Icon, title, text }, i) => (
            <div key={title} className="glass relative flex h-full flex-col p-6">
              <span className="absolute right-5 top-4 text-5xl font-black opacity-10">0{i + 1}</span>
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-2xl text-primary-content">
                <Icon />
              </span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm opacity-75">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}