import Link from "next/link";
import HowBookingWorks from "../components/HowBookingWorks";

export const metadata = { title: "How It Works | StudioSpace" };

const faqs = [
  { q: "Do I pay when I send a booking request?", a: "No. A request stays Pending until the host confirms it. You can cancel any Pending request from My Bookings." },
  { q: "What stops two people booking the same hour?", a: "When a host confirms a booking, that time slot is locked. Any overlapping request is rejected with a clear message." },
  { q: "What is the security deposit?", a: "Each host sets a refundable deposit that is shown on the studio page and in the booking summary before you confirm." },
  { q: "Can I edit or remove my studio later?", a: "Yes. Open My Studio Listings to update details or delete a listing at any time." },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="grid-bg px-4 pb-4 pt-16 text-center">
        <h1 className="section-title">How StudioSpace Works</h1>
        <p className="section-sub">Whether you rent a room or share one, the flow takes only a few minutes.</p>
      </section>

      <HowBookingWorks id="steps" />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="glass p-8">
            <h2 className="text-2xl font-bold text-primary">For creators</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 opacity-85">
              <li>Browse studios by category, price and rating.</li>
              <li>Book by the hour with a transparent total.</li>
              <li>Track every request in My Bookings.</li>
              <li>Leave a review after your session.</li>
            </ul>
            <Link href="/studios" className="btn btn-neon mt-6">
              Find a Studio
            </Link>
          </div>
          <div className="glass p-8">
            <h2 className="text-2xl font-bold text-secondary">For hosts</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 opacity-85">
              <li>List your space with photos, amenities and rules.</li>
              <li>Set your own hourly rate and deposit.</li>
              <li>Confirm or decline each request yourself.</li>
              <li>Edit or remove a listing whenever you like.</li>
            </ul>
            <Link href="/add-studio" className="btn btn-outline btn-secondary mt-6">
              Host Your Space
            </Link>
          </div>
        </div>
      </section>

      <section className="grid-bg px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title">Common Questions</h2>
          <p className="section-sub">Quick answers before you book.</p>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className="collapse collapse-arrow glass">
                <input type="radio" name="faq" defaultChecked={i === 0} />
                <div className="collapse-title font-bold">{f.q}</div>
                <div className="collapse-content text-sm opacity-80">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}