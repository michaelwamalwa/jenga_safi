"use server";
import { connectDB } from "@/lib/db";
import User from "@/app/models/user";
import bcrypt from "bcryptjs";

interface SignupValues {
  email: string;
  password: string;
  name: string;
}

export const signup = async (values: SignupValues) => {
  const { email, password, name } = values;

  try {
    await connectDB();

    // Check if user already exists
    const userFound = await User.findOne({ email });
    if (userFound) {
      return { error: "Email already exists" };
    }

    // Validate password strength
    if (password.length < 8) {
      return { error: "Password must be at least 8 characters" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "An unexpected error occurred. Please try again." };
  }
};