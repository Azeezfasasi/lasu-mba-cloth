import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function updatePreset() {
  try {
    console.log('🔄 Updating "rayob_cloth_upload" preset to enable unsigned uploads...');
    
    const result = await cloudinary.v2.api.update_upload_preset('rayob_cloth_upload', {
      unsigned: true,
      folder: 'rayob-cloth-designs',
      allowed_formats: 'jpg,jpeg,png,gif,webp',
      max_file_size: 5242880, // 5MB
    });
    
    console.log('✅ Preset updated successfully!');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

updatePreset();
