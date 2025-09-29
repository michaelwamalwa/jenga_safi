"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Project {
  _id: string;
  name: string;
}

interface Task {
  _id?: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  projectId?: string; // link to project
}

interface EcoTaskManagerProps {
  tasks: Task[];
  projects: Project[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
}

export default function EcoTaskManager({
  tasks,
  projects,
  onAddTask,
  onUpdateTask,
}: EcoTaskManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "medium",
    impact: "medium",
    status: "todo",
    projectId: projects.length > 0 ? projects[0]._id : undefined, // default first project
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tasks", {
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
          priority: "medium",
          impact: "medium",
          status: "todo",
          projectId: projects.length > 0 ? projects[0]._id : undefined,
        });
      }
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-emerald-700">Eco Task Manager</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          + New Task
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
        >
          <h4 className="font-medium text-emerald-800 mb-4 text-lg">
            Add New Task
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title*
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={newTask.title || ""}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={3}
                value={newTask.description || ""}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>

            {/* Project select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                value={newTask.projectId}
                onChange={(e) =>
                  setNewTask({ ...newTask, projectId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority / Impact / Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      priority: e.target.value as Task["priority"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Impact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impact
                </label>
                <select
                  value={newTask.impact}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      impact: e.target.value as Task["impact"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      status: e.target.value as Task["status"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-md hover:bg-emerald-700 transition-colors font-medium"
              >
                Create Task
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
          >
            <h4 className="font-bold text-emerald-800 mb-2 text-lg">
              {task.title}
            </h4>
            <p className="text-sm text-gray-700 mb-3 line-clamp-3">
              {task.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                Project:{" "}
                {projects.find((p) => p._id === task.projectId)?.name ||
                  "Unassigned"}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {task.priority}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  task.impact === "high"
                    ? "bg-purple-100 text-purple-700"
                    : task.impact === "medium"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {task.impact}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  task.status === "done"
                    ? "bg-emerald-100 text-emerald-700"
                    : task.status === "in-progress"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {task.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && !showAddForm && (
        <div className="text-center py-12 text-gray-500">
          <p>No tasks yet. Add your first task to get started.</p>
        </div>
      )}
    </div>
  );
}
