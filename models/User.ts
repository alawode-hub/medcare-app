import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // this go be HASHED, no be plain
  role: { type: String, default: "patient" },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);