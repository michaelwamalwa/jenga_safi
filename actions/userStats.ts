"use server";

import { revalidatePath } from "next/cache";
import UserStats from "@/app/models/task";
import { connectDB } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Helper function to get user ID
const getUserId = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  return userId;
};

// Fetch user stats
export async function getUserStats() {
  try {
    await connectDB();
    const userId = await getUserId(); // ✅ add await

    const stats = await UserStats.findOne({ userId })
      .populate("completedTasks.taskId")
      .lean();

    if (!stats) {
      // Initialize new user stats if not found
      return await initializeUserStats(userId);
    }

    return {
      ...stats,
      _id: stats._id.toString(),
      userId: stats.userId.toString(),
      completedTasks: stats.completedTasks.map((task) => ({
        ...task,
        _id: task._id?.toString() ?? "",
        taskId: task.taskId?._id?.toString() ?? null,
      })),
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

// Initialize new user stats
async function initializeUserStats(userId: string) {
  const newStats = new UserStats({
    userId,
    ecoPoints: 0,
    carbonSaved: 0,
    waterSaved: 0,
    completedTasks: [],
  });

  await newStats.save();
  return newStats.toObject();
}

// Complete a task and update stats
export async function completeEcoTask(taskData: {
  taskId: string;
  points: number;
  carbon: number;
  water: number;
}) {
  try {
    await connectDB();
    const userId = await getUserId(); // ✅ add await

    const updatedStats = await UserStats.findOneAndUpdate(
      { userId },
      {
        $inc: {
          ecoPoints: taskData.points,
          carbonSaved: taskData.carbon,
          waterSaved: taskData.water,
        },
        $push: {
          completedTasks: {
            taskId: taskData.taskId,
            pointsEarned: taskData.points,
            carbonSaved: taskData.carbon,
            waterSaved: taskData.water,
          },
        },
      },
      { new: true }
    ).lean();

    if (!updatedStats) throw new Error("Failed to update stats"); // ✅ safety check

    revalidatePath("/dashboard");

    return {
      ecoPoints: updatedStats.ecoPoints,
      carbonSaved: updatedStats.carbonSaved,
      waterSaved: updatedStats.waterSaved,
    };
  } catch (error) {
    console.error("Error completing task:", error);
    throw error;
  }
}

// Get monthly stats
export async function getMonthlyStats() {
  try {
    await connectDB();
    const userId = await getUserId(); // ✅ add await

    const stats = await UserStats.findOne({ userId });
    if (!stats) return { ecoPoints: 0, carbonSaved: 0, waterSaved: 0 };

    return stats.monthlyStats;
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    throw error;
  }
}
