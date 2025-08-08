# 🚀 Deployment Separation Guide: Local vs Vercel

## 📋 **PEMBAGIAN FILE: LOCAL vs VERCEL**

### **💻 FILES YANG HARUS DI LOCAL (DSLR Computer):**

#### **🎯 CORE DSLR SYSTEM (Wajib Local):**
```
📁 Local Computer (DSLR System)/
├── 📄 dslr-auto-upload-service.js      # ⭐ CORE - Monitor kamera & upload
├── 📄 dslr-hybrid-cli.js               # ⭐ EVENT MANAGER - Kelola event
├── 📄 dslr-hybrid-event-manager.js     # Event management system
├── 📄 start-dslr-hybrid.bat            # Startup script
├── 📄 dslr.config.js                   # DSLR configuration
├── 📄 .env.local                       # Credentials (SENSITIVE!)
├── 📄 dslr-current-event.json          # Active event
├── 📄 dslr-events.json                 # Event database
├── 📄 dslr-sync-queue.json             # Sync queue
├── 📄 dslr-last-sync.json              # Last sync info
└── 📁 dslr-backup/                     # Local photo backup
```

#### **📦 STORAGE LIBRARIES (Local):**
```
📁 src/lib/ (Local Only)
├── 📄 smart-storage-manager.js         # Storage routing logic
├── 📄 cloudflare-r2-storage.js         # Cloudflare R2 integration
├── 📄 google-drive-storage.js          # Google Drive integration
├── 📄 watermark-processor.js           # Image watermarking
└── 📄 dslr-notification-integration.js # DSLR notifications
```

#### **🛠️ MANAGEMENT TOOLS (Local):**
```
📄 storage-optimization-cli.js          # Storage management CLI
📄 test-cloudflare-r2-connection.js     # Connection testing
📄 check-r2-bucket-contents.js          # Bucket monitoring
📄 debug-tier-selection.js              # Debug tools
📄 cloudflare-r2-credentials-helper.js  # Credential setup
```

---

### **☁️ FILES YANG HARUS DI VERCEL (Web Dashboard):**

#### **🌐 NEXT.JS WEB APPLICATION:**
```
📁 Vercel Deployment/
├── 📁 src/app/                         # Next.js app router
│   ├── 📄 layout.tsx                   # Main layout
│   ├── 📄 page.tsx                     # Homepage
│   ├── 📄 globals.css                  # Global styles
│   └── 📁 api/                         # API routes
├── 📁 src/components/                  # React components
│   ├── 📁 ui/                          # UI components
│   └── 📁 admin/                       # Admin components
├── 📁 src/hooks/                       # React hooks
├── 📁 src/types/                       # TypeScript types
├── 📁 src/utils/                       # Utility functions
└── 📁 public/                          # Static assets
```

#### **🔌 API ENDPOINTS (Vercel):**
```
📁 src/app/api/ (Vercel)
├── 📁 events/                          # Event management API
├── 📁 photos/                          # Photo management API
├── 📁 admin/                           # Admin dashboard API
├── 📁 auth/                            # Authentication API
├── 📁 notifications/                   # Notification API
└── 📁 test/                            # Testing endpoints
```

#### **📊 SHARED LIBRARIES (Vercel):**
```
📁 src/lib/ (Vercel)
├── 📄 supabase.ts                      # Database client
├── 📄 database.ts                      # Database operations
├── 📄 auth.ts                          # Authentication
├── 📄 utils.ts                         # Utility functions
├── 📄 cors.ts                          # CORS handling
└── 📄 queryClient.ts                   # React Query client
```

#### **⚙️ CONFIGURATION (Vercel):**
```
📄 next.config.js                       # Next.js config
📄 tailwind.config.js                   # Tailwind CSS config
📄 tsconfig.json                        # TypeScript config
📄 package.json                         # Dependencies
📄 .env.production                      # Production environment
```

---

## 🔄 **SHARED FILES (Both Local & Vercel):**

### **📄 Files yang Perlu di Kedua Tempat:**
```
📄 package.json                         # Dependencies (different for each)
📄 .env.example                         # Environment template
📄 README.md                            # Documentation
📁 docs/                                # Documentation files
```

---

## 🚀 **DEPLOYMENT STRATEGY:**

