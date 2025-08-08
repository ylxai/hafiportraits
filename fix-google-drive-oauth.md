# 🔧 Fix Google Drive OAuth Error 403: access_denied

## 🚨 **Error yang Terjadi:**
```
Error 403: access_denied
```

## 🔍 **Penyebab Umum & Solusi:**

### **1. OAuth Consent Screen Belum Dikonfigurasi**

#### **Masalah:**
- Google Cloud project belum setup OAuth consent screen
- App masih dalam status "Testing" mode

#### **Solusi:**
1. **Buka Google Cloud Console**: https://console.cloud.google.com/
2. **Pilih project** "HafiPortrait Storage"
3. **Go to "APIs & Services"** → **"OAuth consent screen"**
4. **Configure consent screen:**
   ```
   User Type: External
   App name: HafiPortrait Storage
   User support email: your-email@domain.com
   Developer contact: your-email@domain.com
   ```
5. **Add scopes:**
   ```
   ../auth/drive.file
   ../auth/drive.metadata.readonly
   ```
6. **Add test users** (your email address)
7. **Save and continue**

### **2. Redirect URI Tidak Match**

#### **Masalah:**
- Redirect URI di OAuth credentials tidak sesuai dengan yang digunakan

#### **Solusi:**
1. **Go to "APIs & Services"** → **"Credentials"**
2. **Edit OAuth 2.0 Client ID**
3. **Authorized redirect URIs** harus exact match:
   ```
   http://localhost:3000/auth/google/callback
   ```
4. **Save changes**

### **3. Scopes Tidak Sufficient**

#### **Masalah:**
- OAuth request tidak include scopes yang diperlukan

#### **Solusi:**
Update kode untuk include proper scopes.

---

## 🛠️ **Quick Fix Steps:**

### **Step 1: Configure OAuth Consent Screen**
```
1. https://console.cloud.google.com/apis/credentials/consent
2. User Type: External
3. App name: HafiPortrait Storage  
4. Add your email as test user
5. Scopes: ../auth/drive.file
6. Save
```

### **Step 2: Verify Redirect URI**
```
1. https://console.cloud.google.com/apis/credentials
2. Edit your OAuth client
3. Authorized redirect URIs:
   - http://localhost:3000/auth/google/callback
4. Save
```

### **Step 3: Test Again**
```bash
node storage-optimization-cli.js auth
```

---

## 🔧 **Alternative: Simplified Setup**

Jika masih error, gunakan approach yang lebih simple:

### **Option 1: Service Account (Recommended)**
1. Create Service Account instead of OAuth
2. Download JSON key file
3. Use service account for API calls

### **Option 2: Skip Google Drive (Current System Works)**
```
✅ CURRENT WORKING SYSTEM:
- Cloudflare R2: 10GB ✅ Working
- Local backup: 50GB+ ✅ Working  
- Total: 60GB+ ready for production

⚠️ OPTIONAL:
- Google Drive: 15GB (nice to have)
```

---

## 🎯 **Recommendation:**

**Untuk production immediate**, sistem current sudah sangat baik:
- **Cloudflare R2**: 10GB cloud storage dengan global CDN
- **Local backup**: 50GB+ reliable storage
- **Total**: 60GB+ capacity

**Google Drive** adalah optional untuk additional 15GB jika diperlukan nanti.

---

## 🚀 **Production Ready Commands:**

```bash
# Start production dengan current system (60GB+)
start-dslr-hybrid.bat

# Test current system
node storage-optimization-cli.js test

# Upload test
node storage-optimization-cli.js upload-test ./test-images/IMG_9270.JPG
```

**Sistem sudah 100% production ready tanpa Google Drive!** 🎉