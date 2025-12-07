# Environment Setup Guide - Cloth Design Integration

## Critical Issue: Missing Environment Variables

Your application is missing required environment variables for Cloudinary integration. This guide will help you set them up.

---

## Step 1: Get Your Cloudinary Credentials

### If you don't have a Cloudinary account:

1. Go to https://cloudinary.com/
2. Click "Sign Up Free"
3. Create an account
4. Verify your email

### Get your credentials:

1. Log in to https://dashboard.cloudinary.com/
2. You'll see your **Cloud Name** on the dashboard
3. Look for **API Key** and **API Secret** (keep these safe!)

---

## Step 2: Create Unsigned Upload Preset

This is **required** for the app to upload images from the frontend without exposing sensitive credentials.

### Steps:

1. Go to https://dashboard.cloudinary.com/
2. Navigate to **Settings** (gear icon)
3. Go to **Upload** tab
4. Scroll to **Upload presets** section
5. Click **Add upload preset**
6. Configure:

   - **Name**: `rayob_cloth_upload` (or any name you prefer)
   - **Unsigned**: Toggle **ON** (IMPORTANT!)
   - **Folder**: `rayob/cloth` (optional but recommended)
   - Click **Save**

7. Copy the preset name (you'll need this in .env.local)

---

## Step 3: Create `.env.local` file

### File Location:

```
c:\Users\Azeez Fasasi\Desktop\React Dev\Rayob Engineering\Lasu\.env.local
```

### File Contents:

```env
# Cloudinary Configuration (REQUIRED for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here

# MongoDB Connection (REQUIRED for database)
MONGODB_URI=your_mongodb_connection_string

# Optional: Keep any existing environment variables
```

### Example (with real values):

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dh2k3xj5p
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=rayob_cloth_upload
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/rayob
```

---

## Step 4: Update `.env.local` with Your Values

Replace these with your actual values:

| Variable                               | Where to Find                      | Example                           |
| -------------------------------------- | ---------------------------------- | --------------------------------- |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`    | Cloudinary Dashboard (top of page) | `dh2k3xj5p`                       |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload Presets you created         | `rayob_cloth_upload`              |
| `MONGODB_URI`                          | MongoDB Atlas or local instance    | `mongodb://localhost:27017/rayob` |

---

## Step 5: Restart Your Application

After creating/updating `.env.local`:

1. Stop your Next.js development server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```
3. Verify environment variables are loaded

---

## Verification Steps

### 1. Check if variables are loaded

In your browser console (DevTools), run:

```javascript
console.log(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
```

If you see your cloud name, it's working! ✅

### 2. Test image upload

1. Go to `/dashboard/add-cloth`
2. Fill in cloth details
3. Try uploading an image
4. Should work without "undefined" error

### 3. Test API fetch

1. Go to `/cloth-design`
2. Should load cloth designs
3. No 500 errors in console

---

## Troubleshooting

### Issue: "undefined" in Cloudinary URL

**Cause:** `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is missing or wrong
**Solution:**

- Double-check the value in `.env.local`
- Verify it matches your Cloudinary dashboard
- Restart dev server

### Issue: 401 Unauthorized error

**Cause:** Upload preset is not set to "Unsigned"
**Solution:**

- Go to Cloudinary settings
- Edit the upload preset
- Toggle "Unsigned" to ON
- Save and try again

### Issue: API still returning 500 error

**Cause:** Query parameters not being passed correctly
**Solution:**

- This should be fixed by the code update
- Clear browser cache
- Restart dev server

### Issue: MongoDB connection error

**Cause:** `MONGODB_URI` is missing or invalid
**Solution:**

- Verify MongoDB is running
- Check connection string format
- Try connecting with MongoDB Compass first

---

## Full `.env.local` Template

Copy this template and fill in your values:

```env
# ==========================================
# CLOUDINARY CONFIGURATION (REQUIRED)
# ==========================================
# Get from: https://dashboard.cloudinary.com/
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# ==========================================
# MONGODB CONFIGURATION (REQUIRED)
# ==========================================
# Local: mongodb://localhost:27017/rayob
# Atlas: mongodb+srv://user:password@cluster.mongodb.net/rayob
MONGODB_URI=

# ==========================================
# JWT CONFIGURATION (if using auth)
# ==========================================
JWT_SECRET=your_jwt_secret_key_here

# ==========================================
# API CONFIGURATION
# ==========================================
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Security Note ⚠️

**Never commit `.env.local` to version control!**

The `.gitignore` file should already exclude it, but verify:

```
.env.local
.env.local.backup
.env*.local
```

---

## Common Environment Variables Checklist

- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Set and verified
- [ ] `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` - Set and verified
- [ ] `MONGODB_URI` - Set and verified
- [ ] `.env.local` file created in project root
- [ ] Dev server restarted after creating `.env.local`
- [ ] No errors in browser console
- [ ] Image upload works
- [ ] API fetch returns data

---

## Getting Help

If you're still having issues:

1. **Check if file exists:**

   ```bash
   ls -la .env.local
   ```

2. **Verify values:**

   ```bash
   cat .env.local
   ```

3. **Check dev server logs for errors:**
   Look for messages about missing env variables

4. **Test API directly:**
   ```bash
   curl http://localhost:3000/api/cloth
   ```

---

## Next Steps After Setup

1. ✅ Create `.env.local` with Cloudinary and MongoDB settings
2. ✅ Restart dev server
3. ✅ Test image upload in `/dashboard/add-cloth`
4. ✅ Create a cloth design
5. ✅ View it in `/cloth-design`
6. ✅ Test shopping cart functionality

---

## Reference Links

- **Cloudinary Dashboard:** https://dashboard.cloudinary.com/
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **MongoDB Local:** https://docs.mongodb.com/manual/installation/
- **Next.js Env Variables:** https://nextjs.org/docs/basic-features/environment-variables
