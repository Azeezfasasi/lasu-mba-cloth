import Cloth from '../models/Cloth.js';
import User from '../models/User.js';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
} from '../utils/cloudinaryService.js';
import mongoose from 'mongoose';

/**
 * Create a new cloth design
 */
export const createCloth = async (req, res) => {
  try {
    const { name, description, price, color, material, sizes, images, specs, featured, status, createdBy } = req.body;

    // Validate required fields
    if (!name || !description || !price || !color || !material) {
      return res.status(400).json({ 
        message: 'Name, description, price, color, and material are required' 
      });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Check if cloth name already exists
    const existingCloth = await Cloth.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existingCloth) {
      return res.status(400).json({ message: 'A cloth with this name already exists' });
    }

    // Process images
    const processedImages = images.map((img, index) => {
      return {
        url: img.url,
        publicId: img.publicId,
        alt: img.alt || '',
        displayOrder: index,
      };
    });

    // Process sizes
    const processedSizes = Array.isArray(sizes) ? sizes.map(size => ({
      size: size.size || size,
      quantity: size.quantity || 0,
    })) : [];

    // Process specs
    const processedSpecs = Array.isArray(specs) ? specs : [];

    const newCloth = new Cloth({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      color: color.trim(),
      material: material.trim(),
      sizes: processedSizes,
      images: processedImages,
      specs: processedSpecs,
      featured: featured || false,
      status: status || 'active',
      inStock: processedSizes.some(s => s.quantity > 0),
      createdBy: createdBy ? mongoose.Types.ObjectId(createdBy) : null,
    });

    const savedCloth = await newCloth.save();

    console.log('Cloth created successfully:', savedCloth._id);

    res.status(201).json({
      message: 'Cloth design created successfully',
      cloth: savedCloth,
    });
  } catch (error) {
    console.error('Error creating cloth:', error);
    res.status(500).json({
      message: 'Error creating cloth',
      error: error.message,
    });
  }
};

/**
 * Get single cloth by ID
 */
export const getCloth = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Cloth ID is required' });
    }

    const cloth = await Cloth.findById(id).populate('createdBy', 'name email');

    if (!cloth) {
      return res.status(404).json({ message: 'Cloth not found' });
    }

    // Increment view count
    cloth.views = (cloth.views || 0) + 1;
    await cloth.save();

    res.status(200).json(cloth);
  } catch (error) {
    console.error('Error fetching cloth:', error);
    res.status(500).json({
      message: 'Error fetching cloth',
      error: error.message,
    });
  }
};

/**
 * Get all cloths with filtering and pagination
 */
export const getAllClothes = async (req, res) => {
  try {
    const { status, featured, page = 1, limit = 10, search, sortBy = '-createdAt' } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { color: { $regex: search, $options: 'i' } },
        { material: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query
    const cloths = await Cloth.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email');

    const total = await Cloth.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      cloths,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    console.error('Error fetching cloths:', error);
    res.status(500).json({
      message: 'Error fetching cloths',
      error: error.message,
    });
  }
};

/**
 * Update cloth design
 */
export const updateCloth = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, color, material, sizes, images, specs, featured, status, updatedBy } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Cloth ID is required' });
    }

    const cloth = await Cloth.findById(id);

    if (!cloth) {
      return res.status(404).json({ message: 'Cloth not found' });
    }

    // Check if new name already exists (exclude current cloth)
    if (name && name !== cloth.name) {
      const existingCloth = await Cloth.findOne({ 
        name: { $regex: `^${name}$`, $options: 'i' },
        _id: { $ne: id }
      });
      if (existingCloth) {
        return res.status(400).json({ message: 'A cloth with this name already exists' });
      }
    }

    // Update fields
    if (name) cloth.name = name.trim();
    if (description) cloth.description = description.trim();
    if (price) cloth.price = parseFloat(price);
    if (color) cloth.color = color.trim();
    if (material) cloth.material = material.trim();

    if (sizes && Array.isArray(sizes)) {
      cloth.sizes = sizes.map(size => ({
        size: size.size || size,
        quantity: size.quantity || 0,
      }));
      cloth.inStock = sizes.some(s => s.quantity > 0);
    }

    if (images && Array.isArray(images)) {
      cloth.images = images.map((img, index) => ({
        url: img.url,
        publicId: img.publicId,
        alt: img.alt || '',
        displayOrder: index,
      }));
    }

    if (specs && Array.isArray(specs)) {
      cloth.specs = specs;
    }

    if (featured !== undefined) cloth.featured = featured;
    if (status) cloth.status = status;
    if (updatedBy) cloth.updatedBy = mongoose.Types.ObjectId(updatedBy);

    const updatedCloth = await cloth.save();

    res.status(200).json({
      message: 'Cloth updated successfully',
      cloth: updatedCloth,
    });
  } catch (error) {
    console.error('Error updating cloth:', error);
    res.status(500).json({
      message: 'Error updating cloth',
      error: error.message,
    });
  }
};

