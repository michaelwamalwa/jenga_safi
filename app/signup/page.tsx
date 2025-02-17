"use client";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/actions/signup";
import Card from "@/components/ui/card";

export default function SignupSection() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true); // Set loading to true
    setError(""); // Clear previous errors

    const r = await signup({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
    });

    ref.current?.reset();
    if (r?.error) {
      setError(r.error);
    } else {
      router.push("/login");
    }

    setLoading(false); // Reset loading state
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 text-black">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <p className="text-sm text-gray-500 mt-4 mb-6 text-center">
          Join us today and start your journey to excellence.
        </p>

        <form
          ref={ref}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(ref.current!));
          }}
          className="space-y-6"
        >
          <div className="relative">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your full name"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@mail.com"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a strong password"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg shadow-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 ease-in-out disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-medium hover:underline">
            Log In
          </Link>
        </p>
      </Card>
    </div>
  );
}