"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FaStar, FaMapMarkerAlt, FaUsers, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { onImgError } from "@/lib/placeholder";

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
const pad = (n) => String(n).padStart(2, "0");
const START_TIMES = Array.from({ length: 17 }, (_, i) => `${pad(6 + i)}:00`); // 06:00 - 22:00

function Stars({ value, size = "text-base" }) {
  return (
    <span className={`inline-flex gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar key={n} className={n <= Math.round(value) ? "text-yellow-400" : "opacity-25"} />
      ))}
    </span>
  );
}

export default function StudioDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [studio, setStudio] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [active, setActive] = useState(0);

  // booking modal
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(today());
  const [start, setStart] = useState("10:00");
  const [hours, setHours] = useState(2);
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState("");

  // review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [s, r] = await Promise.all([api(`/studios/${id}`), api(`/studios/${id}/reviews`)]);
      setStudio(s);
      setReviews(r);
    } catch (err) {
      if (err.status === 404 || err.status === 400) setNotFound(true);
      else toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const images = useMemo(() => (studio ? [studio.image, ...(studio.gallery || [])] : []), [studio]);
  const startHour = Number(start.slice(0, 2));
  const maxHours = 23 - startHour; // booking must end by 23:00
  const hoursOptions = Array.from({ length: Math.min(maxHours, 8) }, (_, i) => i + 1);
  const safeHours = Math.min(hours, maxHours);
  const end = `${pad(startHour + safeHours)}:00`;
  const total = studio ? safeHours * studio.hourlyRate : 0;

  const isOwner = !!user && !!studio && studio.ownerEmail === user.email;
  const myReview = reviews.find((r) => r.userEmail === user?.email);

  const openBooking = () => {
    if (!user) {
      toast.info("Please log in to book a studio");
      router.push(`/login?redirect=${encodeURIComponent(`/studios/${id}`)}`);
      return;
    }
    setBookError("");
    setOpen(true);
  };

  const confirmBooking = async () => {
    setBookError("");
    setBooking(true);
    try {
      await api("/bookings", {
        method: "POST",
        body: { studioId: studio._id, date, startTime: start, endTime: end },
      });
      toast.success("Booking request sent! The host will confirm it soon.");
      setOpen(false);
      router.push("/my-bookings");
    } catch (err) {
      setBookError(err.message);
      toast.error(err.message);
    } finally {
      setBooking(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await api(`/studios/${id}/reviews`, { method: "POST", body: { rating, comment } });
      toast.success("Thanks for your review!");
      setComment("");
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid-bg px-4 py-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-3">
            <div className="skeleton h-96 w-full" />
            <div className="skeleton h-20 w-full" />
          </div>
          <div className="space-y-4 lg:col-span-2">
            <div className="skeleton h-10 w-3/4" />
            <div className="skeleton h-6 w-1/2" />
            <div className="skeleton h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !studio) {
    return (
      <div className="grid-bg px-4 py-24 text-center">
        <p className="mb-2 text-6xl">🛰️</p>
        <h2 className="section-title">Studio not found</h2>
        <p className="section-sub">This studio may have been removed by its host.</p>
        <Link href="/studios" className="btn btn-neon">
          Explore Studios
        </Link>
      </div>
    );
  }

  return (
    <div className="grid-bg px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* gallery */}
          <div className="lg:col-span-3">
            <div className="glass overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[active]} alt={studio.title} onError={onImgError} className="h-72 w-full object-cover md:h-[26rem]" />
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setActive(i)} className={`overflow-hidden rounded-lg border-2 transition ${i === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${studio.title} ${i + 1}`} onError={onImgError} className="h-16 w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* summary + booking card */}
          <div className="lg:col-span-2">
            <span className="badge badge-secondary mb-3">{studio.category}</span>
            <h1 className="text-3xl font-extrabold md:text-4xl">{studio.title}</h1>
            <p className="mt-3 flex items-center gap-2 opacity-80">
              <FaMapMarkerAlt className="text-primary" /> {studio.location}
            </p>
            <p className="mt-2 flex items-center gap-2">
              {studio.rating > 0 ? (
                <>
                  <Stars value={studio.rating} /> <span className="font-bold">{studio.rating}</span>
                  <span className="text-sm opacity-70">({studio.reviewCount || reviews.length} reviews)</span>
                </>
              ) : (
                <span className="badge badge-outline badge-primary">New studio · no reviews yet</span>
              )}
            </p>

            <div className="glass mt-6 p-6">
              <p>
                <span className="text-4xl font-extrabold text-primary">${studio.hourlyRate}</span>
                <span className="opacity-70"> / hour</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <FaShieldAlt className="text-primary" /> Security deposit: <b>${studio.securityDeposit}</b>
                </li>
                <li className="flex items-center gap-2">
                  <FaUsers className="text-primary" /> Up to <b>{studio.maxCapacity}</b> people
                </li>
              </ul>

              {isOwner ? (
                <div className="mt-6 space-y-2">
                  <p className="text-sm opacity-75">This is your studio.</p>
                  <Link href={`/studios/edit/${studio._id}`} className="btn btn-outline btn-primary w-full">
                    Update Studio
                  </Link>
                </div>
              ) : (
                <button onClick={openBooking} className="btn btn-neon btn-lg mt-6 w-full">
                  Book Now
                </button>
              )}
            </div>

            <div className="glass mt-4 flex items-center gap-3 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-content">
                {(studio.ownerName || "H")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xs opacity-60">Hosted by</p>
                <p className="font-bold">{studio.ownerName || "StudioSpace Host"}</p>
                <p className="text-xs opacity-70">{studio.ownerEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* overview + amenities */}
        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <div className="glass p-6 lg:col-span-3">
            <h2 className="mb-3 text-xl font-bold">About this studio</h2>
            <p className="whitespace-pre-line opacity-85">{studio.overview}</p>
          </div>
          <div className="glass p-6 lg:col-span-2">
            <h2 className="mb-3 text-xl font-bold">Amenities</h2>
            <ul className="space-y-2">
              {(studio.amenities || []).map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm">
                  <FaCheckCircle className="text-primary" /> {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* reviews */}
        <div className="mt-10">
          <h2 className="section-title !text-left">Reviews</h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-3">
              {reviews.length === 0 ? (
                <div className="glass p-8 text-center">
                  <p className="mb-2 text-4xl">💬</p>
                  <p className="font-bold">No reviews yet</p>
                  <p className="text-sm opacity-70">Be the first to share how your session went.</p>
                </div>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="glass p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">{r.userName}</p>
                      <Stars value={r.rating} size="text-sm" />
                    </div>
                    <p className="mt-2 text-sm opacity-85">{r.comment}</p>
                    <p className="mt-2 text-xs opacity-50">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>

            <div className="glass h-fit p-6 lg:col-span-2">
              <h3 className="mb-3 text-lg font-bold">Leave a review</h3>
              {!user ? (
                <p className="text-sm opacity-80">
                  <Link href={`/login?redirect=${encodeURIComponent(`/studios/${id}`)}`} className="font-bold text-primary hover:underline">
                    Log in
                  </Link>{" "}
                  to review this studio.
                </p>
              ) : isOwner ? (
                <p className="text-sm opacity-80">You cannot review your own studio.</p>
              ) : myReview ? (
                <p className="text-sm opacity-80">You already reviewed this studio. Thank you!</p>
              ) : (
                <form onSubmit={submitReview} className="space-y-3">
                  <div className="flex gap-1 text-2xl">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
                        <FaStar className={n <= rating ? "text-yellow-400" : "opacity-25"} />
                      </button>
                    ))}
                  </div>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} required minLength={3} maxLength={500} rows={4} placeholder="How was the space, lighting and sound?" className="textarea textarea-bordered w-full" />
                  <button type="submit" disabled={posting} className="btn btn-neon w-full">
                    {posting ? <span className="loading loading-spinner" /> : "Post Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* booking modal */}
      {open && (
        <dialog className="modal modal-open">
          <div className="modal-box glass max-w-md">
            <h3 className="text-xl font-bold">Book {studio.title}</h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm opacity-80">Date</span>
                <input type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value)} className="input input-bordered w-full" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-sm opacity-80">Start time</span>
                  <select value={start} onChange={(e) => setStart(e.target.value)} className="select select-bordered w-full">
                    {START_TIMES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm opacity-80">Duration</span>
                  <select value={safeHours} onChange={(e) => setHours(Number(e.target.value))} className="select select-bordered w-full">
                    {hoursOptions.map((h) => (
                      <option key={h} value={h}>
                        {h} {h === 1 ? "hour" : "hours"}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rounded-xl border border-primary/25 p-4 text-sm">
                <p className="flex justify-between">
                  <span className="opacity-70">Time</span>
                  <b>
                    {start} – {end}
                  </b>
                </p>
                <p className="mt-1 flex justify-between">
                  <span className="opacity-70">
                    ${studio.hourlyRate} × {safeHours}h
                  </span>
                  <b>${total}</b>
                </p>
                <p className="mt-1 flex justify-between">
                  <span className="opacity-70">Refundable deposit</span>
                  <b>${studio.securityDeposit}</b>
                </p>
              </div>

              {bookError && (
                <div role="alert" className="alert alert-error text-sm">
                  <span>{bookError}</span>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setOpen(false)} disabled={booking}>
                Cancel
              </button>
              <button className="btn btn-neon" onClick={confirmBooking} disabled={booking || !date}>
                {booking ? <span className="loading loading-spinner" /> : `Confirm · $${total}`}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => !booking && setOpen(false)} />
        </dialog>
      )}
    </div>
  );
}