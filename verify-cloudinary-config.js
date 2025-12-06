import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

console.log('🔍 Cloudinary Configuration:');
console.log(`   Cloud Name: ${cloudName}`);
console.log(`   Upload Preset: ${uploadPreset}`);

if (!cloudName) {
  console.error('❌ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set!');
  process.exit(1);
}

if (!uploadPreset) {
  console.error('❌ NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set!');
  process.exit(1);
}

console.log('\n✅ All environment variables are configured correctly!');
console.log(`\n📝 Test upload URL:`);
console.log(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
console.log(`\n📝 With preset: ${uploadPreset}`);
