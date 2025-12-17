# Zoho Email Migration Guide

## Migration Complete ✅

You have successfully migrated from Brevo to Zoho email service. Here's what was updated:

### Files Created:

1. **`src/app/server/utils/zohoEmailService.js`** - New Zoho email service with all necessary functions

### Files Updated:

1. **`.env.local`** - Replaced Brevo configuration with Zoho
2. **`src/app/server/controllers/newsletterController.js`** - Updated all imports and function calls

### Key Changes:

#### Configuration (.env.local)

**Old (Brevo):**

```
BREVO_API_KEY=...
BREVO_SENDER_EMAIL=...
BREVO_SENDER_NAME=...
BREVO_WEBHOOK_URL=...
BREVO_WEBHOOK_KEY=...
```

**New (Zoho):**

```
ZOHO_API_KEY=your_zoho_api_key
ZOHO_API_URL=https://api.zoho.com/crm/v2.1
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_SENDER_EMAIL=your-email@zoho.com
ZOHO_SENDER_NAME=Lasu MBA
```

### API Functions Replaced:

| Old (Brevo)                | New (Zoho)                                         |
| -------------------------- | -------------------------------------------------- |
| `sendEmailViaBrevo()`      | `sendEmailViaZoho()`                               |
| `sendBulkEmailsViaBrevo()` | `sendBulkEmailsViaZoho()`                          |
| `createBrevoContact()`     | `createZohoContact()`                              |
| `updateBrevoContact()`     | `updateZohoContact()`                              |
| `deleteBrevoContact()`     | `deleteZohoContact()` (uses status update instead) |
| `verifyBrevoApiKey()`      | `verifyZohoConfiguration()`                        |

### Setup Instructions:

1. **Generate Zoho OAuth Credentials:**

   - Go to https://api.console.zoho.com/
   - Create a new OAuth app
   - Get: `ZOHO_CLIENT_ID` and `ZOHO_CLIENT_SECRET`
   - Generate a refresh token following Zoho's OAuth flow
   - Set `ZOHO_REFRESH_TOKEN`

2. **Configure Zoho Sender Email:**

   - Use your Zoho email address for `ZOHO_SENDER_EMAIL`
   - Set a display name for `ZOHO_SENDER_NAME`

3. **Update `.env.local`:**

   ```bash
   ZOHO_API_KEY=your_api_key
   ZOHO_API_URL=https://api.zoho.com/crm/v2.1
   ZOHO_REFRESH_TOKEN=your_refresh_token
   ZOHO_CLIENT_ID=your_client_id
   ZOHO_CLIENT_SECRET=your_client_secret
   ZOHO_SENDER_EMAIL=your-email@zoho.com
   ZOHO_SENDER_NAME=Lasu MBA
   ```

4. **Test the Configuration:**
   ```bash
   node test-zoho-connection.js
   ```

### Features of Zoho Email Service:

✅ **Single Email Sending** - `sendEmailViaZoho()`
✅ **Bulk Email Sending** - `sendBulkEmailsViaZoho()`
✅ **Contact Management** - Create, update, delete contacts in Zoho CRM
✅ **OAuth Authentication** - Secure token-based authentication
✅ **Automatic Token Refresh** - Handles token expiration automatically
✅ **Error Handling** - Comprehensive error logging and handling
✅ **Rate Limiting** - Built-in delays for bulk operations

### Email Fields Supported:

- **to** - Recipient email address (string or array)
- **subject** - Email subject
- **htmlContent** - HTML formatted content
- **textContent** - Plain text content
- **senderEmail** - From email address
- **senderName** - From display name
- **cc** - Carbon copy recipients (array)
- **bcc** - Blind carbon copy recipients (array)
- **replyTo** - Reply-to email address
- **tags** - Email tags for tracking

### Newsletter Features:

- ✅ Newsletter subscription with Zoho CRM contact sync
- ✅ Automatic welcome emails
- ✅ Bulk campaign sending
- ✅ Subscriber management (subscribe/unsubscribe)
- ✅ Activity logging
- ✅ Campaign analytics
- ✅ Contact status tracking

### Notes:

1. **Contact Deletion** - Instead of deleting contacts, Zoho integration updates the subscription status to "deleted" or "inactive"
2. **Token Management** - Access tokens are automatically refreshed when they expire
3. **Error Handling** - Failures in Zoho sync won't break subscriber registration
4. **Tag Support** - Tags are included in email sending but use a different format than Brevo

### Migration Summary:

All Brevo API calls have been replaced with Zoho equivalents in the newsletter controller. The service is backward compatible with the same function signatures, making migration seamless.

---

**Last Updated:** December 17, 2025
**Status:** ✅ Migration Complete
