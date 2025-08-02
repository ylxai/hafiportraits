# 📸 DSLR Auto Upload Setup Guide

## 🎯 Overview
Sistem auto upload foto dari Nikon D7100 ke Supabase untuk album "Official".

## 🔧 Setup Requirements

### 1. **Hardware Setup**
```
Nikon D7100 → USB Cable → Computer (Windows/Mac)
```

### 2. **Software Dependencies**
```bash
npm install chokidar form-data node-fetch
```

### 3. **Nikon D7100 Configuration**

#### **Option A: USB Tethering (Recommended)**
1. Install **Nikon Camera Control Pro 2**
2. Connect D7100 via USB
3. Set auto-save folder: `C:/DCIM/100NIKON`
4. Enable "Auto transfer after shooting"

#### **Option B: SD Card Auto-Import**
1. Use SD card reader
2. Setup Windows/Mac auto-import
3. Monitor import folder

### 4. **Camera Settings**
```
Menu → Setup → USB → PTP/IP
Menu → Shooting → Image Quality → JPEG Fine + RAW
Menu → Setup → Auto Image Transfer → ON
```

## 🚀 Installation

### 1. **Copy Service File**
```bash
cp dslr-auto-upload-service.js ./services/
```

### 2. **Configure Settings**
Edit `CONFIG` object in service file:
```javascript
const CONFIG = {
  WATCH_FOLDER: 'C:/DCIM/100NIKON', // Sesuaikan path
  EVENT_ID: 'your-active-event-id',  // Set event yang aktif
  API_BASE_URL: 'https://your-domain.com', // Production URL
  UPLOADER_NAME: 'Official Photographer'
};
```

### 3. **Start Service**
```bash
node dslr-auto-upload-service.js
```

## 📁 Folder Structure
```
Project/
├── dslr-backup/
│   ├── raw/          ← NEF files backup
│   ├── jpg/          ← JPG files backup
│   └── logs/         ← Upload logs
└── services/
    └── dslr-auto-upload-service.js
```

## 🔄 Workflow

### **Automatic Process:**
1. **📸 Photographer takes photo** → D7100 shutter
2. **💾 Camera saves files** → RAW + JPG to computer
3. **👀 Service detects** → New file in watch folder
4. **📂 Backup locally** → Copy to backup folders
5. **🚀 Upload JPG** → Send to Supabase with "Official" album
6. **✅ Notification** → Confirm upload success

### **Manual Controls:**
```javascript
// Set active event
uploader.setEventId('new-event-id');

// Pause/Resume
uploader.pause();
uploader.resume();

// Get statistics
console.log(uploader.getStats());
```

## 🎛️ Advanced Configuration

### **1. Multiple Camera Support**
```javascript
const cameras = [
  { name: 'Main', folder: 'C:/DCIM/100NIKON', photographer: 'John' },
  { name: 'Second', folder: 'C:/DCIM/101NIKON', photographer: 'Jane' }
];
```

### **2. Smart File Filtering**
```javascript
// Only upload during event hours
const isEventTime = () => {
  const hour = new Date().getHours();
  return hour >= 10 && hour <= 22; // 10 AM - 10 PM
};

// Skip test shots
const isValidPhoto = (fileName) => {
  return !fileName.includes('TEST') && !fileName.includes('_TMP');
};
```

### **3. Quality Control**
```javascript
// Check image quality before upload
const validateImage = async (filePath) => {
  const stats = await fs.stat(filePath);
  return stats.size > 1024 * 1024; // Min 1MB
};
```

## 🔧 Troubleshooting

### **Common Issues:**

#### **1. Camera Not Detected**
```bash
# Check USB connection
lsusb | grep Nikon  # Linux/Mac
# or Device Manager → Cameras  # Windows
```

#### **2. Folder Not Monitored**
```javascript
// Test folder access
const testAccess = async () => {
  try {
    await fs.access(CONFIG.WATCH_FOLDER);
    console.log('✅ Folder accessible');
  } catch (error) {
    console.log('❌ Folder not accessible:', error);
  }
};
```

#### **3. Upload Failures**
- Check internet connection
- Verify Supabase credentials
- Check event ID validity
- Monitor API rate limits

### **Debug Mode:**
```javascript
// Enable detailed logging
const DEBUG = true;

if (DEBUG) {
  console.log('🐛 Debug info:', {
    filePath,
    fileSize,
    eventId,
    timestamp: new Date().toISOString()
  });
}
```

## 📊 Monitoring & Analytics

### **1. Upload Statistics**
```javascript
const stats = {
  totalUploaded: 0,
  failedUploads: 0,
  averageUploadTime: 0,
  lastUpload: null
};
```

### **2. Performance Metrics**
- Upload speed: ~2-5 seconds per photo
- File size: 3-8MB (D7100 JPEG Fine)
- Success rate: >95% with stable connection

### **3. Notifications**
```javascript
// WhatsApp notification (optional)
const sendWhatsApp = (message) => {
  // Integrate dengan WhatsApp Business API
};

// Email notification
const sendEmail = (subject, body) => {
  // Integrate dengan SendGrid/Nodemailer
};
```

## 🚀 Production Deployment

### **1. As Windows Service**
```bash
npm install -g node-windows
node-windows-service-install.js
```

### **2. As systemd Service (Linux)**
```bash
sudo cp dslr-upload.service /etc/systemd/system/
sudo systemctl enable dslr-upload
sudo systemctl start dslr-upload
```

### **3. PM2 Process Manager**
```bash
npm install -g pm2
pm2 start dslr-auto-upload-service.js --name "dslr-uploader"
pm2 startup
pm2 save
```

## 💡 Pro Tips

### **1. Backup Strategy**
- Keep local backup for 7 days
- Auto-cleanup old files
- Sync RAW files to external storage

### **2. Performance Optimization**
- Use SSD for watch folder
- Optimize image compression
- Batch upload during low traffic

### **3. Workflow Integration**
- Auto-generate contact sheets
- Create low-res previews
- Tag photos with metadata

---

## 🎉 Ready to Go!

**Your DSLR is now connected to the cloud!** 

Every photo you take will automatically appear in the "Official" album, giving clients instant access to professional photos during their event.

**Benefits:**
- ⚡ **Instant sharing** - Photos appear within seconds
- 📱 **Mobile access** - Clients can view on phones immediately  
- 💾 **Auto backup** - Never lose a shot
- 🎯 **Professional workflow** - Seamless integration
- 📊 **Analytics** - Track engagement and downloads

**Perfect for:**
- Weddings
- Corporate events  
- Parties
- Photo sessions
- Live events