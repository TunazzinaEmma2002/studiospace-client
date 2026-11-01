"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RequireAuth from "../components/RequireAuth";
import StudioForm from "../components/StudioForm";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";

function AddStudio() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const handleSubmit = async (payload) => {
    try {
      await api("/studios", { method: "POST", body: payload });
      toast.success("Studio added successfully!");
      router.push("/my-listings");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="grid-bg px-4 py-12">
      <StudioForm
        title="Add New Studio"
        subtitle="List your creative space and let creators book it by the hour."
        submitLabel="Add Studio"
        host={{ name: user?.name, email: user?.email }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default function AddStudioPage() {
  return (
    <RequireAuth>
      <AddStudio />
    </RequireAuth>
  );
}