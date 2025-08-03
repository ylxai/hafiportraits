/**
 * Test Notification System
 * Verifies that notification integration works properly
 */

const { getDSLRNotificationIntegration } = require('./src/lib/dslr-notification-integration.js');

async function testNotificationSystem() {
  console.log('🧪 Testing DSLR Notification System...');
  console.log('=' .repeat(50));

  const integration = getDSLRNotificationIntegration();

  // Test 1: Camera Connected
  console.log('\n📷 Test 1: Camera Connected Event');
  await integration.triggerEvent('camera_connected', {
    cameraModel: 'Nikon D7100',
    status: 'connected',
    message: 'Test camera connection'
  });

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 2: Upload Start
  console.log('\n📤 Test 2: Upload Start Event');
  await integration.triggerEvent('upload_start', {
    fileName: 'test-photo-001.jpg',
    fileSize: 2048000,
    filePath: '/test/path/test-photo-001.jpg',
    albumName: 'Official',
    eventName: 'test-event',
    uploaderName: 'Test Photographer'
  });

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 3: Upload Success
  console.log('\n✅ Test 3: Upload Success Event');
  await integration.triggerEvent('upload_success', {
    fileName: 'test-photo-001.jpg',
    fileSize: 2048000,
    filePath: '/test/path/test-photo-001.jpg',
    albumName: 'Official',
    eventName: 'test-event',
    uploaderName: 'Test Photographer',
    photoId: 'test-photo-123',
    total: 1
  });

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 4: Milestone Event
  console.log('\n🎉 Test 4: Milestone Event');
  await integration.triggerEvent('event_milestone', {
    eventName: 'test-event',
    eventId: 'test-event-123',
    milestone: 10,
    totalPhotos: 10,
    albumName: 'Official'
  });

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 5: Upload Failed
  console.log('\n❌ Test 5: Upload Failed Event');
  await integration.triggerEvent('upload_failed', {
    fileName: 'test-photo-002.jpg',
    filePath: '/test/path/test-photo-002.jpg',
    albumName: 'Official',
    eventName: 'test-event',
    uploaderName: 'Test Photographer',
    error: 'Network connection failed'
  });

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 6: Camera Disconnected
  console.log('\n📷 Test 6: Camera Disconnected Event');
  await integration.triggerEvent('camera_disconnected', {
    cameraModel: 'Nikon D7100',
    status: 'disconnected',
    message: 'USB connection lost',
    lastSeen: new Date().toISOString()
  });

  // Check queue status
  console.log('\n📊 Queue Status:', integration.getQueueStatus());

  console.log('\n' + '=' .repeat(50));
  console.log('✅ Notification system test completed!');
  console.log('📝 Check the logs above to verify all events were processed.');
  console.log('🌐 If Next.js is running, check the admin dashboard for real-time updates.');
}

// Run test
if (require.main === module) {
  testNotificationSystem().catch(console.error);
}

module.exports = { testNotificationSystem };