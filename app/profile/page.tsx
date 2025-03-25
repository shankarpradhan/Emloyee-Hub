"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import ProfileUpload from "../components/ProfileUpload";
import ProfilePhoto from "../components/ProfilePhoto";

interface Attendance {
  userId: string;
  email: string;
  timestamp: string;
  location: {
    lat: number;
    lon: number;
  };
}

interface DecodedToken {
  email: string;
  userId: string;
}

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>([]);


  useEffect(() => {
    const fetchAttendances = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not logged in");
        }

        // Decode JWT to get user email
        const decoded: DecodedToken = jwtDecode(token);
        setUserEmail(decoded.email);

        // Fetch all attendance records
        const response = await fetch("/api/attendance", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attendance records.");
        }

        const data = await response.json();

        // Filter attendance records for the logged-in user
        const userAttendance = data.attendances.filter(
          (record: Attendance) => record.email === decoded.email
        );        

        setAttendances(userAttendance);

        // Process data for graph 📊
        const attendanceByDate: Record<string, number> = {};

        userAttendance.forEach((record:Attendance) => {
          const date = new Date(record.timestamp).toLocaleDateString();
          attendanceByDate[date] = (attendanceByDate[date] || 0) + 1;
        });

        const chartDataArray = Object.entries(attendanceByDate).map(([date, count]) => ({
          date,
          count,
        }));

        setChartData(chartDataArray);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setError("Error fetching attendance data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-10">

      {/* Show user email */}
      <ProfileUpload />
      <ProfilePhoto />
      <h1 title="user profile" className="hidden">{userEmail}</h1>
      {/* 📊 Attendance Chart */}
      <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Attendance Table */}
      <h2 className="text-3xl font-bold text-gray-800 mt-4">My Attendance Records</h2>
      <div className="overflow-x-auto mt-6">
        <table className="w-full max-w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Timestamp</th>
              <th className="px-4 py-2 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {attendances.map((attendance) => (
              <tr key={`${attendance.userId}-${attendance.timestamp}`} className="border-b">
                <td className="px-4 py-2">{new Date(attendance.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2">{attendance.location.lat}, {attendance.location.lon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
