import { sendEmailViaZoho } from "../utils/zohoEmailService.js";

const defaultFrom = `"${process.env.ZOHO_SENDER_NAME || "LASUMBA Games"}" <${process.env.ZOHO_SENDER_EMAIL}>`;

/**
 * Send email using Zoho
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.from - Sender email (optional)
 * @returns {Promise}
 */
export const sendEmail = async ({ to, subject, html, from = defaultFrom }) => {
  try {
    const result = await sendEmailViaZoho({
      to,
      subject,
      htmlContent: html,
      senderEmail: process.env.ZOHO_SENDER_EMAIL,
      senderName: process.env.ZOHO_SENDER_NAME || "LASUMBA Games",
    });

    if (result.success) {
      console.log("Email sent successfully via Zoho:", result.messageId);
      return { success: true, messageId: result.messageId };
    } else {
      throw new Error(result.error || "Failed to send email via Zoho");
    }
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send registration verification email
 */
export const sendVerificationEmail = async (email, firstName, verificationLink) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
        .content { padding: 20px; }
        .button { display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome to LASUMBA Games!</h2>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
          <a href="${verificationLink}" class="button">Verify Email Address</a>
          <p>Or copy and paste this link in your browser:</p>
          <p><code>${verificationLink}</code></p>
          <p><strong>This link expires in 24 hours.</strong></p>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 LASUMBA Games. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Verify Your Email - LASUMBA Games",
    html,
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, firstName, resetLink) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #FF9800; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
        .content { padding: 20px; }
        .button { display: inline-block; background-color: #FF9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Password Reset Request</h2>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>Or copy and paste this link in your browser:</p>
          <p><code>${resetLink}</code></p>
          <p><strong>This link expires in 1 hour.</strong></p>
          <p>If you didn't request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 LASUMBA Games. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Password Reset Request - LASUMBA Games",
    html,
  });
};

/**
 * Send quote request confirmation email to students
 */
export const sendQuoteRequestConfirmation = async (quoteData) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #0000FF; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
        .content { padding: 20px; }
        .highlight { background-color: #f0f0f0; padding: 15px; border-left: 4px solid #2196F3; margin: 15px 0; }
        .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>T-Shirt Request Received</h2>
        </div>
        <div class="content">
          <p>Hello ${quoteData.name},</p>
          <p>Thank you for submitting your LASUMBA T-Shirt request! We have received your request and our team will review it shortly.</p>
          <p>We typically respond to quote requests within 24-48 business hours. You will receive an email update with details about your quote.</p>

          <p>Below is your submitted data.</p>
          <table class="details-table">
            <tr>
              <td>Student Name:</td>
              <td>${quoteData.name || "N/A"}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>${quoteData.email || "N/A"}</td>
            </tr>
            <tr>
              <td>WhatsApp Number:</td>
              <td>${quoteData.phone || "N/A"}</td>
            </tr>
            <tr>
              <td>Level:</td>
              <td>${quoteData.company || "N/A"}</td>
            </tr>
            <tr>
              <td>Design Type:</td>
              <td>${quoteData.designType || "N/A"}</td>
            </tr>
            <tr>
              <td>Service:</td>
              <td>${quoteData.service || "N/A"}</td>
            </tr>
            <tr>
              <td>Current Status:</td>
              <td>${quoteData.status || "pending"}</td>
            </tr>
            <tr>
              <td>Submitted Date:</td>
              <td>${new Date(quoteData.createdAt).toLocaleString()}</td>
            </tr>
          </table>
          <p><strong>Request Details:</strong></p>
          <p>${quoteData.message || "N/A"}</p>

          <p>If you have any questions in the meantime, please feel free to reach out to us.</p>
          <p>Best regards,<br>LASUMBA Games Committee</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 LASUMBA Games. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: quoteData.email,
    subject: `Quote Request Received - Reference ID: ${quoteData._id}`,
    html,
  });
};

/**
 * Send quote status update email to customer
 */
