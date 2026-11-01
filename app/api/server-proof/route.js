import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Gives a logged-in user a short-lived proof that the Express server can verify
export async function GET() {
  if (!process.env.JWT_SECRET) {
    return Response.json({ message: "JWT_SECRET is missing in .env.local" }, { status: 500 });
  }
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ message: "Not logged in" }, { status: 401 });
  }
  const proof = jwt.sign(
    { type: "proof", email: session.user.email, name: session.user.name },
    process.env.JWT_SECRET,
    { audience: "studiospace-server", expiresIn: "60s" }
  );
  return Response.json({ proof });
}