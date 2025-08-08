# 🚀 Vercel Deployment Instructions

## 📁 **Files Ready for Vercel:**
All web application files are now in `Vercel-Deployment/` folder.

## 🔄 **Deployment Steps:**

### **1. Prepare Repository:**
```bash
# Copy Vercel files to main directory (or create separate repo)
cp -r Vercel-Deployment/* ./
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### **2. Deploy to Vercel:**
```bash
# Option A: Vercel CLI
npm i -g vercel
vercel --prod

# Option B: Vercel Dashboard
# 1. Go to vercel.com/dashboard
# 2. Import GitHub repository
# 3. Deploy automatically
```

### **3. Set Environment Variables:**
In Vercel Dashboard, add these environment variables:
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
JWT_SECRET = your-jwt-secret
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
```

## ✅ **Verification:**
After deployment, test these URLs:
- Homepage: `https://your-domain.vercel.app`
- Admin: `https://your-domain.vercel.app/admin`
- API: `https://your-domain.vercel.app/api/test/db`

## 🔄 **Local ↔ Vercel Integration:**
- Local DSLR service uploads photos to cloud storage
- Local service updates Supabase database
- Vercel dashboard shows real-time updates
- Perfect separation of concerns!