export const sendQuoteStatusUpdate = async (customerEmail, customerName, quoteId, status, details = "") => {
  const statusMessages = {
    pending: "Your quote is being prepared",
    replied: "We have a response to your quote request",
    approved: "Your quote has been approved",
    rejected: "Unfortunately, we cannot process this quote at this time",
    expired: "Your quote request has expired",
  };

  const statusColors = {
    pending: "#FF9800",
    replied: "#2196F3",
    approved: "#4CAF50",
    rejected: "#F44336",
    expired: "#9E9E9E",
  };

  const statusColor = statusColors[status] || "#2196F3";
  const statusMessage = statusMessages[status] || "Your quote status has been updated";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: ${statusColor}; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
        .content { padding: 20px; }
        .status-badge { display: inline-block; background-color: ${statusColor}; color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold; }
        .details { background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Quote Status Update</h2>
        </div>
        <div class="content">
          <p>Hello ${customerName},</p>
          <p>${statusMessage}</p>
          <p><span class="status-badge">${status.toUpperCase()}</span></p>
          <p><strong>Quote Reference ID:</strong> ${quoteId}</p>
          ${details ? `<div class="details"><p>${details}</p></div>` : ""}
          <p>Thank you for choosing LASUMBA Games!</p>
          <p>Best regards,<br>LASUMBA Games Committee</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 LASUMBA Games. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Quote Status Update: ${status.toUpperCase()} - Reference ID: ${quoteId}`,
    html,
  });
};

/**
 * Send quote reply notification to customer
 */
export const sendQuoteReplyNotification = async (customerEmail, customerName, quoteId, replyMessage) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #2196F3; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
        .content { padding: 20px; }
        .message-box { background-color: #f0f0f0; padding: 15px; border-left: 4px solid #2196F3; margin: 15px 0; border-radius: 5px; }
        .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Reply to Your Quote</h2>
        </div>
        <div class="content">
          <p>Hello ${customerName},</p>
          <p>We have a response to your quote request!</p>
          <p><strong>Quote Reference ID:</strong> ${quoteId}</p>
          <div class="message-box">
            <p>${replyMessage}</p>
          </div>
          <p>Please review the details above and let us know if you have any questions.</p>
          <p>Best regards,<br>LASUMBA Games Committee</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 LASUMBA Games. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `New Reply to Your Quote - Reference ID: ${quoteId}`,
    html,
  });
};

/**
 * Send admin notification for new quote request
 */
export const sendAdminQuoteNotification = async (quoteData) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not configured in environment variables");
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #0000FF; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
        .content { padding: 20px; }
        .details-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .details-table td { padding: 10px; border-bottom: 1px solid #ddd; }
        .details-table td:first-child { font-weight: bold; width: 30%; background-color: #f0f0f0; }
        .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New T-Shirt Request Received</h2>
        </div>
        <div class="content">
          <p>A new T-shirt request has been submitted and requires your attention.</p>
          <table class="details-table">
            <tr>
              <td>Student Name:</td>
              <td>${quoteData.name || "N/A"}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>${quoteData.email || "N/A"}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>${quoteData.phone || "N/A"}</td>
            </tr>
            <tr>
              <td>Level:</td>
              <td>${quoteData.company || "N/A"}</td>
            </tr>
            <tr>
              <td>Design Type:</td>
              <td>${quoteData.designType || "N/A"}</td>
            </tr>
            <tr>
              <td>Service:</td>
              <td>${quoteData.service || "N/A"}</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td>${quoteData.status || "pending"}</td>
            </tr>
            <tr>
              <td>Submitted Date:</td>
              <td>${new Date(quoteData.createdAt).toLocaleString()}</td>
            </tr>
          </table>
          <p><strong>Quote Details:</strong></p>
          <p>${quoteData.message || "N/A"}</p>
          <p>Please log in to the admin panel to view and manage this quote.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 LASUMBA Games. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `[ACTION REQUIRED] New Quote Request - ID: ${quoteData._id}`,
    html,
  });
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendQuoteRequestConfirmation,
  sendQuoteStatusUpdate,
  sendQuoteReplyNotification,
  sendAdminQuoteNotification,
};
