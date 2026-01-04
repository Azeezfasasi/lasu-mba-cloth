import Volunteer from "../models/Volunteer";
import User from "../models/User";
import { connectDB } from "../db/connect";
import { NextResponse } from "next/server";
import {
  sendVolunteerApplicationEmail,
  sendStatusChangeEmail,
  sendNoteNotificationEmail,
} from "../utils/volunteerEmailService.js";

// 1. Create volunteer submission
export const createVolunteer = async (req) => {
  try {
    await connectDB();
    const body = await req.json();

    // Check if email already submitted
    const existingVolunteer = await Volunteer.findOne({
      email: body.email,
    });
    if (existingVolunteer) {
      return NextResponse.json(
        { success: false, message: "This email has already submitted a volunteer application" },
        { status: 400 }
      );
    }

    const volunteer = new Volunteer(body);
    await volunteer.save();

    // Send confirmation emails (non-blocking)
    sendVolunteerApplicationEmail(volunteer).catch((err) =>
      console.error("Failed to send volunteer application email:", err)
    );

    return NextResponse.json({ success: true, volunteer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// 2. Get all volunteers (admin only)
export const getAllVolunteers = async (req) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const volunteers = await Volunteer.find(query)
      .sort({ submittedAt: -1 })
      .populate("adminNotes.createdBy", "firstName lastName");

    return NextResponse.json({ success: true, volunteers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// 3. Get single volunteer
export const getVolunteerById = async (req, volunteerId) => {
  try {
    await connectDB();
    const volunteer = await Volunteer.findById(volunteerId).populate(
      "adminNotes.createdBy",
      "firstName lastName"
    );

    if (!volunteer) {
      return NextResponse.json(
        { success: false, message: "Volunteer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, volunteer }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// 4. Update volunteer status (admin only)
export const updateVolunteerStatus = async (volunteerId, body) => {
  try {
    await connectDB();
    const { status } = body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      volunteerId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!volunteer) {
      return NextResponse.json(
        { success: false, message: "Volunteer not found" },
        { status: 404 }
      );
    }

    // Send status change emails (non-blocking)
    sendStatusChangeEmail(volunteer, status).catch((err) =>
      console.error("Failed to send status change email:", err)
    );

    return NextResponse.json({ success: true, volunteer }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// 5. Add admin note/reply to volunteer
export const addAdminNote = async (volunteerId, body) => {
  try {
    await connectDB();
    const { message, adminId } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message is required" },
        { status: 400 }
      );
    }

    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return NextResponse.json(
        { success: false, message: "Volunteer not found" },
        { status: 404 }
      );
    }

    // Create the note object - adminId is optional
    const noteObject = {
      message,
      createdAt: new Date(),
    };

    // Only add createdBy if adminId is provided and is a valid ID
    if (adminId && adminId !== "admin_id_here") {
      noteObject.createdBy = adminId;
    }

    volunteer.adminNotes.push(noteObject);
    await volunteer.save();

    // Populate the response
    await volunteer.populate("adminNotes.createdBy", "firstName lastName");

    // Send note notification emails (non-blocking)
    sendNoteNotificationEmail(volunteer, message).catch((err) =>
      console.error("Failed to send note notification email:", err)
    );

    return NextResponse.json({ success: true, volunteer }, { status: 200 });
  } catch (error) {
    console.error("Error adding note:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// 6. Delete volunteer (admin only)
export const deleteVolunteer = async (req, volunteerId) => {
  try {
    await connectDB();
    const volunteer = await Volunteer.findByIdAndDelete(volunteerId);

    if (!volunteer) {
      return NextResponse.json(
        { success: false, message: "Volunteer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Volunteer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// 7. Get volunteer statistics
export const getVolunteerStats = async (req) => {
  try {
    await connectDB();
    const total = await Volunteer.countDocuments();
    const approved = await Volunteer.countDocuments({ status: "approved" });
    const pending = await Volunteer.countDocuments({ status: "pending" });
    const rejected = await Volunteer.countDocuments({ status: "rejected" });

    return NextResponse.json(
      {
        success: true,
        stats: { total, approved, pending, rejected },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};
