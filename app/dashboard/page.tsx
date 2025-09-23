"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import ProfileForm from "./components/profile";
import ClientInfoModal from "./components/clientInfoModal";
import ProjectList from "./components/projectList";
import EcoTaskManager from "./components/ecotaskManager";
import CarbonVisualization from "@/components/environment/carbonnew";

interface Props {
  siteId: string;
  carbonEmitted: number;
  carbonSaved: number;
  trend: { time: string; emissions: number }[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const [clientData, setClientData] = useState<any | null>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("jengasafi-clientProfile");
      return cached ? JSON.parse(cached) : null;
    }

    return null;
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [ecoTasks, setEcoTasks] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showProfileForm, setShowProfileForm] = useState(false);

  const fetchData = useCallback(async () => {
    setLoadingProfile(true);
    try {
      // Fetch fresh data from the API
      const profileRes = await fetch("/api/profile");

      if (profileRes.ok) {
        const profile = await profileRes.json();
        // Check if the profile actually contains data
        if (profile && Object.keys(profile).length > 0) {
          // API returned a valid profile: update state and cache
          setClientData(profile);
          localStorage.setItem(
            "jengasafi-clientProfile",
            JSON.stringify(profile)
          );
        } else {
          // API successfully returned an empty response: user has no profile
          setClientData(null);
          localStorage.removeItem("jengasafi-clientProfile"); // Only clear on confirmed empty response
        }
      } else {
        // Handle HTTP errors (e.g., 401, 500). DO NOT clear cache on error.
        console.error("Failed to fetch profile, status:", profileRes.status);
        // Optionally, you could set an error state here, but don't clear the cached data.
        // The component will continue to use the cached data from the initial state.
      }

      // ... rest of your fetch logic for projects and tasks ...
      const projectsRes = await fetch("/api/projects");
      if (projectsRes.ok) setProjects(await projectsRes.json());

      const tasksRes = await fetch("/api/ecotasks");
      if (tasksRes.ok) setEcoTasks(await tasksRes.json());
    } catch (err) {
      // Handle network errors. DO NOT clear cache on error.
      console.error("❌ Network error fetching dashboard data:", err);
      // Leave clientData and localStorage unchanged, using the cached value.
    } finally {
      setHasFetched(true);
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && !hasFetched) {
      fetchData();
    }
  }, [status, hasFetched, fetchData]);

  const handleProfileSave = (profile: any) => {
    setClientData(profile);
    localStorage.setItem("jengasafi-clientProfile", JSON.stringify(profile));

    setShowProfileForm(false);
  };

  const addProject = (p: any) => setProjects((prev) => [...prev, p]);
  const addEcoTask = (t: any) => setEcoTasks((prev) => [...prev, t]);
  const updateEcoTask = (t: any) =>
    setEcoTasks((prev) => prev.map((x) => (x._id === t._id ? t : x)));

  // --- render ---
  if (status === "loading" || (status === "authenticated" && loadingProfile)) {
    return (
      <div className="text-center text-gray-500 p-8">
        Loading your dashboard…
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center text-red-500 p-8">
        You must be signed in to view this page.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-700">
          Sustainability Dashboard
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Welcome, {session?.user?.name || "Guest"}!
        </p>
      </header>
  
      {/* Loading */}
      {loadingProfile && (
        <div className="text-gray-500 text-center">Loading profile…</div>
      )}
  
      {/* Empty profile → Show modal */}
      {!loadingProfile && hasFetched && !clientData && (
        <ClientInfoModal onSave={handleProfileSave} />
      )}
  
      {/* Profile + Tabs */}
      {!loadingProfile && clientData && (
        <div className="space-y-8">
          {/* Profile Card */}
          <motion.div
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-md max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-700 mb-4">
              Welcome back, {clientData.name}! 🌱
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-gray-700 text-sm sm:text-base">
              <p>
                <strong>Email:</strong> {clientData.email}
              </p>
            </div>
            <div className="mt-6 flex justify-center sm:justify-start">
              <button
                onClick={() => setShowProfileForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-5 py-2 rounded-lg transition text-sm sm:text-base"
              >
                Edit Profile
              </button>
            </div>
          </motion.div>
  
          {/* Tabs */}
          <div className="border-b border-gray-200 flex overflow-x-auto">
            {["overview", "projects", "eco-tasks"].map((tab) => (
              <button
                key={tab}
                className={`flex-shrink-0 px-4 py-2 text-sm sm:text-base font-medium transition ${
                  activeTab === tab
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>
  
          {/* Tab Content */}
          <div className="space-y-6 sm:space-y-8">
            {activeTab === "overview" && (
              <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-8 lg:space-y-0">
                <div className="flex-1 bg-white p-6 sm:p-8 rounded-2xl shadow-md">
                  <CarbonVisualization
                    siteId="all"
                    carbonEmitted={clientData.carbonEmitted}
                    carbonSaved={clientData.carbonSaved}
                    trend={[
                      {
                        time: new Date().toISOString(),
                        emissions: clientData.carbonEmitted,
                        savings: clientData.carbonSaved,
                        net: clientData.carbonEmitted - clientData.carbonSaved,
                      },
                    ]}
                  />
                </div>
              </div>
            )}
  
            {activeTab === "projects" && (
              <ProjectList projects={projects} onAddProject={addProject} />
            )}
  
            {activeTab === "eco-tasks" && (
              <EcoTaskManager
                tasks={ecoTasks}
                projects={projects}
                onAddTask={addEcoTask}
                onUpdateTask={updateEcoTask}
              />
            )}
          </div>
        </div>
      )}
  
      {/* Profile Form Modal */}
      {showProfileForm && (
        <ProfileForm
          initialData={clientData}
          onSave={handleProfileSave}
          onCancel={() => setShowProfileForm(false)}
        />
      )}
    </div>
  );
  
}
