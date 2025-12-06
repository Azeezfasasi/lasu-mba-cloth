# Cloth Design 360 Viewer - Integration Guide

## Overview

This document provides complete integration details for the ClothDesign360Viewer with the Next.js backend, including the API routes, database models, and admin components.

## Table of Contents

1. [Database Model](#database-model)
2. [API Routes](#api-routes)
3. [Controller Functions](#controller-functions)
4. [Admin Components](#admin-components)
5. [Usage Examples](#usage-examples)
6. [Deployment Notes](#deployment-notes)

---

## Database Model

### Cloth Model (`src/app/server/models/Cloth.js`)

The Cloth model stores all cloth design information with the following structure:

```javascript
{
  name: String (required, unique),
  description: String (required),
  price: Number (required),
  color: String (required),
  material: String (required),
  sizes: [{
    size: String (enum: XS, S, M, L, XL, XXL, One Size),
    quantity: Number
  }],
  images: [{
    url: String (Cloudinary URL),
    publicId: String (for Cloudinary deletion),
    alt: String,
    displayOrder: Number
  }],
  specs: [{
    label: String,
    value: String
  }],
  inStock: Boolean,
  featured: Boolean,
  status: String (enum: active, inactive, discontinued),
  views: Number,
  rating: Number (0-5),
  totalReviews: Number,
  createdBy: ObjectId (ref: User),
  updatedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `name` - For quick name lookups
- `status` - For filtering active cloths
- `featured` - For featured cloths queries
- `color` - For color-based filtering
- `createdAt` - For sorting by date

---

## API Routes

### Base Endpoint: `/api/cloth`

#### 1. **GET All Cloths**

```
GET /api/cloth?page=1&limit=10&search=&status=&sortBy=-createdAt
```

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `search` (optional) - Search by name, description, color, or material
- `status` (optional) - Filter by status (active, inactive, discontinued)
- `featured` (optional) - Set to 'true' to get featured items only
- `sortBy` (optional, default: -createdAt) - Sort field with - for descending

**Response:**

```json
{
  "cloths": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

#### 2. **GET Single Cloth by ID**

```
GET /api/cloth?id=clothId
```

**Response:**

```json
{
  "_id": "...",
  "name": "LASU MBA T-Shirt",
  "description": "...",
  "price": 25000,
  "color": "Navy Blue",
  "material": "100% Wool Blend",
  "views": 42,
  ...
}
```

#### 3. **GET Cloth by Name**

```
GET /api/cloth?name=LASU%20MBA%20T-Shirt
```

#### 4. **GET Featured Cloths**

```
GET /api/cloth?featured=true&limit=6
```

#### 5. **CREATE New Cloth**

```
POST /api/cloth
Content-Type: application/json

{
  "name": "LASU MBA T-Shirt",
  "description": "Professional navy blue blazer with embroidered LASU MBA logo",
  "price": 25000,
  "color": "Navy Blue",
  "material": "100% Wool Blend",
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
      "url": "https://cloudinary.com/...",
      "publicId": "rayob/cloth/...",
      "alt": "Front view",
      "displayOrder": 0
    }
  ],
  "specs": [
    { "label": "Fabric Type", "value": "100% Premium Wool Blend" },
    { "label": "Color", "value": "Navy Blue" },
    { "label": "Logo", "value": "Embroidered LASU MBA" },
    { "label": "Care", "value": "Dry Clean Only" },
    { "label": "Fit", "value": "Regular/Tailored" }
  ],
  "featured": false,
  "status": "active",
  "createdBy": "userId"
}
```

#### 6. **UPDATE Cloth**

```
PUT /api/cloth?id=clothId
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 30000,
  "sizes": [...],
  "images": [...],
  "specs": [...],
  "featured": true,
  "status": "active",
  "updatedBy": "userId"
}
```

#### 7. **DELETE Cloth**

```
DELETE /api/cloth?id=clothId
```

#### 8. **UPDATE Cloth Stock**

```
PUT /api/cloth/stock?id=clothId
Content-Type: application/json

{
  "sizeUpdates": [
    { "size": "M", "quantity": 20 },
    { "size": "L", "quantity": 15 }
  ]
}
```

---

## Controller Functions

### Location: `src/app/server/controllers/clothController.js`

#### Available Functions:

1. **createCloth(req, res)**

   - Creates a new cloth design
   - Validates unique name
   - Processes images and specifications

2. **getCloth(req, res)**

   - Retrieves single cloth by ID
   - Increments view count

3. **getAllClothes(req, res)**

   - Fetches all cloths with pagination and filtering
   - Supports search across name, description, color, material
   - Supports sorting and status filtering

4. **updateCloth(req, res)**

   - Updates cloth design
   - Validates unique name (excluding current cloth)
   - Updates timestamps

5. **deleteCloth(req, res)**

   - Deletes cloth and associated Cloudinary images
   - Removes multiple images from Cloudinary

6. **getFeaturedClothes(req, res)**

   - Returns featured active cloths
   - Limited by optional limit parameter (default: 6)

7. **updateClothStock(req, res)**

   - Updates specific size quantities
   - Automatically updates inStock status

8. **getClothByName(req, res)**
   - Retrieves cloth by name (case-insensitive)
   - Increments view count

---

## Admin Components

### 1. Add Cloth Component

**Location:** `src/app/dashboard/add-cloth/page.js`

**Features:**

- Form validation for all required fields
- Image upload to Cloudinary
- Size quantity inputs for all 6 standard sizes
- Specification fields for fabric details
- Featured flag and status selection
- Real-time image preview with removal option
- Success/error notifications

**Form Sections:**

- Basic Information (name, price, description, color, material)
- Sizes & Stock (quantities for XS-XXL)
- Specifications (fabric type, color, logo, care, fit)
- Images (drag & drop upload)

**Environment Variables Required:**

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 2. All Clothes Component

**Location:** `src/app/dashboard/all-cloth/page.js`

**Features:**

- Table view of all cloths
- Search functionality (by name, description, color, material)
- Filter by status (active, inactive, discontinued)
- Sort options (date, name, price)
- Pagination with next/previous buttons
- Edit cloth modal
- Delete cloth with confirmation
- View cloth functionality
- Visual indicators for stock status

**Modal Features:**

- Edit cloth information
- Update sizes and stock
- Change featured and status flags
- Real-time validation

---

## Usage Examples

### Creating a Cloth from Frontend

```javascript
import axios from "axios";

const createCloth = async (clothData) => {
  try {
    const response = await axios.post("/api/cloth", {
      name: "LASU MBA Polo Shirt",
      description: "Comfortable polo shirt with LASU MBA embroidery",
      price: 8500,
      color: "White/Navy",
      material: "65% Polyester, 35% Cotton",
      sizes: [
        { size: "XS", quantity: 5 },
        { size: "S", quantity: 10 },
        // ... more sizes
      ],
      images: [
        {
          url: "https://...",
          publicId: "rayob/cloth/...",
          alt: "Polo front view",
        },
      ],
      specs: [
        { label: "Fabric Type", value: "65% Polyester, 35% Cotton" },
        // ... more specs
      ],
      featured: true,
      status: "active",
      createdBy: userId,
    });

    console.log("Cloth created:", response.data);
  } catch (error) {
    console.error("Error creating cloth:", error);
  }
};
```

### Fetching Cloths

```javascript
// Get all cloths with pagination
const fetchClothes = async (page = 1) => {
  const response = await axios.get("/api/cloth", {
    params: {
      page,
      limit: 10,
      status: "active",
      sortBy: "-createdAt",
    },
  });
  return response.data;
};

// Get featured cloths
const getFeatured = async () => {
  const response = await axios.get("/api/cloth?featured=true&limit=6");
  return response.data;
};

// Search cloths
const searchClothes = async (searchTerm) => {
  const response = await axios.get("/api/cloth", {
    params: {
      search: searchTerm,
      page: 1,
    },
  });
  return response.data;
};
```

### Updating Cloth Stock

```javascript
const updateStock = async (clothId) => {
  const response = await axios.put(`/api/cloth/stock?id=${clothId}`, {
    sizeUpdates: [
      { size: "M", quantity: 20 },
      { size: "L", quantity: 15 },
    ],
  });
  return response.data;
};
```

---

## Deployment Notes

### Environment Setup

1. **Database Connection**

   - Ensure MongoDB is connected via `connectDB()` in routes
   - Connection string should be in `.env.local`

2. **Cloudinary Setup**

   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
     NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```

3. **File Permissions**
   - Ensure API routes have proper access to controller files
   - Controller imports should use `.js` extension

### Performance Considerations

1. **Image Optimization**

   - Use Cloudinary transformations for different sizes
   - Example: `url?w=300&h=300&c=fill`

2. **Pagination**

   - Default limit is 10 items per page
   - Adjust in admin components as needed

3. **Indexing**
   - All important query fields are indexed
   - Consider adding more indexes if queries are slow

### Security Considerations

1. **Authentication**

   - Consider adding auth middleware to POST/PUT/DELETE endpoints
   - Add user authorization checks in controller functions

2. **Input Validation**

   - All required fields are validated
   - Price is converted to number
   - Status is validated against enum values

3. **Image Deletion**
   - When updating/deleting cloths, old Cloudinary images are deleted
   - Uses publicId for safe deletion

### Troubleshooting

**Issue: Images not uploading**

- Check Cloudinary credentials in `.env.local`
- Verify upload preset is set to unsigned

**Issue: Duplicate name error**

- Names are case-insensitive unique
- Check existing cloths for similar names

**Issue: Stock not updating**

- Ensure size strings match exactly (XS, S, M, L, XL, XXL)
- Check that sizes array exists in cloth record

---

## API Response Examples

### Success Response

```json
{
  "message": "Cloth design created successfully",
  "cloth": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "LASU MBA T-Shirt",
    "price": 25000,
    "color": "Navy Blue",
    "material": "100% Wool Blend",
    "inStock": true,
    "status": "active",
    "views": 0,
    "createdAt": "2024-12-06T10:00:00Z",
    "updatedAt": "2024-12-06T10:00:00Z"
  }
}
```

### Error Response

```json
{
  "message": "Error creating cloth",
  "error": "A cloth with this name already exists"
}
```

---

## Future Enhancements

1. **Review System**

   - Add customer reviews to cloths
   - Update rating based on reviews

2. **Inventory Management**

   - Low stock alerts
   - Automatic status update when out of stock

3. **Image Gallery**

   - Support 360-degree image rotation
   - Multiple viewing angles per cloth

4. **Bulk Operations**

   - Bulk upload multiple cloths
   - Bulk status updates

5. **Analytics**
   - Track most viewed cloths
   - Purchase statistics

---

## Support & Documentation

For additional help, refer to:

- [Next.js Documentation](https://nextjs.org/docs)
- [Mongoose Documentation](https://mongoosejs.com)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Axios Documentation](https://axios-http.com)
