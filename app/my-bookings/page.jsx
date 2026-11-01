"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import RequireAuth from "../components/RequireAuth";
import { api } from "@/lib/api";
import { onImgError } from "@/lib/placeholder";

const badge = {
  Pending: "badge-warning",
  Confirmed: "badge-success",
  Completed: "badge-info",
  Cancelled: "badge-error",
};

function BookingCard({ b, mode, busy, onCancel, onStatus }) {
  return (
    <div className="glass flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={b.studioImage} alt={b.studioTitle} onError={onImgError} className="h-28 w-full rounded-xl object-cover sm:w-40" />

      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/studios/${b.studioId}`} className="text-lg font-bold hover:text-primary">
            {b.studioTitle}
          </Link>
          <span className={`badge ${badge[b.status] || "badge-ghost"}`}>{b.status}</span>
        </div>
        <p className="flex items-center gap-2 text-sm opacity-80">
          <FaCalendarAlt className="text-primary" /> {b.date}
          <FaClock className="ml-2 text-primary" /> {b.startTime} – {b.endTime} ({b.hours}h)
        </p>
        <p className="flex items-center gap-2 text-sm opacity-70">
          <FaMapMarkerAlt className="text-primary" /> {b.location}
        </p>
        {mode === "requests" && (
          <p className="text-sm opacity-80">
            Guest: <b>{b.userName}</b> · {b.userEmail}
          </p>
        )}
      </div>

      <div className="flex flex-col items-start gap-2 sm:items-end">
        <p className="text-2xl font-extrabold text-primary">${b.totalPrice}</p>
        <p className="text-xs opacity-60">+ ${b.securityDeposit} deposit</p>

        {mode === "mine" && b.status === "Pending" && (
          <button onClick={() => onCancel(b)} disabled={busy} className="btn btn-outline btn-error btn-sm">
            Cancel
          </button>
        )}

        {mode === "requests" && (
          <div className="flex flex-wrap gap-2">
            {b.status === "Pending" && (
              <>
                <button onClick={() => onStatus(b, "Confirmed")} disabled={busy} className="btn btn-success btn-sm">
                  Confirm
                </button>
                <button onClick={() => onStatus(b, "Cancelled")} disabled={busy} className="btn btn-outline btn-error btn-sm">
                  Decline
                </button>
              </>
            )}
            {b.status === "Confirmed" && (
              <button onClick={() => onStatus(b, "Completed")} disabled={busy} className="btn btn-info btn-sm">
                Mark Completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MyBookings() {
  const [tab, setTab] = useState("mine");
  const [mine, setMine] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toCancel, setToCancel] = useState(null);

  const load = useCallback(async () => {
    try {
      const [m, r] = await Promise.all([api("/bookings/mine"), api("/bookings/requests")]);
      setMine(m);
      setRequests(r);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const confirmCancel = async () => {
    setBusy(true);
    try {
      await api(`/bookings/${toCancel._id}/cancel`, { method: "PATCH" });
      toast.success("Booking cancelled");
      setToCancel(null);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = async (b, status) => {
    setBusy(true);
    try {
      await api(`/bookings/${b._id}/status`, { method: "PATCH", body: { status } });
      toast.success(status === "Confirmed" ? "Booking confirmed" : `Booking marked ${status.toLowerCase()}`);
      await load();
    } catch (err) {
      toast.error(err.message); // e.g. double-booking conflict
    } finally {
      setBusy(false);
    }
  };

  const list = tab === "mine" ? mine : requests;
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;

  return (
    <div className="grid-bg px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="section-title">My Bookings</h1>
        <p className="section-sub">Track your sessions and manage requests for your own studios.</p>

        <div role="tablist" className="tabs tabs-box mx-auto mb-8 w-fit">
          <button role="tab" onClick={() => setTab("mine")} className={`tab ${tab === "mine" ? "tab-active" : ""}`}>
            My Bookings ({mine.length})
          </button>
          <button role="tab" onClick={() => setTab("requests")} className={`tab ${tab === "requests" ? "tab-active" : ""}`}>
            Booking Requests ({requests.length})
            {pendingRequests > 0 && <span className="badge badge-warning badge-sm ml-2">{pendingRequests} new</span>}
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-36 w-full" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="glass mx-auto max-w-lg p-10 text-center">
            <p className="mb-2 text-5xl">{tab === "mine" ? "🎟️" : "📬"}</p>
            <h3 className="text-xl font-bold">{tab === "mine" ? "No bookings yet" : "No booking requests yet"}</h3>
            <p className="mb-6 mt-2 opacity-75">
              {tab === "mine" ? "Find a studio and reserve your first session." : "When someone books one of your studios, it shows up here."}
            </p>
            <Link href={tab === "mine" ? "/studios" : "/add-studio"} className="btn btn-neon">
              {tab === "mine" ? "Explore Studios" : "Add a Studio"}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((b) => (
              <BookingCard key={b._id} b={b} mode={tab} busy={busy} onCancel={setToCancel} onStatus={changeStatus} />
            ))}
          </div>
        )}
      </div>

      {toCancel && (
        <dialog className="modal modal-open">
          <div className="modal-box glass">
            <h3 className="text-xl font-bold text-error">Cancel this booking?</h3>
            <p className="py-4">
              Your request for &ldquo;{toCancel.studioTitle}&rdquo; on {toCancel.date} ({toCancel.startTime} – {toCancel.endTime}) will be cancelled.
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setToCancel(null)} disabled={busy}>
                Keep it
              </button>
              <button className="btn btn-error" onClick={confirmCancel} disabled={busy}>
                {busy ? <span className="loading loading-spinner" /> : "Yes, cancel"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => !busy && setToCancel(null)} />
        </dialog>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <RequireAuth>
      <MyBookings />
    </RequireAuth>
  );
}