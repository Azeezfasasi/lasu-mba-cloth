# ClothDesign360Viewer - Backend Integration Summary

## Integration Status: ✅ COMPLETE

The `ClothDesign360Viewer` component has been fully integrated with the backend API. It now fetches real cloth data from the database instead of using hardcoded values.

---

## What Changed

### Before (Hardcoded Data)

```javascript
const cloths = [
  {
    id: 1,
    name: "LASU MBA T-Shirt",
    // ... hardcoded values
  },
  // ... more hardcoded items
];
```

### After (API Integration)

```javascript
// Fetch cloths from API on component mount
useEffect(() => {
  const fetchClothes = async () => {
    const response = await axios.get("/api/cloth", {
      params: {
        status: "active",
        limit: 100,
        sortBy: "-featured",
      },
    });
    setClothes(response.data.cloths || []);
  };
  fetchClothes();
}, []);
```

---

## New Features Implemented

### 1. **API Integration**

- ✅ Fetches cloth data from `/api/cloth` endpoint
- ✅ Displays only active cloths (status: 'active')
- ✅ Orders by featured items first
- ✅ Handles loading and error states

### 2. **State Management**

- ✅ `cloths` - Array of cloth objects from API
- ✅ `selectedClothIndex` - Currently selected cloth
- ✅ `selectedSize` - User's selected size
- ✅ `loading` - Loading state while fetching data
- ✅ `error` - Error messages
- ✅ `cartSuccess` - Add-to-cart feedback
- ✅ `addingToCart` - Button loading state

### 3. **Shopping Cart Integration**

- ✅ Add to cart functionality with localStorage
- ✅ Size selection validation
- ✅ Quantity tracking
- ✅ Success notifications (auto-dismiss after 3 seconds)
- ✅ Stores cart data in browser localStorage

```javascript
// Cart item structure
{
  clothId: "...",
  name: "LASU MBA T-Shirt",
  price: 25000,
  size: "M",
  quantity: 1,
  image: "https://...",
  addedAt: "2024-12-06T..."
}
```

### 4. **Real Data Display**

- ✅ Product images from Cloudinary URLs
- ✅ Actual prices from database (formatted in Naira)
- ✅ Real specifications from database
- ✅ Available sizes based on inventory
- ✅ Stock status (in stock/out of stock)

### 5. **Image Gallery**

- ✅ Displays first image as main viewer
- ✅ Additional images shown as thumbnails
- ✅ Click to switch between images
- ✅ Lazy loading via Cloudinary URLs

### 6. **Loading & Error States**

- ✅ Loading spinner while fetching data
- ✅ Error message with retry button
- ✅ Empty state when no cloths available
- ✅ Graceful fallbacks for missing data

### 7. **Size Management**

- ✅ Shows available sizes from database
- ✅ Handles single-size items (e.g., ties)
- ✅ Size selection validation before cart
- ✅ Displays size quantity/availability

---

## API Endpoints Used

### GET /api/cloth

**Purpose:** Fetch all active cloth designs

**Request:**

```
GET /api/cloth?status=active&limit=100&sortBy=-featured
```

**Response:**

```json
{
  "cloths": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "LASU MBA T-Shirt",
      "description": "Professional navy blue blazer with embroidered LASU MBA logo",
      "price": 25000,
      "color": "Navy Blue",
      "material": "100% Wool Blend",
      "sizes": [
        { "size": "XS", "quantity": 5 },
        { "size": "S", "quantity": 10 },
        { "size": "M", "quantity": 15 }
        // ...
      ],
      "images": [
        {
          "url": "https://res.cloudinary.com/.../image.jpg",
          "publicId": "rayob/cloth/abc123",
          "alt": "Front view"
        }
      ],
      "specs": [
        { "label": "Fabric Type", "value": "100% Premium Wool Blend" },
        { "label": "Color", "value": "Navy Blue" }
        // ...
      ],
      "inStock": true,
      "featured": true,
      "status": "active",
      "views": 42,
      "createdAt": "2024-12-06T..."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 4,
    "itemsPerPage": 100
  }
}
```

---

## Component Functions

### `fetchClothes()`

- Triggered on component mount
- Sets loading state
- Fetches from API
- Handles errors gracefully

### `handleAddToCart()`

- Validates size selection
- Creates cart item object
- Checks for existing items
- Updates quantity or adds new item
- Stores in localStorage
- Shows success notification

### `formatPrice(price)`

- Converts number to Naira format
- Fallback for string prices
- Example: `25000` → `₦25,000`

### `handleMouseDown/Move/Up()`

- Handles drag-to-rotate functionality
- Updates rotation state
- Works across all drag operations

### `handleTouchStart/Move()`

- Mobile touch support
- Same rotation logic as mouse

---

## Component Hooks & Effects

### `useEffect - Fetch Cloths`

```javascript
useEffect(() => {
  const fetchClothes = async () => {
    // Fetch from API
  };
  fetchClothes();
}, []);
```

