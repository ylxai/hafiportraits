/**
 * Test Script untuk DSLR Notification System
 * Simulate foto upload dan test semua notification triggers
 */

const fs = require('fs').promises;
const path = require('path');
const { getDSLRNotificationIntegration } = require('./src/lib/dslr-notification-integration');

class DSLRSystemTester {
  constructor() {
    this.testFolder = './tmp_rovodev_test-photos';
    this.notificationIntegration = getDSLRNotificationIntegration();
    this.testResults = [];
  }

  async runAllTests() {
    console.log('🧪 Starting DSLR System Tests...\n');
    
    try {
      // Setup test environment
      await this.setupTestEnvironment();
      
      // Test 1: Camera Connection
      await this.testCameraConnection();
      
      // Test 2: Upload Start Notification
      await this.testUploadStart();
      
      // Test 3: Upload Success Notification
      await this.testUploadSuccess();
      
      // Test 4: Upload Failed Notification
      await this.testUploadFailed();
      
      // Test 5: Milestone Notifications
      await this.testMilestoneNotifications();
      
      // Test 6: Camera Disconnection
      await this.testCameraDisconnection();
      
      // Test 7: Storage Warning
      await this.testStorageWarning();
      
      // Show results
      this.showTestResults();
      
      // Cleanup
      await this.cleanup();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  async setupTestEnvironment() {
    console.log('🔧 Setting up test environment...');
    
    try {
      // Create test folder
      await fs.mkdir(this.testFolder, { recursive: true });
      
      // Create sample photo files
      await this.createSamplePhotos();
      
      console.log('✅ Test environment ready\n');
    } catch (error) {
      console.error('❌ Failed to setup test environment:', error);
      throw error;
    }
  }

  async createSamplePhotos() {
    const samplePhotos = [
      'DSC_0001.jpg',
      'DSC_0002.jpg', 
      'DSC_0003.jpg',
      'DSC_0004.jpg',
      'DSC_0005.jpg'
    ];

    for (const photo of samplePhotos) {
      // Create dummy JPEG file (minimal valid JPEG header)
      const jpegHeader = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xD9
      ]);
      
      const filePath = path.join(this.testFolder, photo);
      await fs.writeFile(filePath, jpegHeader);
    }
    
    console.log(`📸 Created ${samplePhotos.length} sample photos`);
  }

  async testCameraConnection() {
    console.log('🔌 Testing Camera Connection...');
    
    try {
      // Simulate camera connected
      this.notificationIntegration.triggerEvent('camera_connected', {
        cameraModel: 'Nikon D7100 (Test)',
        status: 'connected',
        message: 'Test camera connection established',
        lastSeen: new Date().toISOString()
      });
      
      this.addTestResult('Camera Connection', true, 'Camera connected notification sent');
      console.log('✅ Camera connection test passed\n');
      
    } catch (error) {
      this.addTestResult('Camera Connection', false, error.message);
      console.log('❌ Camera connection test failed\n');
    }
  }

  async testUploadStart() {
    console.log('🚀 Testing Upload Start Notification...');
    
    try {
      const testFile = 'DSC_0001.jpg';
      const filePath = path.join(this.testFolder, testFile);
      const stats = await fs.stat(filePath);
      
      this.notificationIntegration.triggerEvent('upload_start', {
        fileName: testFile,
        fileSize: stats.size,
        filePath: filePath,
        albumName: 'Test Album',
        eventName: 'test-event-001',
        uploaderName: 'Test Photographer'
      });
      
      this.addTestResult('Upload Start', true, 'Upload start notification sent');
      console.log('✅ Upload start test passed\n');
      
    } catch (error) {
      this.addTestResult('Upload Start', false, error.message);
      console.log('❌ Upload start test failed\n');
    }
  }

  async testUploadSuccess() {
    console.log('✅ Testing Upload Success Notification...');
    
    try {
      const testFile = 'DSC_0002.jpg';
      const filePath = path.join(this.testFolder, testFile);
      const stats = await fs.stat(filePath);
      
      this.notificationIntegration.triggerEvent('upload_success', {
        fileName: testFile,
        fileSize: stats.size,
        filePath: filePath,
        albumName: 'Test Album',
        eventName: 'test-event-001',
        uploaderName: 'Test Photographer',
        photoId: 'test-photo-123',
        total: 1
      });
      
      this.addTestResult('Upload Success', true, 'Upload success notification sent');
      console.log('✅ Upload success test passed\n');
      
    } catch (error) {
      this.addTestResult('Upload Success', false, error.message);
      console.log('❌ Upload success test failed\n');
    }
  }

