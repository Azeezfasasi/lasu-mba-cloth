# Cloth Design Integration - Quick Reference

## Quick Start Checklist

- [x] **Cloth Model Created** - `src/app/server/models/Cloth.js`

  - Comprehensive schema with all cloth properties
  - Automatic timestamps and indexes

- [x] **Controller Created** - `src/app/server/controllers/clothController.js`

  - 8 main functions for CRUD operations
  - Image handling with Cloudinary
  - Search, filter, and pagination support

- [x] **API Routes Created**

  - `src/app/api/cloth/route.js` - Main CRUD operations
  - `src/app/api/cloth/stock/route.js` - Stock management

- [x] **Admin Components Integrated**
  - `src/app/dashboard/add-cloth/page.js` - Create new cloths
  - `src/app/dashboard/all-cloth/page.js` - Manage all cloths

---

## File Structure

```
src/app/
├── server/
│   ├── models/
│   │   └── Cloth.js (NEW)
│   └── controllers/
│       └── clothController.js (NEW)
├── api/
│   └── cloth/
│       ├── route.js (NEW)
│       └── stock/
│           └── route.js (NEW)
├── dashboard/
│   ├── add-cloth/
│   │   └── page.js (UPDATED)
│   └── all-cloth/
│       └── page.js (UPDATED)
└── cloth-design/
    └── page.js (existing viewer)
```

---

## Database Schema Summary

### Cloth Collection

| Field        | Type     | Required | Description                  |
| ------------ | -------- | -------- | ---------------------------- |
| name         | String   | ✓        | Unique cloth name            |
| description  | String   | ✓        | Detailed description         |
| price        | Number   | ✓        | Price in Naira (₦)           |
| color        | String   | ✓        | Cloth color                  |
| material     | String   | ✓        | Material composition         |
| sizes        | Array    | ✓        | Size/quantity pairs          |
| images       | Array    | ✓        | Cloudinary URLs and metadata |
| specs        | Array    | -        | Specification details        |
| inStock      | Boolean  | -        | Stock availability status    |
| featured     | Boolean  | -        | Featured display flag        |
| status       | String   | -        | active/inactive/discontinued |
| views        | Number   | -        | Total view count             |
| rating       | Number   | -        | 0-5 rating                   |
| totalReviews | Number   | -        | Number of reviews            |
| createdBy    | ObjectId | -        | Creator user reference       |
| updatedBy    | ObjectId | -        | Last updater reference       |
| createdAt    | Date     | -        | Creation timestamp           |
| updatedAt    | Date     | -        | Last update timestamp        |

---

## API Endpoints Summary

### Main Routes (`/api/cloth`)

| Method | Endpoint                   | Purpose                      |
| ------ | -------------------------- | ---------------------------- |
| GET    | `/api/cloth`               | Fetch all cloths (paginated) |
| GET    | `/api/cloth?id={id}`       | Get single cloth by ID       |
| GET    | `/api/cloth?name={name}`   | Get cloth by name            |
| GET    | `/api/cloth?featured=true` | Get featured cloths          |
| POST   | `/api/cloth`               | Create new cloth             |
| PUT    | `/api/cloth?id={id}`       | Update cloth                 |
| DELETE | `/api/cloth?id={id}`       | Delete cloth                 |

### Stock Management (`/api/cloth/stock`)

| Method | Endpoint                   | Purpose                |
| ------ | -------------------------- | ---------------------- |
| PUT    | `/api/cloth/stock?id={id}` | Update size quantities |

---

## Admin Component Features

### Add Cloth Component

**Access:** `/dashboard/add-cloth`

**Features:**

- ✓ Form with all required fields
- ✓ Cloudinary image upload (multiple)
- ✓ Size quantity inputs (XS-XXL)
- ✓ Specification fields
- ✓ Featured and status flags
- ✓ Real-time validation
- ✓ Image preview and removal
- ✓ Success notifications

