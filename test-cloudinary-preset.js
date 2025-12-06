import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function listUploadPresets() {
  try {
    console.log('Fetching upload presets...');
    const presets = await cloudinary.v2.api.upload_presets();
    
    console.log('\n✅ Available Upload Presets:');
    presets.presets.forEach(preset => {
      console.log(`- Name: ${preset.name}`);
      console.log(`  Unsigned: ${preset.unsigned || false}`);
      console.log(`  Settings: ${JSON.stringify(preset.settings || {})}\n`);
    });

    const hasPreset = presets.presets.some(p => p.name === 'rayob_cloth_upload');
    if (hasPreset) {
      console.log('✅ "rayob_cloth_upload" preset exists!');
    } else {
      console.log('❌ "rayob_cloth_upload" preset NOT FOUND!');
      console.log('\nYou need to create this preset in Cloudinary:');
      console.log('1. Go to https://cloudinary.com/console/settings/upload');
      console.log('2. Create a new unsigned upload preset named "rayob_cloth_upload"');
      console.log('3. Make sure "Unsigned" is enabled');
    }
  } catch (error) {
    console.error('Error fetching presets:', error.message);
  }
}

listUploadPresets();
