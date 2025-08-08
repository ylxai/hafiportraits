# 🔑 Google Drive API Scopes Guide

## 📋 **Scopes yang Diperlukan untuk Photo Storage:**

### **🎯 RECOMMENDED SCOPES (Minimal & Secure):**

```javascript
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly'
];
```

#### **1. `drive.file` (REQUIRED)**
- **Purpose**: Upload, read, update, delete files created by the app
- **Access**: Only files created by your application
- **Security**: ✅ Secure (tidak akses file user lain)
- **Use case**: Upload foto, create folders, manage uploaded photos

#### **2. `drive.metadata.readonly` (RECOMMENDED)**
- **Purpose**: Read metadata (file info, storage quota)
- **Access**: Read-only metadata
- **Security**: ✅ Very secure
- **Use case**: Check storage usage, get file info

---

## 🔧 **Alternative Scopes (Jika Diperlukan):**

### **📊 For Storage Management:**
```javascript
'https://www.googleapis.com/auth/drive.metadata'
```
- **Purpose**: Read/write metadata
- **Use case**: Update file descriptions, properties

### **📁 For Folder Management:**
```javascript
'https://www.googleapis.com/auth/drive.appdata'
```
- **Purpose**: Access app-specific folder
- **Use case**: Store config files, app data

---

## ⚠️ **Scopes to AVOID (Too Broad):**

### **❌ `drive` (Full Access)**
```javascript
'https://www.googleapis.com/auth/drive'
```
- **Risk**: Access to ALL user files
- **Security**: ❌ Too broad, users will be suspicious
- **Recommendation**: Don't use unless absolutely necessary

### **❌ `drive.readonly` (Read All Files)**
```javascript
'https://www.googleapis.com/auth/drive.readonly'
```
- **Risk**: Can read all user files
- **Security**: ❌ Privacy concerns
- **Recommendation**: Use `drive.metadata.readonly` instead

---

## 🛠️ **Implementation in Code:**

### **Update Google Drive Storage Class:**
```javascript
// src/lib/google-drive-storage.js

/**
 * Get authentication URL for initial setup
 */
getAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata.readonly'
  ];

  return this.auth.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
}
```

### **Update OAuth Consent Screen:**
```
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Edit OAuth consent screen
3. Add scopes:
   - ../auth/drive.file
   - ../auth/drive.metadata.readonly
4. Save changes
```

---

## 📊 **Scope Comparison Table:**

| Scope | Access Level | Security | Use Case | Recommended |
|-------|-------------|----------|----------|-------------|
| `drive.file` | App files only | ✅ High | Upload photos | ✅ Yes |
| `drive.metadata.readonly` | Metadata read | ✅ Very High | Storage info | ✅ Yes |
| `drive.metadata` | Metadata read/write | ✅ High | File properties | ⚠️ If needed |
| `drive.appdata` | App folder only | ✅ High | Config files | ⚠️ If needed |
| `drive.readonly` | All files read | ❌ Medium | Read all files | ❌ No |
| `drive` | Full access | ❌ Low | Everything | ❌ No |

---

## 🔧 **OAuth Consent Screen Setup:**

### **Step 1: Configure Scopes**
```
1. https://console.cloud.google.com/apis/credentials/consent
2. Edit OAuth consent screen
3. Scopes for Google APIs:
   - Add scope: ../auth/drive.file
   - Add scope: ../auth/drive.metadata.readonly
4. Save and continue
```

### **Step 2: Add Test Users**
```
Test users section:
- Add your email address
- Add any other emails that need access during testing
```

### **Step 3: App Information**
```
App name: HafiPortrait Storage
User support email: your-email@domain.com
Developer contact: your-email@domain.com
App domain: hafiportrait.photography (optional)
```

---

## 🧪 **Testing Scopes:**

### **Test Authentication:**
```bash
# Test with new scopes
node storage-optimization-cli.js auth
```

### **Expected Consent Screen:**
```
HafiPortrait Storage wants to:
✅ See, edit, create, and delete only the specific Google Drive files you use with this app
✅ See information about your Google Drive files
```

---

## 🎯 **Best Practices:**

### **✅ DO:**
- Use minimal scopes required
- Request `drive.file` for file operations
- Use `metadata.readonly` for storage info
- Explain to users why you need access

### **❌ DON'T:**
- Request full `drive` access
- Ask for more permissions than needed
- Use broad scopes for simple tasks
- Request scopes you don't actually use

---

## 🔧 **Quick Fix for Current Error:**

### **Update Scopes in Code:**
```javascript
// In src/lib/google-drive-storage.js
getAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata.readonly'
  ];

  return this.auth.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
}
```

### **Update OAuth Consent Screen:**
1. Add the two scopes above
2. Add your email as test user
3. Save changes
4. Test authentication again

---

## 🎉 **Expected Result:**

After fixing scopes, authentication should work and you'll get:
- ✅ Access to upload photos to Google Drive
- ✅ Ability to check storage usage
- ✅ 15GB additional storage for your system
- ✅ Total capacity: 75GB (Cloudflare R2 + Google Drive + Local)

**Minimal scopes = Better security = Higher user trust!** 🔒