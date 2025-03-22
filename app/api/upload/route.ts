// import { NextRequest, NextResponse } from "next/server";
// import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
// import { Readable } from "stream";
// import jwt from "jsonwebtoken";
// import { MongoClient, ObjectId } from "mongodb";

// // ✅ Ensure environment variables are defined
// const MONGODB_URI = process.env.MONGO_URI as string;
// const JWT_SECRET = process.env.JWT_SECRET as string;

// if (!MONGODB_URI || !JWT_SECRET) {
//   throw new Error("❌ Missing MONGODB_URI or JWT_SECRET in environment variables");
// }

// // 🔹 Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
//   secure: true,
// });

// // 🔹 Multer setup
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // ✅ Convert NextRequest to FormData
// async function parseFormData(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("image") as Blob | null;
//     if (!file) return null;
//     return { buffer: Buffer.from(await file.arrayBuffer()), fileType: file.type };
//   } catch (error) {
//     console.error("❌ Error parsing FormData:", error);
//     return null;
//   }
// }

// // ✅ Upload Image to Cloudinary
// async function uploadToCloudinary(buffer: Buffer) {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream({ folder: "uploads" }, (error, result) => {
//       if (error) return reject(error);
//       resolve(result);
//     });
//     Readable.from(buffer).pipe(stream);
//   });
// }

// // ✅ API Handler
// export async function POST(req: NextRequest) {
//   try {
//     // 🔹 Extract & validate token
//     const authHeader = req.headers.get("authorization") ?? "";
//     if (!authHeader.startsWith("Bearer ")) {
//       return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; exp: number };

//     // 🔹 Check for expired token
//     if (decoded.exp < Math.floor(Date.now() / 1000)) {
//       return NextResponse.json({ error: "Unauthorized - Token expired" }, { status: 401 });
//     }

//     // 🔹 Parse file from FormData
//     const fileData = await parseFormData(req);
//     if (!fileData) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     console.log("📂 Uploading file to Cloudinary...");
//     const uploadResult = (await uploadToCloudinary(fileData.buffer)) as any;
//     if (!uploadResult.secure_url) {
//       return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
//     }

//     // 🔹 Connect to MongoDB
//     const client = new MongoClient(MONGODB_URI);
//     await client.connect();
//     const db = client.db();
//     const usersCollection = db.collection("users");

//     // 🔹 Update user profile
//     await usersCollection.updateOne(
//       { _id: new ObjectId(decoded.userId) },
//       { $set: { profilePic: uploadResult.secure_url } }
//     );

//     await client.close();

//     return NextResponse.json({ success: true, imageUrl: uploadResult.secure_url });
//   } catch (error: any) {
//     console.error("❌ Error in /api/upload:", error.message);
//     return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";

// ✅ Ensure environment variables are defined
const MONGODB_URI = process.env.MONGO_URI as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!MONGODB_URI || !JWT_SECRET) {
  throw new Error("❌ Missing MONGODB_URI or JWT_SECRET in environment variables");
}

// 🔹 Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

// ✅ Convert NextRequest to FormData
async function parseFormData(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as Blob | null;
    if (!file) return null;
    return { buffer: Buffer.from(await file.arrayBuffer()), fileType: file.type };
  } catch (error) {
    console.error("❌ Error parsing FormData:", error);
    return null;
  }
}

// ✅ Upload Image to Cloudinary
async function uploadToCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "uploads" }, (error, result) => {
      if (error) return reject(error);
      if (!result) return reject(new Error("Upload result is null"));
      resolve(result);
    });
    Readable.from(buffer).pipe(stream);
  });
}

// ✅ API Handler
export async function POST(req: NextRequest) {
  try {
    // 🔹 Extract & validate token
    const authHeader = req.headers.get("authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; exp: number };

    // 🔹 Check for expired token
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return NextResponse.json({ error: "Unauthorized - Token expired" }, { status: 401 });
    }

    // 🔹 Parse file from FormData
    const fileData = await parseFormData(req);
    if (!fileData) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("📂 Uploading file to Cloudinary...");
    const uploadResult = await uploadToCloudinary(fileData.buffer);

    if (!uploadResult.secure_url) {
      return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }

    // 🔹 Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection("users");

    // 🔹 Update user profile
    await usersCollection.updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { profilePic: uploadResult.secure_url } }
    );

    await client.close();

    return NextResponse.json({ success: true, imageUrl: uploadResult.secure_url });
  } catch (error) {
    console.error("❌ Error in /api/upload:", (error as Error).message);
    return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
  }
}
