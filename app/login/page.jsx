"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

// Only allow redirects to pages inside this site
function getRedirect() {
  const r = new URLSearchParams(window.location.search).get("redirect");
  return r && r.startsWith("/") && !r.startsWith("//") ? r : "/";
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));

    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Login failed. Check your email and password.");
      return;
    }
    toast.success("Welcome back!");
    router.push(getRedirect());
  };

  const handleGoogle = async () => {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: getRedirect() });
    if (error) toast.error(error.message || "Google sign-in failed");
  };

  return (
    <div className="grid-bg flex min-h-[calc(100svh_-_4.5rem)] items-center justify-center px-4 py-12">
      <div className="glass w-full max-w-md p-8">
        <h2 className="section-title">Welcome Back</h2>
        <p className="section-sub !mb-6">Log in to manage your studios and bookings.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm opacity-80">Email</span>
            <input name="email" type="email" required placeholder="you@example.com" className="input input-bordered w-full" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm opacity-80">Password</span>
            <input name="password" type="password" required placeholder="Your password" className="input input-bordered w-full" />
          </label>

          <div className="text-right">
            <button
              type="button"
              onClick={() => toast.info("Password reset is coming soon")}
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn btn-neon w-full">
            {loading ? <span className="loading loading-spinner" /> : "Login"}
          </button>
        </form>

        <div className="divider my-6 text-sm opacity-70">OR</div>

        <button onClick={handleGoogle} type="button" className="btn btn-outline w-full gap-2">
          <FcGoogle className="text-xl" /> Continue with Google
        </button>

        <p className="mt-6 text-center text-sm opacity-80">
          New to StudioSpace?{" "}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}