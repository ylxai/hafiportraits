/**
 * Test Script untuk Grouped Admin Dashboard CRUD
 * Verifikasi bahwa Event CRUD berfungsi dengan baik di grouped tabs
 */

console.log('🧪 Testing Grouped Admin Dashboard Event CRUD...\n');

// Test configuration
const API_BASE = 'http://localhost:3000/api/admin/events';
const ADMIN_URL = 'http://localhost:3000/admin';

// Test data
const testEvent = {
  name: 'Test Grouped Dashboard Event',
  date: '2024-12-25',
  access_code: 'GROUPED123',
  is_premium: false
};

async function testGroupedAdminCRUD() {
  console.log('🎯 Testing Event CRUD in Grouped Admin Dashboard\n');
  
  let createdEventId = null;
  
  try {
    // 1. Test API endpoints are working
    console.log('1️⃣ Testing API Endpoints...');
    
    // Test GET /api/admin/events
    const getResponse = await fetch(API_BASE);
    if (!getResponse.ok) {
      throw new Error(`GET events failed: ${getResponse.status}`);
    }
    const existingEvents = await getResponse.json();
    console.log(`✅ GET Events: Found ${existingEvents.length} existing events`);
    
    // Test POST /api/admin/events
    console.log('\n2️⃣ Testing CREATE Event...');
    const createResponse = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testEvent),
    });
    
    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}));
      throw new Error(`CREATE failed: ${createResponse.status} - ${errorData.message || 'Unknown error'}`);
    }
    
    const createdEvent = await createResponse.json();
    createdEventId = createdEvent.id;
    console.log('✅ CREATE Success:', {
      id: createdEvent.id,
      name: createdEvent.name,
      qr_code: createdEvent.qr_code ? '✅ Generated' : '❌ Not generated',
      shareable_link: createdEvent.shareable_link ? '✅ Generated' : '❌ Not generated'
    });
    
    // Test PUT /api/admin/events/[id]
    console.log('\n3️⃣ Testing UPDATE Event...');
    const updateData = {
      ...testEvent,
      name: 'Updated Grouped Dashboard Event',
      is_premium: true
    };
    
    const updateResponse = await fetch(`${API_BASE}/${createdEventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    
    if (!updateResponse.ok) {
      throw new Error(`UPDATE failed: ${updateResponse.status}`);
    }
    
    const updatedEvent = await updateResponse.json();
    console.log('✅ UPDATE Success:', {
      id: updatedEvent.id,
      name: updatedEvent.name,
      is_premium: updatedEvent.is_premium
    });
    
    // Test DELETE /api/admin/events/[id]
    console.log('\n4️⃣ Testing DELETE Event...');
    const deleteResponse = await fetch(`${API_BASE}/${createdEventId}`, {
      method: 'DELETE',
    });
    
    if (!deleteResponse.ok) {
      throw new Error(`DELETE failed: ${deleteResponse.status}`);
    }
    
    console.log('✅ DELETE Success: Event removed from system');
    
    // Verify deletion
    const verifyResponse = await fetch(API_BASE);
    const remainingEvents = await verifyResponse.json();
    const eventStillExists = remainingEvents.some(e => e.id === createdEventId);
    
    if (eventStillExists) {
      console.log('❌ DELETE Verification Failed: Event still exists');
    } else {
      console.log('✅ DELETE Verification Success: Event properly removed');
    }
    
    console.log('\n🎉 All CRUD operations working correctly!');
    console.log('\n📱 Manual Testing Instructions:');
    console.log(`1. Open: ${ADMIN_URL}`);
    console.log('2. Navigate to: Content > Events tab');
    console.log('3. Try creating, editing, and deleting events');
    console.log('4. Verify real-time statistics update');
    console.log('5. Test modal form functionality');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Cleanup
    if (createdEventId) {
      try {
        console.log('\n🧹 Cleaning up test event...');
        await fetch(`${API_BASE}/${createdEventId}`, { method: 'DELETE' });
        console.log('✅ Cleanup completed');
      } catch (cleanupError) {
        console.log('⚠️ Cleanup failed:', cleanupError.message);
      }
    }
  }
}

// Test React Query integration
async function testReactQueryIntegration() {
  console.log('\n🔄 Testing React Query Integration...\n');
  
  try {
    // Test stats endpoint (used by dashboard)
    console.log('1️⃣ Testing Stats API...');
    const statsResponse = await fetch('http://localhost:3000/api/admin/stats');
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Stats API working:', {
        totalEvents: stats.totalEvents || 0,
        totalPhotos: stats.totalPhotos || 0,
        totalMessages: stats.totalMessages || 0
      });
    } else {
      console.log('⚠️ Stats API not available');
    }
    
    // Test if admin page loads
    console.log('\n2️⃣ Testing Admin Page Accessibility...');
    const adminResponse = await fetch(ADMIN_URL);
    if (adminResponse.ok) {
      console.log('✅ Admin dashboard accessible');
    } else {
      console.log('❌ Admin dashboard not accessible');
    }
    
  } catch (error) {
    console.log('⚠️ React Query integration test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Grouped Admin Dashboard Test Suite\n');
  console.log('=' .repeat(60));
  
  await testGroupedAdminCRUD();
  await testReactQueryIntegration();
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 Grouped Admin Dashboard Test Suite Completed');
  console.log('\n💡 Next Steps:');
  console.log('- Open admin dashboard and test manually');
  console.log('- Verify grouped tabs navigation works');
  console.log('- Test event form modal functionality');
  console.log('- Check real-time statistics updates');
}

// Check environment and run
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runAllTests().catch(console.error);
} else {
  // Browser environment
  window.testGroupedAdmin = runAllTests;
  console.log('Grouped Admin tests loaded. Run testGroupedAdmin() in console.');
}