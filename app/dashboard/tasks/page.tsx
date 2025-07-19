"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  HardHat,
  Leaf,
  CheckCircle,
  Clock,
  Plus,
  RotateCcw,
  X,
  ChevronRight,
  Play,
  Trees,
  Factory,
  Hammer,
  MapPin,
} from "lucide-react";
import AnimatedCard from "@/app/dashboard/components/animated";
import {
  getTasks,
  addTask,
  updateTaskStatus,
  deleteTask,
} from "@/actions/construction";
import type { IConstructionTask } from "@/app/models/constructionTask";

export default function ConstructionTaskList({
  onTaskComplete,
}: {
  onTaskComplete?: () => void;
}) {
  const [tasks, setTasks] = useState<IConstructionTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskImpact, setNewTaskImpact] = useState("");
  const [newTaskSite, setNewTaskSite] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const controls = useAnimation();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const fetched = await getTasks();
      setTasks(fetched);
      setLoading(false);
    };
    load();
  }, []);

  const startAddTask = () => {
    setIsAddingTask(true);
    setNewTaskTitle("");
    setNewTaskImpact("");
    setNewTaskSite("");
    setNewTaskPriority("medium");
  };

  const cancelAddTask = () => setIsAddingTask(false);

  const addNewTask = async () => {
    if (!newTaskTitle.trim()) return;

    const created = await addTask({
      title: newTaskTitle,
      ecoImpact: newTaskImpact || "Positive environmental impact",
      site: newTaskSite,
      priority: newTaskPriority,
    });

    setTasks([created, ...tasks]);
    setIsAddingTask(false);
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    const nextStatus =
      task.status === "pending"
        ? "in-progress"
        : task.status === "in-progress"
        ? "completed"
        : "pending";

    const updated = await updateTaskStatus(id, nextStatus);
    setTasks(tasks.map((t) => (t._id === id ? updated : t)));

    if (nextStatus === "completed" && onTaskComplete) onTaskComplete();
  };

  const removeTask = async (id: string) => {
    await deleteTask(id);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const getPriorityColor = (p: "low" | "medium" | "high" | string) =>
    ({
      high: "bg-red-100 text-red-800 border-red-300",
      medium: "bg-amber-100 text-amber-800 border-amber-300",
      low: "bg-green-100 text-green-800 border-green-300",
    }[p] || "bg-gray-100 text-gray-800");

  const getPriorityIcon = (p: "low" | "medium" | "high" | string) =>
    ({
      high: <Hammer className="h-4 w-4" />,
      medium: <Factory className="h-4 w-4" />,
      low: <Trees className="h-4 w-4" />,
    }[p] || <Leaf className="h-4 w-4" />);

  if (loading) {
    return (
      <AnimatedCard className="p-6 bg-gradient-to-br from-white to-amber-50 rounded-2xl">
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="relative"
          >
            <HardHat className="text-amber-500" size={48} />
            <motion.div
              className="absolute -inset-2 border-4 border-amber-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard className="p-6 bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <motion.h2 className="text-2xl font-bold text-amber-800">
          Construction Eco Tasks
        </motion.h2>
        <motion.button
          className="bg-gradient-to-r from-amber-500 to-amber-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg"
          whileHover={{ scale: 1.05 }}
          onClick={startAddTask}
        >
          <Plus size={18} /> New Task
        </motion.button>
      </div>

      {isAddingTask && (
        <div className="rounded-2xl p-5 bg-white border-2 border-dashed border-amber-300 mb-4">
          <div className="mb-3 flex justify-between items-start">
            <h3 className="font-semibold text-amber-800">Add Task</h3>
            <button onClick={cancelAddTask}>
              <X size={20} className="text-gray-500 hover:text-red-500" />
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              className="w-full p-2 border border-amber-200 rounded-lg"
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-2 border border-amber-200 rounded-lg"
              placeholder="Environmental impact"
              value={newTaskImpact}
              onChange={(e) => setNewTaskImpact(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-2 border border-amber-200 rounded-lg"
              placeholder="Site"
              value={newTaskSite}
              onChange={(e) => setNewTaskSite(e.target.value)}
            />

            <div className="flex gap-2">
              {(["high", "medium", "low"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setNewTaskPriority(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                    newTaskPriority === p
                      ? getPriorityColor(p)
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {getPriorityIcon(p)}
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={cancelAddTask}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              className="bg-gradient-to-r from-amber-500 to-amber-700 text-white px-4 py-2 rounded-lg"
              onClick={addNewTask}
              disabled={!newTaskTitle.trim()}
            >
              <Plus size={16} /> Add Task
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isAddingTask && <div className="absolute inset-0 bg-white/50 pointer-events-none" />}

        {tasks.map((task) => (
          <motion.div
            key={String(task._id)}
            layout
            className={`p-5 rounded-2xl border-l-[6px] mb-3 relative ${
              task.status === "completed"
                ? "border-green-500 bg-green-50"
                : task.status === "in-progress"
                ? "border-amber-500 bg-amber-50"
                : "border-amber-300 bg-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-amber-800 flex items-center">
                  {task.title}
                  {task.status === "in-progress" && (
                    <motion.span
                      className="ml-2 h-2 w-2 bg-amber-500 rounded-full inline-block"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </h3>
                <p className="text-sm text-amber-600 mt-1 flex items-center">
                  <Leaf className="mr-2" size={16} />
                  {task.ecoImpact}
                </p>
                {task.site && (
                  <p className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin size={14} className="mr-2" />
                    {task.site}
                  </p>
                )}
                {task.priority && (
                  <span
                    className={`mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {getPriorityIcon(task.priority)}
                    {task.priority}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleTaskStatus(task._id as string)}
                  className={`p-2.5 rounded-xl ${
                    task.status === "completed"
                      ? "bg-green-500"
                      : "bg-amber-500"
                  } text-white`}
                >
                  {task.status === "completed" ? (
                    <RotateCcw size={18} />
                  ) : (
                    <Play size={18} />
                  )}
                </button>
                <button
                  onClick={() => removeTask(task._id as string)}
                  className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-red-100 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {tasks.length === 0 && !isAddingTask && (
        <div className="text-center mt-10">
          <HardHat className="text-amber-400 mb-4 mx-auto" size={48} />
          <h3 className="text-lg font-medium text-amber-800">
            No construction tasks yet
          </h3>
          <p className="text-amber-600 mt-1">
            Add your first eco-friendly construction task!
          </p>
          <button
            className="mt-4 bg-gradient-to-r from-amber-500 to-amber-700 text-white px-4 py-2 rounded-lg"
            onClick={startAddTask}
          >
            <Plus size={16} /> Create Task
          </button>
        </div>
      )}
    </AnimatedCard>
  );
}
