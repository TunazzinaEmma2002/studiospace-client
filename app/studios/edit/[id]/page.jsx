"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RequireAuth from "../../../components/RequireAuth";
import StudioForm from "../../../components/StudioForm";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";

function EditStudio() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return; // wait until we know who is logged in
    (async () => {
      try {
        const data = await api(`/studios/${id}`);
        if (data.ownerEmail !== user?.email) {
          toast.error("You can only edit your own studios");
          router.replace("/my-listings");
          return;
        }
        setStudio(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user?.email, router]);

  const handleSubmit = async (payload) => {
    try {
      await api(`/studios/${id}`, { method: "PUT", body: payload });
      toast.success("Studio updated successfully!");
      router.push("/my-listings");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="grid-bg px-4 py-12">
        <div className="glass mx-auto max-w-4xl space-y-4 p-10">
          <div className="skeleton h-10 w-1/2" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="grid-bg px-4 py-20 text-center">
        <h2 className="section-title">Studio not found</h2>
        <Link href="/my-listings" className="btn btn-neon mt-6">
          Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="grid-bg px-4 py-12">
      <StudioForm
        initial={studio}
        title="Update Studio"
        subtitle="Change anything about your listing and save."
        submitLabel="Save Changes"
        host={{ name: user?.name, email: user?.email }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default function EditStudioPage() {
  return (
    <RequireAuth>
      <EditStudio />
    </RequireAuth>
  );
}