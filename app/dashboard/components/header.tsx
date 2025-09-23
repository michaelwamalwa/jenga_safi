'use client';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from 'next-auth';

export default function DashboardHeader({ user }: { user?: User }) {
  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      signOut({ redirect: false }).then(() => router.push('/login'));
    }
  };

  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold">JengaSafi Dashboard</h1>
        <p className="text-sm text-gray-500">
          Eco-friendly task management
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-medium">Welcome, {user?.name || 'User'}!</p>
          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}