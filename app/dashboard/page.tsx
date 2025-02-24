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

  //Check user role
  const userRole = "user";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      {
        setActiveTab("dashboard");
      }
    }
  }, [status, router, userRole]);


  const showSession = () => {
    if (status === "authenticated") {
      return (
        <div className="flex flex-col items-center">
          <p className="mb-4">Welcome, {session?.user?.name || "User"}!</p>
          <button
            className="border border-solid border-black rounded px-4 py-2"
            onClick={() => {
              const confirmLogout = window.confirm(
                "Are you sure you want to log out"
              );
              if (confirmLogout) {
                signOut({ redirect: false }).then(() => {
                  router.push("/login");
                });
              }
            }}
          >
            Sign Out
          </button>
        </div>
      );
    } else if (status === "loading") {
      return <span className="text-[#888] text-sm mt-7">Loading...</span>;
    } else {
      return (
        <Link
          href="/login"
          className="border border-solid border-black rounded"
        >
          Sign In
        </Link>
      );
    }
  };
  const handleTabChange = (tab: string) => {
    setLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/*Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-2xl font-semibold">Nexora</h2>
        </div>
        <nav className="flex-grow px-4 py-6 space-y-4">
          {/*Conditional rendering based on user role */}
      
        </nav>
      </aside>
      {/*Main Content */}
      <main className="flex-1 p-6">
        {/* Top bar*/}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">Nexora</span>
          
          </div>
          {showSession()}
          
        </div>
     
        {/*Content tabs */}
        <div
          className={`transition-transform duration-300 ease-in-out ${
            loading ? "transform translate-x-8 opacity-0" : ""
          }`}
        >
          {/*Switch rendering */}
      

          {/* Admin Specific Tabs */}
          {activeTab === "manage-users" && (
            <div>Manage Users Page (Admin Only)
              </div>
          )}
           {activeTab === "admin-dashboard" && (
            <div>Admin Dashboard (Admin Only)</div>
          )}
        </div>
      </main>
    </div>
  );
}
