# 🔧 VERCEL ENVIRONMENT VARIABLES SETUP

## 📋 **ENVIRONMENT VARIABLES YANG DIPERLUKAN**

### **1. CORE APPLICATION VARIABLES:**
```bash
# Database & Supabase
NEXT_PUBLIC_SUPABASE_URL=https://azspktldiblhrwebzmwq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQwNDQsImV4cCI6MjA2OTUyMDA0NH0.uKHB4K9hxUDTc0ZkwidCJv_Ev-oa99AflFvrFt_8MG8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk0NDA0NCwiZXhwIjoyMDY5NTIwMDQ0fQ.hk8vOgFoW3PJZxhw40sHiNyvNxbD4_c4x6fqBynvlmE

# Authentication
JWT_SECRET=hafiportrait-vercel-production-secret-key-2025

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://hafiportrait.vercel.app
```

### **2. OPTIONAL DSLR VARIABLES:**
```bash
# DSLR Service Configuration
DSLR_API_BASE_URL=https://hafiportrait.vercel.app
DSLR_PERFORMANCE_PROFILE=PRODUCTION
DSLR_NOTIFICATIONS_ENABLED=true
DSLR_WATERMARK_ENABLED=false
DSLR_ENABLE_AUTH=true
DSLR_RATE_LIMIT_REQUESTS=100
DSLR_RATE_LIMIT_WINDOW_MS=60000
```

## 🚀 **CARA SETUP DI VERCEL**

### **Method 1: Via Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add JWT_SECRET
vercel env add NODE_ENV
vercel env add NEXT_PUBLIC_APP_URL

# Optional DSLR variables
vercel env add DSLR_API_BASE_URL
vercel env add DSLR_PERFORMANCE_PROFILE
vercel env add DSLR_NOTIFICATIONS_ENABLED
```

### **Method 2: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable manually

## 📝 **STEP-BY-STEP COMMANDS**

### **Step 1: Core Variables**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste: https://azspktldiblhrwebzmwq.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQwNDQsImV4cCI6MjA2OTUyMDA0NH0.uKHB4K9hxUDTc0ZkwidCJv_Ev-oa99AflFvrFt_8MG8

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk0NDA0NCwiZXhwIjoyMDY5NTIwMDQ0fQ.hk8vOgFoW3PJZxhw40sHiNyvNxbD4_c4x6fqBynvlmE

vercel env add JWT_SECRET
# Paste: hafiportrait-vercel-production-secret-key-2025

vercel env add NODE_ENV
# Paste: production
```

### **Step 2: Application URL (After First Deploy)**
```bash
vercel env add NEXT_PUBLIC_APP_URL
# Paste: https://your-project-name.vercel.app
# (You'll get this URL after first deployment)
```

### **Step 3: DSLR Service Variables (Optional)**
```bash
vercel env add DSLR_API_BASE_URL
# Paste: https://your-project-name.vercel.app

vercel env add DSLR_PERFORMANCE_PROFILE
# Paste: PRODUCTION

vercel env add DSLR_NOTIFICATIONS_ENABLED
# Paste: true
```

## 🔒 **SECURITY NOTES**

### **✅ SECURE VARIABLES:**
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side only
- `JWT_SECRET` - Server-side only

### **🌐 PUBLIC VARIABLES:**
- `NEXT_PUBLIC_SUPABASE_URL` - Client-side accessible
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Client-side accessible
- `NEXT_PUBLIC_APP_URL` - Client-side accessible

## 🎯 **DEPLOYMENT WORKFLOW**

### **Complete Deployment Process:**
```bash
# 1. Deploy first (gets project URL)
vercel

# 2. Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add JWT_SECRET
vercel env add NODE_ENV

# 3. Update APP_URL with actual Vercel URL
vercel env add NEXT_PUBLIC_APP_URL

# 4. Redeploy with environment variables
vercel --prod

# 5. Update DSLR service configuration
# Edit .env.dslr with new Vercel URL
```

## ✅ **VERIFICATION CHECKLIST**

After setting environment variables:
- [ ] All core variables set
- [ ] JWT_SECRET is unique and secure
- [ ] NEXT_PUBLIC_APP_URL matches Vercel URL
- [ ] DSLR_API_BASE_URL updated
- [ ] Test deployment successful
- [ ] API endpoints working
- [ ] Database connection verified