import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function listPresets() {
  try {
    console.log('📋 Fetching upload presets...\n');
    const result = await cloudinary.v2.api.upload_presets();
    
    const preset = result.presets.find(p => p.name === 'rayob_cloth_upload');
    
    if (preset) {
      console.log('✅ Found preset: rayob_cloth_upload');
      console.log(`\n📝 Full Preset Details:`);
      console.log(JSON.stringify(preset, null, 2));
    } else {
      console.log('❌ Preset not found!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listPresets();
