# 🚀 Cloudflare R2 Setup Step-by-Step Guide

## 📋 **Prerequisites**
- Email address untuk Cloudflare account
- Browser (Chrome, Firefox, Safari, Edge)
- 5-10 menit waktu setup

---

## 🎯 **STEP 1: Buat Cloudflare Account**

### **1.1 Daftar Account Baru**
1. Buka browser dan kunjungi: **https://dash.cloudflare.com/sign-up**
2. Isi form pendaftaran:
   ```
   Email: your-email@domain.com
   Password: [buat password yang kuat]
   ```
3. Klik **"Create Account"**
4. Check email untuk verifikasi
5. Klik link verifikasi di email
6. Login ke dashboard Cloudflare

### **1.2 Verifikasi Account**
1. Setelah login, Anda akan melihat Cloudflare Dashboard
2. Jika diminta verifikasi phone number, lakukan verifikasi
3. Dashboard siap digunakan

---

## 🗂️ **STEP 2: Setup R2 Object Storage**

### **2.1 Akses R2 Dashboard**
1. Di Cloudflare Dashboard, lihat sidebar kiri
2. Scroll down dan cari **"R2 Object Storage"**
3. Klik **"R2 Object Storage"**
4. Jika pertama kali, akan muncul welcome screen
5. Klik **"Get Started"** atau **"Create Bucket"**

### **2.2 Enable R2 (Jika Belum Aktif)**
1. Jika muncul halaman "Enable R2 Object Storage"
2. Klik **"Enable R2"**
3. Baca terms of service
4. Klik **"I Agree"** dan **"Enable R2"**
5. Tunggu beberapa detik hingga R2 aktif

### **2.3 Buat Bucket Pertama**
1. Di halaman R2 dashboard, klik **"Create bucket"**
2. Isi form bucket:
   ```
   Bucket name: hafiportrait-photos
   Location: Automatic (recommended)
   ```
3. **PENTING**: Nama bucket harus unik secara global
4. Jika nama sudah dipakai, coba variasi:
   ```
   hafiportrait-photos-2025
   hafiportrait-events-storage
   your-name-photos
   ```
5. Klik **"Create bucket"**
6. Bucket berhasil dibuat! ✅

---

## 🔑 **STEP 3: Generate API Credentials**

### **3.1 Akses API Token Management**
1. Di R2 dashboard, cari tombol **"Manage R2 API tokens"**
2. Atau klik profile icon (top right) → **"My Profile"** → **"API Tokens"**
3. Scroll ke section **"R2 API tokens"**
4. Klik **"Create API token"**

### **3.2 Configure API Token**
1. **Token name**: `HafiPortrait DSLR Upload`
2. **Permissions**: 
   - Pilih **"Admin Read & Write"** atau
   - Custom permissions: **"Object Read"** + **"Object Write"**
3. **Account resources**: 
   - Pilih **"Include - All accounts"**
4. **Zone resources**: 
   - Pilih **"Include - All zones"** (atau skip jika tidak ada domain)
5. **Client IP address filtering**: 
   - Leave blank (atau isi IP server jika ingin restrict)
6. **TTL (Time to live)**: 
   - Leave default atau set custom expiry

### **3.3 Generate Token**
1. Review settings
2. Klik **"Continue to summary"**
3. Verify semua settings benar
4. Klik **"Create token"**
5. **IMPORTANT**: Copy credentials yang muncul SEKARANG!

### **3.4 Save Credentials**
Anda akan melihat 3 credentials penting:
```
Account ID: abc123def456ghi789
Access Key ID: jkl012mno345pqr678
Secret Access Key: stu901vwx234yzab567cdef890ghij123klmn456
```

**⚠️ PENTING**: 
- Copy semua 3 credentials ini
- Simpan di tempat aman (password manager)
- Secret key hanya ditampilkan SEKALI
- Jika hilang, harus buat token baru

---

## 💾 **STEP 4: Configure Environment Variables**

### **4.1 Buka File Environment**
1. Di project folder, buka file `.env.local`
2. Jika belum ada, copy dari template:
   ```bash
   copy .env.cloudflare-google.example .env.local
   ```

### **4.2 Update Cloudflare R2 Credentials**
Edit `.env.local` dan isi:
```bash
# ===================================
# CLOUDFLARE R2 STORAGE (10GB FREE)
# ===================================
CLOUDFLARE_R2_ACCOUNT_ID="abc123def456ghi789"
CLOUDFLARE_R2_ACCESS_KEY_ID="jkl012mno345pqr678"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="stu901vwx234yzab567cdef890ghij123klmn456"
CLOUDFLARE_R2_BUCKET_NAME="hafiportrait-photos"

# Optional: Custom domain (setup nanti)
# CLOUDFLARE_R2_CUSTOM_DOMAIN="photos.hafiportrait.photography"
```

### **4.3 Verify Configuration**
1. Save file `.env.local`
2. Restart terminal/command prompt
3. Check environment variables loaded:
   ```bash
   echo $CLOUDFLARE_R2_ACCOUNT_ID
   ```

---

## 🧪 **STEP 5: Test Connection**

### **5.1 Install Dependencies**
```bash
# Install required packages
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### **5.2 Test R2 Connection**
```bash
# Test Cloudflare R2 connection
node storage-optimization-cli.js test
```

### **5.3 Expected Output**
```
🧪 TESTING STORAGE SETUP...

