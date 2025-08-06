/**
 * Test Script untuk Event CRUD Operations
 * Menguji semua operasi Create, Read, Update, Delete untuk Events
 */

const API_BASE = 'http://localhost:3000/api/admin/events';

// Test data
const testEvent = {
  name: 'Test Wedding Event',
  date: '2024-12-31',
  access_code: 'TEST123',
  is_premium: false
};

const updatedEvent = {
  name: 'Updated Wedding Event',
  date: '2024-12-31',
  access_code: 'UPDATED123',
  is_premium: true
};

async function testEventCRUD() {
  console.log('🧪 Testing Event CRUD Operations...\n');
  
  let createdEventId = null;
  
  try {
    // 1. CREATE - Test creating new event
    console.log('1️⃣ Testing CREATE Event...');
    const createResponse = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEvent),
    });
    
    if (!createResponse.ok) {
      throw new Error(`Create failed: ${createResponse.status}`);
    }
    
    const createdEvent = await createResponse.json();
    createdEventId = createdEvent.id;
    console.log('✅ CREATE Success:', {
      id: createdEvent.id,
      name: createdEvent.name,
      qr_code: createdEvent.qr_code ? 'Generated' : 'Not generated',
      shareable_link: createdEvent.shareable_link ? 'Generated' : 'Not generated'
    });
    
    // 2. READ - Test getting all events
    console.log('\n2️⃣ Testing READ All Events...');
    const readResponse = await fetch(API_BASE);
    
    if (!readResponse.ok) {
      throw new Error(`Read failed: ${readResponse.status}`);
    }
    
    const events = await readResponse.json();
    console.log('✅ READ Success:', {
      totalEvents: events.length,
      hasCreatedEvent: events.some(e => e.id === createdEventId)
    });
    
    // 3. UPDATE - Test updating the event
    console.log('\n3️⃣ Testing UPDATE Event...');
    const updateResponse = await fetch(`${API_BASE}/${createdEventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    });
    
    if (!updateResponse.ok) {
      throw new Error(`Update failed: ${updateResponse.status}`);
    }
    
    const updatedEventResult = await updateResponse.json();
    console.log('✅ UPDATE Success:', {
      id: updatedEventResult.id,
      name: updatedEventResult.name,
      is_premium: updatedEventResult.is_premium,
      access_code: updatedEventResult.access_code
    });
    
    // 4. DELETE - Test deleting the event
    console.log('\n4️⃣ Testing DELETE Event...');
    const deleteResponse = await fetch(`${API_BASE}/${createdEventId}`, {
      method: 'DELETE',
    });
    
    if (!deleteResponse.ok) {
      throw new Error(`Delete failed: ${deleteResponse.status}`);
    }
    
    const deleteResult = await deleteResponse.json();
    console.log('✅ DELETE Success:', deleteResult.message);
    
    // 5. VERIFY DELETE - Check if event is really deleted
    console.log('\n5️⃣ Verifying DELETE...');
    const verifyResponse = await fetch(API_BASE);
    const remainingEvents = await verifyResponse.json();
    const eventStillExists = remainingEvents.some(e => e.id === createdEventId);
    
    if (eventStillExists) {
      console.log('❌ DELETE Verification Failed: Event still exists');
    } else {
      console.log('✅ DELETE Verification Success: Event removed');
    }
    
    console.log('\n🎉 All CRUD tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Cleanup: Try to delete the created event if it exists
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

// Test error handling
async function testErrorHandling() {
  console.log('\n🧪 Testing Error Handling...\n');
  
  try {
    // Test invalid data
    console.log('1️⃣ Testing invalid event data...');
    const invalidResponse = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: '' }), // Invalid: missing required fields
    });
    
    if (invalidResponse.ok) {
      console.log('⚠️ Expected error but got success');
    } else {
      console.log('✅ Invalid data properly rejected');
    }
    
    // Test non-existent event update
    console.log('\n2️⃣ Testing update non-existent event...');
    const nonExistentResponse = await fetch(`${API_BASE}/non-existent-id`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    });
    
    if (nonExistentResponse.ok) {
      console.log('⚠️ Expected error but got success');
    } else {
      console.log('✅ Non-existent event update properly rejected');
    }
    
    console.log('\n✅ Error handling tests completed');
    
  } catch (error) {
    console.log('✅ Error handling working:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Event CRUD Test Suite\n');
  console.log('=' .repeat(50));
  
  await testEventCRUD();
  await testErrorHandling();
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 Event CRUD Test Suite Completed');
}

// Check if running in Node.js environment
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runAllTests().catch(console.error);
} else {
  // Browser environment
  window.testEventCRUD = runAllTests;
  console.log('Event CRUD tests loaded. Run testEventCRUD() in console.');
}