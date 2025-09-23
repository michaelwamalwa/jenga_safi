"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ClipboardCheck,
  Calendar,
  AlertCircle,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
  badge?: string;
}

export default function Sidebar({ userRole = "user" }: { userRole?: string }) {
  const pathname = usePathname();
  const [ecoTip, setEcoTip] = useState(
    "Today's eco-tip: Use recycled building materials when possible"
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  // Rotate eco tips every 30 seconds
  useEffect(() => {
    const tips = [
      "Prefabricate components to reduce construction waste",
      "Install solar panels on construction site offices",
      "Use low-VOC paints for better indoor air quality",
      "Implement rainwater harvesting systems on sites",
      "Optimize equipment schedules to reduce fuel consumption",
      "Choose sustainable timber with FSC certification",
      "Reuse excavation materials for landscaping",
      "Conduct regular equipment maintenance to improve efficiency",
      "Implement a construction waste recycling program",
    ];

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * tips.length);
      setEcoTip(`Today's eco-tip: ${tips[randomIndex]}`);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const baseNavItems: NavItem[] = [
    {
      name: "Project Dashboard",
      href: "/dashboard",
      icon: <Gauge className="h-5 w-5" />,
    },
    {
      name: "Materials",
      href: "/dashboard/materials",
      icon: <Package className="h-5 w-5 text-amber-800" />,
    },
    {
      name: "Logistics",
      href: "/dashboard/logistics",
      icon: <Truck className="h-5 w-5 text-purple-500" />,
    },
    {
      name: "Project Reports",
      href: "/dashboard/reports",
      icon: <FileBarChart className="h-5 w-5 text-indigo-600" />,
    },
  ];

  const adminNavItems: NavItem[] = [
    {
      name: "Site Administration",
      href: "/dashboard/admin",
      icon: <Settings className="h-5 w-5" />,
      roles: ["admin", "supervisor"],
    },
    {
      name: "Construction Logs",
      href: "/dashboard/activity-log",
      icon: <ClipboardList className="h-5 w-5 text-rose-600" />,
      roles: ["admin"],
    },
    {
      name: "Facilities",
      href: "/dashboard/facilities",
      icon: <Factory className="h-5 w-5 text-gray-600" />,
      roles: ["admin", "supervisor"],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = [
    ...baseNavItems,
    ...adminNavItems.filter(
      (item) => !item.roles || item.roles.includes(userRole)
    ),
  ];

  // Format time
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Header with construction project info */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-700 to-emerald-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">JengaSafi</h2>
            <p className="text-emerald-200 text-sm mt-1">
              Green Construction Management
            </p>
          </div>
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Building className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Current time */}
        <div className="mt-3 flex items-center justify-between text-emerald-100 text-sm">
          <span>{formattedTime}</span>
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-3 py-5 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-lg transition-all group relative ${
              pathname === item.href
                ? "bg-green-50 text-green-700 font-medium shadow-inner"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span
              className={`p-1.5 rounded-lg ${
                pathname === item.href
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600"
              }`}
            >
              {item.icon}
            </span>
            <span className="ml-3">{item.name}</span>

            {/* Badge */}
            {item.badge && (
              <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                {item.badge}
              </span>
            )}

            {/* Active indicator */}
            {pathname === item.href && (
              <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>
            )}
          </Link>
        ))}
      </nav>

      {/* Eco-tip with construction focus */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100 relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 opacity-20">
            <Building size={48} className="text-green-600" />
          </div>
          <div className="flex items-start">
            <Hammer className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700 relative z-10">{ecoTip}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
