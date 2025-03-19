"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevents mismatched initial render

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  function slowEasedScroll(targetId: string, duration = 2000) {
    const target = document.getElementById(targetId);
  
    if (!target) {
      // If the section is missing (user is on a different page), redirect to Home
      window.location.href = `/#${targetId}`;
      return;
    }
  
    const startPosition = window.scrollY;
    const targetPosition = target.getBoundingClientRect().top + startPosition;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;
  
    // Ease-In-Out Function (Smoother Scroll)
    function easeInOutQuad(t: number) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
  
    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1); // Progress (0 to 1)
  
      const easeProgress = easeInOutQuad(progress);
      window.scrollTo(0, startPosition + distance * easeProgress);
  
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        history.pushState(null, "", `#${targetId}`); // Update URL after scroll
      }
    }
  
    requestAnimationFrame(animation);
  }
  
  

  return (
    <nav className="bg-white shadow-md py-4 px-6 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          EMPLOYEEHUB
        </Link>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

        <ul className={`md:flex space-x-6 text-gray-600 ${menuOpen ? "block" : "hidden"} md:block`}>
            <li>
                <Link href="/"
                onClick={(e) => {
                e.preventDefault();
                slowEasedScroll("home", 2500); // Set duration (e.g., 2.5 seconds)
                }}
                className="cursor-pointer"
                >
                    Home
                </Link>
            </li>
            <li>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  slowEasedScroll("about", 2500); // Set duration (e.g., 2.5 seconds)
                }}
                className="cursor-pointer"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#services"
                onClick={(e) => {
                    e.preventDefault();
                    slowEasedScroll("services", 2500); // Set duration (e.g., 2.5 seconds)
                }}
                className="cursor-pointer"
              >
                Services
              </a>
            </li>
            <li>
            <a
                href="#contact"
                onClick={(e) => {
                    e.preventDefault();
                    slowEasedScroll("contact", 2500); // Set duration (e.g., 2.5 seconds)
                }}
                className="cursor-pointer"
              >
                Contact
              </a>
            </li>

            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>
    </nav>
  );
}
