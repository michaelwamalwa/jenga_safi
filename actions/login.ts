import { connectDB } from "@/lib/db";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB(); // Establish database connection

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Validate request body
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign up." },
        { status: 404 }
      );
    }

    // Check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Ensure TOKEN_SECRET is set
    if (!process.env.TOKEN_SECRET) {
      throw new Error("TOKEN_SECRET is not defined in environment variables");
    }

    // Create a token with expiration
    const token = await jwt.sign(
      tokenData,
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRY || "1d" }
    );

    // Create a JSON response indicating successful login
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    // Set the token as an HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day in seconds
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}