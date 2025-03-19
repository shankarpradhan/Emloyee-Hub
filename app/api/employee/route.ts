import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const employees = await db.collection("employees").find().toArray();
    return NextResponse.json(employees);
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}
