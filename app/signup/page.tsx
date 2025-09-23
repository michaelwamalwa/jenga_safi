"use client";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/actions/signup";
import Card from "@/components/ui/card";

export default function SignupSection() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError("");

    const r = await signup({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
    });

    if (r?.error) {
      setError(r.error);
    } else {
      ref.current?.reset();
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <section className="relative h-screen flex justify-center items-center px-4 bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-green-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      </div>

      {/* Signup Card */}
      <Card className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-lg border border-green-100 rounded-2xl shadow-xl">
        {/* Decorative Gradient Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-lime-500 rounded-t-2xl opacity-80"></div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Create Your Account
        </h2>
        <p className="text-sm text-gray-600 mt-2 mb-6 text-center">
          Start building smarter with{" "}
          <span className="text-green-600 font-semibold">JengaSafi</span>
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form
          ref={ref}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(ref.current!));
          }}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your full name"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-900 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 ease-in-out"
              required
            />
          </div>

          <div>
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
            />
          </div>

          <div>
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
              placeholder="Create a strong password"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-900 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 ease-in-out"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 via-emerald-400 to-lime-500 text-white py-3 px-4 rounded-lg shadow-md hover:opacity-90 focus:ring-2 focus:ring-green-400 transition-all duration-300 ease-in-out disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-gray-700">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green-600 font-medium hover:underline"
          >
            Log In
          </Link>
        </p>
      </Card>
    </section>
  );
}
