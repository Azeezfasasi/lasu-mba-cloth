import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function fixPreset() {
  try {
    console.log('🔄 Deleting old preset...');
    try {
      await cloudinary.v2.api.delete_upload_preset('rayob_cloth_upload');
      console.log('✅ Old preset deleted');
    } catch (e) {
      console.log('ℹ️  No old preset to delete');
    }

    console.log('\n🔄 Creating new unsigned preset...');
    const result = await cloudinary.v2.api.create_upload_preset({
      name: 'rayob_cloth_upload',
      unsigned: true,
    });
    
    console.log('✅ New preset created!');
    console.log(`\n📋 Preset Details:`);
    console.log(`   Name: ${result.name}`);
    console.log(`   Unsigned: ${result.unsigned}`);
    console.log(`   ID: ${result.name}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixPreset();
