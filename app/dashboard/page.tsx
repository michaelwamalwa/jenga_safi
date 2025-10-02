"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import ProfileForm from "./components/profile";
import ClientInfoModal from "./components/clientInfoModal";
import ProjectList from "./components/projectList";
import EcoTaskManager from "./components/ecotaskManager";
import CarbonVisualization from "@/components/environment/carbonnew";
import { ProfileDisplay } from "./profile";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // 👇 REMOVE localStorage initialization - start with null
  const [clientData, setClientData] = useState<any | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [ecoTasks, setEcoTasks] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showProfileForm, setShowProfileForm] = useState(false);

  // 👇 Create user-specific localStorage key
  const getStorageKey = useCallback(() => {
    return session?.user?.email
      ? `jengasafi-clientProfile-${session.user.email}`
      : "jengasafi-clientProfile-anonymous";
  }, [session?.user?.email]);

  const fetchData = useCallback(async () => {
    if (status !== "authenticated") return;

    setLoadingProfile(true);
    try {
      // Fetch fresh data from the API
      const profileRes = await fetch("/api/profile");
      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (profile && Object.keys(profile).length > 0) {
          setClientData(profile);
          // 👇 Store with user-specific key
          sessionStorage.setItem(getStorageKey(), JSON.stringify(profile));
        } else {
          setClientData(null);
          sessionStorage.removeItem(getStorageKey());
        }
      } else {
        console.error("Failed to fetch profile, status:", profileRes.status);
        // On error, try to load from cache as fallback
        const cached = sessionStorage.getItem(getStorageKey());
        if (cached) {
          setClientData(JSON.parse(cached));
        }
      }

      const projectsRes = await fetch("/api/projects");
      if (projectsRes.ok) setProjects(await projectsRes.json());

      const tasksRes = await fetch("/api/ecotasks");
      if (tasksRes.ok) setEcoTasks(await tasksRes.json());
    } catch (err) {
      console.error("❌ Network error fetching dashboard data:", err);
      // On network error, try cached data
      const cached = sessionStorage.getItem(getStorageKey());
      if (cached) {
        setClientData(JSON.parse(cached));
      }
    } finally {
      setHasFetched(true);
      setLoadingProfile(false);
    }
  }, [status, getStorageKey]);

  useEffect(() => {
    if (status === "authenticated" && !hasFetched) {
      fetchData();
    }
  }, [status, hasFetched, fetchData]);

  // 👇 Clear data when user logs out
  useEffect(() => {
    if (status === "unauthenticated") {
      setClientData(null);
      setProjects([]);
      setEcoTasks([]);
      setHasFetched(false);
      Object.keys(sessionStorage).forEach((k) => {
        if (k.startsWith("jengasafi-clientProfile-")) {
          sessionStorage.removeItem(k);
        }
      });
    }
  }, [status]);

  const handleProfileSave = (profile: any) => {
    setClientData(profile);
    // 👇 Store with user-specific key
    sessionStorage.setItem(getStorageKey(), JSON.stringify(profile));
    setShowProfileForm(false);
  };

  // Project and Task handlers
  const addProject = (p: any) => setProjects((prev) => [...prev, p]);
  const addEcoTask = (t: any) => setEcoTasks((prev) => [...prev, t]);
  const updateEcoTask = (t: any) =>
    setEcoTasks((prev) => prev.map((x) => (x._id === t._id ? t : x)));
  const deleteEcoTask = (taskId: string) => {
    setEcoTasks((prev) => prev.filter((task) => task._id !== taskId));
  };

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
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-emerald-700">
          Sustainability Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome, {session?.user?.name || "Guest"}!
        </p>
      </header>

      {!loadingProfile && hasFetched && !clientData && (
        <ClientInfoModal onSave={handleProfileSave} />
      )}

      {!loadingProfile && clientData && (
        <div className="space-y-10">
          {/* Profile Card */}
          <ProfileDisplay
            clientData={clientData}
            session={session}
            onEdit={() => setShowProfileForm(true)}
          />

          {/* Tabs */}
          <div className="border-b border-gray-200 flex space-x-4">
            {["overview", "projects", "eco-tasks"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium transition ${
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
          <div className="space-y-8">
            {activeTab === "overview" && (
              <div className="flex flex-col lg:flex-row lg:space-x-8 gap-8">
                <div className="flex-1 bg-white p-8 rounded-2xl shadow-md">
                  <CarbonVisualization
                    siteId="all"
                    carbonEmitted={clientData?.carbonEmitted ?? 0}
                    carbonSaved={clientData?.carbonSaved ?? 0}
                    trend={[
                      {
                        time: new Date().toISOString(),
                        emissions: clientData?.carbonEmitted ?? 0,
                        savings: clientData?.carbonSaved ?? 0,
                        net:
                          (clientData?.carbonEmitted ?? 0) -
                          (clientData?.carbonSaved ?? 0),
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
                onDeleteTask={deleteEcoTask}
              />
            )}
          </div>
        </div>
      )}
      {showProfileForm && (
        <ProfileForm
          initialData={clientData}
          onSave={handleProfileSave}
          onCancel={() => setShowProfileForm(false)}
        />
      )}
      {loadingProfile && (
        <div className="text-gray-500 text-center">Loading profile…</div>
      )}
    </div>
  );
}
