#!/usr/bin/env node

/**
 * DSLR Event Manager
 * Solusi praktis untuk mengelola multiple events tanpa mengubah environment variables
 */

const fs = require('fs').promises;
const path = require('path');
const { config } = require('./dslr.config.js');

class DSLREventManager {
  constructor() {
    this.eventsFile = './dslr-events.json';
    this.currentEventFile = './dslr-current-event.json';
  }

  // Load events dari file
  async loadEvents() {
    try {
      const data = await fs.readFile(this.eventsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // File tidak ada, return empty array
      return [];
    }
  }

  // Save events ke file
  async saveEvents(events) {
    await fs.writeFile(this.eventsFile, JSON.stringify(events, null, 2));
  }

  // Load current active event
  async loadCurrentEvent() {
    try {
      const data = await fs.readFile(this.currentEventFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  // Save current active event
  async saveCurrentEvent(event) {
    await fs.writeFile(this.currentEventFile, JSON.stringify(event, null, 2));
  }

  // Create new event
  async createEvent(eventData) {
    const events = await this.loadEvents();
    
    const newEvent = {
      id: eventData.id || `event-${Date.now()}`,
      name: eventData.name,
      description: eventData.description || '',
      date: eventData.date || new Date().toISOString().split('T')[0],
      photographer: eventData.photographer || 'Official Photographer',
      album: eventData.album || 'Official',
      apiUrl: eventData.apiUrl || config.API.BASE_URL,
      watermarkEnabled: eventData.watermarkEnabled || false,
      backupEnabled: eventData.backupEnabled || true,
      created: new Date().toISOString(),
      status: 'active'
    };

    events.push(newEvent);
    await this.saveEvents(events);
    
    return newEvent;
  }

  // List all events
  async listEvents() {
    return await this.loadEvents();
  }

  // Get event by ID
  async getEvent(eventId) {
    const events = await this.loadEvents();
    return events.find(event => event.id === eventId);
  }

  // Set active event (untuk DSLR service)
  async setActiveEvent(eventId) {
    const event = await this.getEvent(eventId);
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }

    await this.saveCurrentEvent(event);
    return event;
  }

  // Get current active event
  async getCurrentEvent() {
    const currentEvent = await this.loadCurrentEvent();
    if (!currentEvent) {
      throw new Error('No active event set. Use: node dslr-event-manager.js activate <event-id>');
    }
    return currentEvent;
  }

  // Update event
  async updateEvent(eventId, updates) {
    const events = await this.loadEvents();
    const eventIndex = events.findIndex(event => event.id === eventId);
    
    if (eventIndex === -1) {
      throw new Error(`Event not found: ${eventId}`);
    }

    events[eventIndex] = { ...events[eventIndex], ...updates, updated: new Date().toISOString() };
    await this.saveEvents(events);

    // Update current event if it's the active one
    const currentEvent = await this.loadCurrentEvent();
    if (currentEvent && currentEvent.id === eventId) {
      await this.saveCurrentEvent(events[eventIndex]);
    }

    return events[eventIndex];
  }

  // Delete event
  async deleteEvent(eventId) {
    const events = await this.loadEvents();
    const filteredEvents = events.filter(event => event.id !== eventId);
    
    if (events.length === filteredEvents.length) {
      throw new Error(`Event not found: ${eventId}`);
    }

    await this.saveEvents(filteredEvents);

    // Clear current event if it's the deleted one
    const currentEvent = await this.loadCurrentEvent();
    if (currentEvent && currentEvent.id === eventId) {
      await fs.unlink(this.currentEventFile).catch(() => {});
    }
  }

  // Quick setup untuk event baru
  async quickSetup(eventName, eventDate) {
    const eventId = `${eventName.toLowerCase().replace(/\s+/g, '-')}-${eventDate}`;
    
    const newEvent = await this.createEvent({
      id: eventId,
      name: eventName,
      date: eventDate,
      photographer: 'Official Photographer',
      album: 'Official'
    });

    await this.setActiveEvent(eventId);
    
    return newEvent;
  }

  // Export event configuration untuk production
  async exportForProduction(eventId) {
    const event = await this.getEvent(eventId);
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }

    const productionConfig = {
      DSLR_EVENT_ID: event.id,
      DSLR_UPLOADER_NAME: event.photographer,
      DSLR_ALBUM_NAME: event.album,
      DSLR_API_BASE_URL: event.apiUrl,
      DSLR_WATERMARK_ENABLED: event.watermarkEnabled,
      DSLR_ENABLE_BACKUP: event.backupEnabled
    };

    const exportFile = `production-env-${event.id}.txt`;
    const envContent = Object.entries(productionConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    await fs.writeFile(exportFile, envContent);
    
    return { exportFile, config: productionConfig };
  }
}

// CLI Interface
async function main() {
  const manager = new DSLREventManager();
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'create':
        await createEventCLI(manager, args);
        break;
      case 'list':
        await listEventsCLI(manager);
        break;
      case 'activate':
        await activateEventCLI(manager, args[1]);
        break;
      case 'current':
        await showCurrentEventCLI(manager);
        break;
      case 'update':
        await updateEventCLI(manager, args);
        break;
      case 'delete':
        await deleteEventCLI(manager, args[1]);
        break;
      case 'quick':
        await quickSetupCLI(manager, args);
        break;
      case 'export':
        await exportProductionCLI(manager, args[1]);
        break;
      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function createEventCLI(manager, args) {
  if (args.length < 2) {
    console.error('Usage: node dslr-event-manager.js create <event-name> [date] [photographer]');
    console.error('Example: node dslr-event-manager.js create "Wedding Sarah & John" 2025-01-15 "John Photographer"');
    process.exit(1);
  }

  const eventName = args[1];
  const eventDate = args[2] || new Date().toISOString().split('T')[0];
  const photographer = args[3] || 'Official Photographer';

  const event = await manager.createEvent({
    name: eventName,
    date: eventDate,
    photographer: photographer
  });

  console.log('✅ Event created successfully!');
  console.log(`📅 Event ID: ${event.id}`);
  console.log(`📸 Event Name: ${event.name}`);
  console.log(`📅 Date: ${event.date}`);
  console.log(`👨‍💼 Photographer: ${event.photographer}`);
  console.log('\n💡 To activate this event:');
  console.log(`   node dslr-event-manager.js activate ${event.id}`);
}

async function listEventsCLI(manager) {
  const events = await manager.listEvents();
  const currentEvent = await manager.loadCurrentEvent();

  console.log('📋 All Events:');
  console.log('=' .repeat(60));

  if (events.length === 0) {
    console.log('No events found. Create one with: node dslr-event-manager.js create "Event Name"');
    return;
  }

  events.forEach(event => {
    const isActive = currentEvent && currentEvent.id === event.id;
    const status = isActive ? '🟢 ACTIVE' : '⚪ Inactive';
    
    console.log(`\n${status} ${event.name}`);
    console.log(`   ID: ${event.id}`);
    console.log(`   Date: ${event.date}`);
    console.log(`   Photographer: ${event.photographer}`);
    console.log(`   Created: ${new Date(event.created).toLocaleDateString()}`);
  });

  console.log('\n💡 Commands:');
  console.log('   Activate: node dslr-event-manager.js activate <event-id>');
  console.log('   Export: node dslr-event-manager.js export <event-id>');
}

async function activateEventCLI(manager, eventId) {
  if (!eventId) {
    console.error('Usage: node dslr-event-manager.js activate <event-id>');
    process.exit(1);
  }

  const event = await manager.setActiveEvent(eventId);
  
  console.log('✅ Event activated successfully!');
  console.log(`📸 Active Event: ${event.name}`);
  console.log(`📅 Date: ${event.date}`);
  console.log(`👨‍💼 Photographer: ${event.photographer}`);
  console.log('\n🚀 Ready to start DSLR service!');
  console.log('   node dslr-auto-upload-service.js');
}

async function showCurrentEventCLI(manager) {
  try {
    const event = await manager.getCurrentEvent();
    
    console.log('🟢 Current Active Event:');
    console.log('=' .repeat(40));
    console.log(`📸 Name: ${event.name}`);
    console.log(`📅 ID: ${event.id}`);
    console.log(`📅 Date: ${event.date}`);
    console.log(`👨‍💼 Photographer: ${event.photographer}`);
    console.log(`💾 Album: ${event.album}`);
    console.log(`🌐 API URL: ${event.apiUrl}`);
    console.log(`🏷️ Watermark: ${event.watermarkEnabled ? 'Enabled' : 'Disabled'}`);
    console.log(`💾 Backup: ${event.backupEnabled ? 'Enabled' : 'Disabled'}`);
  } catch (error) {
    console.log('❌ No active event set');
    console.log('\n💡 Available commands:');
    console.log('   List events: node dslr-event-manager.js list');
    console.log('   Create event: node dslr-event-manager.js create "Event Name"');
    console.log('   Quick setup: node dslr-event-manager.js quick "Wedding Sarah" 2025-01-15');
  }
}

async function quickSetupCLI(manager, args) {
  if (args.length < 3) {
    console.error('Usage: node dslr-event-manager.js quick <event-name> <date>');
    console.error('Example: node dslr-event-manager.js quick "Wedding Sarah & John" 2025-01-15');
    process.exit(1);
  }

  const eventName = args[1];
  const eventDate = args[2];

  const event = await manager.quickSetup(eventName, eventDate);
  
  console.log('🚀 Quick Setup Complete!');
  console.log(`✅ Event created and activated: ${event.name}`);
  console.log(`📅 Event ID: ${event.id}`);
  console.log(`📅 Date: ${event.date}`);
  console.log('\n🎯 Ready to start shooting!');
  console.log('   Start DSLR service: node dslr-auto-upload-service.js');
  console.log('   Or complete system: start-complete-system.bat');
}

async function exportProductionCLI(manager, eventId) {
  if (!eventId) {
    console.error('Usage: node dslr-event-manager.js export <event-id>');
    process.exit(1);
  }

  const result = await manager.exportForProduction(eventId);
  
  console.log('📤 Production Configuration Exported!');
  console.log(`📄 File: ${result.exportFile}`);
  console.log('\n📋 Environment Variables:');
  console.log('=' .repeat(40));
  Object.entries(result.config).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });
  
  console.log('\n💡 For Vercel deployment:');
  console.log('1. Copy the environment variables above');
  console.log('2. Go to Vercel Dashboard > Project > Settings > Environment Variables');
  console.log('3. Add each variable');
  console.log('4. Redeploy your application');
}

function showHelp() {
  console.log('🎯 DSLR Event Manager');
  console.log('Solusi praktis untuk mengelola multiple events');
  console.log('=' .repeat(50));
  console.log('\nCommands:');
  console.log('  create <name> [date] [photographer]  Create new event');
  console.log('  list                                 List all events');
  console.log('  activate <event-id>                  Set active event');
  console.log('  current                              Show current active event');
  console.log('  quick <name> <date>                  Quick setup & activate');
  console.log('  export <event-id>                    Export for production');
  console.log('  delete <event-id>                    Delete event');
  console.log('  help                                 Show this help');
  console.log('\nExamples:');
  console.log('  node dslr-event-manager.js create "Wedding Sarah & John" 2025-01-15');
  console.log('  node dslr-event-manager.js quick "Corporate Event" 2025-01-20');
  console.log('  node dslr-event-manager.js list');
  console.log('  node dslr-event-manager.js activate wedding-sarah-john-2025-01-15');
  console.log('  node dslr-event-manager.js current');
  console.log('  node dslr-event-manager.js export wedding-sarah-john-2025-01-15');
}

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = DSLREventManager;