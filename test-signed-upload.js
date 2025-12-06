import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('Testing SIGNED upload (this should work)...\n');

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

async function testSignedUpload() {
  try {
    const testFile = path.join(os.tmpdir(), 'test-upload.png');
    await fs.promises.writeFile(testFile, pngBuffer);

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = {
      timestamp,
      public_id: 'test_rayob_cloth',
    };

    // Create signature
    const paramsStr = Object.entries(paramsToSign)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    const toSign = paramsStr + apiSecret;
    const signature = crypto.createHash('sha1').update(toSign).digest('hex');

    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFile), { filename: 'test-upload.png' });
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('public_id', 'test_rayob_cloth');
    formData.append('signature', signature);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log(`📤 Sending SIGNED upload...\n`);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    console.log(`📊 Response Status: ${response.status}`);
    
    if (response.ok) {
      console.log('\n✅ SIGNED upload successful!');
      console.log(`   URL: ${data.secure_url}`);
      console.log(`   Public ID: ${data.public_id}`);
      console.log('\n✅ Cloudinary connectivity works!');
      console.log('\nℹ️  The issue is with UNSIGNED uploads on this account.');
      console.log('   Your account might not have unsigned uploads enabled.');
      console.log('\n💡 Solution: Use server-side signed uploads for cloth images');
    } else {
      console.error('\n❌ SIGNED upload also failed!');
      console.error(JSON.stringify(data, null, 2));
    }

    await fs.promises.unlink(testFile);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSignedUpload();
