"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaCamera, FaSun, FaMoon, FaBars } from "react-icons/fa";
import { useSession, signOut } from "@/lib/auth-client";

const links = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const userLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/add-studio", label: "Add New Studio" },
  { href: "/my-listings", label: "My Studio Listings" },
  { href: "/my-bookings", label: "My Bookings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [theme, setTheme] = useState("studio-dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "studio-dark";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "studio-dark" ? "studio-light" : "studio-dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const closeMenu = () => document.activeElement?.blur();

  const handleLogout = async () => {
    closeMenu();
    await fetch("/server/logout", { method: "POST" }).catch(() => {});
    await signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <header className="glass sticky top-0 z-50 rounded-none border-x-0 border-t-0">
      <div className="navbar mx-auto max-w-7xl px-4">
        <div className="navbar-start min-w-0 max-lg:w-auto! max-lg:flex-1">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm px-2 lg:hidden">
              <FaBars />
            </div>
                      <ul tabIndex={0} className="menu dropdown-content z-10 mt-3 w-56 rounded-box border border-primary/30 bg-base-100 p-2 shadow-xl">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={closeMenu}
                    className={pathname === l.href ? "font-bold text-primary" : "text-base-content"}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              {!user && !isPending && (
                <li className="sm:hidden">
                  <Link href="/login" onClick={closeMenu}>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold sm:text-2xl">
            <FaCamera className="glow-pulse text-primary" />
            <span className="neon-text">StudioSpace</span>
          </Link>
        </div>

        <nav className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 text-base">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={
                    pathname === l.href
                      ? "rounded-none border-b-2 border-primary bg-transparent font-bold text-primary"
                      : "bg-transparent hover:text-primary"
                  }
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar-end gap-1 sm:gap-2 max-lg:w-auto! max-lg:flex-none">
          <button onClick={toggleTheme} className="btn btn-ghost btn-circle text-lg" aria-label="Toggle theme">
            {theme === "studio-dark" ? <FaSun className="text-warning" /> : <FaMoon />}
          </button>

          {isPending ? (
            <span className="skeleton h-10 w-24 rounded-full" />
          ) : user ? (
            <div className="dropdown dropdown-end dropdown-hover">
              <div tabIndex={0} role="button" className="avatar cursor-pointer">
                <div className="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt={user.name || "User"} referrerPolicy="no-referrer" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-primary text-lg font-bold text-primary-content">
                      {(user.name || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <ul tabIndex={0} className="menu dropdown-content glass z-10 mt-2 w-60 p-2 shadow">
                <li className="pointer-events-none px-3 py-2">
                  <span className="block font-bold text-primary">{user.name}</span>
                  <span className="block text-xs opacity-70">{user.email}</span>
                </li>
                <div className="divider my-0" />
                {userLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={closeMenu}>
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline btn-primary btn-sm hidden sm:inline-flex">
                Login
              </Link>
              <Link href="/register" className="btn btn-neon btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}