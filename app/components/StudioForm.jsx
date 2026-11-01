"use client";
import { useState } from "react";
import { toast } from "sonner";
import { AMENITIES, CATEGORIES } from "@/lib/constants";

const empty = {
  title: "",
  category: CATEGORIES[0],
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  image: "",
  galleryText: "",
  amenities: [],
  overview: "",
};

// Used by both Add Studio and Update Studio. `initial` pre-fills the form for updates.
export default function StudioForm({ initial, host, title, subtitle, submitLabel, onSubmit }) {
  const [form, setForm] = useState(() =>
    initial
      ? { ...empty, ...initial, galleryText: (initial.gallery || []).join("\n") }
      : empty
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleAmenity = (name) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(name)
        ? f.amenities.filter((a) => a !== name)
        : [...f.amenities, name],
    }));

  // Image upload with imgbb (needs NEXT_PUBLIC_IMGBB_KEY). Pasting an image URL works too.
  const uploadImage = async (file) => {
    if (!file) return;
    const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
    if (!key) {
      toast.error("Image upload key is not set. Paste an image URL instead.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || "Upload failed");
      set("image", data.data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      toast.error("Please add a studio image (upload or paste a URL)");
      return;
    }
    if (form.amenities.length === 0) {
      toast.error("Please select at least one amenity");
      return;
    }
    const payload = {
      title: form.title.trim(),
      category: form.category,
      hourlyRate: Number(form.hourlyRate),
      securityDeposit: Number(form.securityDeposit) || 0,
      maxCapacity: Number(form.maxCapacity) || 1,
      location: form.location.trim(),
      image: form.image.trim(),
      gallery: form.galleryText.split("\n").map((l) => l.trim()).filter(Boolean),
      amenities: form.amenities,
      overview: form.overview.trim(),
    };
    setSaving(true);
    await onSubmit(payload);
    setSaving(false);
  };

  return (
    <div className="glass mx-auto w-full max-w-4xl p-6 md:p-10">
      <h2 className="section-title">{title}</h2>
      <p className="section-sub !mb-8">{subtitle}</p>

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-1 block text-sm opacity-80">Studio Title</span>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="e.g. Neon Loft Photo Studio" className="input input-bordered w-full" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm opacity-80">Category</span>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className="select select-bordered w-full">
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm opacity-80">Location / Address</span>
          <input value={form.location} onChange={(e) => set("location", e.target.value)} required placeholder="Street, City" className="input input-bordered w-full" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm opacity-80">Hourly Rate ($)</span>
          <input type="number" min="1" step="any" value={form.hourlyRate} onChange={(e) => set("hourlyRate", e.target.value)} required placeholder="40" className="input input-bordered w-full" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm opacity-80">Security Deposit ($)</span>
          <input type="number" min="0" step="any" value={form.securityDeposit} onChange={(e) => set("securityDeposit", e.target.value)} required placeholder="100" className="input input-bordered w-full" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm opacity-80">Max Capacity (people)</span>
          <input type="number" min="1" value={form.maxCapacity} onChange={(e) => set("maxCapacity", e.target.value)} required placeholder="8" className="input input-bordered w-full" />
        </label>

        <div className="block">
          <span className="mb-1 block text-sm opacity-80">Main Image</span>
          <div className="flex gap-2">
            <input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="Paste image URL" className="input input-bordered w-full" />
            <label className={`btn btn-outline btn-primary ${uploading ? "btn-disabled" : ""}`}>
              {uploading ? <span className="loading loading-spinner loading-sm" /> : "Upload"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0])} />
            </label>
          </div>
        </div>

        {form.image && (
          <div className="md:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image} alt="Studio preview" className="h-48 w-full rounded-xl object-cover md:w-80" />
          </div>
        )}

        <label className="block md:col-span-2">
          <span className="mb-1 block text-sm opacity-80">Extra Gallery Images (optional, one URL per line)</span>
          <textarea value={form.galleryText} onChange={(e) => set("galleryText", e.target.value)} rows={3} placeholder="https://...&#10;https://..." className="textarea textarea-bordered w-full" />
        </label>

        <fieldset className="md:col-span-2">
          <legend className="mb-2 text-sm opacity-80">Amenities</legend>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {AMENITIES.map((a) => (
              <label key={a} className="flex cursor-pointer items-center gap-2 rounded-lg border border-primary/20 px-3 py-2 hover:border-primary">
                <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="checkbox checkbox-primary checkbox-sm" />
                <span className="text-sm">{a}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block md:col-span-2">
          <span className="mb-1 block text-sm opacity-80">Detailed Overview</span>
          <textarea value={form.overview} onChange={(e) => set("overview", e.target.value)} required rows={5} placeholder="Describe the space, the equipment and who it is great for" className="textarea textarea-bordered w-full" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm opacity-80">Host Name</span>
          <input value={host?.name || ""} readOnly className="input input-bordered w-full opacity-70" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm opacity-80">Host Email</span>
          <input value={host?.email || ""} readOnly className="input input-bordered w-full opacity-70" />
        </label>

        <button type="submit" disabled={saving || uploading} className="btn btn-neon btn-lg md:col-span-2">
          {saving ? <span className="loading loading-spinner" /> : submitLabel}
        </button>
      </form>
    </div>
  );
}