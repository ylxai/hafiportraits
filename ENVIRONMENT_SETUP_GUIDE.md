# 🔧 Environment Setup Guide - SIMPLIFIED

## 🎯 **ONLY 2 PLACES FOR ENVIRONMENT VARIABLES:**

### **💻 1. LOCAL (.env.local)**
- **File**: `.env.local` (already created)
- **Purpose**: DSLR system configuration
- **Contains**: Database + Storage + DSLR settings

### **☁️ 2. VERCEL (Dashboard)**
- **Location**: Vercel Dashboard → Settings → Environment Variables
- **Purpose**: Web dashboard configuration  
- **Contains**: Database + Authentication only

---

## 🚀 **SETUP STEPS:**

### **💻 LOCAL SETUP:**
```bash
# 1. File .env.local already created ✅
# 2. Update Google Drive credentials if needed:
nano .env.local

# 3. Test system:
node storage-optimization-cli.js test
```

### **☁️ VERCEL SETUP:**
```bash
# 1. Deploy to Vercel
vercel --prod

# 2. Add environment variables in Vercel Dashboard
# (See VERCEL_ENVIRONMENT_VARIABLES.md)

# 3. Test web dashboard
curl https://your-domain.vercel.app/api/test/db
```

---

## ✅ **VERIFICATION:**

### **💻 Local Test:**
```bash
node storage-optimization-cli.js test
# Should show: 5/5 systems working
```

### **☁️ Vercel Test:**
```bash
# Visit: https://your-domain.vercel.app
# Should show: Web dashboard working
```

---

## 🎉 **RESULT:**
- **Local**: DSLR auto-upload with 2.1TB storage
- **Vercel**: Web dashboard for clients & admin
- **Integration**: Real-time sync via shared database

**Simple, secure, and effective!** 🚀