**Required Environment Variables:**

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
```

### All Clothes Component

**Access:** `/dashboard/all-cloth`

**Features:**

- ✓ Table view of all cloths
- ✓ Search (name, description, color, material)
- ✓ Filter by status
- ✓ Sort options (date, name, price)
- ✓ Pagination controls
- ✓ View cloth (opens in new window)
- ✓ Edit cloth (modal form)
- ✓ Delete cloth (with confirmation)
- ✓ Visual stock indicators
- ✓ Image thumbnails

---

## Code Examples

### Create Cloth (Backend)

```javascript
POST /api/cloth
{
  "name": "LASU MBA T-Shirt",
  "description": "Professional t-shirt with LASU MBA logo",
  "price": 25000,
  "color": "Navy Blue",
  "material": "100% Cotton",
  "sizes": [
    { "size": "XS", "quantity": 5 },
    { "size": "S", "quantity": 10 },
    { "size": "M", "quantity": 15 },
    { "size": "L", "quantity": 12 },
    { "size": "XL", "quantity": 8 },
    { "size": "XXL", "quantity": 3 }
  ],
  "images": [
    {
      "url": "https://res.cloudinary.com/.../image.jpg",
      "publicId": "rayob/cloth/abc123",
      "alt": "Front view"
    }
  ],
  "specs": [
    { "label": "Fabric Type", "value": "100% Premium Cotton" },
    { "label": "Color", "value": "Navy Blue" },
    { "label": "Logo", "value": "Embroidered LASU MBA" },
    { "label": "Care", "value": "Machine Wash, Warm" },
    { "label": "Fit", "value": "Regular" }
  ],
  "featured": true,
  "status": "active"
}
```

### Fetch Cloths (Frontend)

```javascript
import axios from "axios";

// All cloths with pagination
const response = await axios.get("/api/cloth", {
  params: {
    page: 1,
    limit: 10,
    status: "active",
    sortBy: "-createdAt",
  },
});

// Featured cloths
const featured = await axios.get("/api/cloth?featured=true&limit=6");

// Search
const search = await axios.get("/api/cloth", {
  params: { search: "MBA" },
});
```

### Update Stock (Backend)

```javascript
PUT /api/cloth/stock?id={clothId}
{
  "sizeUpdates": [
    { "size": "M", "quantity": 20 },
    { "size": "L", "quantity": 25 },
    { "size": "XL", "quantity": 15 }
  ]
}
```

---

## Key Features

### 1. Image Management

- Cloudinary integration for image upload
- Automatic image deletion when cloth is deleted
- Support for multiple images per cloth
- Display order configuration

### 2. Inventory Management

- Track quantities by size
- Automatic stock status (in stock/out of stock)
- Stock update endpoint for bulk changes

### 3. Search & Filtering

- Full-text search across multiple fields
- Filter by status and featured flag
- Sort by date, name, and price
- Pagination support

### 4. Admin Interface

- Complete CRUD operations
- Bulk operations support
- Real-time feedback and validation
- Responsive design (mobile-friendly)

### 5. Data Integrity

- Unique cloth names (case-insensitive)
- Automatic timestamps
- Input validation on all fields
- Referential integrity for user fields

---

## Integration Points

### Connect to Authentication

Update controller functions to include auth checks:

```javascript
// In POST/PUT/DELETE endpoints
if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}
```

### Connect to User System

Update cloth creation to use current user:

```javascript
createdBy: req.user._id;
updatedBy: req.user._id;
```

### Add to Navigation

Add menu items in dashboard:

```javascript
<Link href="/dashboard/add-cloth">Add Cloth</Link>
<Link href="/dashboard/all-cloth">Manage Clothes</Link>
```

---

## Validation Rules

### Name

- ✓ Required
- ✓ Unique (case-insensitive)
- ✓ Max length: unlimited (trimmed)

### Price

- ✓ Required
- ✓ Must be > 0
- ✓ Supports decimals

### Images

- ✓ Required (at least 1)
- ✓ Must have URL and publicId
- ✓ Cloudinary hosted

### Status

- ✓ Must be: active, inactive, or discontinued
- ✓ Default: active

### Sizes

- ✓ Valid sizes: XS, S, M, L, XL, XXL, One Size
- ✓ Quantity >= 0

---

## Common Issues & Solutions

| Issue                | Solution                              |
| -------------------- | ------------------------------------- |
| Images not uploading | Check Cloudinary credentials          |
| Duplicate name error | Names are case-insensitive unique     |
| Stock not updating   | Ensure size names match exactly       |
| API not responding   | Check MongoDB connection              |
| 404 on routes        | Verify file paths use `.js` extension |

---

## Next Steps

1. **Test the Integration**

   - Create a test cloth in admin panel
   - View all cloths
   - Edit and delete cloths

2. **Add Authentication**

   - Implement auth middleware
   - Add user authorization to endpoints

3. **Customize as Needed**

   - Add more cloth categories
   - Implement advanced filtering
   - Add bulk operations

4. **Deploy**
   - Test in production environment
   - Set up proper environment variables
   - Configure Cloudinary account

---

## Support Files

- **Full Documentation:** `CLOTH_DESIGN_INTEGRATION_GUIDE.md`
- **Component Files:**
  - Add Cloth: `src/app/dashboard/add-cloth/page.js`
  - All Clothes: `src/app/dashboard/all-cloth/page.js`
- **API Files:**
  - Route: `src/app/api/cloth/route.js`
  - Stock: `src/app/api/cloth/stock/route.js`
- **Model:** `src/app/server/models/Cloth.js`
- **Controller:** `src/app/server/controllers/clothController.js`
