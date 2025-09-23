"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/card";

export default function LoginSection() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else if (res?.ok) {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <section className="relative h-screen flex justify-center items-center px-4 bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      </div>

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-lg border border-green-100 rounded-2xl shadow-xl">
        {/* Decorative Gradient Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-lime-500 rounded-t-2xl opacity-80"></div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-600 mt-2 mb-6 text-center">
          Login to continue building with <span className="text-green-600 font-semibold">Jenga Safi</span>
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}

          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@mail.com"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-900 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 ease-in-out"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-900 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 ease-in-out"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 via-emerald-400 to-lime-500 text-white py-3 px-4 rounded-lg shadow-md hover:opacity-90 focus:ring-2 focus:ring-green-400 transition-all duration-300 ease-in-out disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup link */}
        <p className="mt-6 text-center text-gray-700">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-green-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </Card>
    </section>
  );
}