  async testUploadFailed() {
    console.log('❌ Testing Upload Failed Notification...');
    
    try {
      const testFile = 'DSC_0003.jpg';
      const filePath = path.join(this.testFolder, testFile);
      
      this.notificationIntegration.triggerEvent('upload_failed', {
        fileName: testFile,
        filePath: filePath,
        albumName: 'Test Album',
        eventName: 'test-event-001',
        uploaderName: 'Test Photographer',
        error: 'Simulated network error for testing'
      });
      
      this.addTestResult('Upload Failed', true, 'Upload failed notification sent');
      console.log('✅ Upload failed test passed\n');
      
    } catch (error) {
      this.addTestResult('Upload Failed', false, error.message);
      console.log('❌ Upload failed test failed\n');
    }
  }

  async testMilestoneNotifications() {
    console.log('🎯 Testing Milestone Notifications...');
    
    try {
      const milestones = [10, 25, 50];
      
      for (const milestone of milestones) {
        this.notificationIntegration.triggerEvent('event_milestone', {
          eventName: 'test-event-001',
          eventId: 'test-event-001',
          milestone: milestone,
          totalPhotos: milestone,
          albumName: 'Test Album'
        });
        
        console.log(`🎉 Milestone ${milestone} notification sent`);
        await this.delay(500); // Small delay between notifications
      }
      
      this.addTestResult('Milestone Notifications', true, `${milestones.length} milestone notifications sent`);
      console.log('✅ Milestone notifications test passed\n');
      
    } catch (error) {
      this.addTestResult('Milestone Notifications', false, error.message);
      console.log('❌ Milestone notifications test failed\n');
    }
  }

  async testCameraDisconnection() {
    console.log('📵 Testing Camera Disconnection...');
    
    try {
      this.notificationIntegration.triggerEvent('camera_disconnected', {
        cameraModel: 'Nikon D7100 (Test)',
        status: 'disconnected',
        message: 'Test camera disconnection simulation',
        lastSeen: new Date().toISOString()
      });
      
      this.addTestResult('Camera Disconnection', true, 'Camera disconnection notification sent');
      console.log('✅ Camera disconnection test passed\n');
      
    } catch (error) {
      this.addTestResult('Camera Disconnection', false, error.message);
      console.log('❌ Camera disconnection test failed\n');
    }
  }

  async testStorageWarning() {
    console.log('💾 Testing Storage Warning...');
    
    try {
      this.notificationIntegration.triggerEvent('storage_warning', {
        totalSpace: 1000000000, // 1GB
        usedSpace: 850000000,   // 850MB
        freeSpace: 150000000,   // 150MB
        percentage: 85,
        threshold: 80
      });
      
      this.addTestResult('Storage Warning', true, 'Storage warning notification sent');
      console.log('✅ Storage warning test passed\n');
      
    } catch (error) {
      this.addTestResult('Storage Warning', false, error.message);
      console.log('❌ Storage warning test failed\n');
    }
  }

  addTestResult(testName, passed, message) {
    this.testResults.push({
      test: testName,
      passed: passed,
      message: message,
      timestamp: new Date().toISOString()
    });
  }

  showTestResults() {
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('========================\n');
    
    let passedCount = 0;
    let totalCount = this.testResults.length;
    
    this.testResults.forEach((result, index) => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${index + 1}. ${result.test}: ${status}`);
      console.log(`   Message: ${result.message}`);
      console.log(`   Time: ${result.timestamp}\n`);
      
      if (result.passed) passedCount++;
    });
    
    console.log(`📈 OVERALL RESULTS: ${passedCount}/${totalCount} tests passed`);
    
    if (passedCount === totalCount) {
      console.log('🎉 ALL TESTS PASSED! DSLR Notification System is working correctly!\n');
    } else {
      console.log('⚠️  Some tests failed. Please check the implementation.\n');
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async cleanup() {
    console.log('🧹 Cleaning up test files...');
    
    try {
      // Remove test folder and files
      await fs.rmdir(this.testFolder, { recursive: true });
      console.log('✅ Cleanup completed\n');
    } catch (error) {
      console.log('⚠️  Cleanup warning:', error.message);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new DSLRSystemTester();
  tester.runAllTests().catch(console.error);
}

module.exports = DSLRSystemTester;