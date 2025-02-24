"use server";
import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Ensure environment variables are set
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const POST = async (req: Request) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (typeof decoded === "object" && "email" in decoded) {
      return NextResponse.json({ message: 'Token is valid', email: decoded.email });
    }

    return NextResponse.json({ message: 'Token payload is invalid' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
};
