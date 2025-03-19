"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from 'jsonwebtoken';
import AttendanceMine from "../attendance/page";
import AttendanceAll from "../attendance/AttendanceAll";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login"); // Redirect if no token found
      } else {
        // Decode JWT (if using JWT) or fetch user details
        const decoded = jwt.decode(token) as { email: string };
        if (decoded) {
          setUser({ email: decoded.email });
        } else {
          router.push("/login"); // Redirect if token is invalid
        }
      }
    }
  }, [router]);


  if (!user) {
    return <div>Loading...</div>; // Show loading text if user is not loaded
  }

  return (
    <div className="min-h-screen bg-gray-100 mt-10">
      {/* Optional Attendance Component */}
      <AttendanceMine />
      
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800">Welcome to Your Dashboard</h2>
        {user && <p className="mt-2 text-gray-600">Logged in as: {user.email}</p>}
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Total Employees</h3>
            <p className="text-gray-600 text-lg mt-2">150</p>
          </div>
        </div>
        <AttendanceAll />
      </div>
    </div>
  );
}
