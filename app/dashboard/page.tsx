"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from 'jsonwebtoken';
import AttendanceMine from "../attendance/page";
import AttendanceAll from "../attendance/AttendanceAll";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/login"); // Redirect if no token found
      } else {
        // Decode JWT to get the email and other details (e.g., role)
        const decoded = jwt.decode(token) as { email: string; role: string };

        // Check if role exists in localStorage as well
        const userRole = localStorage.getItem("role");
        // alert(userRole);
        if (decoded && userRole) {
          setUser({ email: decoded.email, role: userRole });
        } else {
          router.push("/login"); // Redirect if token or role is invalid
        }
      }
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>; // Show loading text if user is not loaded
  }

  return (
    <div className="min-h-screen bg-gray-100 mt-10">
      <AttendanceMine />
      <div className="container mx-auto p-6">
        {user.role=="admin" && <h2 className="text-3xl font-bold text-gray-800">Welcome to Your Dashboard</h2>}
        {user.role === "admin" && <AttendanceAll />}
        
        {/* Render AttendanceAll only if the role is 'admin' */}
        
        
        {/* You can also render a message for non-admins if needed */}
        {/* {user.role !== "admin" && (
          <p className="mt-4 text-gray-600">You do not have access to view all attendance.</p>
        )} */}
      </div>
    </div>
  );
}
