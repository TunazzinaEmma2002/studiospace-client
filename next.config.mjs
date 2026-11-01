/** @type {import('next').NextConfig} */
const nextConfig = {
  // The browser talks to /server/... on its own domain; Next forwards it to the Express server.
  // This keeps the JWT cookie first-party, so it works on localhost and on the live site.
  async rewrites() {
    return [
      {
        source: "/server/:path*",
        destination: `${process.env.API_URL || "http://localhost:5000"}/:path*`,
      },
    ];
  },
};

export default nextConfig;