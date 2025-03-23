import { NextResponse } from "next/server";
import UserModel from "../../models/User";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI as string);

    // Extract the token from the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1]; // Get the token part

    // Verify the token and extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = decoded.userId;

    // Fetch the user's profile picture
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // console.log(user);
    return NextResponse.json({ name:user.name, profilePic: user.profilePic, mail:user.email }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}