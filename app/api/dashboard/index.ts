import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Task from "../../models/Task";
import Project from "../../models/Project";
import Notification from "../../models/Notification";

const MONGODB_URI = process.env.MONGODB_URI!;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
     
      const userId = req.query.userId as string; 
      const type = req.query.type as string;
      await connectToDatabase();

      let data;

      if (type === "tasks") {
        data = await Task.find({ userId }).exec();
      } else if (type === "projects") {
        data = await Project.find({ userId }).exec();
      } else if (type === "notifications") {
        data = await Notification.find({ userId }).exec();
      } else {
        return res.status(400).json({error: "Invalid type parameter"})
      }

      return res.status(200).json({ [type]: data });
    

  
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
