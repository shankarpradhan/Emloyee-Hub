"use client";

import { useEffect, useState } from "react";

interface Attendance {
  userId: string;
  email: string;
  timestamp: string;
  location: {
    lat: number;
    lon: number;
  };
}

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>([]);
  const [userWorkDays, setUserWorkDays] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");

  useEffect(() => {
    const fetchAttendances = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/attendance", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attendance records.");
        }

        const data = await response.json();
        setAttendances(data.attendances);

        // Calculate total unique workdays per user
        const userDaysWorked: Record<string, Set<string>> = {};
        data.attendances.forEach((att: Attendance) => {
          const date = new Date(att.timestamp).toISOString().split("T")[0];
          if (!userDaysWorked[att.email]) {
            userDaysWorked[att.email] = new Set();
          }
          userDaysWorked[att.email].add(date);
        });

        setUserWorkDays(
          Object.fromEntries(
            Object.entries(userDaysWorked).map(([email, days]) => [email, days.size])
          )
        );

        // Filter to show only today's attendance by default
        const today = new Date().toISOString().split("T")[0];
        setFilteredAttendances(data.attendances.filter((att: Attendance) => att.timestamp.startsWith(today)));
      } catch (error) {
        console.log(error);
        setError("Error fetching attendance data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, []);

  const handleFilterChange = () => {
    let filtered = attendances;

    if (selectedYear) {
      filtered = filtered.filter((att) => new Date(att.timestamp).getFullYear().toString() === selectedYear);
    }
    if (selectedMonth) {
      filtered = filtered.filter((att) => (new Date(att.timestamp).getMonth() + 1).toString() === selectedMonth);
    }
    if (selectedDay) {
      filtered = filtered.filter((att) => new Date(att.timestamp).getDate().toString() === selectedDay);
    }

    setFilteredAttendances(filtered);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800">Attendance Records</h2>
      <p className="text-gray-600">Showing today's attendance by default</p>

      {/* Filter Options */}
      <div className="flex space-x-4 mt-4">
        <select onChange={(e) => setSelectedYear(e.target.value)} className="p-2 border rounded">
          <option value="">Select Year</option>
          {[...new Set(attendances.map(att => new Date(att.timestamp).getFullYear().toString()))].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
          
        <select onChange={(e) => setSelectedMonth(e.target.value)} className="p-2 border rounded">
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <select onChange={(e) => setSelectedDay(e.target.value)} className="p-2 border rounded">
          <option value="">Select Day</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
          
        <button onClick={handleFilterChange} className="px-4 py-2 bg-blue-500 text-white rounded">Filter</button>
        
        <div>
          <h3 className="text-xl font-bold text-gray-800">Total Employees</h3>
          <p className="text-gray-600 text-lg text-center">{filteredAttendances.length}</p>
        </div>
      </div>
      
      {filteredAttendances.length === 0 ? (
        <p className="mt-4">No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full table-auto border">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-2 text-left">Email</th>
                <th className="px-6 py-2 text-left">Timestamp</th>
                <th className="px-6 py-2 text-left">Location</th>
                <th className="px-6 py-2 text-left">Days Worked</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendances.map((attendance) => (
                <tr key={`${attendance.userId}-${attendance.timestamp}`} className="border-b">
                  <td className="px-6 py-2">{attendance.email}</td>
                  <td className="px-6 py-2">{new Date(attendance.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-2">{attendance.location.lat}, {attendance.location.lon}</td>
                  <td className="px-6 py-2 font-bold">{userWorkDays[attendance.email] || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}