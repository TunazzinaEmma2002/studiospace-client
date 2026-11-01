"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaWarehouse, FaTicketAlt, FaInbox, FaPlus } from "react-icons/fa";
import RequireAuth from "../components/RequireAuth";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";

function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const [data, setData] = useState({ studios: [], bookings: [], requests: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, b, r] = await Promise.allSettled([api("/studios/mine"), api("/bookings/mine"), api("/bookings/requests")]);
      setData({
        studios: s.status === "fulfilled" ? s.value : [],
        bookings: b.status === "fulfilled" ? b.value : [],
        requests: r.status === "fulfilled" ? r.value : [],
      });
      setLoading(false);
    })();
  }, []);

  const pending = data.requests.filter((r) => r.status === "Pending").length;
  const earned = data.requests.filter((r) => r.status === "Confirmed" || r.status === "Completed").reduce((sum, r) => sum + r.totalPrice, 0);

  const stats = [
    { label: "My studios", value: data.studios.length, Icon: FaWarehouse, href: "/my-listings" },
    { label: "My bookings", value: data.bookings.length, Icon: FaTicketAlt, href: "/my-bookings" },
    { label: "Pending requests", value: pending, Icon: FaInbox, href: "/my-bookings" },
  ];

  return (
    <div className="grid-bg px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="section-title">Dashboard</h1>
        <p className="section-sub">Welcome back, {user?.name || "creator"}. Here is your StudioSpace at a glance.</p>

        <div className="grid gap-5 sm:grid-cols-3">
          {stats.map(({ label, value, Icon, href }) => (
            <Link key={label} href={href} className="glass flex items-center gap-4 p-6 transition hover:-translate-y-1 hover:border-primary">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-2xl text-primary">
                <Icon />
              </span>
              <div>
                {loading ? <div className="skeleton h-8 w-12" /> : <p className="text-3xl font-extrabold">{value}</p>}
                <p className="text-sm opacity-70">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="glass mt-6 p-6">
          <p className="text-sm opacity-70">Confirmed earnings from your studios</p>
          <p className="neon-text text-4xl font-extrabold">${loading ? "…" : earned}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/add-studio" className="btn btn-neon gap-2">
            <FaPlus /> Add New Studio
          </Link>
          <Link href="/studios" className="btn btn-outline btn-primary">
            Explore Studios
          </Link>
          <Link href="/my-bookings" className="btn btn-outline btn-primary">
            Manage Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}