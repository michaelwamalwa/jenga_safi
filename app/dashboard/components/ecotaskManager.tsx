// app/components/ecotaskManager.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface EcoTask {
  _id?: string;
  title: string;
  description: string;
  site: string;
  materials: string[];
  deadline: string;
  priority: "low" | "medium" | "high";
  ecoImpact: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  assignedTo: string;
  estimatedCarbonSavings: number;
  actualCarbonSavings: number;
  projectId: string;
}

interface Project {
  _id?: string;
  name: string;
}

interface EcoTaskManagerProps {
  tasks: EcoTask[];
  projects: Project[];
  onAddTask: (task: EcoTask) => void;
  onUpdateTask: (task: EcoTask) => void;
  onLogCarbonSavings?: (savings: number, description: string) => void; // New prop to log savings
}

export default function EcoTaskManager({ 
  tasks, 
  projects, 
  onAddTask, 
  onUpdateTask, 
  onLogCarbonSavings 
}: EcoTaskManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterEcoImpact, setFilterEcoImpact] = useState<string>("");
  const [filterProject, setFilterProject] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newTask, setNewTask] = useState<Partial<EcoTask>>({
    title: "",
    description: "",
    site: "",
    materials: [],
    deadline: "",
    priority: "medium",
    ecoImpact: "medium",
    status: "pending",
    assignedTo: "",
    estimatedCarbonSavings: 0,
    actualCarbonSavings: 0,
    projectId: ""
  });

  const [newMaterial, setNewMaterial] = useState("");

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesPriority = !filterPriority || task.priority === filterPriority;
    const matchesEcoImpact = !filterEcoImpact || task.ecoImpact === filterEcoImpact;
    const matchesProject = !filterProject || task.projectId === filterProject;
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.site.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPriority && matchesEcoImpact && matchesProject && matchesSearch;
  });

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setNewTask(prev => ({
        ...prev,
        materials: [...(prev.materials || []), newMaterial.trim()]
      }));
      setNewMaterial("");
    }
  };

  const removeMaterial = (index: number) => {
    setNewTask(prev => ({
      ...prev,
      materials: prev.materials?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/ecotasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (res.ok) {
        const savedTask = await res.json();
        onAddTask(savedTask);
        setShowAddForm(false);
        setNewTask({
          title: "",
          description: "",
          site: "",
          materials: [],
          deadline: "",
          priority: "medium",
          ecoImpact: "medium",
          status: "pending",
          assignedTo: "",
          estimatedCarbonSavings: 0,
          actualCarbonSavings: 0,
          projectId: ""
        });
      }
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: EcoTask['status']) => {
    try {
      const taskToUpdate = tasks.find(t => t._id === taskId);
      if (!taskToUpdate) return;

      const res = await fetch(`/api/ecotasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        onUpdateTask(updatedTask);

        // If task is being marked as completed, log the carbon savings
        if (newStatus === "completed" && taskToUpdate.status !== "completed" && onLogCarbonSavings) {
          onLogCarbonSavings(
            taskToUpdate.estimatedCarbonSavings,
            `Completed eco-task: ${taskToUpdate.title}`
          );
        }
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/15 text-destructive";
      case "medium": return "bg-warning/15 text-warning";
      case "low": return "bg-success/15 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getEcoImpactVariant = (impact: string) => {
    switch (impact) {
      case "high": return "bg-emerald-500/15 text-emerald-600";
      case "medium": return "bg-blue-500/15 text-blue-600";
      case "low": return "bg-purple-500/15 text-purple-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/15 text-success";
      case "in-progress": return "bg-blue-500/15 text-blue-600";
      case "pending": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Sustainability Tasks</h2>
          <p className="text-sm text-muted-foreground">Manage eco-friendly initiatives and track their impact</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium shrink-0"
        >
          + New Task
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-muted/30 p-4 rounded-lg border border-border mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">Filter Tasks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Impact</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
              value={filterEcoImpact}
              onChange={(e) => setFilterEcoImpact(e.target.value)}
            >
              <option value="">All Impact</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Project</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Search</label>
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/20 p-6 rounded-lg border border-border mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Create New Task</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Task Title*
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={newTask.title || ""}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g., Install Solar Panels"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Site/Location*
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={newTask.site || ""}
                  onChange={(e) => setNewTask({ ...newTask, site: e.target.value })}
                  placeholder="e.g., Main Construction Site"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Project
                </label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={newTask.projectId || ""}
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Assigned To*
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={newTask.assignedTo || ""}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  placeholder="Team or person responsible"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Priority
                </label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={newTask.priority || "medium"}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as "low" | "medium" | "high" })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Eco-Impact
                </label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={newTask.ecoImpact || "medium"}
                  onChange={(e) => setNewTask({ ...newTask, ecoImpact: e.target.value as "low" | "medium" | "high" })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Deadline*
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={newTask.deadline || ""}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Estimated Savings (kg CO₂)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={newTask.estimatedCarbonSavings || 0}
                  onChange={(e) => setNewTask({ ...newTask, estimatedCarbonSavings: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                rows={3}
                value={newTask.description || ""}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Describe the task objectives, steps, and expected outcomes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Materials
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add material..."
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMaterial())}
                />
                <button
                  type="button"
                  onClick={addMaterial}
                  className="bg-secondary text-secondary-foreground px-3 py-2 rounded-md hover:bg-secondary/80 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newTask.materials?.map((material, index) => (
                  <span
                    key={index}
                    className="bg-blue-500/15 text-blue-600 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                  >
                    {material}
                    <button
                      type="button"
                      onClick={() => removeMaterial(index)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                Create Task
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-md hover:bg-secondary/80 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 border border-border rounded-lg bg-background hover:shadow-sm transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-lg mb-1">{task.title}</h4>
                <p className="text-muted-foreground text-sm mb-2">{task.site}</p>
                <p className="text-foreground text-sm">{task.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityVariant(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getEcoImpactVariant(task.ecoImpact)}`}>
                  {task.ecoImpact} impact
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusVariant(task.status)}`}>
                  {task.status.replace("-", " ")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Assigned to</span>
                <p className="text-sm font-medium text-foreground">{task.assignedTo}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Deadline</span>
                <p className="text-sm font-medium text-foreground">{new Date(task.deadline).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Estimated Savings</span>
                <p className="text-sm font-medium text-emerald-600">
                  {task.estimatedCarbonSavings} kg CO₂
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Actual Savings</span>
                <p className="text-sm font-medium text-emerald-600">
                  {task.actualCarbonSavings} kg CO₂
                </p>
              </div>
            </div>

            {task.materials && task.materials.length > 0 && (
              <div className="mb-4">
                <span className="text-xs text-muted-foreground block mb-2">Materials Required</span>
                <div className="flex flex-wrap gap-2">
                  {task.materials.map((material, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/15 text-blue-600 px-2.5 py-1 rounded-full text-xs"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-border">
              <select
                className="px-3 py-1.5 border border-border rounded-md bg-background text-sm w-full sm:w-auto"
                value={task.status}
                onChange={(e) => updateTaskStatus(task._id!, e.target.value as EcoTask['status'])}
              >
                <option value="pending">Mark as Pending</option>
                <option value="in-progress">Mark as In Progress</option>
                <option value="completed">Mark as Completed</option>
              </select>

              {task.status === "completed" && (
                <span className="text-sm text-success font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Completed
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTasks.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-foreground font-medium mb-1">No tasks found</p>
          <p className="text-muted-foreground text-sm">
            {filterStatus || filterPriority || filterEcoImpact || filterProject || searchTerm 
              ? "Try adjusting your filters or search term." 
              : "Get started by creating your first sustainability task."
            }
          </p>
        </div>
      )}
    </div>
  );
}