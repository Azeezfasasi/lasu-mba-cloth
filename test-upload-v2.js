import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import path from 'path';
import os from 'os';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

console.log('Testing with URLSearchParams (alternative method)...');
console.log(`Cloud: ${cloudName}`);
console.log(`Preset: ${uploadPreset}\n`);

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

async function testUploadWithURL() {
  try {
    const testFile = path.join(os.tmpdir(), 'test-upload.png');
    await fs.promises.writeFile(testFile, pngBuffer);

    const formData = new FormData();
    const stream = fs.createReadStream(testFile);
    formData.append('file', stream, { filename: 'test-upload.png' });
    formData.append('upload_preset', uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log(`📤 Using FormData.append with filename...\n`);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // FormData automatically sets Content-Type with boundary
    });

    const responseText = await response.text();
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📊 Response Headers:`);
    [...response.headers.entries()].forEach(([k, v]) => {
      console.log(`   ${k}: ${v}`);
    });

    try {
      const data = JSON.parse(responseText);
      console.log(`\n📝 Response Body:`);
      console.log(JSON.stringify(data, null, 2));

      if (response.ok) {
        console.log('\n✅ Upload successful!');
      } else {
        console.error('\n❌ Upload failed!');
        if (data.error) {
          console.error(`   Error: ${data.error.message}`);
        }
      }
    } catch (e) {
      console.log(responseText);
    }

    await fs.promises.unlink(testFile);

  } catch (error) {
    console.error('Error:', error);
  }
}

testUploadWithURL();
