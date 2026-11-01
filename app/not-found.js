import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid-bg flex min-h-[calc(100svh_-_4.5rem)] items-center justify-center px-4 py-16">
      <div className="glass max-w-lg p-10 text-center">
        <p className="neon-text text-8xl font-black">404</p>
        <h1 className="mt-2 text-2xl font-bold">Signal lost</h1>
        <p className="mb-8 mt-3 opacity-75">
          This scene is not on the schedule. The page you are looking for moved, or never existed.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-neon">
            Back to Home
          </Link>
          <Link href="/studios" className="btn btn-outline btn-primary">
            Explore Studios
          </Link>
        </div>
      </div>
    </div>
  );
}