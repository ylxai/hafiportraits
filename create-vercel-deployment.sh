#!/bin/bash

echo ""
echo "========================================"
echo "  ☁️ VERCEL DEPLOYMENT PREPARATION"
echo "  Preparing files for Vercel deployment"
echo "========================================"
echo ""

echo "🔍 Creating Vercel deployment structure..."

# Create Vercel deployment folder
mkdir -p "Vercel-Deployment"

echo "📋 Copying web application files..."

# Copy Next.js application files
cp -r "src/app" "Vercel-Deployment/src/" 2>/dev/null || echo "⚠️ src/app not found"
cp -r "src/components" "Vercel-Deployment/src/" 2>/dev/null || echo "⚠️ src/components not found"
cp -r "src/hooks" "Vercel-Deployment/src/" 2>/dev/null || echo "⚠️ src/hooks not found"
cp -r "src/types" "Vercel-Deployment/src/" 2>/dev/null || echo "⚠️ src/types not found"
cp -r "src/utils" "Vercel-Deployment/src/" 2>/dev/null || echo "⚠️ src/utils not found"
cp -r "src/styles" "Vercel-Deployment/src/" 2>/dev/null || echo "⚠️ src/styles not found"
cp -r "public" "Vercel-Deployment/" 2>/dev/null || echo "⚠️ public folder not found"

# Copy web-specific lib files (exclude DSLR-specific ones)
mkdir -p "Vercel-Deployment/src/lib"
cp "src/lib/supabase.ts" "Vercel-Deployment/src/lib/" 2>/dev/null || echo "⚠️ supabase.ts not found"
cp "src/lib/database.ts" "Vercel-Deployment/src/lib/" 2>/dev/null || echo "⚠️ database.ts not found"
cp "src/lib/auth.ts" "Vercel-Deployment/src/lib/" 2>/dev/null || echo "⚠️ auth.ts not found"
cp "src/lib/utils.ts" "Vercel-Deployment/src/lib/" 2>/dev/null || echo "⚠️ utils.ts not found"
cp "src/lib/cors.ts" "Vercel-Deployment/src/lib/" 2>/dev/null || echo "⚠️ cors.ts not found"
cp "src/lib/queryClient.ts" "Vercel-Deployment/src/lib/" 2>/dev/null || echo "⚠️ queryClient.ts not found"

# Copy configuration files
cp "next.config.js" "Vercel-Deployment/" 2>/dev/null || echo "⚠️ next.config.js not found"
cp "tailwind.config.js" "Vercel-Deployment/" 2>/dev/null || echo "⚠️ tailwind.config.js not found"
cp "tsconfig.json" "Vercel-Deployment/" 2>/dev/null || echo "⚠️ tsconfig.json not found"
cp "postcss.config.js" "Vercel-Deployment/" 2>/dev/null || echo "⚠️ postcss.config.js not found"
cp "components.json" "Vercel-Deployment/" 2>/dev/null || echo "⚠️ components.json not found"

# Create Vercel-specific package.json (web dependencies only)
cat > "Vercel-Deployment/package.json" << 'EOF'
{
  "name": "hafiportrait-web-dashboard",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-context-menu": "^2.1.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-toggle": "^1.0.3",
    "@radix-ui/react-toggle-group": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@radix-ui/react-visually-hidden": "^1.0.3",
    "@supabase/supabase-js": "^2.39.3",
    "@tanstack/react-query": "^5.17.10",
    "bcryptjs": "^3.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "cmdk": "^0.2.1",
    "date-fns": "^3.2.0",
    "embla-carousel-react": "^8.0.0",
    "framer-motion": "^12.23.12",
    "input-otp": "^1.2.4",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.323.0",
    "next": "14.1.0",
    "next-themes": "^0.2.1",
    "qrcode": "^1.5.3",
    "react": "^18",
    "react-day-picker": "^8.10.0",
    "react-dom": "^18",
    "react-resizable-panels": "^1.0.9",
    "recharts": "^2.15.4",
    "sonner": "^1.4.0",
    "tailwind-merge": "^2.2.1",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.0",
    "yet-another-react-lightbox": "^3.25.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.21",
    "eslint": "^8",
    "eslint-config-next": "14.1.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
EOF

# Create Vercel configuration
cat > "Vercel-Deployment/vercel.json" << 'EOF'
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key",
    "JWT_SECRET": "@jwt-secret",
    "NEXT_PUBLIC_APP_URL": "https://hafiportrait.photography"
  }
}
EOF

# Create environment template for Vercel
cat > "Vercel-Deployment/.env.example" << 'EOF'
# Vercel Environment Variables
# Set these in Vercel Dashboard: https://vercel.com/dashboard

# Database
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Authentication
JWT_SECRET=your-jwt-secret

# Application
NEXT_PUBLIC_APP_URL=https://hafiportrait.photography
EOF

# Create deployment README
cat > "Vercel-Deployment/README.md" << 'EOF'
# 🌐 HafiPortrait Web Dashboard - Vercel Deployment

## 🚀 Quick Deploy to Vercel:

### 1. **Connect Repository:**
```bash
# Push to GitHub first
git add .
git commit -m "Prepare Vercel deployment"
git push origin main
```

### 2. **Deploy to Vercel:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Framework: **Next.js** (auto-detected)
5. Click "Deploy"

### 3. **Set Environment Variables:**
In Vercel Dashboard → Project → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL = your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-supabase-service-role-key
JWT_SECRET = your-jwt-secret
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
```

### 4. **Custom Domain (Optional):**
1. Vercel Dashboard → Project → Settings → Domains
2. Add: `hafiportrait.photography`
3. Configure DNS records as instructed

## 📊 **What's Included:**
- ✅ Next.js web application
- ✅ Admin dashboard
- ✅ API endpoints
- ✅ Real-time photo gallery
- ✅ Event management
- ✅ QR code generation
- ✅ Mobile-optimized UI

## 🔗 **Integration:**
- **Database**: Supabase (shared with local DSLR service)
- **Storage**: Cloudflare R2 + Google Drive (managed by local service)
- **Real-time**: WebSocket updates from local uploads

## 🎯 **Access:**
- **Public Gallery**: `https://your-domain.vercel.app/event/[event-id]`
- **Admin Dashboard**: `https://your-domain.vercel.app/admin`
- **API**: `https://your-domain.vercel.app/api/*`
EOF

echo "✅ Vercel deployment structure created"
echo ""
echo "📝 Creating deployment instructions..."

cat > "VERCEL_DEPLOYMENT_INSTRUCTIONS.md" << 'EOF'
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
EOF

echo "✅ Deployment instructions created"
echo ""
echo "========================================"
echo "  🎉 VERCEL DEPLOYMENT READY!"
echo "========================================"
echo ""
echo "📁 Vercel files prepared in: Vercel-Deployment/"
echo ""
echo "🚀 Next steps:"
echo "  1. Review files in Vercel-Deployment/"
echo "  2. Follow VERCEL_DEPLOYMENT_INSTRUCTIONS.md"
echo "  3. Deploy to Vercel"
echo "  4. Set environment variables"
echo "  5. Test web dashboard"
echo ""
echo "🔄 Integration:"
echo "  Local: DSLR auto-upload service"
echo "  Vercel: Web dashboard & API"
echo "  Database: Supabase (shared)"
echo ""
echo "✅ Perfect separation achieved!"
echo ""