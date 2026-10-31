"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCamera, FaSun, FaMoon, FaBars } from "react-icons/fa";

const links = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const pathname = usePathname();
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

  return (
    <header className="glass sticky top-0 z-50 rounded-none border-x-0 border-t-0">
      <div className="navbar max-w-7xl mx-auto px-4">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <FaBars />
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content glass mt-3 w-56 p-2 shadow z-10"
            >
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={pathname === l.href ? "text-primary font-bold" : ""}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/" className="flex items-center gap-2 text-2xl font-display font-bold">
            <FaCamera className="text-primary glow-pulse" />
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
                      ? "text-primary font-bold border-b-2 border-primary rounded-none bg-transparent"
                      : "hover:text-primary bg-transparent"
                  }
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar-end gap-2">
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle text-lg"
            aria-label="Toggle theme"
          >
            {theme === "studio-dark" ? <FaSun className="text-warning" /> : <FaMoon />}
          </button>
          <Link href="/login" className="btn btn-outline btn-primary btn-sm">
            Login
          </Link>
          <Link href="/register" className="btn btn-neon btn-sm">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}