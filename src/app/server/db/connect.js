import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

let cached = null;

export const connectDB = async () => {
  try {
    // Return cached connection if available
    if (cached) {
      console.log('✅ Using cached MongoDB connection');
      return cached;
    }

    const connection = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
    });

    cached = connection;
    console.log('✅ MongoDB connected');
    return connection;
  } catch (error) {
    console.error('❌ Database connection failed', error);
    throw error;
  }
};
