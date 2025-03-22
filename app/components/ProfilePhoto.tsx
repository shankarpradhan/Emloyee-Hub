// "use client";
// import { useEffect, useState } from "react";

// export default function ProfileDisplay() {
//   const [profilePic, setProfilePic] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Retrieve the JWT from localStorage or cookies
//         const token = localStorage.getItem("token");
//         if (!token) {
//           throw new Error("No token found. Please log in.");
//         }

//         const res = await fetch("/api/user/profile", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           throw new Error("Failed to fetch profile picture");
//         }

//         const data = await res.json();
//         setProfilePic(data.profilePic);
//       } catch (err) {
//         setError((err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold">My Profile</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : profilePic ? (
//         <img src={profilePic} alt="Profile" className="mt-2 w-32 h-32 rounded-full" />
//       ) : (
//         <p>No profile picture uploaded.</p>
//       )}
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfileDisplay() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Retrieve the JWT from localStorage or cookies
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const res = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile picture");
        }

        const data = await res.json();
        setProfilePic(data.profilePic);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">My Profile</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : profilePic ? (
        <Image 
          src={profilePic} 
          alt="Profile" 
          width={128} // 32 * 4
          height={128} 
          className="mt-2 rounded-full"
        />
      ) : (
        <p>No profile picture uploaded.</p>
      )}
    </div>
  );
}
