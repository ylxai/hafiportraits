#!/usr/bin/env node

/**
 * DSLR Hybrid Event Manager
 * Local + Supabase Sync Capability
 * Week 1 Implementation: Enhanced event manager dengan sync
 */

const fs = require('fs').promises;
const path = require('path');
const { config } = require('./dslr.config.js');

class DSLRHybridEventManager {
  constructor() {
    this.eventsFile = './dslr-events.json';
    this.currentEventFile = './dslr-current-event.json';
    this.syncQueueFile = './dslr-sync-queue.json';
    this.lastSyncFile = './dslr-last-sync.json';
    
    // Supabase client (will be initialized if available)
    this.supabaseClient = null;
    this.syncEnabled = false;
    
    this.initializeSupabase();
  }

  // Initialize Supabase connection
  async initializeSupabase() {
    try {
      // Try to load Supabase client
      const { createClient } = require('@supabase/supabase-js');
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        this.supabaseClient = createClient(supabaseUrl, supabaseKey);
        this.syncEnabled = true;
        console.log('🔄 Supabase sync enabled');
      } else {
        console.log('📦 Running in local-only mode (no Supabase config)');
      }
    } catch (error) {
      console.log('📦 Running in local-only mode (Supabase not available)');
      this.syncEnabled = false;
    }
  }

  // Test internet connectivity
  async testConnectivity() {
    if (!this.syncEnabled) return false;
    
    try {
      const { data, error } = await this.supabaseClient
        .from('events')
        .select('id')
        .limit(1);
      
      return !error;
    } catch (error) {
      return false;
    }
  }

  // Load events dari local file
  async loadLocalEvents() {
    try {
      const data = await fs.readFile(this.eventsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Save events ke local file
  async saveLocalEvents(events) {
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

  // Load sync queue
  async loadSyncQueue() {
    try {
      const data = await fs.readFile(this.syncQueueFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Save sync queue
  async saveSyncQueue(queue) {
    await fs.writeFile(this.syncQueueFile, JSON.stringify(queue, null, 2));
  }

  // Get last sync timestamp
  async getLastSyncTime() {
    try {
      const data = await fs.readFile(this.lastSyncFile, 'utf8');
      const syncData = JSON.parse(data);
      return new Date(syncData.lastSync);
    } catch (error) {
      return new Date(0); // Unix epoch if no sync yet
    }
  }

  // Update last sync timestamp
  async updateLastSyncTime() {
    const syncData = {
      lastSync: new Date().toISOString(),
      syncCount: await this.getSyncCount() + 1
    };
    await fs.writeFile(this.lastSyncFile, JSON.stringify(syncData, null, 2));
  }

  // Get sync count
  async getSyncCount() {
    try {
      const data = await fs.readFile(this.lastSyncFile, 'utf8');
      const syncData = JSON.parse(data);
      return syncData.syncCount || 0;
    } catch (error) {
      return 0;
    }
  }

  // Generate access code
  generateAccessCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Generate shareable link
  generateShareableLink(eventId, apiUrl) {
    // Use production URL if available, fallback to provided apiUrl
    const productionUrl = process.env.NODE_ENV === 'production' ? 'https://hafiportrait.photography' : apiUrl;
    return `${productionUrl}/event/${eventId}`;
  }

  // Generate QR code data
  generateQRCodeData(shareableLink) {
    // Generate QR code URL using QR Server API
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareableLink)}`;
  }

  // Create new event (hybrid)
  async createEvent(eventData) {
    const events = await this.loadLocalEvents();
    
    const eventId = eventData.id || this.generateEventId(eventData.name, eventData.date);
    const apiUrl = eventData.apiUrl || config.API.BASE_URL;
    const accessCode = eventData.accessCode || this.generateAccessCode();
    const shareableLink = eventData.shareableLink || this.generateShareableLink(eventId, apiUrl);
    const qrCodeData = eventData.qrCodeData || this.generateQRCodeData(shareableLink);
    
    const newEvent = {
      id: eventId,
      name: eventData.name,
      description: eventData.description || '',
      date: eventData.date || new Date().toISOString().split('T')[0],
      photographer: eventData.photographer || 'Hafiportrait',
      album: eventData.album || 'Official',
      apiUrl: apiUrl,
      accessCode: accessCode,
      shareableLink: shareableLink,
      qrCodeData: qrCodeData,
      watermarkEnabled: eventData.watermarkEnabled || false,
      backupEnabled: eventData.backupEnabled !== false, // Default true
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      status: 'active',
      syncStatus: 'pending', // pending, synced, failed
      createdVia: 'cli'
    };

    // Add to local events
    events.push(newEvent);
    await this.saveLocalEvents(events);
    
    console.log(`✅ Event created locally: ${newEvent.id}`);
    
    // Try to sync immediately
    await this.syncEventToSupabase(newEvent);
    
    return newEvent;
  }

  // Sync single event to Supabase
  async syncEventToSupabase(event) {
    if (!this.syncEnabled) {
      console.log('📦 Sync disabled - event queued for later');
      await this.addToSyncQueue(event, 'create');
      return false;
    }

    const isOnline = await this.testConnectivity();
    if (!isOnline) {
      console.log('🔌 No internet - event queued for sync');
      await this.addToSyncQueue(event, 'create');
      return false;
    }

    try {
      // Check if event already exists in Supabase
      const { data: existingEvent } = await this.supabaseClient
        .from('events')
        .select('id')
        .eq('id', event.id)
        .single();

      if (existingEvent) {
        // Update existing event
        const { error } = await this.supabaseClient
          .from('events')
          .update({
            name: event.name,
            description: event.description,
            date: event.date,
            access_code: event.accessCode,
            shareable_link: event.shareableLink,
            qr_code: event.qrCodeData,
            photographer_name: event.photographer,
            album_name: event.album,
            watermark_enabled: event.watermarkEnabled,
            backup_enabled: event.backupEnabled,
            updated_at: event.updated,
            created_via: event.createdVia
          })
          .eq('id', event.id);

        if (error) throw error;
        console.log(`🔄 Event updated in Supabase: ${event.id}`);
      } else {
        // Create new event in Supabase
        const { error } = await this.supabaseClient
          .from('events')
          .insert({
            id: event.id,
            name: event.name,
            description: event.description,
            date: event.date,
            access_code: event.accessCode,
            shareable_link: event.shareableLink,
            qr_code: event.qrCodeData,
            photographer_name: event.photographer,
            album_name: event.album,
            watermark_enabled: event.watermarkEnabled,
            backup_enabled: event.backupEnabled,
            created_at: event.created,
            updated_at: event.updated,
            created_via: event.createdVia
          });

        if (error) throw error;
        console.log(`☁️ Event synced to Supabase: ${event.id}`);
      }

      // Update local sync status
      await this.updateEventSyncStatus(event.id, 'synced');
      return true;

    } catch (error) {
      console.error(`❌ Sync failed for ${event.id}:`, error.message);
      await this.addToSyncQueue(event, 'create');
      await this.updateEventSyncStatus(event.id, 'failed');
      return false;
    }
  }

  // Update event sync status in local storage
  async updateEventSyncStatus(eventId, status) {
    const events = await this.loadLocalEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex !== -1) {
      events[eventIndex].syncStatus = status;
      events[eventIndex].lastSyncAttempt = new Date().toISOString();
      await this.saveLocalEvents(events);
    }
  }

  // Add event to sync queue
  async addToSyncQueue(event, action) {
    const queue = await this.loadSyncQueue();
    
    const queueItem = {
      id: `${event.id}-${Date.now()}`,
      eventId: event.id,
      action: action, // create, update, delete
      event: event,
      timestamp: new Date().toISOString(),
      retryCount: 0
    };
    
    queue.push(queueItem);
    await this.saveSyncQueue(queue);
  }

  // Process sync queue
  async processSyncQueue() {
    if (!this.syncEnabled) {
      console.log('📦 Sync disabled - queue not processed');
      return;
    }

    const isOnline = await this.testConnectivity();
    if (!isOnline) {
      console.log('🔌 No internet - queue not processed');
      return;
    }

    const queue = await this.loadSyncQueue();
    const processedItems = [];
    
    console.log(`🔄 Processing sync queue (${queue.length} items)...`);
    
    for (const item of queue) {
      try {
        let success = false;
        
        switch (item.action) {
          case 'create':
          case 'update':
            success = await this.syncEventToSupabase(item.event);
            break;
          case 'delete':
            success = await this.deleteEventFromSupabase(item.eventId);
            break;
        }
        
        if (success) {
          processedItems.push(item.id);
          console.log(`✅ Synced: ${item.eventId}`);
        } else {
          item.retryCount++;
          if (item.retryCount >= 3) {
            processedItems.push(item.id);
            console.log(`❌ Max retries reached for: ${item.eventId}`);
          }
        }
      } catch (error) {
        console.error(`❌ Queue processing error for ${item.eventId}:`, error.message);
        item.retryCount++;
      }
    }
    
    // Remove processed items from queue
    const remainingQueue = queue.filter(item => !processedItems.includes(item.id));
    await this.saveSyncQueue(remainingQueue);
    
    if (processedItems.length > 0) {
      await this.updateLastSyncTime();
      console.log(`✅ Processed ${processedItems.length} sync items`);
    }
  }

  // Sync events from Supabase to local
  async syncFromSupabase() {
    if (!this.syncEnabled) return;

    const isOnline = await this.testConnectivity();
    if (!isOnline) return;

    try {
      const lastSync = await this.getLastSyncTime();
      
      // Get events updated since last sync
      const { data: remoteEvents, error } = await this.supabaseClient
        .from('events')
        .select('*')
        .gte('updated_at', lastSync.toISOString())
        .order('updated_at', { ascending: true });

      if (error) throw error;

      if (remoteEvents && remoteEvents.length > 0) {
        const localEvents = await this.loadLocalEvents();
        let hasChanges = false;

        for (const remoteEvent of remoteEvents) {
          const localIndex = localEvents.findIndex(e => e.id === remoteEvent.id);
          
          const hybridEvent = {
            id: remoteEvent.id,
            name: remoteEvent.name,
            description: remoteEvent.description || '',
            date: remoteEvent.date,
            accessCode: remoteEvent.access_code || this.generateAccessCode(),
            shareableLink: remoteEvent.shareable_link || this.generateShareableLink(remoteEvent.id, config.API.BASE_URL),
            qrCodeData: remoteEvent.qr_code || this.generateQRCodeData(remoteEvent.shareable_link || this.generateShareableLink(remoteEvent.id, config.API.BASE_URL)),
            photographer: remoteEvent.photographer_name || 'Hafiportrait',
            album: remoteEvent.album_name || 'Official',
            apiUrl: config.API.BASE_URL,
            watermarkEnabled: remoteEvent.watermark_enabled || false,
            backupEnabled: remoteEvent.backup_enabled !== false,
            created: remoteEvent.created_at,
            updated: remoteEvent.updated_at,
            status: 'active',
            syncStatus: 'synced',
            createdVia: remoteEvent.created_via || 'dashboard'
          };

          if (localIndex === -1) {
            // New event from remote
            localEvents.push(hybridEvent);
            hasChanges = true;
            console.log(`📥 New event from Supabase: ${remoteEvent.id}`);
          } else {
            // Update existing event if remote is newer
            const localUpdated = new Date(localEvents[localIndex].updated);
            const remoteUpdated = new Date(remoteEvent.updated_at);
            
            if (remoteUpdated > localUpdated) {
              localEvents[localIndex] = hybridEvent;
              hasChanges = true;
              console.log(`🔄 Updated event from Supabase: ${remoteEvent.id}`);
            }
          }
        }

        if (hasChanges) {
          await this.saveLocalEvents(localEvents);
          console.log(`✅ Synced ${remoteEvents.length} events from Supabase`);
        }
      }

    } catch (error) {
      console.error('❌ Sync from Supabase failed:', error.message);
    }
  }

  // List all events (with background sync)
  async listEvents() {
    // Load local events first (fast)
    const localEvents = await this.loadLocalEvents();
    
    // Background sync from Supabase
    if (this.syncEnabled) {
      this.syncFromSupabase().catch(error => {
        console.log('🔄 Background sync failed:', error.message);
      });
      
      // Process any pending sync queue
      this.processSyncQueue().catch(error => {
        console.log('🔄 Queue processing failed:', error.message);
      });
    }
    
    return localEvents;
  }

  // Get event by ID
  async getEvent(eventId) {
    const events = await this.loadLocalEvents();
    return events.find(event => event.id === eventId);
  }

  // Set active event
  async setActiveEvent(eventId) {
    const event = await this.getEvent(eventId);
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }

    await this.saveCurrentEvent(event);
    console.log(`✅ Active event set: ${event.name} (${event.id})`);
    return event;
  }

  // Get current active event
  async getCurrentEvent() {
    const currentEvent = await this.loadCurrentEvent();
    if (!currentEvent) {
      throw new Error('No active event set. Use: node dslr-hybrid-event-manager.js activate <event-id>');
    }
    return currentEvent;
  }

  // Update event
  async updateEvent(eventId, updates) {
    const events = await this.loadLocalEvents();
    const eventIndex = events.findIndex(event => event.id === eventId);
    
    if (eventIndex === -1) {
      throw new Error(`Event not found: ${eventId}`);
    }

    events[eventIndex] = { 
      ...events[eventIndex], 
      ...updates, 
      updated: new Date().toISOString(),
      syncStatus: 'pending'
    };
    
    await this.saveLocalEvents(events);

    // Update current event if it's the active one
    const currentEvent = await this.loadCurrentEvent();
    if (currentEvent && currentEvent.id === eventId) {
      await this.saveCurrentEvent(events[eventIndex]);
    }

    // Try to sync
    await this.syncEventToSupabase(events[eventIndex]);

    return events[eventIndex];
  }

  // Delete event
  async deleteEvent(eventId) {
    const events = await this.loadLocalEvents();
    const filteredEvents = events.filter(event => event.id !== eventId);
    
    if (events.length === filteredEvents.length) {
      throw new Error(`Event not found: ${eventId}`);
    }

    await this.saveLocalEvents(filteredEvents);

    // Clear current event if it's the deleted one
    const currentEvent = await this.loadCurrentEvent();
    if (currentEvent && currentEvent.id === eventId) {
      await fs.unlink(this.currentEventFile).catch(() => {});
    }

    // Try to delete from Supabase
    await this.deleteEventFromSupabase(eventId);

    console.log(`✅ Event deleted: ${eventId}`);
  }

  // Delete event from Supabase
  async deleteEventFromSupabase(eventId) {
    if (!this.syncEnabled) {
      await this.addToSyncQueue({ id: eventId }, 'delete');
      return false;
    }

    const isOnline = await this.testConnectivity();
    if (!isOnline) {
      await this.addToSyncQueue({ id: eventId }, 'delete');
      return false;
    }

    try {
      const { error } = await this.supabaseClient
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      console.log(`☁️ Event deleted from Supabase: ${eventId}`);
      return true;
    } catch (error) {
      console.error(`❌ Delete from Supabase failed for ${eventId}:`, error.message);
      await this.addToSyncQueue({ id: eventId }, 'delete');
      return false;
    }
  }

  // Generate event ID (UUID or custom format)
  generateEventId(eventName, eventDate) {
    // Option 1: Custom readable format (current)
    return `${eventName.toLowerCase().replace(/\s+/g, '-')}-${eventDate}`;
    
    // Option 2: UUID format (for database compatibility)
    // const crypto = require('crypto');
    // return crypto.randomUUID();
  }

  // Quick setup untuk event baru
  async quickSetup(eventName, eventDate) {
    const eventId = this.generateEventId(eventName, eventDate);
    
    const newEvent = await this.createEvent({
      id: eventId,
      name: eventName,
      date: eventDate,
      photographer: 'Hafiportrait',
      album: 'Official'
    });

    await this.setActiveEvent(eventId);
    
    return newEvent;
  }

  // Get sync status
  async getSyncStatus() {
    const events = await this.loadLocalEvents();
    const queue = await this.loadSyncQueue();
    const lastSync = await this.getLastSyncTime();
    const syncCount = await this.getSyncCount();
    
    const syncStats = {
      totalEvents: events.length,
      syncedEvents: events.filter(e => e.syncStatus === 'synced').length,
      pendingEvents: events.filter(e => e.syncStatus === 'pending').length,
      failedEvents: events.filter(e => e.syncStatus === 'failed').length,
      queueSize: queue.length,
      lastSync: lastSync,
      syncCount: syncCount,
      syncEnabled: this.syncEnabled,
      isOnline: this.syncEnabled ? await this.testConnectivity() : false
    };
    
    return syncStats;
  }

  // Force sync all
  async forceSyncAll() {
    console.log('🔄 Force syncing all events...');
    
    const events = await this.loadLocalEvents();
    let syncedCount = 0;
    
    for (const event of events) {
      const success = await this.syncEventToSupabase(event);
      if (success) syncedCount++;
    }
    
    await this.processSyncQueue();
    await this.syncFromSupabase();
    
    console.log(`✅ Force sync completed: ${syncedCount}/${events.length} events synced`);
    return syncedCount;
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

module.exports = DSLRHybridEventManager;
