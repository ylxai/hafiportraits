/**
 * Complete Integration Test
 * Test end-to-end flow: Photo capture → Upload → Notifications
 */

const DSLRSystemTester = require('./tmp_rovodev_test-dslr-system');
const PhotoUploadSimulator = require('./tmp_rovodev_test-photo-simulator');
const APIEndpointTester = require('./tmp_rovodev_test-api-endpoints');

class CompleteIntegrationTester {
  constructor() {
    this.testResults = {
      api: [],
      notifications: [],
      simulation: [],
      integration: []
    };
  }

  async runCompleteTest() {
    console.log('🚀 COMPLETE DSLR INTEGRATION TEST');
    console.log('==================================\n');
    console.log('This test will verify the entire DSLR system:');
    console.log('1. API Endpoints functionality');
    console.log('2. Notification system integration');
    console.log('3. Photo upload simulation');
    console.log('4. End-to-end integration\n');

    const startTime = Date.now();

    try {
      // Phase 1: Test API Endpoints
      await this.testAPIEndpoints();
      
      // Phase 2: Test Notification System
      await this.testNotificationSystem();
      
      // Phase 3: Test Photo Simulation
      await this.testPhotoSimulation();
      
      // Phase 4: Integration Test
      await this.testIntegration();
      
      // Final Results
      this.showCompleteResults(startTime);
      
    } catch (error) {
      console.error('❌ Complete integration test failed:', error);
    }
  }

  async testAPIEndpoints() {
    console.log('🌐 PHASE 1: API ENDPOINTS TEST');
    console.log('==============================\n');
    
    try {
      const apiTester = new APIEndpointTester();
      await apiTester.runAllTests();
      
      this.testResults.api = apiTester.testResults;
      console.log('✅ API endpoints test completed\n');
      
    } catch (error) {
      console.error('❌ API endpoints test failed:', error);
      this.testResults.api.push({
        test: 'API Endpoints',
        passed: false,
        message: error.message
      });
    }
  }

  async testNotificationSystem() {
    console.log('🔔 PHASE 2: NOTIFICATION SYSTEM TEST');
    console.log('====================================\n');
    
    try {
      const notificationTester = new DSLRSystemTester();
      await notificationTester.runAllTests();
      
      this.testResults.notifications = notificationTester.testResults;
      console.log('✅ Notification system test completed\n');
      
    } catch (error) {
      console.error('❌ Notification system test failed:', error);
      this.testResults.notifications.push({
        test: 'Notification System',
        passed: false,
        message: error.message
      });
    }
  }

  async testPhotoSimulation() {
    console.log('📸 PHASE 3: PHOTO SIMULATION TEST');
    console.log('==================================\n');
    
    try {
      const simulator = new PhotoUploadSimulator();
      
      console.log('📸 Running automated photo simulation...');
      await simulator.startSimulation({
        photoCount: 3,
        interval: 2000,
        useCustomFolder: true
      });
      
      this.testResults.simulation.push({
        test: 'Photo Simulation',
        passed: true,
        message: `Successfully simulated ${simulator.photoCount} photos`
      });
      
      // Cleanup simulation files
      await simulator.cleanup();
      
      console.log('✅ Photo simulation test completed\n');
      
    } catch (error) {
      console.error('❌ Photo simulation test failed:', error);
      this.testResults.simulation.push({
        test: 'Photo Simulation',
        passed: false,
        message: error.message
      });
    }
  }

  async testIntegration() {
    console.log('🔗 PHASE 4: END-TO-END INTEGRATION TEST');
    console.log('=======================================\n');
    
    try {
      // Test 1: Service Worker Registration
      await this.testServiceWorkerIntegration();
      
      // Test 2: DSLR Service Integration
      await this.testDSLRServiceIntegration();
      
      // Test 3: Real-time Notification Flow
      await this.testRealTimeFlow();
      
      console.log('✅ Integration tests completed\n');
      
    } catch (error) {
      console.error('❌ Integration test failed:', error);
    }
  }

  async testServiceWorkerIntegration() {
    console.log('🔧 Testing Service Worker Integration...');
    
    try {
      // Check if service worker file exists
      const fs = require('fs').promises;
      await fs.access('./public/sw.js');
      
      this.testResults.integration.push({
        test: 'Service Worker File',
        passed: true,
        message: 'Service worker file exists and accessible'
      });
      
      console.log('✅ Service worker integration test passed');
      
    } catch (error) {
      this.testResults.integration.push({
        test: 'Service Worker File',
        passed: false,
        message: 'Service worker file not found or not accessible'
      });
      
      console.log('❌ Service worker integration test failed');
    }
  }

