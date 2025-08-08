# 📁 DSLR Auto Upload - File Organization Guide

## 🎯 **CORE FILES YANG ANDA BUTUHKAN:**

### **🚀 STARTUP FILES (Utama):**
```
📄 start-dslr-hybrid.bat           # ⭐ MAIN STARTUP - Start semua sistem
📄 dslr-auto-upload-service.js     # ⭐ CORE SERVICE - Monitor kamera & upload
📄 dslr-hybrid-cli.js              # ⭐ EVENT MANAGER - Kelola event
📄 storage-optimization-cli.js     # ⭐ STORAGE MANAGER - Kelola storage
```

### **⚙️ CONFIGURATION FILES:**
```
📄 .env.local                      # ⭐ CREDENTIALS - Semua password & API keys
📄 dslr.config.js                  # ⭐ SETTINGS - Konfigurasi sistem
📄 dslr-current-event.json         # ⭐ ACTIVE EVENT - Event yang sedang aktif
📄 dslr-events.json                # ⭐ EVENT LIST - Daftar semua event
```

### **🧪 TESTING & MONITORING:**
```
📄 test-cloudflare-r2-connection.js    # Test Cloudflare R2
📄 check-r2-bucket-contents.js         # Monitor bucket contents
📄 debug-tier-selection.js             # Debug storage selection
```

---

## 📂 **FOLDER STRUCTURE YANG RAPI:**

### **Buat Folder Organisasi:**
```
📁 DSLR-System/
├── 📁 Core/                    # File utama
│   ├── start-dslr-hybrid.bat
│   ├── dslr-auto-upload-service.js
│   └── dslr-hybrid-cli.js
├── 📁 Config/                  # Konfigurasi
│   ├── .env.local
│   ├── dslr.config.js
│   └── dslr-current-event.json
├── 📁 Storage/                 # Storage management
│   ├── storage-optimization-cli.js
│   └── check-r2-bucket-contents.js
├── 📁 Backup/                  # Local backup
│   └── dslr-backup/
└── 📁 Logs/                    # Log files
    └── dslr-notifications.log
```

---

## 🛠️ **SCRIPT ORGANIZER OTOMATIS:**

Mari saya buat script untuk merapikan file Anda: