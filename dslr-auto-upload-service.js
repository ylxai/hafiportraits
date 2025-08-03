/**
 * DSLR Auto Upload Service
 * Monitors folder untuk foto baru dari Nikon D7100
 * Auto upload JPG ke Supabase dengan album "Official"
 */

const chokidar = require('chokidar');
const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Import notification integration
const { getDSLRNotificationIntegration } = require('./src/lib/dslr-notification-integration');

// Konfigurasi
const CONFIG = {
  // Folder dimana Nikon D7100 menyimpan foto (sesuaikan dengan setup kamera)
  WATCH_FOLDER: 'C:/DCIM/100NIKON', // Windows
  // WATCH_FOLDER: '/Volumes/NIKON D7100/DCIM/100NIKON', // macOS
  
  // Folder backup lokal
  BACKUP_FOLDER: './dslr-backup',
  RAW_FOLDER: './dslr-backup/raw',
  JPG_FOLDER: './dslr-backup/jpg',
  
  // API Configuration
  API_BASE_URL: 'http://localhost:3000', // Ganti dengan production URL
  EVENT_ID: 'your-event-id', // Set event ID yang aktif
  
  // File patterns
  JPG_PATTERN: /\.(jpg|jpeg)$/i,
  RAW_PATTERN: /\.(nef|raw)$/i,
  
  // Upload settings
  UPLOADER_NAME: 'Official Photographer',
  ALBUM_NAME: 'Official'
};

class DSLRAutoUploader {
  constructor() {
    this.isProcessing = false;
    this.processedFiles = new Set();
    this.uploadStats = {
      totalUploaded: 0,
      totalFailed: 0,
      sessionStartTime: new Date().toISOString()
    };
    
    // Initialize notification integration
    this.notificationIntegration = getDSLRNotificationIntegration();
    
    this.init();
  }

  async init() {
    console.log('🚀 DSLR Auto Upload Service Starting...');
    
    // Buat folder backup jika belum ada
    await this.createBackupFolders();
    
    // Start file watcher
    this.startWatcher();
    
    // Trigger camera connected notification
    this.notificationIntegration.triggerEvent('camera_connected', {
      cameraModel: 'Nikon D7100',
      status: 'connected',
      message: 'DSLR Auto Upload Service started successfully',
      lastSeen: new Date().toISOString()
    });
    
    // Monitor camera connection
    this.startCameraMonitoring();
    
    console.log(`📁 Watching folder: ${CONFIG.WATCH_FOLDER}`);
    console.log(`📸 Event ID: ${CONFIG.EVENT_ID}`);
    console.log(`👨‍💼 Photographer: ${CONFIG.UPLOADER_NAME}`);
  }

  async createBackupFolders() {
    try {
      await fs.mkdir(CONFIG.BACKUP_FOLDER, { recursive: true });
      await fs.mkdir(CONFIG.RAW_FOLDER, { recursive: true });
      await fs.mkdir(CONFIG.JPG_FOLDER, { recursive: true });
      console.log('✅ Backup folders created');
    } catch (error) {
      console.error('❌ Error creating backup folders:', error);
    }
  }

  startWatcher() {
    const watcher = chokidar.watch(CONFIG.WATCH_FOLDER, {
      ignored: /^\./, // ignore dotfiles
      persistent: true,
      ignoreInitial: true, // ignore existing files
      awaitWriteFinish: {
        stabilityThreshold: 2000, // wait 2s after file stops changing
        pollInterval: 100
      }
    });

    watcher
      .on('add', (filePath) => this.handleNewFile(filePath))
      .on('error', (error) => console.error('❌ Watcher error:', error))
      .on('ready', () => console.log('👀 File watcher ready'));
  }

  async handleNewFile(filePath) {
    const fileName = path.basename(filePath);
    const fileExt = path.extname(fileName).toLowerCase();
    
    // Skip jika file sudah diproses
    if (this.processedFiles.has(fileName)) {
      return;
    }

    console.log(`📸 New file detected: ${fileName}`);

    try {
      // Backup file ke local storage
      await this.backupFile(filePath, fileName);
      
      // Jika JPG, upload ke Supabase
      if (CONFIG.JPG_PATTERN.test(fileExt)) {
        // Trigger upload start notification
        this.notificationIntegration.triggerEvent('upload_start', {
          fileName,
          fileSize: (await fs.stat(filePath)).size,
          filePath,
          albumName: CONFIG.ALBUM_NAME,
          eventName: CONFIG.EVENT_ID,
          uploaderName: CONFIG.UPLOADER_NAME
        });

        await this.uploadToSupabase(filePath, fileName);
      }
      
      // Mark as processed
      this.processedFiles.add(fileName);
      
    } catch (error) {
      console.error(`❌ Error processing ${fileName}:`, error);
      
      // Trigger upload failed notification
      this.notificationIntegration.triggerEvent('upload_failed', {
        fileName,
        filePath,
        albumName: CONFIG.ALBUM_NAME,
        eventName: CONFIG.EVENT_ID,
        uploaderName: CONFIG.UPLOADER_NAME,
        error: error.message
      });
    }
  }

