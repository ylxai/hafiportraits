# ☁️ Cloudflare R2 + Google Drive Storage Solution

## 🎯 **Solusi Optimal: 25GB Gratis Tanpa Supabase Storage**

### **📊 Perbandingan Storage:**
```
❌ SEBELUM (Supabase Only):
- Kapasitas: 1GB
- Biaya: $25-250/bulan untuk upgrade
- Limitasi: 1 event saja

✅ SESUDAH (Cloudflare R2 + Google Drive):
- Kapasitas: 25GB (25x lebih besar!)
- Biaya: $0/bulan (100% gratis)
- Kapasitas: 25+ events wedding
```

## 🏗️ **Arsitektur Storage Baru**

```
📊 TIER STORAGE STRATEGY:

Tier 1: Cloudflare R2 (10GB)    → Primary storage untuk semua foto
Tier 2: Google Drive (15GB)     → Backup & overflow storage  
Tier 3: Local Backup (50GB+)    → RAW files & emergency backup

TOTAL: 75GB+ storage capacity!
```

## 🚀 **Setup Cloudflare R2 (10GB Gratis)**

### **Step 1: Buat Cloudflare Account**
1. Daftar di [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Verifikasi email dan login

### **Step 2: Setup R2 Object Storage**
1. Di dashboard, pilih **"R2 Object Storage"**
2. Klik **"Create bucket"**
3. Nama bucket: `hafiportrait-photos`
4. Region: **Automatic** (optimal performance)
5. Klik **"Create bucket"**

### **Step 3: Generate API Credentials**
1. Di R2 dashboard, klik **"Manage R2 API tokens"**
2. Klik **"Create API token"**
3. Token name: `HafiPortrait DSLR Upload`
4. Permissions: **R2:Edit**
5. Account resources: **Include - All accounts**
6. Zone resources: **Include - All zones**
7. Klik **"Continue to summary"** → **"Create token"**
8. **SIMPAN** credentials yang muncul:
   ```
   Account ID: abc123...
   Access Key ID: def456...
   Secret Access Key: ghi789...
   ```

### **Step 4: Update Environment Variables**
```bash
# Tambahkan ke .env.local
CLOUDFLARE_R2_ACCOUNT_ID="your-account-id"
CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key-id"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-access-key"
CLOUDFLARE_R2_BUCKET_NAME="hafiportrait-photos"
```

## 🚀 **Setup Google Drive API (15GB Gratis)**

### **Step 1: Google Cloud Console**
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru: **"HafiPortrait Storage"**
3. Select project yang baru dibuat

### **Step 2: Enable Google Drive API**
1. Di sidebar, pilih **"APIs & Services"** → **"Library"**
2. Search: **"Google Drive API"**
3. Klik **"Google Drive API"** → **"Enable"**

### **Step 3: Create OAuth Credentials**
1. Di sidebar, pilih **"APIs & Services"** → **"Credentials"**
2. Klik **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: **"HafiPortrait DSLR Upload"**
5. Authorized redirect URIs: 
   ```
   http://localhost:3000/auth/google/callback
   https://hafiportrait.photography/auth/google/callback
   ```
6. Klik **"Create"**
7. **SIMPAN** credentials:
   ```
   Client ID: 123-abc.googleusercontent.com
   Client Secret: def-456-ghi
   ```

### **Step 4: Create Root Folder (Optional)**
1. Buka [Google Drive](https://drive.google.com/)
2. Buat folder baru: **"HafiPortrait Events"**
3. Klik kanan folder → **"Share"** → **"Anyone with the link"**
4. Copy folder ID dari URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`

### **Step 5: Update Environment Variables**
```bash
# Tambahkan ke .env.local
GOOGLE_DRIVE_CLIENT_ID="your-client-id.googleusercontent.com"
GOOGLE_DRIVE_CLIENT_SECRET="your-client-secret"
GOOGLE_DRIVE_ROOT_FOLDER_ID="your-folder-id"
```

## ⚙️ **Installation & Configuration**

### **Quick Setup (5 menit):**
```bash
# 1. Run automated setup
setup-cloudflare-google-storage.bat

# 2. Update .env.local dengan credentials
# (Copy dari Cloudflare R2 dan Google Cloud Console)

# 3. Test connections
node storage-optimization-cli.js test

# 4. Authenticate Google Drive
node storage-optimization-cli.js auth

# 5. Start production system
start-dslr-hybrid.bat
```

### **Manual Installation:**
```bash
# Install dependencies
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner googleapis

# Configure storage strategy
node dslr-config-tool.js set STORAGE.STRATEGY "cloudflare-google"

# Test setup
node storage-optimization-cli.js test
```

## 📊 **Smart Upload Logic**

### **Automatic Tier Selection:**
```javascript
// Foto akan otomatis diarahkan ke storage yang optimal:

📸 Semua foto event        → Cloudflare R2 (Primary, fast CDN)
📸 Overflow/backup         → Google Drive (Secondary)
📸 RAW files              → Local backup (Original quality)
📸 Emergency fallback     → Local storage

// Compression otomatis:
🏆 Homepage/Featured: 95% quality, 4000px width
📷 Event photos:     85% quality, 2000px width  
🖼️ Thumbnails:       75% quality, 800px width
```

## 🔧 **Management Commands**

### **Storage Monitoring:**
```bash
# Check storage status across all tiers
node storage-optimization-cli.js status

# Expected output:
# CLOUDFLARE R2: 2.1GB / 10GB (21% used) 🟢 Good
# GOOGLE DRIVE:  1.5GB / 15GB (10% used) 🟢 Good  
# LOCAL BACKUP:  8.2GB / 50GB (16% used) 🟢 Good
```

### **Authentication & Testing:**
```bash
# Authenticate Google Drive (one-time setup)
node storage-optimization-cli.js auth

# Test all storage connections
node storage-optimization-cli.js test

# Test upload workflow
node storage-optimization-cli.js upload-test
```

### **Migration & Optimization:**
```bash
# Migrate existing events from Supabase storage
node storage-optimization-cli.js migrate-from-supabase

# Optimize storage distribution
node storage-optimization-cli.js optimize

# Cleanup old files
node storage-optimization-cli.js cleanup 30
```

## 📈 **Performance Benefits**

### **Speed & Reliability:**
```
✅ Cloudflare R2: Global CDN, ultra-fast loading
✅ Google Drive: 99.9% uptime guarantee
✅ Local backup: Instant access, zero latency
✅ Triple redundancy: Never lose photos
```

### **Cost Savings:**
```
BEFORE (Supabase Pro): $25-250/month
AFTER (R2 + Drive):    $0/month
ANNUAL SAVINGS:        $300-3000/year! 💰
```

### **Capacity Increase:**
```
BEFORE: 1GB (1 event max)
AFTER:  25GB (25+ events)
INCREASE: 2500% more storage! 🚀
```

## 🔮 **Scaling Options**

### **Jika Storage Penuh:**
1. **Cloudflare R2**: $0.015/GB/month (sangat murah)
2. **Google One**: $2/month untuk 100GB
3. **Add AWS S3**: Pay-per-use, minimal cost
4. **Custom CDN**: Cloudflare integration

### **Advanced Features:**
- **Custom Domain**: `photos.hafiportrait.photography`
- **CDN Optimization**: Global edge caching
- **Auto-archiving**: Move old events to cold storage
- **Geo-replication**: Multiple regions backup

## 🧪 **Testing & Verification**

### **Connection Tests:**
```bash
# Test Cloudflare R2 connection
node -e "
const R2 = require('./src/lib/cloudflare-r2-storage');
const r2 = new R2();
r2.testConnection();
"

# Test Google Drive connection  
node -e "
const GDrive = require('./src/lib/google-drive-storage');
const drive = new GDrive();
drive.testConnection();
"
```

### **Upload Test:**
```bash
# Test complete upload workflow
node storage-optimization-cli.js upload-test ./test-images/test-image-1.jpg

# Expected output:
# ✅ Uploaded to Cloudflare R2: events/test/test-image-1.jpg
# ✅ Backup to Google Drive: test-image-1.jpg
# ✅ Local backup saved: ./dslr-backup/test-image-1.jpg
```

## 🎯 **Production Workflow**

### **Event Setup (30 detik):**
```bash
# Create new event
node dslr-hybrid-cli.js quick "Wedding Sarah & John" 2025-01-15

# Start DSLR service
start-dslr-hybrid.bat

# Monitor uploads
node storage-optimization-cli.js status
```

### **During Event:**
```
📸 Photographer takes photos
⚡ Auto-upload to Cloudflare R2 (2-3 seconds)
💾 Auto-backup to Google Drive (background)
📱 Real-time notifications to clients
🌐 Photos instantly available via CDN
```

### **Post-Event:**
```bash
# Generate event report
node storage-optimization-cli.js report wedding-sarah-john-2025-01-15

# Cleanup and optimize
node storage-optimization-cli.js cleanup 30
node storage-optimization-cli.js optimize
```

## ✅ **Migration dari Supabase Storage**

### **Safe Migration Process:**
```bash
# 1. Backup current Supabase storage URLs
node storage-optimization-cli.js backup-supabase-urls

# 2. Download all photos from Supabase
node storage-optimization-cli.js download-from-supabase

# 3. Upload to new storage tiers
node storage-optimization-cli.js migrate-to-cloudflare-google

# 4. Update database references
node storage-optimization-cli.js update-database-urls

# 5. Verify migration success
node storage-optimization-cli.js verify-migration
```

## 🎉 **Expected Results**

### **Immediate Benefits:**
- ✅ **25x more storage** (1GB → 25GB)
- ✅ **$0 monthly cost** (vs $25-250/month)
- ✅ **Faster loading** (Cloudflare CDN)
- ✅ **Better reliability** (triple backup)
- ✅ **Global availability** (CDN edge locations)

### **Long-term Benefits:**
- 📈 **Scalable**: Easy to add more storage
- 🔒 **Secure**: Enterprise-grade security
- 🌍 **Global**: Worldwide CDN distribution
- 💰 **Cost-effective**: Pay only for what you use
- 🚀 **Future-proof**: Industry-standard solutions

---

## 🚀 **Quick Start Summary**

```bash
# 1. Setup (5 menit)
setup-cloudflare-google-storage.bat

# 2. Configure credentials (3 menit)
# Edit .env.local dengan Cloudflare R2 & Google Drive credentials

# 3. Authenticate (1 menit)
node storage-optimization-cli.js auth

# 4. Test (1 menit)
node storage-optimization-cli.js test

# 5. Start production (instant)
start-dslr-hybrid.bat
```

**Total setup: 10 menit untuk 25x more storage! 🚀**

**Ready untuk production dengan 25GB gratis storage!** 🎉