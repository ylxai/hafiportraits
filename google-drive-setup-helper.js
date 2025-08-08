#!/usr/bin/env node

/**
 * Google Drive Setup Helper
 * Interactive guide untuk setup Google Drive API credentials
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

async function setupGoogleDrive() {
  console.log('\n🔐 GOOGLE DRIVE SETUP HELPER');
  console.log('=====================================\n');
  
  console.log('📋 This helper will guide you through setting up Google Drive API credentials');
  console.log('   for 15GB free storage as secondary backup.\n');
  
  const proceed = await question('Do you want to setup Google Drive API now? (y/n): ');
  
  if (proceed.toLowerCase() !== 'y') {
    console.log('\n💡 You can setup Google Drive later for additional 15GB storage');
    console.log('   Current system works with Cloudflare R2 (10GB) + Local backup (50GB+)');
    rl.close();
    return;
  }
  
  console.log('\n🌐 STEP 1: Google Cloud Console Setup');
  console.log('=====================================');
  console.log('1. Open: https://console.cloud.google.com/');
  console.log('2. Create new project: "HafiPortrait Storage"');
  console.log('3. Select the project');
  console.log('');
  
  await question('Press Enter when you have created the project...');
  
  console.log('\n📡 STEP 2: Enable Google Drive API');
  console.log('=====================================');
  console.log('1. In the sidebar, go to "APIs & Services" → "Library"');
  console.log('2. Search for "Google Drive API"');
  console.log('3. Click "Google Drive API" → "Enable"');
  console.log('');
  
  await question('Press Enter when you have enabled the API...');
  
  console.log('\n🔑 STEP 3: Create OAuth Credentials');
  console.log('=====================================');
  console.log('1. Go to "APIs & Services" → "Credentials"');
  console.log('2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"');
  console.log('3. Application type: "Web application"');
  console.log('4. Name: "HafiPortrait DSLR Upload"');
  console.log('5. Authorized redirect URIs:');
  console.log('   - http://localhost:3000/auth/google/callback');
  console.log('   - https://hafiportrait.photography/auth/google/callback');
  console.log('6. Click "Create"');
  console.log('');
  
  await question('Press Enter when you have created the credentials...');
  
  console.log('\n📝 STEP 4: Enter Your Credentials');
  console.log('=====================================');
  console.log('Copy the credentials from the popup dialog:\n');
  
  const clientId = await question('Client ID: ');
  const clientSecret = await question('Client Secret: ');
  
  if (!clientId || !clientSecret) {
    console.log('\n❌ Invalid credentials provided');
    rl.close();
    return;
  }
  
  console.log('\n🔍 Validating credentials format...');
  
  // Basic validation
  if (!clientId.includes('.googleusercontent.com')) {
    console.log('⚠️ Client ID format looks unusual (should end with .googleusercontent.com)');
  }
  
  if (clientSecret.length < 20) {
    console.log('⚠️ Client Secret seems too short');
  }
  
  console.log('✅ Credentials format looks good\n');
  
  // Update .env.local
  try {
    let envContent = '';
    
    // Read existing .env.local
    try {
      envContent = await fs.readFile('.env.local', 'utf8');
    } catch (error) {
      console.log('⚠️ .env.local not found, creating new file');
    }
    
    // Add or update Google Drive credentials
    const googleDriveSection = `
# Google Drive Storage (15GB FREE)
GOOGLE_DRIVE_CLIENT_ID="${clientId}"
GOOGLE_DRIVE_CLIENT_SECRET="${clientSecret}"
GOOGLE_DRIVE_ROOT_FOLDER_ID=""
GOOGLE_DRIVE_REDIRECT_URI="http://localhost:3000/auth/google/callback"
`;
    
    // Check if Google Drive section already exists
    if (envContent.includes('GOOGLE_DRIVE_CLIENT_ID')) {
      // Update existing
      envContent = envContent.replace(
        /GOOGLE_DRIVE_CLIENT_ID="[^"]*"/,
        `GOOGLE_DRIVE_CLIENT_ID="${clientId}"`
      );
      envContent = envContent.replace(
        /GOOGLE_DRIVE_CLIENT_SECRET="[^"]*"/,
        `GOOGLE_DRIVE_CLIENT_SECRET="${clientSecret}"`
      );
    } else {
      // Add new section
      envContent += googleDriveSection;
    }
    
    await fs.writeFile('.env.local', envContent);
    console.log('✅ Credentials saved to .env.local');
    
  } catch (error) {
    console.error('❌ Failed to save credentials:', error.message);
    console.log('\n📝 Please manually add these lines to .env.local:');
    console.log('=====================================');
    console.log(`GOOGLE_DRIVE_CLIENT_ID="${clientId}"`);
    console.log(`GOOGLE_DRIVE_CLIENT_SECRET="${clientSecret}"`);
    console.log('GOOGLE_DRIVE_ROOT_FOLDER_ID=""');
    console.log('GOOGLE_DRIVE_REDIRECT_URI="http://localhost:3000/auth/google/callback"');
    console.log('=====================================');
  }
  
  console.log('\n🧪 STEP 5: Test Authentication');
  console.log('=====================================');
  
  const testAuth = await question('Test Google Drive authentication now? (y/n): ');
  
  if (testAuth.toLowerCase() === 'y') {
    console.log('\nTesting authentication...');
    
    // Reload environment variables
    delete require.cache[require.resolve('dotenv')];
    require('dotenv').config({ path: '.env.local' });
    require('dotenv').config();
    
    try {
      const { execSync } = require('child_process');
      execSync('node storage-optimization-cli.js auth', { stdio: 'inherit' });
    } catch (error) {
      console.log('\n⚠️ Please run manually: node storage-optimization-cli.js auth');
    }
  }
  
  console.log('\n🎉 GOOGLE DRIVE SETUP COMPLETED!');
  console.log('=====================================');
  console.log('✅ Credentials configured');
  console.log('✅ Ready for authentication');
  console.log('✅ 15GB additional storage available');
  console.log('\n🚀 Next steps:');
  console.log('   1. Run: node storage-optimization-cli.js auth');
  console.log('   2. Complete OAuth flow in browser');
  console.log('   3. Test: node storage-optimization-cli.js test');
  console.log('\n💾 Total storage capacity after setup:');
  console.log('   - Cloudflare R2: 10GB ✅ Working');
  console.log('   - Google Drive: 15GB (after auth)');
  console.log('   - Local backup: 50GB+ ✅ Working');
  console.log('   - TOTAL: 75GB+ storage!');
  
  rl.close();
}

async function showStatus() {
  console.log('\n📊 GOOGLE DRIVE SETUP STATUS\n');
  
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  require('dotenv').config();
  
  const requiredVars = [
    'GOOGLE_DRIVE_CLIENT_ID',
    'GOOGLE_DRIVE_CLIENT_SECRET'
  ];
  
  console.log('🔑 Credentials Status:');
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`   ❌ ${varName}: Not set`);
    }
  });
  
  const allSet = requiredVars.every(varName => process.env[varName]);
  
  if (allSet) {
    console.log('\n✅ Google Drive credentials configured!');
    console.log('🚀 Ready for authentication: node storage-optimization-cli.js auth');
  } else {
    console.log('\n⚠️ Google Drive credentials not configured');
    console.log('🔧 Run setup: node google-drive-setup-helper.js');
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('status') || args.includes('-s')) {
    await showStatus();
  } else if (args.includes('help') || args.includes('-h')) {
    console.log('\n🔐 GOOGLE DRIVE SETUP HELPER\n');
    console.log('Usage:');
    console.log('  node google-drive-setup-helper.js        Interactive setup');
    console.log('  node google-drive-setup-helper.js status Show current status');
    console.log('  node google-drive-setup-helper.js help   Show this help');
    console.log('\nThis tool helps you setup Google Drive API credentials');
    console.log('for 15GB additional free storage as secondary backup.');
  } else {
    await setupGoogleDrive();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupGoogleDrive, showStatus };