  async backupFile(sourcePath, fileName) {
    try {
      const fileExt = path.extname(fileName).toLowerCase();
      let targetFolder;
      
      if (CONFIG.JPG_PATTERN.test(fileExt)) {
        targetFolder = CONFIG.JPG_FOLDER;
      } else if (CONFIG.RAW_PATTERN.test(fileExt)) {
        targetFolder = CONFIG.RAW_FOLDER;
      } else {
        targetFolder = CONFIG.BACKUP_FOLDER;
      }
      
      const targetPath = path.join(targetFolder, fileName);
      
      // Copy file
      const data = await fs.readFile(sourcePath);
      await fs.writeFile(targetPath, data);
      
      console.log(`💾 Backed up: ${fileName} → ${targetFolder}`);
      
    } catch (error) {
      console.error(`❌ Backup failed for ${fileName}:`, error);
    }
  }

  async uploadToSupabase(filePath, fileName) {
    try {
      console.log(`🚀 Uploading ${fileName} to Supabase...`);
      
      // Read file
      const fileBuffer = await fs.readFile(filePath);
      const fileBlob = new Blob([fileBuffer], { type: 'image/jpeg' });
      
      // Create FormData
      const formData = new FormData();
      formData.append('file', fileBlob, fileName);
      formData.append('uploaderName', CONFIG.UPLOADER_NAME);
      formData.append('albumName', CONFIG.ALBUM_NAME);
      
      // Upload via API
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/api/events/${CONFIG.EVENT_ID}/photos`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Upload success: ${fileName}`);
        console.log(`📷 Photo ID: ${result.id}`);
        
        // Update stats
        this.uploadStats.totalUploaded++;
        
        // Trigger upload success notification
        this.notificationIntegration.triggerEvent('upload_success', {
          fileName,
          fileSize: (await fs.stat(filePath)).size,
          filePath,
          albumName: CONFIG.ALBUM_NAME,
          eventName: CONFIG.EVENT_ID,
          uploaderName: CONFIG.UPLOADER_NAME,
          photoId: result.id,
          total: this.uploadStats.totalUploaded
        });

        // Check for milestones
        this.checkEventMilestone();
        
        // Optional: Send notification
        this.sendNotification(fileName, result);
        
      } else {
        const error = await response.text();
        this.uploadStats.totalFailed++;
        throw new Error(`Upload failed: ${response.status} - ${error}`);
      }
      
    } catch (error) {
      console.error(`❌ Upload failed for ${fileName}:`, error);
      
      // Retry logic (optional)
      setTimeout(() => {
        console.log(`🔄 Retrying upload for ${fileName}...`);
        this.uploadToSupabase(filePath, fileName);
      }, 5000);
    }
  }

  sendNotification(fileName, uploadResult) {
    // Optional: Send notification ke admin/client
    console.log(`📱 New official photo uploaded: ${fileName}`);
    
    // Bisa integrate dengan:
    // - WhatsApp API
    // - Email notification
    // - Push notification
    // - Slack/Discord webhook
  }

  // Method untuk set event ID secara dinamis
  setEventId(eventId) {
    CONFIG.EVENT_ID = eventId;
    console.log(`📝 Event ID updated: ${eventId}`);
  }

  // Method untuk pause/resume
  pause() {
    this.isProcessing = false;
    console.log('⏸️ Auto upload paused');
  }

  resume() {
    this.isProcessing = true;
    console.log('▶️ Auto upload resumed');
  }

  // Check for event milestones
  checkEventMilestone() {
    const milestones = [10, 25, 50, 100, 250, 500, 1000];
    const current = this.uploadStats.totalUploaded;
    
    if (milestones.includes(current)) {
      this.notificationIntegration.triggerEvent('event_milestone', {
        eventName: CONFIG.EVENT_ID,
        eventId: CONFIG.EVENT_ID,
        milestone: current,
        totalPhotos: current,
        albumName: CONFIG.ALBUM_NAME
      });
    }
  }

  // Monitor camera connection
  startCameraMonitoring() {
    setInterval(() => {
      this.checkCameraConnection();
    }, 30000); // Check every 30 seconds
  }

  async checkCameraConnection() {
    try {
      // Check if watch folder is accessible
      await fs.access(CONFIG.WATCH_FOLDER);
      // Camera is connected
    } catch (error) {
      // Camera disconnected
      this.notificationIntegration.triggerEvent('camera_disconnected', {
        cameraModel: 'Nikon D7100',
        status: 'disconnected',
        message: 'Camera folder not accessible',
        lastSeen: new Date().toISOString()
      });
    }
  }

  // Get statistics
  getStats() {
    return {
      processedFiles: this.processedFiles.size,
      isProcessing: this.isProcessing,
      watchFolder: CONFIG.WATCH_FOLDER,
      eventId: CONFIG.EVENT_ID,
      uploadStats: this.uploadStats
    };
  }
}

// Start service
const uploader = new DSLRAutoUploader();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down DSLR Auto Upload Service...');
  process.exit(0);
});

// Export untuk testing
module.exports = DSLRAutoUploader;