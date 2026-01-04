import { sendEmailViaZoho } from "./zohoEmailService.js";
import User from "../models/User.js";
import { connectDB } from "../db/connect.js";

/**
 * Send volunteer application submission email
 */
export const sendVolunteerApplicationEmail = async (volunteer) => {
  try {
    await connectDB();

    const studentEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .header { background-color: #0066cc; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
          .content { padding: 20px; }
          .detail { margin: 10px 0; }
          .label { font-weight: bold; color: #0066cc; }
          .button { display: inline-block; background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LASUMBA Games 2026</h1>
            <p>Volunteer Application Received</p>
          </div>
          <div class="content">
            <p>Dear ${volunteer.firstName} ${volunteer.lastName},</p>
            <p>Thank you for submitting your volunteer application for the LASUMBA Games 2026!</p>
            
            <h3>Application Details:</h3>
            <div class="detail"><span class="label">Name:</span> ${volunteer.firstName} ${volunteer.lastName}</div>
            <div class="detail"><span class="label">Email:</span> ${volunteer.email}</div>
            <div class="detail"><span class="label">Phone:</span> ${volunteer.phone}</div>
            <div class="detail"><span class="label">Program:</span> ${volunteer.program}</div>
            <div class="detail"><span class="label">Interested Activities:</span> ${volunteer.interestedActivities.join(", ")}</div>
            <div class="detail"><span class="label">Experience Level:</span> ${volunteer.experience}</div>
            
            <p>We will review your application and get back to you shortly. Your status can be checked using the application ID: <strong>${volunteer._id}</strong></p>
            
            <p>Thank you for your interest in supporting the LASUMBA Games!</p>
            
            <p>Best regards,<br>The LASUMBA Games Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to student
    await sendEmailViaZoho({
      to: volunteer.email,
      subject: `LASUMBA Games - Volunteer Application Received | ${volunteer._id}`,
      htmlContent: studentEmailHtml,
      textContent: `Thank you for submitting your volunteer application for the LASUMBA Games 2026!`,
    });

    // Get all active admin and staff-member users (exclude deleted accounts)
    const admins = await User.find({ 
      $or: [{ role: "admin" }, { role: "staff-member" }],
      accountStatus: { $ne: "deleted" },
      isActive: true
    }).select("email firstName lastName role");
    console.log(`\n📋 === ADMIN EMAIL QUERY ===`);
    console.log(`🔍 Query: { (role: "admin" OR "staff-member") AND accountStatus != "deleted" AND isActive: true }`);
    console.log(`📊 Found ${admins.length} active users`);
    if (admins.length > 0) {
      admins.forEach((a) => console.log(`   ✉️ ${a.email} (Role: ${a.role})`));
    } else {
      console.log(`   ⚠️ NO ACTIVE ADMINS FOUND`);
    }
    console.log(`📋 === END QUERY ===\n`);
    
    if (admins.length > 0) {
      const adminEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            .header { background-color: #ff6600; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
            .content { padding: 20px; }
            .detail { margin: 10px 0; }
            .label { font-weight: bold; color: #ff6600; }
            .button { display: inline-block; background-color: #ff6600; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>LASUMBA Games 2026</h1>
              <p>New Volunteer Application</p>
            </div>
            <div class="content">
              <p>A new volunteer application has been submitted.</p>
              
              <h3>Applicant Details:</h3>
              <div class="detail"><span class="label">Name:</span> ${volunteer.firstName} ${volunteer.lastName}</div>
              <div class="detail"><span class="label">Email:</span> ${volunteer.email}</div>
              <div class="detail"><span class="label">Phone:</span> ${volunteer.phone}</div>
              <div class="detail"><span class="label">Program:</span> ${volunteer.program}</div>
              <div class="detail"><span class="label">Interested Activities:</span> ${volunteer.interestedActivities.join(", ")}</div>
              <div class="detail"><span class="label">Experience Level:</span> ${volunteer.experience}</div>
              ${volunteer.additionalInfo ? `<div class="detail"><span class="label">Additional Info:</span> ${volunteer.additionalInfo}</div>` : ""}
              
              <p>Application ID: <strong>${volunteer._id}</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send to all admins with slight delay to prevent rate limiting
      for (let i = 0; i < admins.length; i++) {
        const admin = admins[i];
        if (i > 0) {
          // Small delay between admin emails (500ms)
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        await sendEmailViaZoho({
          to: admin.email,
          subject: `LASUMBA Games - New Volunteer Application from ${volunteer.firstName} ${volunteer.lastName}`,
          htmlContent: adminEmailHtml,
          textContent: `A new volunteer application from ${volunteer.firstName} ${volunteer.lastName} has been submitted.`,
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending volunteer application email:", error);
    // Don't throw - email failure shouldn't break the application submission
    return { success: false, error: error.message };
  }
};

/**
 * Send volunteer status change email
 */
export const sendStatusChangeEmail = async (volunteer, newStatus) => {
  try {
    await connectDB();

    const statusMessages = {
      approved: "Your volunteer application has been APPROVED! 🎉",
      rejected: "Your volunteer application status has been updated",
      pending: "Your volunteer application is under review",
    };

    const statusDescriptions = {
      approved: "Congratulations! Your application has been approved. We look forward to your participation in the LASUMBA Games 2026.",
      rejected: "Unfortunately, your application could not be approved at this time. Thank you for your interest.",
      pending: "Your application is being reviewed. We will update you soon.",
    };

    const studentEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .header { background-color: ${newStatus === "approved" ? "#28a745" : newStatus === "rejected" ? "#dc3545" : "#ffc107"}; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
          .content { padding: 20px; }
          .status-badge { display: inline-block; padding: 10px 20px; border-radius: 5px; background-color: ${newStatus === "approved" ? "#d4edda" : newStatus === "rejected" ? "#f8d7da" : "#fff3cd"}; color: ${newStatus === "approved" ? "#155724" : newStatus === "rejected" ? "#721c24" : "#856404"}; font-weight: bold; margin: 20px 0; }
          .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LASUMBA Games 2026</h1>
            <p>${statusMessages[newStatus]}</p>
          </div>
          <div class="content">
            <p>Dear ${volunteer.firstName} ${volunteer.lastName},</p>
            
            <div class="status-badge">${newStatus.toUpperCase()}</div>
            
            <p>${statusDescriptions[newStatus]}</p>
            
            <p>Thank you for your interest in supporting the LASUMBA Games 2026.</p>
            
            <p>Best regards,<br>The LASUMBA Games Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to student
    await sendEmailViaZoho({
      to: volunteer.email,
      subject: `LASUMBA Games 2026 - Application Status Update: ${newStatus.toUpperCase()}`,
      htmlContent: studentEmailHtml,
      textContent: `Your volunteer application status has been updated to: ${newStatus.toUpperCase()}`,
    });

    // Get all active admin and staff-member users (exclude deleted accounts)
    const admins = await User.find({ 
      $or: [{ role: "admin" }, { role: "staff-member" }],
      accountStatus: { $ne: "deleted" },
      isActive: true
    }).select("email firstName lastName role");
    console.log(`\n📋 === STATUS CHANGE EMAIL QUERY ===`);
    console.log(`🔍 Query: { (role: "admin" OR "staff-member") AND accountStatus != "deleted" AND isActive: true }`);
    console.log(`📊 Found ${admins.length} active users`);
    if (admins.length > 0) {
      admins.forEach((a) => console.log(`   ✉️ ${a.email} (Role: ${a.role})`));
    } else {
      console.log(`   ⚠️ NO ACTIVE ADMINS FOUND`);
    }
    console.log(`📋 === END QUERY ===\n`);

    if (admins.length > 0) {
      const adminEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            .header { background-color: #0066cc; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
            .content { padding: 20px; }
            .detail { margin: 10px 0; }
            .label { font-weight: bold; color: #0066cc; }
            .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>LASUMBA Games 2026</h1>
              <p>Volunteer Status Updated</p>
            </div>
            <div class="content">
              <p>A volunteer application status has been updated.</p>
              
              <div class="detail"><span class="label">Volunteer:</span> ${volunteer.firstName} ${volunteer.lastName}</div>
              <div class="detail"><span class="label">Email:</span> ${volunteer.email}</div>
              <div class="detail"><span class="label">New Status:</span> <strong>${newStatus.toUpperCase()}</strong></div>
              
              <p>Application ID: <strong>${volunteer._id}</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send to all admins with slight delay to prevent rate limiting
      for (let i = 0; i < admins.length; i++) {
        const admin = admins[i];
        if (i > 0) {
          // Small delay between admin emails (500ms)
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        await sendEmailViaZoho({
          to: admin.email,
          subject: `LASUMBA Games 2026 - Volunteer Status Updated: ${volunteer.firstName} ${volunteer.lastName} (${newStatus.toUpperCase()})`,
          htmlContent: adminEmailHtml,
          textContent: `Volunteer ${volunteer.firstName} ${volunteer.lastName}'s status has been updated to ${newStatus.toUpperCase()}.`,
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending status change email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send admin note/reply notification email
 */
export const sendNoteNotificationEmail = async (volunteer, noteMessage) => {
  try {
    await connectDB();

    const studentEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .header { background-color: #0066cc; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
          .content { padding: 20px; }
          .note-box { background-color: #e7f3ff; border-left: 4px solid #0066cc; padding: 15px; margin: 20px 0; }
          .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LASUMBA Games 2026</h1>
            <p>New Message Regarding Your Application</p>
          </div>
          <div class="content">
            <p>Dear ${volunteer.firstName} ${volunteer.lastName},</p>
            
            <p>The LASUMBA Games team has left a message regarding your volunteer application:</p>
            
            <div class="note-box">
              <p>${noteMessage}</p>
            </div>
            
            <p>Please check your application status in the portal for more details.</p>
            
            <p>Best regards,<br>The LASUMBA Games Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to student
    await sendEmailViaZoho({
      to: volunteer.email,
      subject: `LASUMBA Games 2026 - New Message on Your Application`,
      htmlContent: studentEmailHtml,
      textContent: `New message on your volunteer application: ${noteMessage}`,
    });

    // Get all active admin and staff-member users (exclude deleted accounts)
    const admins = await User.find({ 
      $or: [{ role: "admin" }, { role: "staff-member" }],
      accountStatus: { $ne: "deleted" },
      isActive: true
    }).select("email firstName lastName role");
    console.log(`\n📋 === NOTE NOTIFICATION EMAIL QUERY ===`);
    console.log(`🔍 Query: { (role: "admin" OR "staff-member") AND accountStatus != "deleted" AND isActive: true }`);
    console.log(`📊 Found ${admins.length} active users`);
    if (admins.length > 0) {
      admins.forEach((a) => console.log(`   ✉️ ${a.email} (Role: ${a.role})`));
    } else {
      console.log(`   ⚠️ NO ACTIVE ADMINS FOUND`);
    }
    console.log(`📋 === END QUERY ===\n`);

    if (admins.length > 0) {
      const adminEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            .header { background-color: #0066cc; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
            .content { padding: 20px; }
            .detail { margin: 10px 0; }
            .label { font-weight: bold; color: #0066cc; }
            .note-box { background-color: #e7f3ff; border-left: 4px solid #0066cc; padding: 15px; margin: 20px 0; }
            .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>LASUMBA Games 2026</h1>
              <p>Note Added to Volunteer Application</p>
            </div>
            <div class="content">
              <p>A note has been added to a volunteer application.</p>
              
              <div class="detail"><span class="label">Volunteer:</span> ${volunteer.firstName} ${volunteer.lastName}</div>
              <div class="detail"><span class="label">Email:</span> ${volunteer.email}</div>
              <div class="detail"><span class="label">Current Status:</span> ${volunteer.status.toUpperCase()}</div>
              
              <div class="note-box">
                <strong>Note:</strong><br>
                ${noteMessage}
              </div>
              
              <p>Application ID: <strong>${volunteer._id}</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send to all admins with slight delay to prevent rate limiting
      for (let i = 0; i < admins.length; i++) {
        const admin = admins[i];
        if (i > 0) {
          // Small delay between admin emails (500ms)
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        await sendEmailViaZoho({
          to: admin.email,
          subject: `LASUMBA Games 2026 - Note Added to ${volunteer.firstName} ${volunteer.lastName}'s Application`,
          htmlContent: adminEmailHtml,
          textContent: `A note has been added to ${volunteer.firstName} ${volunteer.lastName}'s volunteer application.`,
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending note notification email:", error);
    return { success: false, error: error.message };
  }
};
