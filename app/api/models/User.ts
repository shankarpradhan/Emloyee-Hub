import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  profilePic: { type: String, default: "" }, // Store Cloudinary URL
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
