import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import path from 'path';
import os from 'os';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

console.log('Testing Cloudinary unsigned upload with actual API call...');
console.log(`Cloud: ${cloudName}`);
console.log(`Preset: ${uploadPreset}\n`);

// Create a simple test file (1x1 pixel PNG)
const pngBuffer = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
  0x89, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x44, 0x41,
  0x54, 0x08, 0x5B, 0x63, 0xF8, 0x0F, 0x00, 0x00,
  0x01, 0x01, 0x00, 0x00, 0x18, 0xDD, 0x8D, 0xB4,
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
  0xAE, 0x42, 0x60, 0x82
]);

const FormData = (await import('form-data')).default;
const fs = await import('fs');

async function testUpload() {
  try {
    // Write test image to temp file
    const testFile = path.join(os.tmpdir(), 'test-upload.png');
    await fs.promises.writeFile(testFile, pngBuffer);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFile));
    formData.append('upload_preset', uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log(`📤 Sending POST to: ${url}\n`);
    console.log(`📋 Form data:`);
    console.log(`   - file: test image`);
    console.log(`   - upload_preset: ${uploadPreset}\n`);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    console.log(`📊 Response Body:`);
    console.log(JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Upload successful!');
      console.log(`   URL: ${data.secure_url}`);
      console.log(`   Public ID: ${data.public_id}`);
    } else {
      console.error('\n❌ Upload failed!');
    }

    // Cleanup
    await fs.promises.unlink(testFile);

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  }
}

testUpload();
