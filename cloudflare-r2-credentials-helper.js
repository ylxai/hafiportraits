#!/usr/bin/env node

/**
 * Cloudflare R2 Credentials Helper
 * Interactive setup untuk credentials
 */

const readline = require('readline');
const fs = require('fs').promises;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function setupCredentials() {
  console.log('\n🔑 CLOUDFLARE R2 CREDENTIALS SETUP');
  console.log('=====================================\n');
  
  console.log('📋 You need these credentials from Cloudflare Dashboard:');
  console.log('   1. Account ID');
  console.log('   2. Access Key ID');
  console.log('   3. Secret Access Key');
  console.log('   4. Bucket Name\n');
  
  console.log('🌐 Get credentials from: https://dash.cloudflare.com/\n');
  
  const proceed = await question('Do you have your Cloudflare R2 credentials ready? (y/n): ');
  
  if (proceed.toLowerCase() !== 'y') {
    console.log('\n📖 Please follow the setup guide first:');
    console.log('   CLOUDFLARE_R2_SETUP_STEP_BY_STEP.md\n');
    rl.close();
    return;
  }
  
  console.log('\n📝 Enter your Cloudflare R2 credentials:\n');
  
  const accountId = await question('Account ID: ');
  const accessKeyId = await question('Access Key ID: ');
  const secretAccessKey = await question('Secret Access Key: ');
  const bucketName = await question('Bucket Name (default: hafiportrait-photos): ') || 'hafiportrait-photos';
  
  console.log('\n🔍 Validating credentials format...');
  
  // Basic validation
  const errors = [];
  
  if (!accountId || accountId.length < 10) {
    errors.push('Account ID seems too short');
  }
  
  if (!accessKeyId || accessKeyId.length < 10) {
    errors.push('Access Key ID seems too short');
  }
  
  if (!secretAccessKey || secretAccessKey.length < 20) {
    errors.push('Secret Access Key seems too short');
  }
  
  if (!bucketName || bucketName.length < 3) {
    errors.push('Bucket name seems too short');
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Validation errors:');
    errors.forEach(error => console.log(`   - ${error}`));
    console.log('\n💡 Please check your credentials and try again\n');
    rl.close();
    return;
  }
  
  console.log('✅ Credentials format looks good\n');
  
  // Create environment variables
  const envContent = `# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCOUNT_ID="${accountId}"
CLOUDFLARE_R2_ACCESS_KEY_ID="${accessKeyId}"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="${secretAccessKey}"
CLOUDFLARE_R2_BUCKET_NAME="${bucketName}"

# Optional: Custom domain (setup later)
# CLOUDFLARE_R2_CUSTOM_DOMAIN="photos.hafiportrait.photography"

# Storage strategy
DSLR_STORAGE_STRATEGY="cloudflare-google"
DSLR_CLOUDFLARE_R2_MAX_GB="8"
`;

  try {
    // Check if .env.local exists
    let existingContent = '';
    try {
      existingContent = await fs.readFile('.env.local', 'utf8');
    } catch (error) {
      // File doesn't exist, that's ok
    }
    
    if (existingContent) {
      console.log('⚠️ .env.local already exists');
      const overwrite = await question('Overwrite existing file? (y/n): ');
      
      if (overwrite.toLowerCase() !== 'y') {
        console.log('\n📝 Please manually add these lines to your .env.local:');
        console.log('=====================================');
        console.log(envContent);
        console.log('=====================================\n');
        rl.close();
        return;
      }
    }
    
    // Write credentials to .env.local
    await fs.writeFile('.env.local', envContent);
    console.log('✅ Credentials saved to .env.local\n');
    
    // Test connection
    console.log('🧪 Testing connection...');
    
    // Load environment variables
    require('dotenv').config();
    
    try {
      const testResult = require('./test-cloudflare-r2-connection');
      const connectionOk = await testResult.testCloudflareR2Connection();
      
      if (connectionOk) {
        console.log('\n🎉 SUCCESS! Cloudflare R2 is ready to use!');
        console.log('✅ 10GB free storage available');
        console.log('✅ Global CDN enabled');
        console.log('✅ Ready for production uploads\n');
        
        console.log('🚀 Next steps:');
        console.log('   1. Setup Google Drive API (secondary storage)');
        console.log('   2. Test upload workflow');
        console.log('   3. Start DSLR auto-upload service\n');
      } else {
        console.log('\n⚠️ Connection test failed');
        console.log('💡 Please check your credentials in Cloudflare Dashboard');
        console.log('💡 Ensure API token has R2:Edit permissions\n');
      }
    } catch (error) {
      console.log('\n⚠️ Could not test connection automatically');
      console.log('💡 Run manually: node test-cloudflare-r2-connection.js\n');
    }
    
  } catch (error) {
    console.log('\n❌ Failed to save credentials:', error.message);
  }
  
  rl.close();
}

// Show help
function showHelp() {
  console.log('\n🔑 CLOUDFLARE R2 CREDENTIALS HELPER\n');
  console.log('Usage:');
  console.log('  node cloudflare-r2-credentials-helper.js        Interactive setup');
  console.log('  node cloudflare-r2-credentials-helper.js help   Show this help');
  console.log('\nBefore running this script:');
  console.log('  1. Create Cloudflare account');
  console.log('  2. Enable R2 Object Storage');
  console.log('  3. Create bucket');
  console.log('  4. Generate API token');
  console.log('\nDetailed guide: CLOUDFLARE_R2_SETUP_STEP_BY_STEP.md\n');
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('help') || args.includes('-h') || args.includes('--help')) {
    showHelp();
    return;
  }
  
  await setupCredentials();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupCredentials };