#!/bin/bash

echo ""
echo "========================================"
echo "  🔧 ENVIRONMENT FILES CREATOR"
echo "  Creating only the .env files you need"
echo "========================================"
echo ""

echo "🗑️ Cleaning up unnecessary .env files..."

# Remove all the template/example .env files to avoid confusion
rm -f .env.example .env.production .env.test .env.cloudflare .env.dslr .env.storage.example .env.cloudflare-google.example 2>/dev/null

echo "✅ Template files removed"
echo ""

echo "📝 Creating LOCAL .env.local file..."

# Create the ONLY .env file needed for local
cat > ".env.local" << 'EOF'
# ===================================
# LOCAL DSLR SYSTEM ENVIRONMENT
# ===================================

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
EOF

echo "✅ .env.local created"
echo ""

echo "📝 Creating Vercel environment template..."

# Create Vercel environment template
cat > "VERCEL_ENVIRONMENT_VARIABLES.md" << 'EOF'
# ☁️ VERCEL ENVIRONMENT VARIABLES

## 🚀 Set these in Vercel Dashboard:
**Go to: Vercel Dashboard → Your Project → Settings → Environment Variables**

### **Add these 4 variables:**

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://azspktldiblhrwebzmwq.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQwNDQsImV4cCI6MjA2OTUyMDA0NH0.uKHB4K9hxUDTc0ZkwidCJv_Ev-oa99AflFvrFt_8MG8

Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk0NDA0NCwiZXhwIjoyMDY5NTIwMDQ0fQ.hk8vOgFoW3PJZxhw40sHiNyvNxbD4_c4x6fqBynvlmE

Name: JWT_SECRET
Value: hafiportrait-super-secret-key-change-in-production
```

## ✅ That's it! Only 4 variables needed for Vercel.
EOF

echo "✅ Vercel environment template created"
echo ""

echo "📝 Creating environment setup guide..."

cat > "ENVIRONMENT_SETUP_GUIDE.md" << 'EOF'
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
EOF

echo "✅ Setup guide created"
echo ""

echo "🔍 Checking current .env files..."
echo ""
echo "📁 Environment files in current directory:"
ls -la .env* 2>/dev/null || echo "No .env files found"
echo ""

echo "========================================"
echo "  🎉 ENVIRONMENT FILES SIMPLIFIED!"
echo "========================================"
echo ""
echo "✅ Created files:"
echo "  📄 .env.local                    - LOCAL DSLR system"
echo "  📄 VERCEL_ENVIRONMENT_VARIABLES.md - Vercel setup guide"
echo "  📄 ENVIRONMENT_SETUP_GUIDE.md    - Complete guide"
echo ""
echo "🎯 ONLY 2 PLACES FOR ENV VARS:"
echo "  💻 Local: .env.local file"
echo "  ☁️ Vercel: Dashboard environment variables"
echo ""
echo "🚀 Next steps:"
echo "  1. Update Google Drive credentials in .env.local"
echo "  2. Test local: node storage-optimization-cli.js test"
echo "  3. Deploy to Vercel with environment variables"
echo ""
echo "✅ Environment setup simplified!"
echo ""