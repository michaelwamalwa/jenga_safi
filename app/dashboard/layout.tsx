import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Providers from '@/app/providers';
import Sidebar from './components/sidebar';
import DashboardHeader from './components/header';
import { TreePine } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <Providers>
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
        <Sidebar userRole={session.user.role} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader user={session.user} />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </Providers>
  );
}