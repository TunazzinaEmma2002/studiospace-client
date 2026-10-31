"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

function validatePassword(pw) {
  if (pw.length < 6) return "Password must be at least 6 characters long";
  if (!/[A-Z]/.test(pw)) return "Password must have an uppercase letter";
  if (!/[a-z]/.test(pw)) return "Password must have a lowercase letter";
  return "";
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pwError, setPwError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name")).trim();
    const email = String(form.get("email")).trim();
    const photo = String(form.get("photo")).trim();
    const password = String(form.get("password"));

    const err = validatePassword(password);
    if (err) {
      setPwError(err);
      toast.error(err);
      return;
    }
    setPwError("");

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      image: photo || undefined,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Registration failed. Please try again.");
      return;
    }
    toast.success("Account created! Please log in.");
    router.push("/login");
  };

  const handleGoogle = async () => {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    if (error) toast.error(error.message || "Google sign-in failed");
  };

  return (
    <div className="grid-bg flex min-h-[calc(100svh_-_4.5rem)] items-center justify-center px-4 py-12">
      <div className="glass w-full max-w-md p-8">
        <h2 className="section-title">Create Your Account</h2>
        <p className="section-sub !mb-6">Join StudioSpace and start booking or hosting studios.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm opacity-80">Full Name</span>
            <input name="name" type="text" required placeholder="Your name" className="input input-bordered w-full" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm opacity-80">Email</span>
            <input name="email" type="email" required placeholder="you@example.com" className="input input-bordered w-full" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm opacity-80">Photo URL</span>
            <input name="photo" type="url" placeholder="https://..." className="input input-bordered w-full" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm opacity-80">Password</span>
            <input
              name="password"
              type="password"
              required
              placeholder="Min 6 chars, upper + lower case"
              className={`input input-bordered w-full ${pwError ? "input-error" : ""}`}
            />
            {pwError && <span className="mt-1 block text-sm text-error">{pwError}</span>}
          </label>

          <button type="submit" disabled={loading} className="btn btn-neon w-full">
            {loading ? <span className="loading loading-spinner" /> : "Register"}
          </button>
        </form>

        <div className="divider my-6 text-sm opacity-70">OR</div>

        <button onClick={handleGoogle} type="button" className="btn btn-outline w-full gap-2">
          <FcGoogle className="text-xl" /> Continue with Google
        </button>

        <p className="mt-6 text-center text-sm opacity-80">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}