import Quote from "../models/Quote";
import { connectDB } from "../db/connect";
import User from "../models/User";
import { NextResponse } from "next/server";
import {
  sendQuoteRequestConfirmation,
  sendQuoteStatusUpdate,
  sendQuoteReplyNotification,
  sendAdminQuoteNotification,
} from "../services/emailService";

// 1. Create quote request
export const createQuote = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const quote = new Quote({ ...body });
    await quote.save();

    // Send confirmation email to customer
    try {
      if (quote.customerEmail && quote.customerName) {
        await sendQuoteRequestConfirmation(
          quote.customerEmail,
          quote.customerName,
          quote._id.toString()
        );
      }
    } catch (emailError) {
      console.log("Failed to send customer confirmation email:", emailError.message);
    }

    // Send notification email to admin
    try {
      await sendAdminQuoteNotification(quote);
    } catch (emailError) {
      console.log("Failed to send admin notification email:", emailError.message);
    }

    return NextResponse.json({ success: true, quote }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// 2. Get all quote requests (admin/staff only)
export const getAllQuotes = async (req) => {
  try {
    await connectDB();
    const quotes = await Quote.find().populate("assignedTo").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, quotes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// 3. Edit quote request
export const updateQuote = async (req, quoteId) => {
  try {
    await connectDB();
    const body = await req.json();
    const quote = await Quote.findByIdAndUpdate(quoteId, body, { new: true });
    if (!quote) return NextResponse.json({ success: false, message: "Quote not found" }, { status: 404 });
    return NextResponse.json({ success: true, quote }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// 4. Delete quote request
export const deleteQuote = async (req, quoteId) => {
  try {
    await connectDB();
    const quote = await Quote.findByIdAndDelete(quoteId);
    if (!quote) return NextResponse.json({ success: false, message: "Quote not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Quote deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// 5. Change quote request status
export const changeQuoteStatus = async (req, quoteId) => {
  try {
    await connectDB();
    const body = await req.json();
    const { status } = body;
    const quote = await Quote.findById(quoteId);
    if (!quote) return NextResponse.json({ success: false, message: "Quote not found" }, { status: 404 });
    
    const oldStatus = quote.status;
    quote.status = status;
    await quote.save();

    // Send status update email to customer
    try {
      if (quote.customerEmail && quote.customerName) {
        await sendQuoteStatusUpdate(
          quote.customerEmail,
          quote.customerName,
          quoteId,
          status,
          body.details || ""
        );
      }
    } catch (emailError) {
      console.log("Failed to send status update email:", emailError.message);
    }

    return NextResponse.json({ success: true, quote }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// 6. Reply to quote request
export const replyToQuote = async (req, quoteId) => {
  try {
    await connectDB();
    const body = await req.json();
    const { message, senderId, senderName } = body;
    // Validate senderId exists and is admin or staff
    const sender = await User.findById(senderId);
    if (!sender) {
      return NextResponse.json({ success: false, message: "Sender not found" }, { status: 400 });
    }
    if (sender.role !== 'admin' && sender.role !== 'staff-member') {
      return NextResponse.json({ success: false, message: "Sender is not authorized to reply (must be admin or staff-member)" }, { status: 403 });
    }
    const quote = await Quote.findById(quoteId);
    if (!quote) return NextResponse.json({ success: false, message: "Quote not found" }, { status: 404 });
    quote.replies.push({ sender: senderId, senderName: sender.firstName + ' ' + sender.lastName, message });
    quote.status = "replied";
    await quote.save();

    // Send reply notification email to customer
    try {
      if (quote.customerEmail && quote.customerName) {
        await sendQuoteReplyNotification(
          quote.customerEmail,
          quote.customerName,
          quoteId,
          message
        );
      }
    } catch (emailError) {
      console.log("Failed to send reply notification email:", emailError.message);
    }

    return NextResponse.json({ success: true, quote }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// 7. Assign quote request to admin/staff
export const assignQuote = async (req, quoteId) => {
  try {
    await connectDB();
    const body = await req.json();
    const { assignedTo } = body;
    const quote = await Quote.findById(quoteId);
    if (!quote) return NextResponse.json({ success: false, message: "Quote not found" }, { status: 404 });
    quote.assignedTo = assignedTo;
    await quote.save();
    return NextResponse.json({ success: true, quote }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};