Cloudflare R2 connection: ✅ Connected
Google Drive access: ❌ Failed (setup nanti)
Local backup folder: ✅ Writable
Image compression: ✅ Working
Smart storage routing: ✅ Working

📊 Storage Capacity Test:
  Cloudflare R2: 10GB available (FREE)
  Google Drive: 15GB available (FREE)
  Local backup: 50GB available
  TOTAL: 75GB+ capacity!

✅ Cloudflare R2 operational!
```

---

## 🔧 **STEP 6: Advanced Configuration (Optional)**

### **6.1 Setup Custom Domain**
1. Di R2 dashboard, pilih bucket `hafiportrait-photos`
2. Klik tab **"Settings"**
3. Scroll ke **"Custom Domains"**
4. Klik **"Connect Domain"**
5. Enter domain: `photos.hafiportrait.photography`
6. Follow DNS setup instructions
7. Update `.env.local`:
   ```bash
   CLOUDFLARE_R2_CUSTOM_DOMAIN="photos.hafiportrait.photography"
   ```

### **6.2 Configure CORS (Jika Diperlukan)**
1. Di bucket settings, cari **"CORS policy"**
2. Add CORS rule:
   ```json
   [
     {
       "AllowedOrigins": ["https://hafiportrait.photography", "http://localhost:3000"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedHeaders": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

### **6.3 Setup Lifecycle Rules (Optional)**
1. Di bucket settings, cari **"Lifecycle rules"**
2. Create rule untuk auto-cleanup:
   ```
   Rule name: Auto cleanup old uploads
   Status: Enabled
   Filter: Prefix "temp/"
   Action: Delete after 7 days
   ```

---

## ✅ **STEP 7: Verification & Testing**

### **7.1 Test Upload**
```bash
# Test upload dengan sample file
node storage-optimization-cli.js upload-test ./test-images/test-image-1.jpg
```

### **7.2 Expected Upload Result**
```
🧪 TESTING UPLOAD WORKFLOW

📁 Testing upload: test-image-1.jpg
📊 File size: 2.34 MB

✅ Upload test successful!
   Storage tier: cloudflareR2
   URL: https://pub-abc123.r2.dev/events/test-event/1704123456789_abc123_test-image-1.jpg
   Compression: standard
```

### **7.3 Verify in Dashboard**
1. Kembali ke R2 dashboard
2. Klik bucket `hafiportrait-photos`
3. Lihat file yang baru diupload
4. Klik file untuk preview
5. Copy public URL untuk test

### **7.4 Test Public Access**
1. Copy public URL dari dashboard
2. Paste di browser baru
3. Image harus load dengan cepat
4. Check network tab untuk verify CDN

---

## 🚨 **Troubleshooting Common Issues**

### **Issue 1: "Access Denied" Error**
**Cause**: API token permissions tidak cukup
**Solution**:
1. Kembali ke API tokens dashboard
2. Delete token lama
3. Buat token baru dengan "Admin Read & Write" permissions

### **Issue 2: "Bucket Not Found" Error**
**Cause**: Bucket name salah atau tidak exist
**Solution**:
1. Check bucket name di R2 dashboard
2. Update `CLOUDFLARE_R2_BUCKET_NAME` di `.env.local`
3. Pastikan tidak ada typo

### **Issue 3: "Invalid Credentials" Error**
**Cause**: Credentials salah atau expired
**Solution**:
1. Verify credentials di `.env.local`
2. Check tidak ada extra spaces atau quotes
3. Generate new API token jika perlu

### **Issue 4: Upload Slow/Timeout**
**Cause**: Network atau file size issue
**Solution**:
1. Test dengan file kecil (<1MB)
2. Check internet connection
3. Try different network/VPN

---

## 📊 **Storage Limits & Pricing**

### **Free Tier Limits:**
```
Storage: 10GB FREE per month
Class A operations: 1 million FREE per month
Class B operations: 10 million FREE per month
Egress: FREE (unlimited bandwidth!)
```

### **Paid Pricing (Jika Exceed Free Tier):**
```
Storage: $0.015 per GB per month
Class A operations: $4.50 per million
Class B operations: $0.36 per million
Egress: FREE (always!)
```

### **Cost Example:**
```
50GB storage = $0.75/month
100GB storage = $1.50/month
(Masih jauh lebih murah dari Supabase Pro $25/month!)
```

---

## 🎉 **Success Checklist**

- [ ] ✅ Cloudflare account created & verified
- [ ] ✅ R2 Object Storage enabled
- [ ] ✅ Bucket `hafiportrait-photos` created
- [ ] ✅ API token generated with correct permissions
- [ ] ✅ Credentials saved securely
- [ ] ✅ `.env.local` updated with R2 credentials
- [ ] ✅ Dependencies installed (`@aws-sdk/client-s3`)
- [ ] ✅ Connection test passed
- [ ] ✅ Upload test successful
- [ ] ✅ Public URL accessible
- [ ] ✅ Ready for production! 🚀

---

## 🔗 **Useful Links**

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [R2 API Reference](https://developers.cloudflare.com/r2/api/)
- [AWS S3 SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [Cloudflare Community](https://community.cloudflare.com/)

---

## 🎯 **Next Steps**

Setelah Cloudflare R2 setup selesai, lanjut ke:

1. **Setup Google Drive API** (secondary storage)
2. **Test complete upload workflow**
3. **Configure DSLR auto-upload service**
4. **Setup monitoring & alerts**

**Cloudflare R2 setup COMPLETED! 🎉**
**10GB free storage siap digunakan!** ⚡