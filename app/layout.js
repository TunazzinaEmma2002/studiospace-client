import "./globals.css";
import { Orbitron, Rajdhani } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "sonner";

const display = Orbitron({ subsets: ["latin"], variable: "--font-display" });
const body = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata = {
  title: "StudioSpace | Creative Studio Booking",
  description:
    "Discover and book photo studios, sound stages, podcast rooms and music suites by the hour.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="studio-dark"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable}`}
    >
      <body className="min-h-screen flex flex-col text-lg">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}