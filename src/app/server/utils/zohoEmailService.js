/**
 * Zoho Email Service
 * Integration with Zoho Mail for email sending using App Password
 */

import nodemailer from 'nodemailer';

const zohoEmail = process.env.ZOHO_SENDER_EMAIL;
const zohoAppPassword = process.env.ZOHO_APP_PASSWORD;
const zohoSenderName = process.env.ZOHO_SENDER_NAME || 'Rayob Engineering';

// Create Zoho transporter
const getZohoTransporter = () => {
  if (!zohoEmail || !zohoAppPassword) {
    throw new Error('Zoho email credentials not configured. Set ZOHO_SENDER_EMAIL and ZOHO_APP_PASSWORD');
  }

  return nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
      user: zohoEmail,
      pass: zohoAppPassword,
    },
  });
};

/**
 * Send email via Zoho Mail using App Password
 * @param {Object} emailData - Email configuration
 * @returns {Promise<Object>} Response from nodemailer
 */
export const sendEmailViaZoho = async (emailData) => {
  try {
    const {
      to,
      subject,
      htmlContent,
      textContent,
      senderEmail = zohoEmail,
      senderName = zohoSenderName,
      cc = [],
      bcc = [],
      replyTo = null,
    } = emailData;

    if (!senderEmail) {
      throw new Error('ZOHO_SENDER_EMAIL is not configured');
    }

    console.log('📧 Sending email via Zoho:', {
      to,
      subject,
      senderEmail,
      senderName,
    });

    const transporter = getZohoTransporter();

    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject,
      html: htmlContent || '',
      text: textContent || subject,
    };

    // Add optional fields
    if (cc.length > 0) {
      mailOptions.cc = Array.isArray(cc) ? cc.join(',') : cc;
    }

    if (bcc.length > 0) {
      mailOptions.bcc = Array.isArray(bcc) ? bcc.join(',') : bcc;
    }

    if (replyTo) {
      mailOptions.replyTo = replyTo;
    }

    console.log('📤 Zoho Email Payload:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasHtml: !!mailOptions.html,
    });

    const info = await transporter.sendMail(mailOptions);

    console.log('✓ Email sent successfully via Zoho:', info.messageId);

    return {
      success: true,
      status: 200,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error('❌ Zoho email send error:', error);
    return {
      success: false,
      status: 500,
      error: error.message,
      details: error,
    };
  }
};

/**
 * Send bulk emails via Zoho
 * @param {Array<Object>} emailList - Array of email data objects
 * @returns {Promise<Object>} Results of bulk send
 */
export const sendBulkEmailsViaZoho = async (emailList) => {
  const results = {
    successful: [],
    failed: [],
    totalSent: 0,
    totalFailed: 0,
  };

  for (const emailData of emailList) {
    try {
      const result = await sendEmailViaZoho(emailData);
      if (result.success) {
        results.successful.push({
          email: emailData.to,
          messageId: result.messageId,
        });
        results.totalSent++;
      } else {
        results.failed.push({
          email: emailData.to,
          error: result.error,
        });
        results.totalFailed++;
      }
    } catch (error) {
      results.failed.push({
        email: emailData.to,
        error: error.message,
      });
      results.totalFailed++;
    }

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log('📊 Bulk send results:', {
    successful: results.totalSent,
    failed: results.totalFailed,
    total: emailList.length,
  });

  return results;
};

/**
 * Verify Zoho configuration
 * @returns {Promise<boolean>} True if configuration is valid
 */
export const verifyZohoConfiguration = async () => {
  try {
    if (!zohoEmail || !zohoAppPassword) {
      console.error('❌ Zoho email configuration incomplete. Set ZOHO_SENDER_EMAIL and ZOHO_APP_PASSWORD');
      return false;
    }

    const transporter = getZohoTransporter();
    await transporter.verify();

    console.log('✓ Zoho email configuration verified successfully');
    console.log(`  Email: ${zohoEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error verifying Zoho configuration:', error.message);
    return false;
  }
};
