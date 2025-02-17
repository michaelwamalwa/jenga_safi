import mongoose from 'mongoose';

const { MONGODB_URI } = process.env;

// Track the connection status
let isConnected: boolean = false;

export const connectDB = async (): Promise<void> => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
  }

  if (isConnected) {
    console.log("Database is already connected.");
    return;
  }

  try {
    const { connection } = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (connection.readyState === 1) {
      isConnected = true;
      console.log("Database connected successfully!");
    }
  } catch (error) {
    console.error("Database connection failed!", error);
    throw error; // Rethrow the error for better error handling upstream
  }
};
