import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      await connectToDatabase();
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
