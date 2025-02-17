import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// Ensure environment variables are set
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };