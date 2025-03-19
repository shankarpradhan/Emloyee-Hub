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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendances = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/attendance", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add the token from localStorage to authenticate the user
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attendance records.");
        }

        const data = await response.json();
        setAttendances(data.attendances); // Assuming the API returns an object with the `attendances` array.
      } catch (error) {
        console.log(error);
        setError("Error fetching attendance data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800">Attendance Records</h2>

      {attendances.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-2 text-left">Email</th>
                <th className="px-6 py-2 text-left">Timestamp</th>
                <th className="px-6 py-2 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((attendance) => (
                <tr key={attendance.userId} className="border-b">
                  <td className="px-6 py-2">{attendance.email}</td>
                  <td className="px-6 py-2">
                    {new Date(attendance.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-2">
                    Latitude: {attendance.location.lat}, Longitude:{" "}
                    {attendance.location.lon}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
