# StudioSpace

A peer-to-peer creative studio booking platform. Creators book photo studios, sound stages, podcast rooms, music suites and art workshops by the hour, and hosts list and manage their own spaces.

**Live site:** https://studiospace-client-lake.vercel.app
**Server API:** https://studiospace-server-black.vercel.app
**Server repo:** https://github.com/TunazzinaEmma2002/studiospace-server

## Test credentials

| Role | Email | Password |
|---|---|---|
| Examiner | examiner@studiospace.com | Examiner123 |

You can also register a new account.

## Key features

- **Cinematic anime-style home page** with a Swiper hero, featured studios from MongoDB, category browsing, "How Booking Works" and "Host Guarantee" sections.
- **Authentication** with BetterAuth: email and password (uppercase, lowercase and 6+ characters enforced). Logged-in users stay logged in after a page reload.
- **Explore Studios** with search, category filter, price sorting, equal-height cards and loading skeletons.
- **Studio details** with an image gallery, amenities, host info, reviews and star ratings.
- **Booking with double-booking prevention**: overlapping slots are rejected when a host confirms a booking.
- **Host tools**: add, update and delete studios (with a confirmation modal), and confirm, decline or complete booking requests.
- **My Bookings** with status badges (Pending, Confirmed, Completed, Cancelled) and a cancel option for Pending bookings.
- **JWT in HTTPOnly cookies**: the Express server issues the JWT, protects private routes and returns 401 for unauthenticated requests.
- **Light and dark theme toggle**, custom 404 page, empty states and Sonner toast notifications.
- Fully responsive layout.

## Tech stack

- Next.js 16 (App Router), React, Tailwind CSS 4, daisyUI 5
- BetterAuth with the MongoDB adapter
- Swiper, Sonner, React Icons
- Express and MongoDB Atlas (server repo), JSON Web Tokens

## Run locally

1. Clone the repo and install packages:
   ```bash
   git clone https://github.com/TunazzinaEmma2002/studiospace-client.git
   cd studiospace-client
   npm install
   ```
2. Create a `.env.local` file:
   ```
   MONGODB_URI=your_mongodb_connection_string
   BETTER_AUTH_SECRET=a_long_random_string
   BETTER_AUTH_URL=http://localhost:3000
   JWT_SECRET=the_same_secret_as_the_server
   API_URL=http://localhost:5000
   NEXT_PUBLIC_IMGBB_KEY=your_imgbb_key
   ```
3. Start the server from the server repo (`node index.js`), then start the client:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000