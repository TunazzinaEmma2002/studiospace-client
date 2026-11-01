"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { FaSearch } from "react-icons/fa";
import StudioCard from "../components/StudioCard";
import StudioCardSkeleton from "../components/StudioCardSkeleton";
import { CATEGORIES } from "@/lib/constants";
import { api } from "@/lib/api";

function Explore() {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("category") || "";
  const q = params.get("q") || "";
  const sort = params.get("sort") || "newest";

  const [search, setSearch] = useState(q);
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Put a filter into the URL (so /studios?category=... links work and survive reload)
  const setParam = (key, value) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/studios${next.toString() ? `?${next}` : ""}`, { scroll: false });
  };

  // Search box: wait a moment after typing before searching
  useEffect(() => {
    if (search === q) return;
    const t = setTimeout(() => setParam("q", search.trim()), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (category) qs.set("category", category);
        if (q) qs.set("search", q);
        if (sort) qs.set("sort", sort);
        const data = await api(`/studios?${qs}`);
        if (!ignore) setStudios(data);
      } catch (err) {
        if (!ignore) toast.error(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [category, q, sort]);

  const clearAll = () => {
    setSearch("");
    router.replace("/studios", { scroll: false });
  };

  return (
    <div className="grid-bg px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="section-title">Explore Studios</h1>
        <p className="section-sub">Find the perfect room to shoot, record or create in.</p>

        <div className="glass mb-6 flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <label className="input input-bordered flex flex-1 items-center gap-2">
            <FaSearch className="opacity-60" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search studios by name..."
              className="grow"
            />
          </label>
          <select
            value={sort}
            onChange={(e) => setParam("sort", e.target.value === "newest" ? "" : e.target.value)}
            className="select select-bordered md:w-56"
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          <button onClick={() => setParam("category", "")} className={`btn btn-sm ${!category ? "btn-neon" : "btn-outline btn-primary"}`}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setParam("category", c)} className={`btn btn-sm ${category === c ? "btn-neon" : "btn-outline btn-primary"}`}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        ) : studios.length === 0 ? (
          <div className="glass mx-auto max-w-lg p-10 text-center">
            <p className="mb-2 text-5xl">🔭</p>
            <h3 className="text-xl font-bold">No studios found</h3>
            <p className="mb-6 mt-2 opacity-75">Try a different search or category.</p>
            <button onClick={clearAll} className="btn btn-neon">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm opacity-70">
              {studios.length} {studios.length === 1 ? "studio" : "studios"} found
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {studios.map((s) => (
                <StudioCard key={s._id} studio={s} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Explore />
    </Suspense>
  );
}