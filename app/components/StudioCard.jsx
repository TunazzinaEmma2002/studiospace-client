"use client";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { onImgError } from "@/lib/placeholder";

// Every card has the same height: fixed image, clamped text, button pinned to the bottom
export default function StudioCard({ studio }) {
  return (
    <div className="glass flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]">
      <div className="relative h-48 w-full shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={studio.image} alt={studio.title} onError={onImgError} className="h-full w-full object-cover" />
        <span className="badge badge-secondary absolute left-3 top-3">{studio.category}</span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white">
          {studio.rating > 0 ? (
            <>
              <FaStar className="text-yellow-400" /> {studio.rating}
            </>
          ) : (
            "New"
          )}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-1 text-lg font-bold">{studio.title}</h3>
        <p className="flex items-center gap-2 text-sm opacity-75">
          <FaMapMarkerAlt className="shrink-0 text-primary" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>
        <p className="line-clamp-2 text-sm opacity-70">{studio.overview}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <p>
            <span className="text-xl font-extrabold text-primary">${studio.hourlyRate}</span>
            <span className="text-sm opacity-70"> / hour</span>
          </p>
          <span className="flex items-center gap-1 text-sm opacity-75">
            <FaUsers /> {studio.maxCapacity}
          </span>
        </div>

        <Link href={`/studios/${studio._id}`} className="btn btn-neon w-full">
          View Details
        </Link>
      </div>
    </div>
  );
}