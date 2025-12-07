# Troubleshooting Guide - Cloth Design Integration Errors

## Error 1: Cloudinary 401 Unauthorized

### Error Message:

```
POST https://api.cloudinary.com/v1_1/undefined/image/upload 401 (Unauthorized)
```

### Root Cause:

Missing or incorrect Cloudinary environment variables

### Solutions:

**Step 1: Create `.env.local` file**

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

**Step 2: Get correct values from Cloudinary**

1. Go to https://dashboard.cloudinary.com/
2. Your **Cloud Name** is displayed at the top of the dashboard
3. Go to **Settings → Upload** tab
4. Create an **Unsigned Upload Preset** (very important!)
5. Copy the preset name

**Step 3: Restart dev server**

```bash
npm run dev
```

**Step 4: Verify variables loaded**
In browser console:

```javascript
console.log(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
// Should show your cloud name
```

---

## Error 2: Cannot destructure property 'status' of 'req.query'

### Error Message:

```
TypeError: Cannot destructure property 'status' of 'req.query' as it is undefined.
    at getAllClothes (src\app\server\controllers\clothController.js:120:13)
```

### Root Cause:

Query parameters not being properly parsed in Next.js API route

### Solution Applied:

✅ Fixed in API route handler - query params now correctly passed to controller

**What was changed:**

```javascript
// BEFORE (wrong)
getAllClothes(req, res);

// AFTER (correct)
const query = Object.fromEntries(url.searchParams);
getAllClothes({ query }, res);
```

**Action Required:** None - already fixed!

---

## Error 3: MongoDB Connection Errors

### Error Message:

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

### Root Cause:

MongoDB is not running or connection string is incorrect

### Solutions:

**If using MongoDB Locally:**

1. Start MongoDB service:

   ```bash
   # Windows
   net start MongoDB

   # Or if using MongoDB Community Edition
   mongod
   ```

2. Verify connection:
   ```bash
   mongo
   # Should connect without errors
   ```

**If using MongoDB Atlas:**

1. Get connection string from MongoDB Atlas dashboard
2. Add to `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rayob?retryWrites=true&w=majority
   ```
3. Whitelist your IP in MongoDB Atlas

**If still not working:**

1. Test connection string with MongoDB Compass
2. Verify credentials are correct
3. Check firewall settings

---

## Error 4: Image Upload - Network Timeout

### Error Message:

```
Failed to upload images
Network error
```

### Solutions:

1. **Check file size:**

   - Cloudinary free tier: max 100MB per file
   - Try with smaller images

2. **Check internet connection:**

   - Verify you're online
   - Try from different network

3. **Check CORS settings:**

   - Cloudinary should handle CORS automatically
   - Clear browser cache and retry

4. **Check upload preset:**
   - Verify upload preset is set to "Unsigned"
   - Verify folder path is correct

---

## Error 5: "Failed to load cloth designs" on /cloth-design

### Error Message:

```
Failed to load cloth designs. Please try again later.
```

### Root Causes & Solutions:

**1. API Route Not Responding**

```bash
# Test API directly
curl http://localhost:3000/api/cloth?status=active
```

**2. MongoDB Not Connected**

- Check if MongoDB is running
- Check connection string in `.env.local`
- Check MongoDB logs for errors

**3. No Active Cloths in Database**

- Go to `/dashboard/add-cloth`
- Create at least one cloth design
- Make sure status is set to "active"

**4. CORS Issues**

- Check if fetch is blocked by browser
- Look in browser DevTools Console tab
- Verify API is running on correct port

---

## Error 6: Admin Form - "Failed to create cloth design"

### Error Messages:

```
Failed to create cloth design
Error creating cloth
A cloth with this name already exists
```

### Solutions:

**Error: "Cloth with this name already exists"**

- Use a unique cloth name
- Check `/dashboard/all-cloth` for existing names

**Error: "At least one image is required"**

- Click upload area to add images
- Make sure images are actually uploaded before submitting

**Error: "Name/description/price/color/material are required"**

- Fill in all required fields (marked with \*)
- Don't leave any field empty

**Error: Form submitting but nothing happens**

1. Check browser console for errors
2. Check if Cloudinary upload succeeded
3. Verify all required fields are filled

---

## Error 7: Size Selection Not Working

### Symptoms:

- Can't click size buttons
- Size doesn't change when clicked
- "Add to cart" button stays disabled

### Solutions:

**1. Check if cloth has sizes**

