import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  
  // Program Information
  program: {
    type: String,
    required: true,
    enum: ["MBA 1", "MBA 2", "Other"],
  },
  
  // Volunteer Details
  interestedActivities: [
    {
      type: String,
      enum: [
        "Football Competition (MBA 1 vs MBA 2)",
        "Track & Field Events (100m)",
        "Track & Field Events (200m)",
        "Track & Field Events (Sack Race)",
        "Chess & Draught Games",
        "Table Tennis",
        "Table Soccer",
        "Lawn Tennis",
        "Organizing/Setup",
        "Registration",
        "Medical Support",
        "Photography",
      ],
    },
  ],
  
  
  experience: {
    type: String,
    required: true,
    enum: ["No Experience", "Some Experience", "Extensive Experience"],
  },
  
  additionalInfo: {
    type: String,
    trim: true,
  },
  
  // Status
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    index: true,
  },
  
  // Admin replies/notes
  adminNotes: [
    {
      message: String,
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now,
    index: -1,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Volunteer || mongoose.model("Volunteer", volunteerSchema);
