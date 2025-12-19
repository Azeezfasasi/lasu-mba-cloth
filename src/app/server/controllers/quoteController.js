import Quote from "../models/Quote";
import { connectDB } from "../db/connect";
import User from "../models/User";
import { NextResponse } from "next/server";
import {
  sendEmail,
  sendQuoteRequestConfirmation,
  sendQuoteStatusUpdate,
  sendQuoteReplyNotification,
  sendAdminQuoteNotification,
  sendAdminQuoteStatusUpdate,
  sendAdminQuoteReplyNotification,
  sendAdminAssignmentNotification,
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
      if (quote.email && quote.name) {
        await sendQuoteRequestConfirmation(quote);
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
    quote.details = body.details || "";
    await quote.save();

    // Send status update email to customer
    try {
      if (quote.email && quote.name) {
        await sendQuoteStatusUpdate(quote);
      }
    } catch (emailError) {
      console.log("Failed to send status update email to customer:", emailError.message);
    }

    // Send admin notification about status change
    try {
      await sendAdminQuoteStatusUpdate(quote, oldStatus);
    } catch (emailError) {
      console.log("Failed to send admin notification about status change:", emailError.message);
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
    quote.replyMessage = message;
    await quote.save();

    // Send reply notification email to customer
    try {
      if (quote.email && quote.name) {
        await sendQuoteReplyNotification(quote);
      }
    } catch (emailError) {
      console.log("Failed to send reply notification email to customer:", emailError.message);
    }

    // Send admin notification about the reply
    try {
      await sendAdminQuoteReplyNotification(quote, sender.firstName + ' ' + sender.lastName, message);
    } catch (emailError) {
      console.log("Failed to send admin notification about reply:", emailError.message);
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
    
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) return NextResponse.json({ success: false, message: "Assigned user not found" }, { status: 404 });
    
    quote.assignedTo = assignedTo;
    await quote.save();

    // Send assignment notification email to customer
    try {
      if (quote.email && quote.name) {
        const assignmentNotificationHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
              .header { background-color: #2196F3; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
              .content { padding: 20px; }
              .details { background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0; }
              .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Your Request Has Been Assigned</h2>
              </div>
              <div class="content">
                <p>Hello ${quote.name},</p>
                <p>Your T-shirt request has been assigned to a committee member for processing.</p>
                <div class="details">
                  <p><strong>Assigned To:</strong> ${assignedUser.firstName} ${assignedUser.lastName}</p>
                  <p><strong>Quote Reference ID:</strong> ${quote._id}</p>
                </div>
                <p>Your assigned committee member will review your request and contact you soon with further details.</p>
                <p>Thank you for your patience!</p>
                <p>Best regards,<br>LASUMBA Games Committee</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 LASUMBA Games. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;
        await sendEmail({
          to: quote.email,
          subject: `Your T-Shirt Request Has Been Assigned - Reference ID: ${quote._id}`,
          html: assignmentNotificationHtml,
        });
      }
    } catch (emailError) {
      console.log("Failed to send assignment notification email to customer:", emailError.message);
    }

    // Send admin notification about assignment
    try {
      await sendAdminAssignmentNotification(quote, assignedUser);
    } catch (emailError) {
      console.log("Failed to send admin notification about assignment:", emailError.message);
    }

    return NextResponse.json({ success: true, quote }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};
