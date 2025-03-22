"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProfileUpload() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File size must be less than 5MB.");
        return;
      }

      setError(null);
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image!");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image); // Ensure the field name is "image"

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed!");
      }

      alert("Upload successful!");
      console.log("Cloudinary URL:", data.imageUrl);

      // Reset form after successful upload
      setImage(null);
      setPreview(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Error uploading image:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Upload Profile Picture</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />

      {preview && (
        <div className="mt-2 w-32 h-32 relative">
          <Image 
            src={preview} 
            alt="Preview" 
            layout="fill" 
            objectFit="cover" 
            className="rounded-full"
          />
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={loading || !image}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}


// "use client";
// import { useState } from "react";

// export default function ProfileUpload() {
//   const [image, setImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       // Validate file type and size
//       if (!file.type.startsWith("image/")) {
//         setError("Please upload an image file.");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         // 5MB limit
//         setError("File size must be less than 5MB.");
//         return;
//       }

//       setError(null);
//       setImage(file);
//       setPreview(URL.createObjectURL(file)); // Show preview
//     }
//   };

//   const handleUpload = async () => {
//     if (!image) {
//       setError("Please select an image!");
//       return;
//     }
  
//     setLoading(true);
//     setError(null);
  
//     const formData = new FormData();
//     formData.append("image", image); // Ensure the field name is "image"
  
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No token found. Please log in.");
//       }
  
//       const res = await fetch("/api/upload", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`, // Include the JWT token
//         },
//         body: formData,
//       });
  
//       const data = await res.json();
  
//       if (!res.ok) {
//         throw new Error(data.error || "Upload failed!");
//       }
  
//       alert("Upload successful!");
//       console.log("Cloudinary URL:", data.imageUrl);
  
//       // Reset form after successful upload
//       setImage(null);
//       setPreview(null);
//       const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
//       if (fileInput) fileInput.value = "";
//     } catch (err) {
//       console.error("Error uploading image:", err);
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold">Upload Profile Picture</h2>

//       <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />

//       {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-32 rounded-full" />}

//       {error && <p className="text-red-500 mt-2">{error}</p>}

//       <button
//         onClick={handleUpload}
//         disabled={loading || !image}
//         className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
//       >
//         {loading ? "Uploading..." : "Upload"}
//       </button>
//     </div>
//   );
// }