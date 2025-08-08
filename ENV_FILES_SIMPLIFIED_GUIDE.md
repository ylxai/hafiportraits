# 🔧 Environment Files - Simplified Guide

## 🚨 **HANYA 2 FILE .ENV YANG ANDA BUTUHKAN!**

### **💻 1. LOCAL (.env.local) - Untuk DSLR Computer**
### **☁️ 2. VERCEL (Environment Variables) - Untuk Web Dashboard**

---

## 💻 **LOCAL: .env.local (DSLR Computer)**

### **📄 File: `.env.local` (di root folder DSLR)**
```bash
# ===================================
# DATABASE (Shared dengan Vercel)
# ===================================
NEXT_PUBLIC_SUPABASE_URL="https://azspktldiblhrwebzmwq.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQwNDQsImV4cCI6MjA2OTUyMDA0NH0.uKHB4K9hxUDTc0ZkwidCJv_Ev-oa99AflFvrFt_8MG8"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk0NDA0NCwiZXhwIjoyMDY5NTIwMDQ0fQ.hk8vOgFoW3PJZxhw40sHiNyvNxbD4_c4x6fqBynvlmE"

# ===================================
# CLOUDFLARE R2 STORAGE (10GB FREE)
# ===================================
CLOUDFLARE_R2_ACCOUNT_ID="b14090010faed475102a62eca152b67f"
CLOUDFLARE_R2_ACCESS_KEY_ID="51c66dbac26827b84132186428eb3492"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="65fe114360a7e8b1b4b5c8e9f2a3d6c7e8f9a0b1c2d3e4f5"
CLOUDFLARE_R2_BUCKET_NAME="hafiportrait-photos"

# ===================================
# GOOGLE DRIVE STORAGE (2TB+)
# ===================================
GOOGLE_DRIVE_CLIENT_ID="your-client-id.googleusercontent.com"
GOOGLE_DRIVE_CLIENT_SECRET="your-client-secret"

# ===================================
# DSLR CONFIGURATION
# ===================================
DSLR_CAMERA_MODEL="NIKON_D7100"
DSLR_WATCH_FOLDER="C:/DCIM/100NIKON"
DSLR_STORAGE_STRATEGY="cloudflare-google"

# ===================================
# API CONFIGURATION
# ===================================
DSLR_API_BASE_URL="https://hafiportrait.photography"
JWT_SECRET="hafiportrait-super-secret-key-change-in-production"
```

---

## ☁️ **VERCEL: Environment Variables (Web Dashboard)**

### **⚙️ Set di Vercel Dashboard → Project → Settings → Environment Variables:**

```bash
# ===================================
# DATABASE (Same as Local)
# ===================================
NEXT_PUBLIC_SUPABASE_URL = https://azspktldiblhrwebzmwq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQwNDQsImV4cCI6MjA2OTUyMDA0NH0.uKHB4K9hxUDTc0ZkwidCJv_Ev-oa99AflFvrFt_8MG8
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk0NDA0NCwiZXhwIjoyMDY5NTIwMDQ0fQ.hk8vOgFoW3PJZxhw40sHiNyvNxbD4_c4x6fqBynvlmE

# ===================================
# WEB APPLICATION
# ===================================
JWT_SECRET = hafiportrait-super-secret-key-change-in-production
NEXT_PUBLIC_APP_URL = https://hafiportrait.photography
```

---

## 🗑️ **FILE .ENV YANG BISA DIABAIKAN:**

### **❌ File-file ini TIDAK DIPERLUKAN:**
```
❌ .env                           # Template saja
❌ .env.example                   # Template saja
❌ .env.production               # Template saja
❌ .env.test                     # Template saja
❌ .env.cloudflare               # Template saja
❌ .env.dslr                     # Template saja
❌ .env.storage.example          # Template saja
❌ .env.cloudflare-google.example # Template saja
```

**Semua file .env.* lainnya adalah template/example saja!**

---

## 📋 **COMPARISON TABLE:**

| Variable | Local (.env.local) | Vercel (Dashboard) | Purpose |
|----------|-------------------|-------------------|---------|
| **Database** | ✅ Required | ✅ Required | Shared database |
| **Cloudflare R2** | ✅ Required | ❌ Not needed | DSLR uploads only |
| **Google Drive** | ✅ Required | ❌ Not needed | DSLR uploads only |
| **DSLR Config** | ✅ Required | ❌ Not needed | Camera settings |
| **JWT Secret** | ✅ Required | ✅ Required | Authentication |
| **App URL** | ✅ Required | ✅ Required | API endpoints |

---

## 🔄 **WHY THIS SEPARATION?**

### **💻 LOCAL needs:**
- **Database access**: To store photo metadata
- **Storage credentials**: To upload photos to cloud
- **DSLR settings**: Camera monitoring configuration

### **☁️ VERCEL needs:**
- **Database access**: To display photos in web dashboard
- **Authentication**: For admin login
- **App URL**: For API endpoints

### **🔒 SECURITY:**
- Storage credentials stay on local computer only
- Web dashboard doesn't need storage access
- Perfect security separation!

---

## 🚀 **SETUP INSTRUCTIONS:**

### **💻 LOCAL SETUP:**
```bash
# 1. Create .env.local in your DSLR computer
cp .env.cloudflare-google.example .env.local

# 2. Fill in your actual credentials
nano .env.local

# 3. Test
node storage-optimization-cli.js test
```

### **☁️ VERCEL SETUP:**
```bash
# 1. Go to Vercel Dashboard
# 2. Project → Settings → Environment Variables
# 3. Add the 4 variables listed above
# 4. Deploy
```

---

## ✅ **VERIFICATION:**

### **💻 Test Local:**
```bash
# Should show all systems working
node storage-optimization-cli.js test
```

### **☁️ Test Vercel:**
```bash
# Should show web dashboard
curl https://your-domain.vercel.app/api/test/db
```

---

## 🎯 **SUMMARY:**

**HANYA 2 TEMPAT ENVIRONMENT VARIABLES:**

1. **💻 Local**: File `.env.local` (lengkap dengan storage credentials)
2. **☁️ Vercel**: Dashboard environment variables (minimal, hanya database & auth)

**Semua file .env lainnya adalah template yang bisa diabaikan!**

**Simple, secure, and effective!** 🚀