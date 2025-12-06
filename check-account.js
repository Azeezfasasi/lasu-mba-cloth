import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function checkAccount() {
  try {
    console.log('🔍 Checking Cloudinary Account Settings...\n');
    
    const result = await cloudinary.v2.api.root_folders();
    console.log('✅ API is accessible');
    
    // Get account details
    const me = await cloudinary.v2.api.ping();
    console.log('✅ Ping successful:', me);

    // List all presets
    const presets = await cloudinary.v2.api.upload_presets();
    console.log(`\n📋 Total Upload Presets: ${presets.presets.length}`);
    
    presets.presets.forEach(p => {
      console.log(`\n   Name: ${p.name}`);
      console.log(`   Unsigned: ${p.unsigned === true ? '✅ YES' : '❌ NO'}`);
      console.log(`   ID: ${p.external_id}`);
    });

    // Check if our preset is there
    const ourPreset = presets.presets.find(p => p.name === 'rayob_cloth_upload');
    if (ourPreset) {
      console.log(`\n✅ rayob_cloth_upload found!`);
      console.log(`   Full details: ${JSON.stringify(ourPreset, null, 2)}`);
    } else {
      console.log(`\n❌ rayob_cloth_upload NOT found`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAccount();
