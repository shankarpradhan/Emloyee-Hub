"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfileDisplay() {
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("-");
  const [email, setEmail] = useState<string>("---");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const res = await fetch("/api/user/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile data");

        const data = await res.json();
        setProfilePic(data.profilePic);
        setName(data.name);
        setEmail(data.mail);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
      {/* Profile Picture */}
      {loading ? (
        <div className="w-24 h-24 rounded-full bg-gray-300 animate-pulse"></div> // Skeleton loader
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Image
          src={profilePic || "/default-avatar.png"}
          alt="Profile"
          width={150}
          height={150}
          className="rounded-full border-4 border-gray-300 shadow-md"
          priority
        />
      )}

      {/* Name */}
      <h2 className="mt-4 text-lg font-semibold text-gray-800">Name: {loading ? "Loading..." : name}</h2>
      <h2 className="mt-4 text-lg font-semibold text-gray-800">Email: {loading ? "Loading..." : email}</h2>

      {/* Error message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
