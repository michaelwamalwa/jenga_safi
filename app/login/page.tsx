"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/card";

export default function LoginSection() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    setError(''); // Clear previous errors

    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError(res.error); // Display error message
    } else if (res?.ok) {
      router.push("/dashboard"); // Redirect on success
    }

    setLoading(false); // Reset loading state
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 text-black">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
        <p className="text-sm text-gray-500 mt-4 mb-6 text-center">
          Welcome back to Nexora
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Enter your password"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg shadow-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 ease-in-out disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

       
          <Link href="/signup" className="text-indigo-600 font-medium hover:underline">
            Sign up
          </Link>
      
      </Card>
    </div>
  );
}