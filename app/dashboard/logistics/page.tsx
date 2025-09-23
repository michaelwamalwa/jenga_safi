"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const SustainabilityMap = dynamic(
  () => import("../components/sustainabilityMap"),
  { ssr: false }
);

type Material = {
  name: string;
  quantity: number;
  carbonPerUnit: number;
  isRecycled: boolean;
  supplierLocation: string;
  lat?: number;
  lng?: number;
};

type Vehicle = {
  type: string;
  count: number;
  fuelEfficiency: number;
  distance: number;
};

type WasteManagement = {
  recyclingRate: number;
  hazardousWaste: number;
};

type LogisticsData = {
  _id?: string;
  projectName: string;
  location: string;
  materials: Material[];
  vehicles: Vehicle[];
  wasteManagement: WasteManagement;
  lastUpdated: Date | null;
};

export default function LogisticsDashboard() {
  const [editWaste, setEditWaste] = useState(false);
  const [projects, setProjects] = useState<LogisticsData[]>([]);
  const [currentProject, setCurrentProject] = useState<LogisticsData | null>(null);
  const [activeModal, setActiveModal] = useState<
    "material" | "vehicle" | "waste" | "project" | null
  >(null);
  const [tempMaterial, setTempMaterial] = useState<Material>({
    name: "",
    quantity: 0,
    carbonPerUnit: 0,
    isRecycled: false,
    supplierLocation: "",
  });
  const [tempVehicle, setTempVehicle] = useState<Vehicle>({
    type: "",
    count: 0,
    fuelEfficiency: 0,
    distance: 0,
  });
  const [tempProject, setTempProject] = useState({
    projectName: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/logistics");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const projectsData = await response.json();
        setProjects(projectsData);
        if (projectsData.length > 0) {
          setCurrentProject(projectsData[0]);
        }
      } catch (err) {
        console.error("Failed to load logistics:", err);
        setError("Failed to load project data. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const saveProject = async (project: LogisticsData) => {
    try {
      setError(null);
      const response = await fetch("/api/logistics", {
        method: project._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const savedProject = await response.json();
      
      // Update projects list
      if (project._id) {
        setProjects(projects.map(p => p._id === project._id ? savedProject : p));
      } else {
        setProjects([...projects, savedProject]);
      }
      
      // Set as current project
      setCurrentProject(savedProject);
      return savedProject;
    } catch (err) {
      console.error("Failed to save project:", err);
      setError("Failed to save project. Please try again.");
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/logistics?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      // Remove from projects list
      const updatedProjects = projects.filter(p => p._id !== id);
      setProjects(updatedProjects);
      
      // Set current project if available
      if (updatedProjects.length > 0) {
        setCurrentProject(updatedProjects[0]);
      } else {
        setCurrentProject(null);
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
      setError("Failed to delete project. Please try again.");
    }
  };

  const handleAddMaterial = async () => {
    if (!currentProject) return;
    
    const updated = {
      ...currentProject,
      materials: [...currentProject.materials, tempMaterial],
      lastUpdated: new Date(),
    };
    await saveProject(updated);
    setActiveModal(null);
    setTempMaterial({
      name: "",
      quantity: 0,
      carbonPerUnit: 0,
      isRecycled: false,
      supplierLocation: "",
    });
  };

  const handleAddVehicle = async () => {
    if (!currentProject) return;
    
    const updated = {
      ...currentProject,
      vehicles: [...currentProject.vehicles, tempVehicle],
      lastUpdated: new Date(),
    };
    await saveProject(updated);
    setActiveModal(null);
    setTempVehicle({ type: "", count: 0, fuelEfficiency: 0, distance: 0 });
  };

  const handleCreateProject = async () => {
    const newProject: LogisticsData = {
      projectName: tempProject.projectName,
      location: tempProject.location,
      materials: [],
      vehicles: [],
      wasteManagement: { recyclingRate: 0, hazardousWaste: 0 },
      lastUpdated: new Date(),
    };
    
    await saveProject(newProject);
    setActiveModal(null);
    setTempProject({
      projectName: "",
      location: "",
    });
  };

  const handleUpdateWaste = async (
    field: keyof WasteManagement,
    value: number
  ) => {
    if (!currentProject) return;
    
    const updated = {
      ...currentProject,
      wasteManagement: { ...currentProject.wasteManagement, [field]: value },
      lastUpdated: new Date(),
    };
    await saveProject(updated);
  };

  const totalCarbon = currentProject ? 
    currentProject.materials.reduce(
      (sum, m) => sum + m.quantity * m.carbonPerUnit * (m.isRecycled ? 0.7 : 1),
      0
    ) +
    currentProject.vehicles.reduce(
      (sum, v) => sum + v.count * v.distance * (2.31 / v.fuelEfficiency),
      0
    ) : 0;

  const savingsFromRecycling = currentProject ? 
    currentProject.materials.reduce(
      (sum, m) => (m.isRecycled ? sum + m.quantity * m.carbonPerUnit * 0.3 : sum),
      0
    ) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Construction Logistics Dashboard
            </h1>
            
            {/* Project Selector */}
            <div className="relative">
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg"
                value={currentProject?._id || ""}
                onChange={(e) => {
                  const project = projects.find(p => p._id === e.target.value);
                  if (project) setCurrentProject(project);
                }}
              >
                {projects.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.projectName}
                  </option>
                ))}
              </select>
              
              {currentProject && (
                <div className="text-sm text-gray-500 mt-1">
                  Last updated:{" "}
                  {currentProject.lastUpdated
                    ? new Date(currentProject.lastUpdated).toLocaleString()
                    : "Never"}
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setActiveModal("project")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + New Project
          </button>
        </div>
      </header>

      {error && (
        <div className="container mx-auto px-4 py-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
            <button
              onClick={() => setError(null)}
              className="absolute top-0 right-0 p-2"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-6">
        {!currentProject ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md p-6 mb-6 text-center"
          >
            <h2 className="text-xl font-semibold mb-4">
              No Projects Found
            </h2>
            <p className="text-gray-600 mb-4">
              Get started by creating your first construction project.
            </p>
            <button
              onClick={() => setActiveModal("project")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create New Project
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Carbon Metrics */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Carbon Footprint</h2>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">
                    {totalCarbon.toFixed(2)} kg CO₂
                  </div>
                  <p className="text-sm text-gray-600">Total Emissions</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {savingsFromRecycling.toFixed(2)} kg CO₂
                  </div>
                  <p className="text-sm text-gray-600">
                    Saved Through Recycling
                  </p>
                </div>
              </div>
            </div>

            {/* Materials */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Materials</h2>
                <button
                  onClick={() => setActiveModal("material")}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg"
                >
                  + Add
                </button>
              </div>
              {currentProject.materials.length > 0 ? (
                <ul className="space-y-2">
                  {currentProject.materials.map((m, i) => (
                    <li key={i} className="flex justify-between border-b pb-2">
                      <span className="font-medium">{m.name}</span>
                      <span>
                        {m.quantity} × {m.carbonPerUnit}kg
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No materials added yet
                </p>
              )}
            </div>

            {/* Vehicles */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Vehicles</h2>
                <button
                  onClick={() => setActiveModal("vehicle")}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg"
                >
                  + Add
                </button>
              </div>
              {currentProject.vehicles.length > 0 ? (
                <ul className="space-y-2">
                  {currentProject.vehicles.map((v, i) => (
                    <li key={i} className="flex justify-between border-b pb-2">
                      <span>{v.type}</span>
                      <span>
                        {v.count} × {v.distance}km
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No vehicles added yet
                </p>
              )}
            </div>

            {/* Waste Management */}
            <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Waste Management</h2>
                {!editWaste ? (
                  <button
                    onClick={() => setEditWaste(true)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg"
                  >
                    Update
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (currentProject) {
                          saveProject({ ...currentProject, lastUpdated: new Date() });
                        }
                        setEditWaste(false);
                      }}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditWaste(false)}
                      className="px-3 py-1 bg-gray-400 text-white text-sm rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Recycling Rate */}
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Recycling Rate</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {currentProject.wasteManagement.recyclingRate}%
                  </span>
                </div>

                {editWaste ? (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border rounded-lg mb-2"
                    value={currentProject.wasteManagement.recyclingRate}
                    onChange={(e) =>
                      setCurrentProject(prev => prev ? {
                        ...prev,
                        wasteManagement: {
                          ...prev.wasteManagement,
                          recyclingRate: Number(e.target.value),
                        },
                      } : null)
                    }
                  />
                ) : (
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: `${currentProject.wasteManagement.recyclingRate}%` }}
                    />
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  Goal: 80% —{" "}
                  {currentProject.wasteManagement.recyclingRate >= 80
                    ? "On track ✅"
                    : "Needs improvement ⚠️"}
                </p>
              </div>

              {/* Hazardous Waste */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      (currentProject.wasteManagement.recyclingRate / 100) *
                        (currentProject.wasteManagement.hazardousWaste + 1000)
                    )}{" "}
                    kg
                  </div>
                  <p className="text-sm text-gray-600">Recycled Waste</p>
                </div>
                <div
                  className={`p-4 rounded-lg text-center ${
                    currentProject.wasteManagement.hazardousWaste > 500
                      ? "bg-red-100"
                      : "bg-orange-50"
                  }`}
                >
                  {editWaste ? (
                    <input
                      type="number"
                      min="0"
                      className="w-full text-center text-2xl font-bold border rounded-lg mb-1"
                      value={currentProject.wasteManagement.hazardousWaste}
                      onChange={(e) =>
                        setCurrentProject(prev => prev ? {
                          ...prev,
                          wasteManagement: {
                            ...prev.wasteManagement,
                            hazardousWaste: Number(e.target.value),
                          },
                        } : null)
                      }
                    />
                  ) : (
                    <div
                      className={`text-2xl font-bold ${
                        currentProject.wasteManagement.hazardousWaste > 500
                          ? "text-red-600"
                          : "text-orange-600"
                      }`}
                    >
                      {currentProject.wasteManagement.hazardousWaste} kg
                    </div>
                  )}

                  <p className="text-sm text-gray-600">Hazardous Waste (kg)</p>
                  {currentProject.wasteManagement.hazardousWaste > 500 && (
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      High levels — review disposal strategy!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-3">
              <h2 className="text-xl font-semibold mb-4">
                Material Sourcing Map
              </h2>
              <SustainabilityMap
                location={currentProject.location}
                materials={currentProject.materials}
              />
            </div>
            
            {/* Project Actions */}
            <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-3 flex justify-end space-x-4">
              <button
                onClick={() => {
                  if (currentProject && confirm("Are you sure you want to delete this project?")) {
                    deleteProject(currentProject._id!);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Project
              </button>
              <button
                onClick={() => setActiveModal("project")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Project Details
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {activeModal === "material" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold mb-4">Add Material</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Material Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={tempMaterial.name}
                onChange={(e) =>
                  setTempMaterial({ ...tempMaterial, name: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Quantity"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={tempMaterial.quantity}
                  onChange={(e) =>
                    setTempMaterial({
                      ...tempMaterial,
                      quantity: Number(e.target.value),
                    })
                  }
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="CO₂ per Unit"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={tempMaterial.carbonPerUnit}
                  onChange={(e) =>
                    setTempMaterial({
                      ...tempMaterial,
                      carbonPerUnit: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded"
                  checked={tempMaterial.isRecycled}
                  onChange={(e) =>
                    setTempMaterial({
                      ...tempMaterial,
                      isRecycled: e.target.checked,
                    })
                  }
                />
                <span className="ml-2 text-sm text-gray-700">
                  Recycled Material (30% less CO₂)
                </span>
              </div>
              <input
                type="text"
                placeholder="Supplier Location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={tempMaterial.supplierLocation}
                onChange={(e) =>
                  setTempMaterial({
                    ...tempMaterial,
                    supplierLocation: e.target.value,
                  })
                }
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMaterial}
                disabled={!tempMaterial.name || tempMaterial.quantity <= 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {activeModal === "vehicle" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold mb-4">Add Vehicle</h3>
            <div className="space-y-4">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={tempVehicle.type}
                onChange={(e) =>
                  setTempVehicle({ ...tempVehicle, type: e.target.value })
                }
              >
                <option value="">Select Type</option>
                <option value="Dump Truck">Dump Truck</option>
                <option value="Concrete Mixer">Concrete Mixer</option>
                <option value="Crane">Crane</option>
                <option value="Excavator">Excavator</option>
                <option value="Delivery Truck">Delivery Truck</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Count"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={tempVehicle.count}
                  onChange={(e) =>
                    setTempVehicle({
                      ...tempVehicle,
                      count: Number(e.target.value),
                    })
                  }
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Fuel Efficiency (km/L)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={tempVehicle.fuelEfficiency}
                  onChange={(e) =>
                    setTempVehicle({
                      ...tempVehicle,
                      fuelEfficiency: Number(e.target.value),
                    })
                  }
                />
              </div>
              <input
                type="number"
                placeholder="Distance (km)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={tempVehicle.distance}
                onChange={(e) =>
                  setTempVehicle({
                    ...tempVehicle,
                    distance: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVehicle}
                disabled={!tempVehicle.type || tempVehicle.count <= 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {activeModal === "project" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold mb-4">
              {currentProject ? "Edit Project" : "Create New Project"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={tempProject.projectName}
                onChange={(e) =>
                  setTempProject({ ...tempProject, projectName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={tempProject.location}
                onChange={(e) =>
                  setTempProject({ ...tempProject, location: e.target.value })
                }
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!tempProject.projectName || !tempProject.location}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {currentProject ? "Update" : "Create"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}