import Link from "next/link";
import { FaCamera, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const social =
  "btn btn-circle btn-sm btn-ghost border border-primary/40 hover:border-primary hover:text-primary";

export default function Footer() {
  return (
    <footer className="glass rounded-none border-x-0 border-b-0 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 text-2xl font-display font-bold">
            <FaCamera className="text-primary" />
            <span className="neon-text">StudioSpace</span>
          </Link>
          <p className="mt-3 opacity-75">
            Our mission is to put every creator in the right room. Book
            verified studios by the hour, then shoot, record and create.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" aria-label="X" className={social}><FaXTwitter /></a>
            <a href="#" aria-label="Facebook" className={social}><FaFacebookF /></a>
            <a href="#" aria-label="Instagram" className={social}><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn" className={social}><FaLinkedinIn /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-primary mb-3">Quick Links</h4>
          <ul className="space-y-2 opacity-80">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/studios" className="hover:text-primary">Explore Studios</Link></li>
            <li><Link href="/how-it-works" className="hover:text-primary">How It Works</Link></li>
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-primary mb-3">Popular Categories</h4>
          <ul className="space-y-2 opacity-80">
            <li><Link href="/studios?category=Photo Studio" className="hover:text-primary">Photo Studios</Link></li>
            <li><Link href="/studios?category=Film Stage" className="hover:text-primary">Sound Stages</Link></li>
            <li><Link href="/studios?category=Podcast Lounge" className="hover:text-primary">Podcast Rooms</Link></li>
            <li><Link href="/studios?category=Music Suite" className="hover:text-primary">Music Suites</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-primary mb-3">Newsletter</h4>
          <p className="opacity-75 mb-3">New studios and creator tips, once a month.</p>
          <div className="join w-full">
            <input
              type="email"
              placeholder="your@email.com"
              className="input input-bordered join-item w-full"
            />
            <button className="btn btn-neon join-item">Join</button>
          </div>
        </div>
      </div>

      <div className="border-t border-primary/20 text-center text-sm py-4 opacity-70">
        © 2026 StudioSpace. All rights reserved. Terms &amp; Privacy apply.
      </div>
    </footer>
  );
}