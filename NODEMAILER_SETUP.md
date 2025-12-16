# Nodemailer Integration Guide

## Overview

Successfully integrated **Nodemailer** for email notifications across three key features:

1. **User Registration** - Email verification
2. **Quote Requests** - Quote confirmation and updates
3. **Password Reset** - Password recovery emails

## What's Been Done

### 1. Updated Environment Configuration (.env.local)

Replaced Brevo configuration with SMTP settings:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Rayob Engineering
ADMIN_EMAIL=admin@rayobengineering.com
FRONTEND_URL=http://localhost:3000
```

### 2. Created Email Service (emailService.js)

Comprehensive email utility with pre-designed HTML templates for:

- **sendVerificationEmail()** - Registration verification emails
- **sendPasswordResetEmail()** - Password reset emails
- **sendQuoteRequestConfirmation()** - Quote submission confirmation
- **sendQuoteStatusUpdate()** - Quote status change notifications
- **sendQuoteReplyNotification()** - New reply to quote notifications
- **sendAdminQuoteNotification()** - Admin alert for new quotes

### 3. Updated Quote Controller (quoteController.js)

Added email notifications for:

- **createQuote()** - Sends confirmation to customer + notification to admin
- **changeQuoteStatus()** - Sends status update to customer
- **replyToQuote()** - Sends reply notification to customer

### 4. Updated Auth Controller (authController.js)

- Removed old transporter configuration
- Integrated emailService for registration and password reset
- Cleaner, centralized email handling

## Setup Instructions

### Step 1: Gmail Configuration (Recommended)

If using Gmail as your SMTP provider:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification"
3. Generate an "App Password":
   - Go to [App passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows"
   - Copy the generated password
4. Update `.env.local`:
   ```env
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-generated-app-password
   ```

### Step 2: Alternative SMTP Providers

For other providers, use their SMTP settings:

**SendGrid:**

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Mailgun:**

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

**AWS SES:**

```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
```

### Step 3: Admin Email Configuration

Update the admin notification email:

```env
ADMIN_EMAIL=your-admin@rayobengineering.com
```

### Step 4: Frontend URL

Ensure the frontend URL is correct for email links:

```env
FRONTEND_URL=http://localhost:3000  # Development
FRONTEND_URL=https://yourdomain.com  # Production
```

## Email Templates

### Registration Verification

- Sent to: Customer email
- Includes: Email verification link
- Expiration: 24 hours
- Professional HTML design with Rayob branding

### Password Reset

- Sent to: User email
- Includes: Password reset link
- Expiration: 1 hour
- Clear instructions on password reset process

### Quote Request Confirmation

- Sent to: Customer email
- Includes: Quote reference ID
- Content: Confirmation that quote was received
- Sets expectations for response time

### Quote Status Updates

- Sent to: Customer email
- Includes: Quote ID, new status, custom details
- Color-coded by status (pending, replied, approved, rejected, expired)
- Provides reference information

### Quote Reply Notification

- Sent to: Customer email
- Includes: Quote ID and reply message
- Encourages customer to review and respond

### Admin Quote Notification

- Sent to: Admin email (ADMIN_EMAIL env var)
- Includes: Full quote details in table format
- Subject: Marked as [ACTION REQUIRED]
- Prompts admin to review in dashboard

## Testing Emails

### Using Mailtrap (Free Testing Service)

1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Create a testing inbox
3. Copy SMTP credentials from "Email Testing" → "Integrations"
4. Update `.env.local`:
   ```env
   SMTP_HOST=live.smtp.mailtrap.io
   SMTP_PORT=587
   SMTP_USER=api
   SMTP_PASS=your-mailtrap-token
   ```
5. All emails will be captured in Mailtrap instead of sending

### Using Your Local Machine

For development without sending real emails, use Ethereal (temporary):

```javascript
// In emailService.js temporarily
import nodemailer from "nodemailer";
const testAccount = await nodemailer.createTestAccount();
```

## Error Handling

All email functions include try-catch blocks:

- Email failures don't block the main operation (graceful degradation)
- Errors are logged to console for debugging
- System continues even if email service is temporarily unavailable

Example:

```javascript
try {
  await sendQuoteRequestConfirmation(email, name, quoteId);
} catch (emailError) {
  console.log("Failed to send confirmation email:", emailError.message);
  // Quote is still created even if email fails
}
```

## Production Checklist

- [ ] Update SMTP credentials in production environment variables
- [ ] Set FRONTEND_URL to production domain
- [ ] Update ADMIN_EMAIL to production admin email
- [ ] Enable SSL/TLS (SMTP_SECURE=true for port 465)
- [ ] Test email sending with real account
- [ ] Set up email forwarding if needed
- [ ] Configure SPF, DKIM, DMARC records for domain
- [ ] Monitor email delivery rates
- [ ] Set up backup SMTP provider for failover

## Troubleshooting

### Emails Not Sending

1. Check SMTP credentials in `.env.local`
2. Verify SMTP_HOST and SMTP_PORT are correct
3. Check console logs for specific error messages
4. Use Mailtrap to debug SMTP configuration
5. Verify firewall isn't blocking SMTP port

### "Authentication Failed"

- Double-check SMTP_USER and SMTP_PASS
- For Gmail: Ensure App Password is used (not regular password)
- For SendGrid: Ensure "apikey" is in SMTP_USER field

### "Connection Refused"

- Verify SMTP_HOST and SMTP_PORT are correct
- Check if your firewall blocks port 587 or 465
- Test SMTP connection: `telnet smtp.gmail.com 587`

### Emails Going to Spam

- Configure SPF record for your domain
- Configure DKIM signing
- Use consistent sender name and email
- Avoid spam-trigger keywords

## API Integration Example

### Creating a Quote with Email

```javascript
const response = await fetch("/api/quotes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "1234567890",
    serviceType: "Custom Clothing Design",
    message: "I need 100 custom t-shirts...",
  }),
});
// Automatically sends:
// 1. Confirmation email to customer
// 2. Notification email to admin
```

### Updating Quote Status with Email

```javascript
const response = await fetch("/api/quotes/123/status", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    status: "approved",
    details: "Quote approved. Expected delivery: Dec 25, 2025",
  }),
});
// Automatically sends status update email to customer
```

## Next Steps

1. **Configure SMTP Provider**: Choose Gmail, SendGrid, or another provider
2. **Test Email Service**: Submit a test quote/registration
3. **Verify Delivery**: Check that emails arrive
4. **Update Templates**: Customize email templates with your branding
5. **Monitor Performance**: Set up email delivery tracking
6. **Document in Postman**: Create API examples for your team

## Files Modified

- `.env.local` - Environment configuration
- `src/app/server/services/emailService.js` - Email utility (created)
- `src/app/server/controllers/quoteController.js` - Quote notifications
- `src/app/server/controllers/authController.js` - Auth emails

## Nodemailer Documentation

- Official: https://nodemailer.com
- SMTP Options: https://nodemailer.com/smtp/
- Email Examples: https://nodemailer.com/message/