**Runs on:** Component mount only

### `useEffect - Mouse/Touch Events`

(Already existed, unchanged)
**Runs on:** isDragging or dragStart changes

---

## Data Transformation

### Before Storage

```javascript
// From API response
{
  _id: "...",
  price: 25000,
  sizes: [{ size: "M", quantity: 15 }, ...]
  images: [{ url: "...", publicId: "...", alt: "..." }, ...]
}
```

### Display in Component

```javascript
// Current cloth data
currentCloth = cloths[selectedClothIndex];

// Display price with formatting
formatPrice(currentCloth.price); // ₦25,000

// Display images
currentCloth.images[0].url; // Direct URL to Cloudinary

// Display sizes
currentCloth.sizes.map((s) => s.size); // ['XS', 'S', 'M', ...]
```

---

## Local Storage Structure

### Cart Storage

```javascript
// localStorage key: 'cart'
[
  {
    clothId: "507f1f77bcf86cd799439011",
    name: "LASU MBA T-Shirt",
    price: 25000,
    size: "M",
    quantity: 1,
    image: "https://res.cloudinary.com/.../image.jpg",
    addedAt: "2024-12-06T10:30:00Z",
  },
];
```

---

## Error Handling

### Network Errors

- Catches fetch failures
- Displays user-friendly error message
- Provides retry button

### Missing Data

- Gracefully handles missing images
- Falls back to emoji display
- Shows placeholder specs message
- Handles undefined sizes array

### Validation

- Requires size selection before cart
- Checks for empty cloths array
- Validates price format

---

## Performance Optimizations

1. **Limited API Results**

   - Fetches up to 100 items (configurable)
   - Sorts by featured first for relevant items

2. **Image Optimization**

   - Cloudinary URLs support transformation
   - Can add width/height parameters if needed
   - Lazy loading via browser

3. **State Management**

   - Only re-renders when state changes
   - Refs used for DOM elements
   - Efficient event listeners

4. **Caching**
   - Cart stored in localStorage
   - No redundant API calls
   - Single fetch on mount

---

## Usage Instructions

### For Users

1. **Browse Cloths**: Visit `/cloth-design` to see all active cloths
2. **Select Product**: Click on any cloth in the gallery
3. **View Details**: Scroll to see specifications and images
4. **Choose Size**: Click a size button to select
5. **Add to Cart**: Click "Add to Cart" button
6. **Confirmation**: Green notification appears

### For Developers

1. **Create Cloths**: Use `/dashboard/add-cloth` admin panel
2. **Edit Cloths**: Use `/dashboard/all-cloth` admin panel
3. **View Cart**: Check localStorage.getItem('cart')
4. **Test API**: GET `/api/cloth?status=active`

---

## Testing Checklist

- [x] Component loads without errors
- [x] API data displays correctly
- [x] Images render from Cloudinary
- [x] Sizes are selectable
- [x] Add to cart stores data
- [x] Success notification appears
- [x] Error handling works
- [x] Loading state displays
- [x] Mobile touch events work
- [x] Price formatting works

---

## Next Steps / Future Enhancements

1. **Cart Management**

   - Create cart page to view items
   - Update quantities from cart
   - Remove items
   - Calculate total

2. **Checkout**

   - Integrate payment gateway
   - Order creation
   - Email confirmations

3. **Reviews & Ratings**

   - Add customer reviews
   - Display average ratings
   - Filter by rating

4. **Recommendations**

   - Show related items
   - "Also Bought" section
   - Personalized suggestions

5. **Analytics**
   - Track page views
   - Conversion tracking
   - Popular items dashboard

---

## Troubleshooting

### Issue: Cloths not loading

**Solution:**

- Check if MongoDB is connected
- Verify API route exists
- Check browser console for errors
- Ensure cloths exist in database with status: 'active'

### Issue: Images not displaying

**Solution:**

- Verify Cloudinary URLs are valid
- Check image permissions
- Try accessing URL directly
- Ensure image format is supported

### Issue: Size selection not working

**Solution:**

- Check if sizes array is populated
- Verify size format matches
- Check console for state updates

### Issue: Cart not persisting

**Solution:**

- Check if localStorage is enabled
- Verify cart key in localStorage
- Check browser storage quota
- Clear cache and retry

---

## File Locations

- **Component:** `src/app/cloth-design/page.js`
- **API Route:** `src/app/api/cloth/route.js`
- **Controller:** `src/app/server/controllers/clothController.js`
- **Model:** `src/app/server/models/Cloth.js`
- **Admin Create:** `src/app/dashboard/add-cloth/page.js`
- **Admin Manage:** `src/app/dashboard/all-cloth/page.js`

---

## Dependencies

- `axios` - API requests
- `react` - UI framework
- `lucide-react` - Icons
- `next` - Framework
- (localStorage - native browser API)

---

## Integration Complete ✅

The ClothDesign360Viewer is now fully integrated with the backend and ready for production use!