### **💻 LOCAL SETUP (DSLR Computer):**
```bash
# 1. Clone repository
git clone https://github.com/your-repo/hafiportrait-dslr.git
cd hafiportrait-dslr

# 2. Install dependencies (local version)
npm install

# 3. Setup environment
cp .env.example .env.local
# Fill in credentials

# 4. Organize files
./organize-dslr-files.sh

# 5. Test system
cd DSLR-System && ./test-system.sh

# 6. Start DSLR service
./start-system.sh
```

### **☁️ VERCEL DEPLOYMENT:**
```bash
# 1. Deploy to Vercel
vercel --prod

# 2. Set environment variables in Vercel dashboard:
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret

# 3. Custom domain (optional)
# hafiportrait.photography → Vercel app
```

---

## 📁 **FOLDER STRUCTURE COMPARISON:**

### **💻 LOCAL STRUCTURE:**
```
📁 DSLR-Computer/
├── 📁 DSLR-System/                     # Organized DSLR files
│   ├── 📁 Core/                        # DSLR core services
│   ├── 📁 Config/                      # Local configuration
│   ├── 📁 Storage/                     # Storage management
│   ├── 📁 Testing/                     # Local testing tools
│   └── 📁 Backup/                      # Local photo backup
├── 📁 src/lib/                         # DSLR-specific libraries
└── 📁 node_modules/                    # Local dependencies
```

### **☁️ VERCEL STRUCTURE:**
```
📁 Vercel-Deployment/
├── 📁 src/app/                         # Next.js application
├── 📁 src/components/                  # React components
├── 📁 src/lib/                         # Web-specific libraries
├── 📁 public/                          # Static assets
├── 📄 next.config.js                   # Next.js config
└── 📄 vercel.json                      # Vercel config
```

---

## 🔐 **ENVIRONMENT VARIABLES:**

### **💻 LOCAL (.env.local):**
```bash
# DSLR Configuration
DSLR_CAMERA_MODEL=NIKON_D7100
DSLR_WATCH_FOLDER=C:/DCIM/100NIKON
DSLR_EVENT_ID=current-event-id

# Storage Credentials
CLOUDFLARE_R2_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
GOOGLE_DRIVE_CLIENT_ID=your-client-id
GOOGLE_DRIVE_CLIENT_SECRET=your-client-secret

# Database (same as Vercel)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **☁️ VERCEL (Environment Variables):**
```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
JWT_SECRET=your-jwt-secret

# API Configuration
NEXT_PUBLIC_APP_URL=https://hafiportrait.photography
```

---

## 🔄 **COMMUNICATION FLOW:**

### **📡 How Local & Vercel Communicate:**
```
📷 DSLR Camera
    ↓ (USB/SD Card)
💻 Local DSLR Service
    ↓ (API calls)
☁️ Supabase Database
    ↓ (Real-time sync)
🌐 Vercel Web Dashboard
    ↓ (Browser access)
👥 Clients & Admin
```

### **🔄 Data Flow:**
1. **DSLR** captures photo
2. **Local service** uploads to Cloudflare R2 + Google Drive
3. **Local service** updates Supabase database
4. **Vercel dashboard** shows real-time updates
5. **Clients** access photos via web dashboard

---

## 🎯 **DEPLOYMENT CHECKLIST:**

### **💻 LOCAL DEPLOYMENT:**
- [ ] ✅ Install Node.js
- [ ] ✅ Clone repository
- [ ] ✅ Setup .env.local with credentials
- [ ] ✅ Install dependencies: `npm install`
- [ ] ✅ Organize files: `./organize-dslr-files.sh`
- [ ] ✅ Test system: `./test-system.sh`
- [ ] ✅ Start DSLR service: `./start-system.sh`

### **☁️ VERCEL DEPLOYMENT:**
- [ ] ✅ Connect GitHub repository to Vercel
- [ ] ✅ Set environment variables in Vercel dashboard
- [ ] ✅ Deploy: `vercel --prod`
- [ ] ✅ Test web dashboard
- [ ] ✅ Configure custom domain (optional)
- [ ] ✅ Test API endpoints

---

## 🎉 **RESULT:**

**Setelah deployment:**
- 💻 **Local**: DSLR auto-upload service running
- ☁️ **Vercel**: Web dashboard accessible at hafiportrait.photography
- 🔄 **Integration**: Real-time sync between local & cloud
- 📱 **Access**: Clients can view photos via web dashboard
- 📊 **Admin**: Complete control via admin dashboard

**Perfect separation: Local handles DSLR, Vercel handles web interface!** 🚀