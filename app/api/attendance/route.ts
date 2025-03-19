import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// Define the type for the decoded JWT payload
type DecodedJWT = {
  userId: string;
  email: string;
};

export async function POST(req: NextRequest) {
  try {
    const { lat, lon } = await req.json();

    // Validate location data
    if (typeof lat !== "number" || typeof lon !== "number") {
      return NextResponse.json({ error: "Invalid location data" }, { status: 400 });
    }

    // Extract JWT token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1]; // Extract Bearer token
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Invalid token format" }, { status: 401 });
    }

    // Ensure JWT Secret exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("Missing JWT_SECRET in environment variables.");
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    // Verify JWT Token and use the DecodedJWT type
    let decoded: DecodedJWT;
    try {
      decoded = jwt.verify(token, jwtSecret) as DecodedJWT;
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;
    const db = await connectDB();

    // Check if user exists
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent duplicate attendance in the same day
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of the day

    const existingAttendance = await db.collection("attendances").findOne({
      userId: user._id,
      timestamp: { $gte: today }, // Check if user has already marked attendance today
    });

    if (existingAttendance) {
      return NextResponse.json({ error: "Attendance already marked for today!" }, { status: 400 });
    }

    // Save attendance record
    const attendanceRecord = {
      userId: user._id,
      email: user.email,
      timestamp: new Date(),
      location: { lat, lon },
    };

    await db.collection("attendances").insertOne(attendanceRecord);

    return NextResponse.json({ message: "✅ Attendance marked successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Attendance Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET method: Fetch all Attendance records
export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    // Fetch all attendance records
    const attendances = await db.collection("attendances").find().toArray();

    // Return the records in the response
    return NextResponse.json({ attendances }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    console.log(req);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
