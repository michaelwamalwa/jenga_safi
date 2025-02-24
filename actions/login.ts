import { connectDB } from "@/lib/db";
import dotenv from "dotenv";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();//Load environment variables
connectDB(); // Establish database connection

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const email = reqBody.email?.trim();
    const password = reqBody.password?.trim();

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

    // Ensure TOKEN_SECRET is set
    const tokenSecret = process.env.JWT_SECRET;
    if (!tokenSecret) {
     
      throw new Error("TOKEN_SECRET is missing in environment variables");
    }

    console.log("JWT_SECRET: " + tokenSecret); //Debugging
    // Create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Create JWT token with valid secret type
    const token = jwt.sign(tokenData, String(tokenSecret), {
      expiresIn: "1d",
    });

    // Create a JSON response
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    // Manually set cookies in headers (Next.js 13+)
    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`
    );

    return response;
  }  catch (error) {
    if (error instanceof Error) {
      console.error("Login error:", error.message);
    } else {
      console.error("Login error:", error);
    }
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
  
}
