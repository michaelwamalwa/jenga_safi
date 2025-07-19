'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Leaf,
  Users,
  Gauge,
  Settings,
  BarChart,
  Sparkles,
  FileBarChart,
  ClipboardList,
  HardHat,
  MapPin,
  Truck,
  Package,
  Hammer,
  Building,
  Factory,
  ClipboardCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname();
  const [ecoTip, setEcoTip] = useState("Today's eco-tip: Use recycled building materials when possible");

  // Rotate eco tips every 30 seconds
  useEffect(() => {
    const tips = [
      "Prefabricate components to reduce construction waste",
      "Install solar panels on construction site offices",
      "Use low-VOC paints for better indoor air quality",
      "Implement rainwater harvesting systems on sites",
      "Optimize equipment schedules to reduce fuel consumption",
      "Choose sustainable timber with FSC certification",
      "Reuse excavation materials for landscaping"
    ];
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * tips.length);
      setEcoTip(`Today's eco-tip: ${tips[randomIndex]}`);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      name: 'Project Dashboard',
      href: '/dashboard',
      icon: <Gauge className="h-5 w-5" />,
    },
    {
      name: 'Construction Tasks',
      href: '/dashboard/tasks',
      icon: <HardHat className="h-5 w-5 text-amber-600" />,
    },
    {
      name: 'Project Sites',
      href: '/dashboard/sites',
      icon: <MapPin className="h-5 w-5 text-blue-500" />,
    },
    {
      name: 'Contractors',
      href: '/dashboard/contractors',
      icon: <Users className="h-5 w-5 text-indigo-500" />,
    },
    {
      name: 'Sustainability',
      href: '/dashboard/sustainability',
      icon: <Leaf className="h-5 w-5 text-green-500" />,
    },
    {
      name: 'Eco Suggestions',
      href: '/dashboard/suggestions',
      icon: <Sparkles className="h-5 w-5 text-yellow-500" />,
    },
    {
      name: 'Project Reports',
      href: '/dashboard/reports',
      icon: <FileBarChart className="h-5 w-5 text-indigo-600" />,
    },
  ];

  if (userRole === 'admin') {
    navItems.push(
      {
        name: 'Site Administration',
        href: '/dashboard/admin',
        icon: <Settings className="h-5 w-5" />,
      },
      {
        name: 'Construction Logs',
        href: '/dashboard/activity-log',
        icon: <ClipboardList className="h-5 w-5 text-rose-600" />,
      }
    );
  }

  // Construction project status indicator
  const projectStatus = {
    name: "Riverfront Eco-Towers",
    progress: 65
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header with construction project info */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-700 to-emerald-800">
        <h2 className="text-2xl font-bold text-white">Nexora</h2>
        <p className="text-emerald-200 text-sm mt-1">Green Construction Management</p>
      </div>
      
      {/* Project status bar */}
      <div className="px-4 py-3 border-b border-gray-200 bg-amber-50">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-700">{projectStatus.name}</span>
          <span className="text-xs font-medium text-gray-700">{projectStatus.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-green-600 h-1.5 rounded-full" 
            style={{ width: `${projectStatus.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-3 py-5 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-lg transition-all group ${
              pathname === item.href
                ? 'bg-green-50 text-green-700 font-medium shadow-inner'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className={`p-1.5 rounded-lg ${
              pathname === item.href 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600'
            }`}>
              {item.icon}
            </span>
            <span className="ml-3">{item.name}</span>
            
            {/* Active indicator */}
            {pathname === item.href && (
              <span className="ml-auto h-2 w-2 rounded-full bg-green-500"></span>
            )}
          </Link>
        ))}
      </nav>
      
      {/* Eco-tip with construction focus */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100 relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 opacity-20">
            <Building size={48} className="text-green-600" />
          </div>
          <div className="flex items-start">
            <Hammer className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700 relative z-10">
              {ecoTip}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}