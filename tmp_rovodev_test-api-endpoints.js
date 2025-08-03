/**
 * API Endpoints Tester
 * Test semua API endpoints yang digunakan oleh DSLR system
 */

const fetch = require('node-fetch');
const fs = require('fs').promises;
const FormData = require('form-data');
const path = require('path');

class APIEndpointTester {
  constructor() {
    this.baseURL = 'http://localhost:3000';
    this.testResults = [];
    this.testEventId = 'test-event-' + Date.now();
  }

  async runAllTests() {
    console.log('🌐 Starting API Endpoints Tests...\n');
    console.log(`🔗 Base URL: ${this.baseURL}`);
    console.log(`📝 Test Event ID: ${this.testEventId}\n`);

    try {
      // Test 1: Health Check
      await this.testHealthCheck();
      
      // Test 2: Create Test Event
      await this.testCreateEvent();
      
      // Test 3: Photo Upload API
      await this.testPhotoUpload();
      
      // Test 4: Notification API
      await this.testNotificationAPI();
      
      // Test 5: DSLR Status API
      await this.testDSLRStatusAPI();
      
      // Test 6: WebSocket Connection
      await this.testWebSocketConnection();
      
      // Show results
      this.showTestResults();
      
    } catch (error) {
      console.error('❌ API test suite failed:', error);
    }
  }

  async testHealthCheck() {
    console.log('🏥 Testing Health Check...');
    
    try {
      const response = await fetch(`${this.baseURL}/api/health`);
      
      if (response.ok) {
        const data = await response.json();
        this.addTestResult('Health Check', true, `Server is healthy: ${data.status || 'OK'}`);
        console.log('✅ Health check passed\n');
      } else {
        this.addTestResult('Health Check', false, `Server returned ${response.status}`);
        console.log('❌ Health check failed\n');
      }
      
    } catch (error) {
      // If health endpoint doesn't exist, try root
      try {
        const response = await fetch(`${this.baseURL}/`);
        if (response.ok) {
          this.addTestResult('Health Check', true, 'Server is responding (via root endpoint)');
          console.log('✅ Health check passed (via root)\n');
        } else {
          this.addTestResult('Health Check', false, 'Server not responding');
          console.log('❌ Health check failed\n');
        }
      } catch (rootError) {
        this.addTestResult('Health Check', false, `Connection failed: ${error.message}`);
        console.log('❌ Health check failed - server not reachable\n');
      }
    }
  }

