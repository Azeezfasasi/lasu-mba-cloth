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
        .header { background-color: #0000FF; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
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
        .header { background-color: #0000FF; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
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
          <p>Thank you for submitting your request for the LASUMBA T-Shirt. We are pleased to confirm that your request has been received and reviewed.</p>

          <p>Below are the details of your submission for your reference:</p>
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

          <p><strong>To proceed with your order, please make payment using the bank details below:</strong></p>
          <ul class="highlight">
            <li>Account Name: [Insert Account Name]</li>
            <li>Bank Name: [Insert Bank Name]</li>
            <li>Account Number: [Insert Account Number]</li>
            <li>Amount: [Insert Amount]</li>
          </ul>

          <p>After making payment, kindly send proof of payment (receipt or transfer confirmation) via WhatsApp</p>
          <p>Once payment is confirmed, your request status will be updated, and further details regarding T-shirt collection will be communicated to you.</p>
          <p>If you have any questions or require assistance, please do not hesitate to contact us</p>
          <p>Kind regards,<br>LASUMBA Games Committee</p>
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
    subject: `LASUMBA T-Shirt Request Confirmation & Payment Details - Reference ID: ${quoteData._id}`,
    html,
  });
};

/**
 * Send quote status update email to customer
 */
export const sendQuoteStatusUpdate = async (quoteData) => {
  const statusMessages = {
    pending: "Your T-shirt is being prepared",
    replied: "We have a response to your T-shirt request",
    approved: "Your T-shirt request has been approved",
    rejected: "Unfortunately, we cannot process this T-shirt quote at this time",
    expired: "Your T-shirt request has expired",
  };

  const statusColors = {
    pending: "#FF9800",
    replied: "#2196F3",
    approved: "#4CAF50",
    rejected: "#F44336",
    expired: "#9E9E9E",
  };

  const statusColor = statusColors[quoteData.status] || "#2196F3";
  const statusMessage = statusMessages[quoteData.status] || "Your T-shirt request status has been updated";

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
          <p>Hello ${quoteData.name},</p>
          <p>${statusMessage}</p>
          <p><span class="status-badge">${quoteData.status.toUpperCase()}</span></p>
          <p><strong>Quote Reference ID:</strong> ${quoteData._id}</p>
          ${quoteData.details ? `<div class="details"><p>${quoteData.details}</p></div>` : ""}
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
    to: quoteData.email,
    subject: `T-shirt Status Update: ${quoteData.status.toUpperCase()} - Reference ID: ${quoteData._id}`,
    html,
  });
};

/**
 * Send quote reply notification to customer
 */
export const sendQuoteReplyNotification = async (quoteData) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #0000FF; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
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
          <p>Hello ${quoteData.name},</p>
          <p>We have a response to your quote request!</p>
          <p><strong>Quote Reference ID:</strong> ${quoteData._id}</p>
          <div class="message-box">
            <p>${quoteData.replyMessage}</p>
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
    to: quoteData.email,
    subject: `New Reply to Your T-shirt - Reference ID: ${quoteData._id}`,
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
          <p>Dear Admin Committee,</p>
          <p>A new LASUMBA T-Shirt request has been submitted and requires your review.</p>
          <p>Below are the details of the request:</p>
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
          <p><strong>Request Notes::</strong></p>
          <p>${quoteData.message || "N/A"}</p>
          <p>Please review the submitted data for accuracy and completeness.</p>
          <p>Kindly log in to the admin panel to review, approve, and manage this request.</p>
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
    to: adminEmail,
    subject: `New LASUMBA T-Shirt Request Submitted - ID: ${quoteData._id}`,
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
