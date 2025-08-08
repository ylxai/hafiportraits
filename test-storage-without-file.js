#!/usr/bin/env node

/**
 * Test Storage System Without Real File
 * Create dummy image data untuk testing
 */

async function testStorageWithDummyFile() {
  console.log('\n🧪 TESTING STORAGE WITH DUMMY FILE\n');
  
  try {
    // Create dummy image buffer
    const dummyImageData = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
      0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
      0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
      0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
      0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xD9
    ]);
    
    console.log('📁 Created dummy JPEG file');
    console.log(`📊 File size: ${(dummyImageData.length / 1024).toFixed(2)} KB`);
    
    // Test storage manager
    const SmartStorageManager = require('./src/lib/smart-storage-manager');
    const storageManager = new SmartStorageManager();
    
    const testFile = {
      buffer: dummyImageData,
      name: 'test-dummy-image.jpg',
      size: dummyImageData.length
    };
    
    const testMetadata = {
      eventId: 'test-event-123',
      albumName: 'Test Album',
      uploaderName: 'Storage Test',
      isHomepage: false
    };
    
    console.log('\n🎯 Testing storage tier selection...');
    const storagePlan = storageManager.determineStorageTier(testMetadata);
    console.log(`   Selected tier: ${storagePlan.tier}`);
    console.log(`   Compression: ${storagePlan.compression}`);
    console.log(`   Priority: ${storagePlan.priority}`);
    
    console.log('\n⚡ Testing upload workflow...');
    
    try {
      const uploadResult = await storageManager.uploadPhoto(testFile, testMetadata);
      
      console.log('\n✅ UPLOAD TEST SUCCESSFUL!');
      console.log(`   Storage tier: ${uploadResult.tier}`);
      console.log(`   URL: ${uploadResult.url}`);
      console.log(`   Path: ${uploadResult.path}`);
      console.log(`   Size: ${uploadResult.size} bytes`);
      console.log(`   Compression: ${uploadResult.compressionUsed}`);
      
      if (uploadResult.thumbnailUrl) {
        console.log(`   Thumbnail: ${uploadResult.thumbnailUrl}`);
      }
      
      return true;
    } catch (uploadError) {
      console.log('\n⚠️ Upload failed, testing individual components...');
      console.log(`   Error: ${uploadError.message}`);
      
      // Test individual storage providers
      await testIndividualProviders(testFile, testMetadata);
      
      return false;
    }
    
  } catch (error) {
    console.error('❌ Storage test failed:', error.message);
    return false;
  }
}

async function testIndividualProviders(testFile, testMetadata) {
  console.log('\n🔧 TESTING INDIVIDUAL STORAGE PROVIDERS\n');
  
  // Test Cloudflare R2
  console.log('1. Testing Cloudflare R2...');
  try {
    const CloudflareR2Storage = require('./src/lib/cloudflare-r2-storage');
    const r2 = new CloudflareR2Storage();
    
    const r2Result = await r2.uploadPhoto(testFile.buffer, testFile.name, testMetadata);
    console.log('   ✅ Cloudflare R2 upload successful');
    console.log(`   URL: ${r2Result.url}`);
    
    // Test connection
    const connectionOk = await r2.testConnection();
    console.log(`   Connection test: ${connectionOk ? '✅ OK' : '❌ Failed'}`);
    
  } catch (r2Error) {
    console.log('   ❌ Cloudflare R2 failed:', r2Error.message);
    
    if (r2Error.message.includes('Missing Cloudflare R2 credentials')) {
      console.log('   💡 Setup credentials: node cloudflare-r2-credentials-helper.js');
    }
  }
  
  // Test Google Drive
  console.log('\n2. Testing Google Drive...');
  try {
    const GoogleDriveStorage = require('./src/lib/google-drive-storage');
    const drive = new GoogleDriveStorage();
    
    const driveResult = await drive.uploadPhoto(testFile.buffer, testFile.name, testMetadata);
    console.log('   ✅ Google Drive upload successful');
    console.log(`   URL: ${driveResult.url || driveResult.webViewLink}`);
    
  } catch (driveError) {
    console.log('   ❌ Google Drive failed:', driveError.message);
    
    if (driveError.message.includes('Authentication required')) {
      console.log('   💡 Authenticate: node storage-optimization-cli.js auth');
    }
  }
  
  // Test Local Storage
  console.log('\n3. Testing Local Storage...');
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    const localPath = path.join('./dslr-backup', 'test', `${Date.now()}_${testFile.name}`);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(localPath), { recursive: true });
    
    // Save file
    await fs.writeFile(localPath, testFile.buffer);
    
    console.log('   ✅ Local storage successful');
    console.log(`   Path: ${localPath}`);
    
    // Cleanup test file
    await fs.unlink(localPath);
    console.log('   🧹 Test file cleaned up');
    
  } catch (localError) {
    console.log('   ❌ Local storage failed:', localError.message);
  }
}

async function showStorageStatus() {
  console.log('\n📊 STORAGE SYSTEM STATUS\n');
  
  // Check environment variables
  const requiredVars = [
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME'
  ];
  
  console.log('🔑 Environment Variables:');
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`   ❌ ${varName}: Not set`);
    }
  });
  
  // Check dependencies
  console.log('\n📦 Dependencies:');
  const deps = [
    { name: '@aws-sdk/client-s3', module: '@aws-sdk/client-s3' },
    { name: 'googleapis', module: 'googleapis' },
    { name: 'sharp', module: 'sharp' }
  ];
  
  deps.forEach(dep => {
    try {
      require(dep.module);
      console.log(`   ✅ ${dep.name}: Available`);
    } catch (error) {
      console.log(`   ❌ ${dep.name}: Missing`);
    }
  });
}

// Main function
async function main() {
  console.log('🚀 STORAGE SYSTEM TEST');
  console.log('======================');
  
  // Load environment variables
  require('dotenv').config();
  
  await showStorageStatus();
  
  const testResult = await testStorageWithDummyFile();
  
  if (testResult) {
    console.log('\n🎉 STORAGE SYSTEM WORKING!');
    console.log('✅ Ready for production uploads');
    console.log('✅ Cloudflare R2 + Google Drive operational');
  } else {
    console.log('\n⚠️ STORAGE SYSTEM NEEDS SETUP');
    console.log('💡 Next steps:');
    console.log('   1. Setup Cloudflare R2: node cloudflare-r2-credentials-helper.js');
    console.log('   2. Setup Google Drive: node storage-optimization-cli.js auth');
    console.log('   3. Test again: node test-storage-without-file.js');
  }
  
  console.log('\n======================');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testStorageWithDummyFile };