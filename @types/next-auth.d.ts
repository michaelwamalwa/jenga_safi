import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user"; // Add the role field
  }

  interface Session {
    user: User;
  }
}
