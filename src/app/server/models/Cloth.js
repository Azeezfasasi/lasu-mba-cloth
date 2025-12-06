import mongoose from 'mongoose';

// Cloth Specification Schema
const specSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
}, { _id: false });

// Cloth Size Schema
const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
  },
  quantity: {
    type: Number,
    default: 0,
  },
}, { _id: false });

// Cloth Image Schema
const clothImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true, // Cloudinary public ID for deletion
  },
  alt: {
    type: String,
    default: '',
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, { _id: false });

// Main Cloth Schema
const clothSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Cloth name is required'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Cloth description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    trim: true,
  },
  material: {
    type: String,
    required: [true, 'Material is required'],
    trim: true,
  },
  sizes: [sizeSchema],
  images: [clothImageSchema],
  specs: [specSchema],
  inStock: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active',
  },
  views: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Middleware to update updatedAt timestamp
clothSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better query performance
clothSchema.index({ name: 1 });
clothSchema.index({ status: 1 });
clothSchema.index({ featured: 1 });
clothSchema.index({ color: 1 });
clothSchema.index({ createdAt: -1 });

const Cloth = mongoose.models.Cloth || mongoose.model('Cloth', clothSchema);

export default Cloth;