  async testCreateEvent() {
    console.log('📅 Testing Create Event API...');
    
    try {
      const eventData = {
        name: 'Test Event for DSLR',
        description: 'Automated test event',
        date: new Date().toISOString(),
        location: 'Test Location',
        type: 'wedding'
      };

      const response = await fetch(`${this.baseURL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        const result = await response.json();
        this.testEventId = result.id || this.testEventId;
        this.addTestResult('Create Event', true, `Event created with ID: ${this.testEventId}`);
        console.log('✅ Create event test passed\n');
      } else {
        const error = await response.text();
        this.addTestResult('Create Event', false, `Failed: ${response.status} - ${error}`);
        console.log('❌ Create event test failed\n');
      }
      
    } catch (error) {
      this.addTestResult('Create Event', false, `Request failed: ${error.message}`);
      console.log('❌ Create event test failed\n');
    }
  }

  async testPhotoUpload() {
    console.log('📸 Testing Photo Upload API...');
    
    try {
      // Create test photo
      const testPhoto = await this.createTestPhoto();
      
      const formData = new FormData();
      formData.append('file', testPhoto, 'test-photo.jpg');
      formData.append('uploaderName', 'Test Photographer');
      formData.append('albumName', 'Official');

      const response = await fetch(`${this.baseURL}/api/events/${this.testEventId}/photos`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        this.addTestResult('Photo Upload', true, `Photo uploaded with ID: ${result.id || 'unknown'}`);
        console.log('✅ Photo upload test passed\n');
      } else {
        const error = await response.text();
        this.addTestResult('Photo Upload', false, `Failed: ${response.status} - ${error}`);
        console.log('❌ Photo upload test failed\n');
      }
      
    } catch (error) {
      this.addTestResult('Photo Upload', false, `Request failed: ${error.message}`);
      console.log('❌ Photo upload test failed\n');
    }
  }

  async testNotificationAPI() {
    console.log('🔔 Testing Notification API...');
    
    try {
      const notificationData = {
        type: 'upload_success',
        title: 'Test Upload Success',
        message: 'This is a test notification from API tester',
        priority: 'medium',
        metadata: {
          fileName: 'test-photo.jpg',
          eventName: this.testEventId
        }
      };

      const response = await fetch(`${this.baseURL}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
      });

      if (response.ok) {
        const result = await response.json();
        this.addTestResult('Notification API', true, 'Notification sent successfully');
        console.log('✅ Notification API test passed\n');
      } else {
        const error = await response.text();
        this.addTestResult('Notification API', false, `Failed: ${response.status} - ${error}`);
        console.log('❌ Notification API test failed\n');
      }
      
    } catch (error) {
      this.addTestResult('Notification API', false, `Request failed: ${error.message}`);
      console.log('❌ Notification API test failed\n');
    }
  }

  async testDSLRStatusAPI() {
    console.log('📊 Testing DSLR Status API...');
    
    try {
      const response = await fetch(`${this.baseURL}/api/dslr/status`);

      if (response.ok) {
        const result = await response.json();
        this.addTestResult('DSLR Status API', true, `Status retrieved: ${result.status || 'unknown'}`);
        console.log('✅ DSLR status API test passed\n');
      } else {
        const error = await response.text();
        this.addTestResult('DSLR Status API', false, `Failed: ${response.status} - ${error}`);
        console.log('❌ DSLR status API test failed\n');
      }
      
    } catch (error) {
      this.addTestResult('DSLR Status API', false, `Request failed: ${error.message}`);
      console.log('❌ DSLR status API test failed\n');
    }
  }

  async testWebSocketConnection() {
    console.log('🔌 Testing WebSocket Connection...');
    
    try {
      // Simple WebSocket test (if WebSocket is available)
      const WebSocket = require('ws');
      
      const ws = new WebSocket(`ws://localhost:3000/ws`);
      
      const testPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          ws.close();
          reject(new Error('WebSocket connection timeout'));
        }, 5000);

        ws.on('open', () => {
          clearTimeout(timeout);
          ws.close();
          resolve('Connected successfully');
        });

        ws.on('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      const result = await testPromise;
      this.addTestResult('WebSocket Connection', true, result);
      console.log('✅ WebSocket connection test passed\n');
      
    } catch (error) {
      // WebSocket might not be implemented yet, so this is optional
      this.addTestResult('WebSocket Connection', false, `Connection failed: ${error.message} (Optional)`);
      console.log('⚠️  WebSocket connection test failed (this is optional)\n');
    }
  }

  async createTestPhoto() {
    // Create a minimal valid JPEG
    const jpegData = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xD9
    ]);
    
    return jpegData;
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
    console.log('📊 API ENDPOINTS TEST RESULTS');
    console.log('==============================\n');
    
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
      console.log('🎉 ALL API TESTS PASSED! Backend is ready for DSLR integration!\n');
    } else {
      console.log('⚠️  Some API tests failed. Please check backend implementation.\n');
    }

    // Recommendations
    console.log('💡 RECOMMENDATIONS:');
    if (passedCount < totalCount) {
      console.log('   - Make sure Next.js app is running (npm run dev)');
      console.log('   - Check if all API routes are implemented');
      console.log('   - Verify database connection and schema');
    }
    console.log('   - Test with real DSLR service after API fixes');
    console.log('   - Monitor notification center for real-time updates\n');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new APIEndpointTester();
  tester.runAllTests().catch(console.error);
}

module.exports = APIEndpointTester;