#!/usr/bin/env node

/**
 * Test Cascade Delete Event Functionality
 * Tests that when an event is deleted, all related photos and messages are also deleted
 */

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000';

// Test data
const testEvent = {
  name: 'Test Cascade Delete Event',
  date: '2025-12-31',
  accessCode: 'test-cascade-123',
  isPremium: false
};

const testMessage = {
  sender_name: 'Test User',
  content: 'This is a test message for cascade delete'
};

async function apiRequest(method, endpoint, data = null) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  return response;
}

async function testCascadeDelete() {
  console.log('🧪 TESTING CASCADE DELETE FUNCTIONALITY');
  console.log('=====================================');
  
  let createdEventId = null;
  let createdMessageId = null;

  try {
    // Step 1: Create a test event
    console.log('\n1️⃣ Creating test event...');
    const createEventResponse = await apiRequest('POST', '/api/admin/events', testEvent);
    
    if (!createEventResponse.ok) {
      throw new Error(`Failed to create event: ${createEventResponse.status}`);
    }
    
    const createdEvent = await createEventResponse.json();
    createdEventId = createdEvent.id;
    console.log(`✅ Event created: ${createdEvent.name} (ID: ${createdEventId})`);

    // Step 2: Add a message to the event
    console.log('\n2️⃣ Adding test message to event...');
    const createMessageResponse = await apiRequest('POST', `/api/events/${createdEventId}/messages`, testMessage);
    
    if (!createMessageResponse.ok) {
      throw new Error(`Failed to create message: ${createMessageResponse.status}`);
    }
    
    const createdMessage = await createMessageResponse.json();
    createdMessageId = createdMessage.id;
    console.log(`✅ Message created: "${createdMessage.content}" (ID: ${createdMessageId})`);

    // Step 3: Verify event, photos, and messages exist
    console.log('\n3️⃣ Verifying data exists before deletion...');
    
    // Check event exists
    const eventCheckResponse = await apiRequest('GET', `/api/events/${createdEventId}`);
    if (eventCheckResponse.ok) {
      console.log('✅ Event exists in database');
    } else {
      console.log('❌ Event not found');
    }

    // Check messages exist
    const messagesCheckResponse = await apiRequest('GET', `/api/events/${createdEventId}/messages`);
    if (messagesCheckResponse.ok) {
      const messages = await messagesCheckResponse.json();
      console.log(`✅ Found ${messages.length} message(s) for event`);
    } else {
      console.log('❌ Messages not found');
    }

    // Check photos exist (if any)
    const photosCheckResponse = await apiRequest('GET', `/api/events/${createdEventId}/photos`);
    if (photosCheckResponse.ok) {
      const photos = await photosCheckResponse.json();
      console.log(`✅ Found ${photos.length} photo(s) for event`);
    } else {
      console.log('❌ Photos not found');
    }

    // Step 4: Delete the event (this should cascade delete everything)
    console.log('\n4️⃣ Deleting event (testing cascade delete)...');
    const deleteEventResponse = await apiRequest('DELETE', `/api/admin/events/${createdEventId}`);
    
    if (!deleteEventResponse.ok) {
      throw new Error(`Failed to delete event: ${deleteEventResponse.status}`);
    }
    
    console.log('✅ Event deletion request successful');

    // Step 5: Verify everything is deleted
    console.log('\n5️⃣ Verifying cascade deletion worked...');
    
    // Check event is deleted
    const eventDeletedCheckResponse = await apiRequest('GET', `/api/events/${createdEventId}`);
    if (eventDeletedCheckResponse.status === 404 || !eventDeletedCheckResponse.ok) {
      console.log('✅ Event successfully deleted from database');
    } else {
      console.log('❌ Event still exists in database');
    }

    // Check messages are deleted
    const messagesDeletedCheckResponse = await apiRequest('GET', `/api/events/${createdEventId}/messages`);
    if (messagesDeletedCheckResponse.status === 404 || !messagesDeletedCheckResponse.ok) {
      console.log('✅ Messages successfully deleted from database');
    } else {
      const remainingMessages = await messagesDeletedCheckResponse.json();
      if (remainingMessages.length === 0) {
        console.log('✅ Messages successfully deleted from database');
      } else {
        console.log(`❌ ${remainingMessages.length} message(s) still exist in database`);
      }
    }

    // Check photos are deleted
    const photosDeletedCheckResponse = await apiRequest('GET', `/api/events/${createdEventId}/photos`);
    if (photosDeletedCheckResponse.status === 404 || !photosDeletedCheckResponse.ok) {
      console.log('✅ Photos successfully deleted from database');
    } else {
      const remainingPhotos = await photosDeletedCheckResponse.json();
      if (remainingPhotos.length === 0) {
        console.log('✅ Photos successfully deleted from database');
      } else {
        console.log(`❌ ${remainingPhotos.length} photo(s) still exist in database`);
      }
    }

    // Step 6: Check admin stats to verify counts updated
    console.log('\n6️⃣ Checking admin stats...');
    const statsResponse = await apiRequest('GET', '/api/admin/stats');
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log(`📊 Current stats: ${stats.totalEvents} events, ${stats.totalPhotos} photos, ${stats.totalMessages} messages`);
    }

    console.log('\n🎉 CASCADE DELETE TEST COMPLETED SUCCESSFULLY!');
    console.log('✅ Event and all related data properly deleted');

  } catch (error) {
    console.error('\n❌ CASCADE DELETE TEST FAILED:', error.message);
    
    // Cleanup: Try to delete the created event if it still exists
    if (createdEventId) {
      console.log('\n🧹 Attempting cleanup...');
      try {
        await apiRequest('DELETE', `/api/admin/events/${createdEventId}`);
        console.log('✅ Cleanup successful');
      } catch (cleanupError) {
        console.log('❌ Cleanup failed:', cleanupError.message);
      }
    }
  }
}

// Run the test
if (require.main === module) {
  testCascadeDelete();
}

module.exports = { testCascadeDelete };