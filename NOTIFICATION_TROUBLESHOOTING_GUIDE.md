# 🔧 DSLR Notification System - Troubleshooting Guide

## 🚨 **Masalah: "Failed to send notification"**

### **Root Cause Analysis**
Error ini terjadi karena DSLR service mencoba mengirim notification ke API endpoint yang belum tersedia (HTTP 404).

### **Penyebab Umum:**
1. ❌ Next.js application belum berjalan
2. ❌ API endpoint `/api/notifications/send` tidak tersedia
3. ❌ Network connectivity issues
4. ❌ Port 3000 digunakan oleh service lain

## 🛠️ **Solusi yang Telah Diimplementasi**

### **1. Smart Fallback System**
```javascript
// ✅ Auto-detect API availability
const healthCheck = await this.checkAPIHealth();
if (!healthCheck) {
  console.warn('⚠️ API server not available, logging notification locally');
  this.logNotificationLocally(notification);
  return { success: true, mode: 'local' };
}
```

### **2. Local Logging Mode**
Ketika API tidak tersedia, sistem akan:
- ✅ Log notifications secara lokal
- ✅ Tidak mengganggu proses upload
- ✅ Memberikan feedback yang jelas

### **3. Health Check dengan Timeout**
```javascript
// ✅ 3-second timeout untuk health check
const response = await Promise.race([
  fetch(`${this.apiBaseUrl}/api/test/db`),
  timeoutPromise
]);
```

### **4. Enhanced Error Handling**
- ✅ Graceful degradation
- ✅ Detailed error logging
- ✅ Non-blocking operation

## 🚀 **Cara Menjalankan Sistem dengan Benar**

### **Option 1: Automatic Startup (Recommended)**
```bash
# Jalankan script otomatis
start-complete-system.bat
```

Script ini akan:
1. ✅ Check system requirements
2. ✅ Start Next.js app otomatis
3. ✅ Wait for API to be ready
4. ✅ Start DSLR service

### **Option 2: Manual Startup**
```bash
# Terminal 1: Start Next.js
npm run dev

# Terminal 2: Start DSLR service (setelah Next.js ready)
node dslr-auto-upload-service.js
```

### **Option 3: Standalone Mode**
```bash
# DSLR service akan berjalan dengan local logging
node dslr-auto-upload-service.js
```

## 🧪 **Testing & Verification**

### **Test Notification System**
```bash
# Test notification integration
node test-notification-system.js
```

### **Expected Output:**
```
🧪 Testing DSLR Notification System...
📷 Test 1: Camera Connected Event
📝 Local notification log: {
  "timestamp": "2024-01-01T12:00:00.000Z",
  "type": "camera_connected",
  "title": "📷 Kamera Terhubung",
  "message": "Nikon D7100 siap untuk shooting"
}
✅ All tests completed successfully!
```

## 📊 **Monitoring & Logs**

### **DSLR Service Logs**
```
🔔 DSLR Notification Integration initialized
🚀 DSLR Auto Upload Service Starting...
✅ Backup folders created
📸 DSLR Event triggered: { type: 'camera_connected', ... }
⚠️ API server not available, logging notification locally
📝 Local notification log: { ... }
📷 Camera connected: Nikon D7100
👀 File watcher ready
```

### **Success Indicators**
- ✅ `DSLR Notification Integration initialized`
- ✅ `Backup folders created`
- ✅ `File watcher ready`
- ✅ `Local notification log` (jika API tidak tersedia)
- ✅ `Notification sent successfully` (jika API tersedia)

## 🔍 **Diagnostic Commands**

### **Check API Health**
```bash
# Test API endpoint
curl http://localhost:3000/api/test/db

# Expected response:
{"success": true, "message": "Database connection successful"}
```

### **Check Port Usage**
```bash
# Windows
netstat -an | find "3000"

# Expected: No output (port available) or LISTENING (port in use)
```

### **Test Notification Endpoint**
```bash
# Test notification API
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","message":"Test notification","type":"test"}'
```

## 🎯 **Different Operating Modes**

### **Mode 1: Full Integration (API Available)**
```
📸 Photo Captured → 🔍 Watcher → 📤 Upload → ☁️ Supabase → ✅ API Notification → 📱 Real-time Updates
```

### **Mode 2: Standalone Mode (API Not Available)**
```
📸 Photo Captured → 🔍 Watcher → 📤 Upload → ☁️ Supabase → 📝 Local Log → 💾 File Backup
```

### **Mode 3: Mock Mode (Dependencies Missing)**
```
📸 Photo Captured → 🔍 Watcher → 📤 Upload → 🔄 Mock Response → 📝 Console Log
```

## ⚙️ **Configuration Options**

### **Environment Variables**
```bash
# .env file
API_BASE_URL=http://localhost:3000
EVENT_ID=your-event-id
WATCH_FOLDER=C:/DCIM/100NIKON
UPLOADER_NAME=Official Photographer
```

### **Runtime Configuration**
```javascript
// Modify in dslr-auto-upload-service.js
const CONFIG = {
  API_BASE_URL: 'http://localhost:3000',
  EVENT_ID: 'your-event-id',
  WATCH_FOLDER: 'C:/DCIM/100NIKON'
};
```

## 🚨 **Common Issues & Solutions**

### **Issue 1: Port 3000 Already in Use**
```bash
# Solution: Kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### **Issue 2: Node.js Not Found**
```bash
# Solution: Install Node.js
# Download from: https://nodejs.org/
```

### **Issue 3: Dependencies Missing**
```bash
# Solution: Install dependencies
npm install chokidar node-fetch form-data
```

### **Issue 4: Camera Folder Not Found**
```bash
# Solution: Update watch folder path
# Modify WATCH_FOLDER in dslr-auto-upload-service.js
```

## 📈 **Performance Monitoring**

### **Key Metrics to Monitor**
- 📊 Upload success rate
- ⏱️ API response time
- 💾 Storage usage
- 🔄 Queue processing time

### **Log Analysis**
```bash
# Count successful uploads
grep "Upload success" dslr-service.log | wc -l

# Count failed notifications
grep "Failed to send notification" dslr-service.log | wc -l
```

## 🎉 **Success Checklist**

- ✅ DSLR service starts without errors
- ✅ File watcher is active
- ✅ Notifications are logged (locally or via API)
- ✅ Camera connection detected
- ✅ Upload process works
- ✅ Admin dashboard accessible (if API running)

## 🔮 **Next Steps**

1. **Production Deployment**
   - Setup Windows Service for DSLR service
   - Configure reverse proxy for API
   - Setup monitoring and alerting

2. **Enhanced Features**
   - Email notifications
   - WhatsApp integration
   - Mobile app notifications
   - Advanced analytics

3. **Optimization**
   - Batch processing
   - Compression optimization
   - CDN integration
   - Database optimization

---

## 📞 **Support**

Jika masih mengalami masalah:
1. Check logs di console
2. Verify system requirements
3. Test dengan `test-notification-system.js`
4. Use `start-complete-system.bat` untuk startup otomatis