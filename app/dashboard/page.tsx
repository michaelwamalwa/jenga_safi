"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { status, data: session } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("Session Data:", session); // Debugging
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      setActiveTab("dashboard");
    }
  }, [status, router, session]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      signOut({ redirect: false }).then(() => router.push("/login"));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-2xl font-semibold">Nexora</h2>
        </div>
        <nav className="flex-grow px-4 py-6 space-y-4">
          <button 
            className={`block w-full text-left py-2 px-4 rounded transition-all duration-300 ease-in-out hover:bg-gray-600 ${
              activeTab === "dashboard" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>

          {/* Removed Role-Based Checks */}
          <button
            className={`block w-full text-left py-2 px-4 rounded transition-all duration-300 ease-in-out hover:bg-gray-600 ${
              activeTab === "manage-users" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("manage-users")}
          >
            Manage Users
          </button>

          <button
            className={`block w-full text-left py-2 px-4 rounded transition-all duration-300 ease-in-out hover:bg-gray-600 ${
              activeTab === "admin-dashboard" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("admin-dashboard")}
          >
            Admin Dashboard
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <span className="text-lg font-semibold">Nexora</span>
          <div className="flex flex-col items-center">
            {status === "authenticated" ? (
              <>
                <p className="mb-2">Welcome, {session?.user?.name || "User"}!</p>
                <button
                  className="border border-black rounded px-4 py-2 transition-all duration-300 ease-in-out hover:bg-black hover:text-white"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="border border-black rounded px-4 py-2 transition-all duration-300 ease-in-out hover:bg-black hover:text-white"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className={`transition-transform duration-300 ease-in-out ${loading ? "transform translate-x-8 opacity-0" : ""}`}>
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-xl font-bold">User Dashboard</h2>
              <p className="mt-2">Recent Tasks</p>
              <ul className="list-disc pl-5 space-y-2">
                <li className="hover:underline cursor-pointer">Task 1 - In Progress</li>
                <li className="hover:underline cursor-pointer">Task 2 - Completed</li>
                <li className="hover:underline cursor-pointer">Task 3 - Pending</li>
              </ul>
              <p className="mt-4">Notifications</p>
              <ul className="list-disc pl-5 space-y-2">
                <li className="hover:underline cursor-pointer">Meeting at 3 PM</li>
                <li className="hover:underline cursor-pointer">Project deadline extended</li>
              </ul>
            </div>
          )}

          {activeTab === "manage-users" && (
            <div>
              <h2 className="text-xl font-bold">Manage Users</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li className="hover:underline cursor-pointer">User 1 - Admin</li>
                <li className="hover:underline cursor-pointer">User 2 - Editor</li>
                <li className="hover:underline cursor-pointer">User 3 - Viewer</li>
              </ul>
            </div>
          )}

          {activeTab === "admin-dashboard" && (
            <div>
              <h2 className="text-xl font-bold">Admin Dashboard</h2>
              <p className="mt-2">System Logs</p>
              <ul className="list-disc pl-5 space-y-2">
                <li className="hover:underline cursor-pointer">Admin logged in</li>
                <li className="hover:underline cursor-pointer">User updated profile</li>
                <li className="hover:underline cursor-pointer">New project created</li>
              </ul>
              <p className="mt-4">Analytics</p>
              <ul className="list-disc pl-5 space-y-2">
                <li className="hover:underline cursor-pointer">Active Users: 45</li>
                <li className="hover:underline cursor-pointer">Projects Completed: 12</li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
