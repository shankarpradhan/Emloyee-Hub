"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";
export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check if user is already logged in on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard"); // Redirect to dashboard if logged in
    }
  }, [router]);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
    } else {
      alert("Login failed!");
    }
  }

  // ✅ Redirect to dashboard after successful login
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-sm border border-gray-700 text-center">
        <h1 className="text-3xl font-extrabold mb-6 text-yellow-400">🔐 Employee Login</h1>
    
        {/* Email Input */}

        <form onSubmit={handleLogin}>
        <div className="relative w-full mb-4">
          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 pl-10 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
          />
        </div>

        {/* Password Input */}
        <div className="relative w-full mb-4">
          <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}  
          className="w-full p-3 pl-10 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
          required
          />
        </div>

        {/* Error Message */}

        {/* Login Button */}
        <button
          type="submit"
          className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg font-bold text-gray-900 transition-all duration-200"
        >
          Login 🔑
        </button>
      </form>
      <div className="mt-6">
        <a href="/register" className="text-blue-500 hover:underline">
          Create your account 
        </a>
        </div>
      </div>
      
    </div>  
  );
}
