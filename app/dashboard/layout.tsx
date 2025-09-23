import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Providers from "@/app/providers";
import Sidebar from "./components/sidebar";
import DashboardHeader from "./components/header";
import { Menu } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <Providers>
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
        {/* Sidebar (hidden on mobile) */}
        <div className="hidden md:block">
          <Sidebar userRole={session.user.role} />
        </div>

        {/* Mobile sidebar drawer (can add state + slide-in later) */}
        <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center justify-between px-4 py-3">
          <button
            aria-label="Open menu"
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            // TODO: Hook into sidebar open/close state
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="font-bold text-emerald-700 text-lg">Dashboard</h1>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col md:ml-0 pt-12 md:pt-0">
          {/* Header (desktop only, since mobile has fixed top bar) */}
          <div className="hidden md:block">
            <DashboardHeader user={session.user} />
          </div>

          <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
