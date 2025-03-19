"use client";
import { useEffect, useState } from "react";

export default function AttendancePage() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const COMPANY_LAT = 12.9121;
  const COMPANY_LON = 77.6446;
  const MAX_DISTANCE_KM = 5;

  function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        setLocation({ lat: userLat, lon: userLon });

        const distance = getDistanceFromLatLonInKm(userLat, userLon, COMPANY_LAT, COMPANY_LON);
        setIsWithinRange(distance <= MAX_DISTANCE_KM);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Please enable location services.");
      }
    );
  }, []);

  const handleMarkAttendance = async () => {
    if (!location) {
      alert("Location not available.");
      return;
    }

    if (!isWithinRange) {
      alert("You are not within the allowed range!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated. Please log in.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lat: location.lat, // ✅ Correct field names
          lon: location.lon,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAttendanceMarked(true);
        alert("✅ Attendance marked successfully!");
      } else {
        alert(data.error || "❌ Failed to mark attendance.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("❌ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Mark Your Attendance</h1>

      {location ? (
        <>
          <p className="mt-4">Your Location: 📍 {location.lat}, {location.lon}</p>
          <p className={`mt-2 ${isWithinRange ? "text-green-400" : "text-red-400"}`}>
            {isWithinRange ? "✅ You are within range!" : "❌ You are outside the range!"}
          </p>
          
          <button
            onClick={handleMarkAttendance}
            disabled={!isWithinRange || attendanceMarked || loading}
            className={`mt-6 px-6 py-3 rounded-lg font-bold transition ${
              isWithinRange ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : attendanceMarked ? "✅ Attendance Marked" : "🕒 Mark Attendance"}
          </button>
        </>
      ) : (
        <p className="mt-4 text-gray-400">Fetching location...</p>
      )}
    </div>
  );
}
