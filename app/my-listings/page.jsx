"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RequireAuth from "../components/RequireAuth";
import { api } from "@/lib/api";

function MyListings() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setStudios(await api("/studios/mine"));
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api(`/studios/${toDelete._id}`, { method: "DELETE" });
      setStudios((list) => list.filter((s) => s._id !== toDelete._id));
      toast.success("Studio deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid-bg px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="section-title">My Studio Listings</h2>
        <p className="section-sub">Manage the spaces you host on StudioSpace.</p>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-20 w-full" />
            ))}
          </div>
        ) : studios.length === 0 ? (
          <div className="glass mx-auto max-w-lg p-10 text-center">
            <p className="mb-2 text-5xl">📷</p>
            <h3 className="text-xl font-bold">No studios listed yet</h3>
            <p className="mb-6 mt-2 opacity-75">List your first space and let creators book it by the hour.</p>
            <Link href="/add-studio" className="btn btn-neon">
              Add Your First Studio
            </Link>
          </div>
        ) : (
          <div className="glass overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Studio</th>
                  <th>Category</th>
                  <th>Rate</th>
                  <th>Location</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studios.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.image} alt={s.title} className="h-14 w-20 rounded-lg object-cover" />
                        <span className="font-bold">{s.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary badge-outline">{s.category}</span>
                    </td>
                    <td>${s.hourlyRate}/hr</td>
                    <td>{s.location}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Link href={`/studios/${s._id}`} className="btn btn-ghost btn-sm">
                          View
                        </Link>
                        <Link href={`/studios/edit/${s._id}`} className="btn btn-outline btn-primary btn-sm">
                          Update
                        </Link>
                        <button onClick={() => setToDelete(s)} className="btn btn-outline btn-error btn-sm">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toDelete && (
        <dialog className="modal modal-open">
          <div className="modal-box glass">
            <h3 className="text-xl font-bold text-error">Delete this studio?</h3>
            <p className="py-4">
              &ldquo;{toDelete.title}&rdquo; will be permanently removed. This cannot be undone.
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setToDelete(null)} disabled={deleting}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={confirmDelete} disabled={deleting}>
                {deleting ? <span className="loading loading-spinner" /> : "Yes, delete"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => !deleting && setToDelete(null)} />
        </dialog>
      )}
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <RequireAuth>
      <MyListings />
    </RequireAuth>
  );
}