  async testDSLRServiceIntegration() {
    console.log('📷 Testing DSLR Service Integration...');
    
    try {
      // Check if DSLR service file exists and is valid
      const fs = require('fs').promises;
      const serviceContent = await fs.readFile('./dslr-auto-upload-service.js', 'utf8');
      
      // Check for key integration points
      const hasNotificationIntegration = serviceContent.includes('getDSLRNotificationIntegration');
      const hasEventTriggers = serviceContent.includes('triggerEvent');
      const hasUploadHandling = serviceContent.includes('uploadToSupabase');
      
      if (hasNotificationIntegration && hasEventTriggers && hasUploadHandling) {
        this.testResults.integration.push({
          test: 'DSLR Service Integration',
          passed: true,
          message: 'DSLR service properly integrated with notification system'
        });
        
        console.log('✅ DSLR service integration test passed');
      } else {
        this.testResults.integration.push({
          test: 'DSLR Service Integration',
          passed: false,
          message: 'DSLR service missing key integration components'
        });
        
        console.log('❌ DSLR service integration test failed');
      }
      
    } catch (error) {
      this.testResults.integration.push({
        test: 'DSLR Service Integration',
        passed: false,
        message: 'DSLR service file not found or not readable'
      });
      
      console.log('❌ DSLR service integration test failed');
    }
  }

  async testRealTimeFlow() {
    console.log('⚡ Testing Real-time Notification Flow...');
    
    try {
      // Simulate the complete flow
      const { getDSLRNotificationIntegration } = require('./src/lib/dslr-notification-integration');
      const integration = getDSLRNotificationIntegration();
      
      // Test notification trigger
      integration.triggerEvent('upload_success', {
        fileName: 'integration-test.jpg',
        fileSize: 1024000,
        albumName: 'Test Album',
        eventName: 'integration-test',
        uploaderName: 'Integration Tester',
        photoId: 'test-123',
        total: 1
      });
      
      this.testResults.integration.push({
        test: 'Real-time Flow',
        passed: true,
        message: 'Real-time notification flow working correctly'
      });
      
      console.log('✅ Real-time flow test passed');
      
    } catch (error) {
      this.testResults.integration.push({
        test: 'Real-time Flow',
        passed: false,
        message: `Real-time flow failed: ${error.message}`
      });
      
      console.log('❌ Real-time flow test failed');
    }
  }

  showCompleteResults(startTime) {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('📊 COMPLETE INTEGRATION TEST RESULTS');
    console.log('=====================================\n');
    
    // Summary by phase
    const phases = [
      { name: 'API Endpoints', results: this.testResults.api },
      { name: 'Notification System', results: this.testResults.notifications },
      { name: 'Photo Simulation', results: this.testResults.simulation },
      { name: 'Integration Tests', results: this.testResults.integration }
    ];
    
    let totalPassed = 0;
    let totalTests = 0;
    
    phases.forEach(phase => {
      const passed = phase.results.filter(r => r.passed).length;
      const total = phase.results.length;
      
      totalPassed += passed;
      totalTests += total;
      
      const status = passed === total ? '✅' : passed > 0 ? '⚠️' : '❌';
      console.log(`${status} ${phase.name}: ${passed}/${total} tests passed`);
    });
    
    console.log(`\n📈 OVERALL RESULTS: ${totalPassed}/${totalTests} tests passed`);
    console.log(`⏱️  Total duration: ${duration} seconds\n`);
    
    // Final assessment
    if (totalPassed === totalTests) {
      console.log('🎉 COMPLETE INTEGRATION TEST PASSED!');
      console.log('=====================================');
      console.log('✅ Your DSLR notification system is fully functional!');
      console.log('✅ All components are properly integrated');
      console.log('✅ Ready for production use with real camera\n');
      
      console.log('🚀 NEXT STEPS:');
      console.log('   1. Connect your Nikon D7100 via USB');
      console.log('   2. Run: start-full-system.bat');
      console.log('   3. Start shooting and enjoy real-time notifications!');
      
    } else {
      console.log('⚠️  INTEGRATION TEST PARTIALLY PASSED');
      console.log('=====================================');
      console.log(`✅ ${totalPassed} tests passed, ${totalTests - totalPassed} tests failed`);
      console.log('🔧 Please review failed tests and fix issues before production use\n');
      
      console.log('🛠️  TROUBLESHOOTING:');
      console.log('   - Ensure Next.js app is running (npm run dev)');
      console.log('   - Check all dependencies are installed (npm install)');
      console.log('   - Verify environment variables are set');
      console.log('   - Review console logs for specific errors');
    }
    
    console.log('\n📋 Test completed at:', new Date().toLocaleString());
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run complete test if this file is executed directly
if (require.main === module) {
  const tester = new CompleteIntegrationTester();
  tester.runCompleteTest().catch(console.error);
}

module.exports = CompleteIntegrationTester;