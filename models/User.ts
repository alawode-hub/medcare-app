import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["patient", "doctor", "admin"],
    default: "patient"
  },
  doctorId: {
    type: String,
    default: null
  },
  specialty: {
    type: String,
    default: ""
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);