/**
 * Delete cloth design
 */
export const deleteCloth = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Cloth ID is required' });
    }

    const cloth = await Cloth.findById(id);

    if (!cloth) {
      return res.status(404).json({ message: 'Cloth not found' });
    }

    // Delete images from Cloudinary
    if (cloth.images && cloth.images.length > 0) {
      const publicIds = cloth.images.map(img => img.publicId);
      await deleteMultipleFromCloudinary(publicIds);
    }

    await Cloth.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Cloth deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting cloth:', error);
    res.status(500).json({
      message: 'Error deleting cloth',
      error: error.message,
    });
  }
};

/**
 * Get featured cloths
 */
export const getFeaturedClothes = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const limitNum = parseInt(limit) || 6;

    const cloths = await Cloth.find({ featured: true, status: 'active' })
      .sort('-createdAt')
      .limit(limitNum)
      .populate('createdBy', 'name email');

    res.status(200).json(cloths);
  } catch (error) {
    console.error('Error fetching featured cloths:', error);
    res.status(500).json({
      message: 'Error fetching featured cloths',
      error: error.message,
    });
  }
};

/**
 * Update cloth stock/size quantity
 */
export const updateClothStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { sizeUpdates } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Cloth ID is required' });
    }

    const cloth = await Cloth.findById(id);

    if (!cloth) {
      return res.status(404).json({ message: 'Cloth not found' });
    }

    if (!Array.isArray(sizeUpdates) || sizeUpdates.length === 0) {
      return res.status(400).json({ message: 'Size updates are required' });
    }

    // Update sizes
    sizeUpdates.forEach(update => {
      const sizeIndex = cloth.sizes.findIndex(s => s.size === update.size);
      if (sizeIndex !== -1) {
        cloth.sizes[sizeIndex].quantity = update.quantity;
      }
    });

    // Update inStock status
    cloth.inStock = cloth.sizes.some(s => s.quantity > 0);

    const updatedCloth = await cloth.save();

    res.status(200).json({
      message: 'Cloth stock updated successfully',
      cloth: updatedCloth,
    });
  } catch (error) {
    console.error('Error updating cloth stock:', error);
    res.status(500).json({
      message: 'Error updating cloth stock',
      error: error.message,
    });
  }
};

/**
 * Get cloth by name
 */
export const getClothByName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ message: 'Cloth name is required' });
    }

    const cloth = await Cloth.findOne({ 
      name: { $regex: `^${name}$`, $options: 'i' } 
    }).populate('createdBy', 'name email');

    if (!cloth) {
      return res.status(404).json({ message: 'Cloth not found' });
    }

    cloth.views = (cloth.views || 0) + 1;
    await cloth.save();

    res.status(200).json(cloth);
  } catch (error) {
    console.error('Error fetching cloth:', error);
    res.status(500).json({
      message: 'Error fetching cloth',
      error: error.message,
    });
  }
};
