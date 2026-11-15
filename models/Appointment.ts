import mongoose, { Schema } from "mongoose";

const AppointmentSchema = new Schema(
  {
    patientId: { 
      type: String, 
      required: true 
    },

    patientName: {
       type: String,
        required: true 
      },

    patientEmail: {
       type: String, 
       required: true
       },

    doctorId: { 
      type: String,
       required: true
       },

    doctorName: { 
      type: String, 
      required: true 
    },

    specialty: { 
      type: String, 
      required: true
     },


    date: { 
      type: String,
       required: true
       },


    time: { type: String, 
      required: true
     },


    reason: { 
      type: String,
       default: "" 
      },
      

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);