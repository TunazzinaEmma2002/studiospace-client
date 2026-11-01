"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import StudioCard from "./StudioCard";
import StudioCardSkeleton from "./StudioCardSkeleton";
import { api } from "@/lib/api";

export default function FeaturedStudios() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setStudios(await api("/studios/featured"));
      } catch {
        setStudios([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="grid-bg px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="section-title">Featured Studios</h2>
        <p className="section-sub">Fresh, creator-ready spaces hand-picked from our latest listings.</p>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        ) : studios.length === 0 ? (
          <div className="glass mx-auto max-w-lg p-10 text-center">
            <p className="mb-2 text-5xl">🎬</p>
            <h3 className="text-xl font-bold">No studios yet</h3>
            <p className="mb-6 mt-2 opacity-75">Be the first host on StudioSpace and list your space.</p>
            <Link href="/add-studio" className="btn btn-neon">
              Host Your Space
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {studios.map((s) => (
                <StudioCard key={s._id} studio={s} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/studios" className="btn btn-outline btn-primary">
                View All Studios
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}