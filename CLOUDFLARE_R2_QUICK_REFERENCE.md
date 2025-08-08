# ⚡ Cloudflare R2 Quick Reference

## 🚀 **Quick Setup Commands**

```bash
# 1. Run setup wizard
setup-cloudflare-r2-only.bat

# 2. Interactive credentials setup
node cloudflare-r2-credentials-helper.js

# 3. Test connection
node test-cloudflare-r2-connection.js

# 4. Test upload
node storage-optimization-cli.js upload-test ./test-images/test-image-1.jpg
```

## 🔗 **Important URLs**

| Purpose | URL |
|---------|-----|
| **Cloudflare Dashboard** | https://dash.cloudflare.com/ |
| **R2 Object Storage** | https://dash.cloudflare.com/[account]/r2 |
| **API Tokens** | https://dash.cloudflare.com/profile/api-tokens |
| **Documentation** | https://developers.cloudflare.com/r2/ |

## 🔑 **Credentials Checklist**

- [ ] **Account ID**: `abc123def456ghi789` (32 chars)
- [ ] **Access Key ID**: `jkl012mno345pqr678` (20 chars)
- [ ] **Secret Access Key**: `stu901vwx234yzab567cdef890ghij123klmn456` (40 chars)
- [ ] **Bucket Name**: `hafiportrait-photos` (your choice)

## ⚙️ **Environment Variables**

```bash
# Required in .env.local
CLOUDFLARE_R2_ACCOUNT_ID="your-account-id"
CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key-id"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-access-key"
CLOUDFLARE_R2_BUCKET_NAME="hafiportrait-photos"

# Optional
CLOUDFLARE_R2_CUSTOM_DOMAIN="photos.hafiportrait.photography"
```

## 🧪 **Testing Commands**

```bash
# Test connection only
node test-cloudflare-r2-connection.js

# Test complete storage system
node storage-optimization-cli.js test

# Test upload workflow
node storage-optimization-cli.js upload-test ./path/to/image.jpg

# Check storage status
node storage-optimization-cli.js status
```

## 📊 **Storage Limits**

| Resource | Free Tier | Paid Tier |
|----------|-----------|-----------|
| **Storage** | 10GB/month | $0.015/GB/month |
| **Class A Ops** | 1M/month | $4.50/million |
| **Class B Ops** | 10M/month | $0.36/million |
| **Egress** | FREE | FREE |

## 🔧 **Common Issues & Solutions**

### **❌ "Access Denied" Error**
```bash
# Check API token permissions
# Regenerate token with "Admin Read & Write" or "R2:Edit"
```

### **❌ "Bucket Not Found" Error**
```bash
# Verify bucket name in dashboard
# Check CLOUDFLARE_R2_BUCKET_NAME in .env.local
```

### **❌ "Invalid Credentials" Error**
```bash
# Verify all 3 credentials are correct
# Check for extra spaces or quotes
# Regenerate API token if needed
```

### **❌ Upload Timeout**
```bash
# Test with smaller file first
# Check internet connection
# Verify bucket CORS settings
```

## 🌐 **Public URL Formats**

```bash
# Default R2 URL
https://pub-[account-hash].r2.dev/[file-path]

# Custom domain URL (if configured)
https://photos.hafiportrait.photography/[file-path]

# Example
https://pub-abc123def456.r2.dev/events/wedding-2025/photo-001.jpg
```

## 📁 **File Organization**

```
hafiportrait-photos/
├── events/
│   ├── wedding-sarah-john-2025-01-15/
│   │   ├── Official/
│   │   ├── Tamu/
│   │   └── Bridesmaid/
│   └── corporate-event-2025-01-20/
├── homepage/
│   └── featured-photos/
└── temp/
    └── test-uploads/
```

## 🔄 **Backup Strategy**

```
Primary: Cloudflare R2 (10GB)
├── All event photos
├── Homepage photos
└── Featured content

Secondary: Google Drive (15GB)
├── Backup copies
├── Overflow storage
└── Archive photos

Local: Hard drive (50GB+)
├── RAW files
├── Original backups
└── Emergency copies
```

## 📈 **Performance Tips**

1. **Use CDN URLs** for faster global loading
2. **Enable compression** to save 60-80% storage
3. **Organize files** in logical folder structure
4. **Set cache headers** for better performance
5. **Use custom domain** for branding

## 🎯 **Production Checklist**

- [ ] ✅ Cloudflare account created
- [ ] ✅ R2 Object Storage enabled
- [ ] ✅ Bucket created with correct name
- [ ] ✅ API token generated with R2:Edit permissions
- [ ] ✅ Credentials added to .env.local
- [ ] ✅ Dependencies installed (@aws-sdk/client-s3)
- [ ] ✅ Connection test passed
- [ ] ✅ Upload test successful
- [ ] ✅ Public URL accessible
- [ ] ✅ Ready for DSLR auto-upload! 🚀

## 🆘 **Support Resources**

- **Documentation**: https://developers.cloudflare.com/r2/
- **Community**: https://community.cloudflare.com/
- **API Reference**: https://developers.cloudflare.com/r2/api/
- **Status Page**: https://www.cloudflarestatus.com/

---

## 🎉 **Success Message**

```
✅ CLOUDFLARE R2 SETUP COMPLETED!
🎯 10GB free storage ready
⚡ Global CDN enabled
🔒 Enterprise-grade security
💰 $0/month cost
🚀 Ready for production!
```