"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
    } else {
      // Fetch user info if needed (optional)
      setUser({ email: "johndoe@example.com" }); // Replace with actual user data
    }
  }, [router]);

  

  return (
    <div className="min-h-screen bg-gray-100 mt-10">
      {/* ✅ Dashboard Content */}
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800">Welcome to Your Dashboard</h2>
        {user && <p className="mt-2 text-gray-600">Logged in as: {user.email}</p>}

        {/* ✅ Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800">Total Employees</h3>
            <p className="text-gray-600 text-lg mt-2">150</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800">Projects Completed</h3>
            <p className="text-gray-600 text-lg mt-2">85</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800">Pending Tasks</h3>
            <p className="text-gray-600 text-lg mt-2">12</p>
          </div>
        </div>
      </div>
    </div>
  );
}
