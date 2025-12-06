import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function createUploadPreset() {
  try {
    console.log('🔄 Checking for existing "rayob_cloth_upload" preset...');
    
    // List presets
    const presets = await cloudinary.v2.api.upload_presets();
    const existingPreset = presets.presets.find(p => p.name === 'rayob_cloth_upload');
    
    if (existingPreset) {
      console.log('✅ Preset "rayob_cloth_upload" already exists!');
      console.log(`   Unsigned: ${existingPreset.unsigned}`);
      return;
    }
    
    console.log('Creating new unsigned upload preset...');
    const result = await cloudinary.v2.api.create_upload_preset({
      name: 'rayob_cloth_upload',
      unsigned: true,
      folder: 'rayob-cloth-designs',
      resource_type: 'auto',
      allowed_formats: 'jpg,jpeg,png,gif,webp',
      max_file_size: 5242880, // 5MB
    });
    
    console.log('✅ Preset created successfully!');
    console.log(`   Name: ${result.name}`);
    console.log(`   Unsigned: ${result.unsigned}`);
    console.log(`   Folder: ${result.folder}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('already exists')) {
      console.log('✅ Preset already exists (from another account session)');
    }
  }
}

createUploadPreset();
