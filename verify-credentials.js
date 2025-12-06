import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import cloudinary from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('🔍 Verifying Cloudinary Credentials...\n');
console.log(`Cloud Name: ${cloudName}`);
console.log(`API Key: ${apiKey?.substring(0, 10)}...`);
console.log(`API Secret: ${apiSecret?.substring(0, 10)}...`);

cloudinary.v2.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

async function verifyCredentials() {
  try {
    console.log('\n✅ Attempting API call...');
    const result = await cloudinary.v2.api.resources_by_tag('test');
    console.log('✅ API credentials are VALID');
    console.log(`   Found resources with tag "test": ${result.resources?.length || 0}`);

    // Try to get account info
    const account = await cloudinary.v2.api.account();
    console.log(`\n✅ Account info:`);
    console.log(`   Email: ${account.email}`);
    console.log(`   Account type: ${account.account_type}`);
    console.log(`   Account ID: ${account.account_id}`);

  } catch (error) {
    console.error('❌ API Error:', error.message);
    if (error.message.includes('Unauthorized')) {
      console.error('\n❌❌❌ INVALID API CREDENTIALS!');
      console.error('   The Cloud Name, API Key, or API Secret is incorrect.');
    }
  }
}

verifyCredentials();
