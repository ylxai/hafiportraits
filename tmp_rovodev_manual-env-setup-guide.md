# 🔧 MANUAL ENVIRONMENT VARIABLES SETUP - STEP BY STEP

## 📋 **PREPARATION CHECKLIST**
- ✅ Vercel CLI installed (v44.7.3)
- ✅ Environment variables ready
- ✅ Supabase credentials available

## 🚀 **STEP-BY-STEP SETUP PROCESS**

### **STEP 1: Login to Vercel**
```bash
vercel login
```
**Expected:** Browser will open for authentication

---

### **STEP 2: Core Application Variables (REQUIRED)**

#### **2.1 Supabase URL**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
```
**When prompted, paste:**
```
https://azspktldiblhrwebzmwq.supabase.co
```

#### **2.2 Supabase Anonymous Key**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**When prompted, paste:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQwNDQsImV4cCI6MjA2OTUyMDA0NH0.uKHB4K9hxUDTc0ZkwidCJv_Ev-oa99AflFvrFt_8MG8
```

#### **2.3 Supabase Service Role Key**
```bash
vercel env add SUPABASE_SERVICE_ROLE_KEY
```
**When prompted, paste:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk0NDA0NCwiZXhwIjoyMDY5NTIwMDQ0fQ.hk8vOgFoW3PJZxhw40sHiNyvNxbD4_c4x6fqBynvlmE
```

#### **2.4 JWT Secret**
```bash
vercel env add JWT_SECRET
```
**When prompted, paste:**
```
hafiportrait-vercel-production-secret-key-2025
```

#### **2.5 Node Environment**
```bash
vercel env add NODE_ENV
```
**When prompted, paste:**
```
production
```

---

### **STEP 3: DSLR Service Variables (OPTIONAL)**

#### **3.1 Performance Profile**
```bash
vercel env add DSLR_PERFORMANCE_PROFILE
```
**When prompted, paste:**
```
PRODUCTION
```

#### **3.2 Notifications Enabled**
```bash
vercel env add DSLR_NOTIFICATIONS_ENABLED
```
**When prompted, paste:**
```
true
```

#### **3.3 Watermark Disabled**
```bash
vercel env add DSLR_WATERMARK_ENABLED
```
**When prompted, paste:**
```
false
```

#### **3.4 Authentication Enabled**
```bash
vercel env add DSLR_ENABLE_AUTH
```
**When prompted, paste:**
```
true
```

#### **3.5 Rate Limiting**
```bash
vercel env add DSLR_RATE_LIMIT_REQUESTS
```
**When prompted, paste:**
```
100
```

```bash
vercel env add DSLR_RATE_LIMIT_WINDOW_MS
```
**When prompted, paste:**
```
60000
```

---

### **STEP 4: Verify Environment Variables**
```bash
vercel env ls
```
**Expected:** List of all environment variables you just added

---

### **STEP 5: Deploy (After Setting Variables)**
```bash
vercel
```
**Expected:** Deployment process starts

---

### **STEP 6: Set URL Variables (After Deployment)**

After deployment, you'll get a Vercel URL like: `https://your-project-name.vercel.app`

#### **6.1 App URL**
```bash
vercel env add NEXT_PUBLIC_APP_URL
```
**When prompted, paste your actual Vercel URL:**
```
https://your-project-name.vercel.app
```

#### **6.2 DSLR API URL**
```bash
vercel env add DSLR_API_BASE_URL
```
**When prompted, paste your actual Vercel URL:**
```
https://your-project-name.vercel.app
```

---

### **STEP 7: Final Production Deployment**
```bash
vercel --prod
```
**Expected:** Production deployment with all environment variables

## ✅ **VERIFICATION CHECKLIST**

After completing all steps:
- [ ] All core variables set (5 variables)
- [ ] DSLR variables set (6 variables)
- [ ] URL variables set (2 variables)
- [ ] Deployment successful
- [ ] Environment variables verified with `vercel env ls`

## 🎯 **TOTAL VARIABLES TO SET: 13**

### **Core (5):**
1. NEXT_PUBLIC_SUPABASE_URL
2. NEXT_PUBLIC_SUPABASE_ANON_KEY
3. SUPABASE_SERVICE_ROLE_KEY
4. JWT_SECRET
5. NODE_ENV

### **DSLR (6):**
6. DSLR_PERFORMANCE_PROFILE
7. DSLR_NOTIFICATIONS_ENABLED
8. DSLR_WATERMARK_ENABLED
9. DSLR_ENABLE_AUTH
10. DSLR_RATE_LIMIT_REQUESTS
11. DSLR_RATE_LIMIT_WINDOW_MS

### **URLs (2 - After Deployment):**
12. NEXT_PUBLIC_APP_URL
13. DSLR_API_BASE_URL