```javascript
// In browser console
// Go to /cloth-design and run:
console.log(document.body.innerHTML);
// Search for size buttons
```

**2. Verify database has sizes**

```javascript
// In MongoDB
db.cloths.find({}, { name: 1, sizes: 1 });
```

**3. Reload page**

- Hard refresh: Ctrl+Shift+R
- Clear cache and retry

---

## Error 8: Cart Not Persisting

### Symptoms:

- Add to cart shows success
- Cart data doesn't save
- Data lost on page refresh

### Solutions:

**1. Check localStorage enabled:**

```javascript
// In browser console
localStorage.setItem("test", "value");
console.log(localStorage.getItem("test"));
// Should show "value"
```

**2. Check storage quota:**

```javascript
// In browser console
navigator.storage
  .estimate()
  .then((est) => console.log(`Used: ${est.usage}, Available: ${est.quota}`));
```

**3. Check localStorage data:**

```javascript
// In browser console
console.log(JSON.parse(localStorage.getItem("cart")));
// Should show cart items
```

---

## Error 9: 401/403 Unauthorized on Admin Pages

### Error Message:

```
Unauthorized
Access Denied
```

### Solutions:

**1. Authentication not implemented yet:**

- Admin pages currently don't require auth
- If you get this error, authentication might be added

**2. If auth is implemented:**

- Make sure you're logged in
- Check auth token in cookies/localStorage
- Try logging in again

---

## Error 10: "Cannot find db/connect.js" or similar import errors

### Error Message:

```
Error: Cannot find module '@/app/server/db/connect.js'
```

### Solutions:

**1. Verify file exists:**

```bash
# Check if connect.js exists
ls src/app/server/db/connect.js
```

**2. If file is missing, create it:**

The `connect.js` file should be in your database utilities.

**Contact:** Ensure your MongoDB connection setup file exists at `src/app/server/db/connect.js`

---

## Quick Diagnostic Checklist

Run through this checklist if experiencing issues:

### Environment Setup

- [ ] `.env.local` file created
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` set correctly
- [ ] `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` set correctly
- [ ] `MONGODB_URI` set correctly
- [ ] Dev server restarted after creating `.env.local`

### Application Status

- [ ] Dev server running (`npm run dev`)
- [ ] MongoDB running locally or MongoDB Atlas connected
- [ ] No console errors in browser DevTools
- [ ] No errors in terminal where dev server runs

### API Status

- [ ] `/api/cloth` responds with data
- [ ] Can create cloth in admin panel
- [ ] Images upload to Cloudinary
- [ ] Cloths display in viewer

### Component Status

- [ ] Loading state shows initially
- [ ] Data loads successfully
- [ ] Size selection works
- [ ] Add to cart stores data
- [ ] Cart displays in localStorage

---

## Common Fixes Summary

| Issue                  | Quick Fix                                      |
| ---------------------- | ---------------------------------------------- |
| Cloudinary undefined   | Create `.env.local` with Cloudinary vars       |
| req.query is undefined | Code already fixed, restart server             |
| MongoDB error          | Start MongoDB, verify connection string        |
| No cloths loading      | Create cloth in admin panel, set status=active |
| Images not uploading   | Upload preset must be "Unsigned"               |
| Size selection broken  | Create cloth with sizes in admin panel         |
| Cart empty             | Check localStorage enabled in browser          |

---

## Getting Help

If you're still stuck:

1. **Check browser console:**

   - F12 → Console tab
   - Look for red errors

2. **Check server terminal:**

   - Look where `npm run dev` runs
   - Note any error messages

3. **Test API directly:**

   ```bash
   curl http://localhost:3000/api/cloth
   ```

4. **Check environment:**

   ```bash
   cat .env.local
   # Verify all variables are set
   ```

5. **Create a test cloth:**
   - Go to `/dashboard/add-cloth`
   - Fill in basic info
   - Try to submit
   - Note exact error message

---

## Reference Files

- **Setup Guide:** `ENV_SETUP_GUIDE.md`
- **Integration Status:** `CLOTH_DESIGN_VIEWER_INTEGRATION_STATUS.md`
- **Quick Reference:** `CLOTH_DESIGN_QUICK_REFERENCE.md`

---

## Next Steps

After fixing errors:

1. ✅ Create `.env.local` properly
2. ✅ Restart dev server
3. ✅ Test image upload
4. ✅ Create a cloth design
5. ✅ View in cloth-design page
6. ✅ Test shopping cart
7. ✅ You're done! 🎉
