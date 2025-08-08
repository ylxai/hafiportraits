# ✅ Web System Update Checklist

## 🎯 **QUICK REFERENCE - What Needs to be Done**

### **📋 HIGH PRIORITY UPDATES:**

#### **🔌 API Endpoints (CRITICAL):**
- [ ] `src/app/api/photos/route.ts` - Change from Supabase storage to Cloudflare R2/Google Drive URLs
- [ ] `src/app/api/photos/[photoId]/route.ts` - Update photo URL resolution
- [ ] `src/app/api/events/[id]/photos/route.ts` - Update photo loading logic
- [ ] `src/app/api/admin/photos/route.ts` - Redirect uploads to new storage
- [ ] `src/app/api/admin/photos/homepage/route.ts` - Update featured photo source

#### **🖼️ Frontend Components (CRITICAL):**
- [ ] `src/components/photo-lightbox.tsx` - Load images from new storage URLs
- [ ] `src/components/gallery-section.tsx` - Update image sources
- [ ] `src/components/admin/StatsCards.tsx` - Show new storage statistics
- [ ] `src/components/ui/optimized-image.tsx` - Handle new URL formats
- [ ] `src/components/events-section.tsx` - Update event photo display

#### **🗄️ Database Schema (MEDIUM):**
- [ ] Add `storage_provider` column to photos table
- [ ] Add `cloudflare_url` column to photos table  
- [ ] Add `google_drive_url` column to photos table
- [ ] Add `storage_tier` column to photos table
- [ ] Create migration script for existing data

### **📋 MEDIUM PRIORITY UPDATES:**

#### **📚 Library Updates:**
- [ ] `src/lib/supabase.ts` - Remove storage upload functions
- [ ] `src/lib/database.ts` - Update photo URL handling
- [ ] `src/lib/utils.ts` - Add new storage URL utilities

#### **🔄 Integration Layer:**
- [ ] Real-time sync between DSLR service and web dashboard
- [ ] Event switching integration
- [ ] Storage status monitoring
- [ ] Admin dashboard integration

### **📋 LOW PRIORITY UPDATES:**

#### **📱 Mobile Optimization:**
- [ ] Mobile gallery loading optimization
- [ ] Progressive image loading for new sources
- [ ] Offline support for new URLs
- [ ] Touch optimizations

#### **🎨 UI/UX Improvements:**
- [ ] Storage provider indicators
- [ ] Download source selection
- [ ] Bulk download from Google Drive
- [ ] QR code updates for new URLs

---

## 🔧 **TECHNICAL IMPLEMENTATION NOTES:**

### **🔄 URL Structure Changes:**
```javascript
// OLD (Supabase Storage):
https://azspktldiblhrwebzmwq.supabase.co/storage/v1/object/public/photos/...

// NEW (Cloudflare R2):
https://photos.hafiportrait.photography/events/wedding-2025/photo-001.jpg

// NEW (Google Drive):
https://drive.google.com/uc?id=FILE_ID
```

### **📊 Database Schema Updates:**
```sql
-- Add new columns
ALTER TABLE photos ADD COLUMN storage_provider TEXT DEFAULT 'cloudflare-r2';
ALTER TABLE photos ADD COLUMN cloudflare_url TEXT;
ALTER TABLE photos ADD COLUMN google_drive_url TEXT;
ALTER TABLE photos ADD COLUMN storage_tier TEXT DEFAULT 'primary';

-- Update existing records
UPDATE photos SET 
  storage_provider = 'supabase',
  storage_tier = 'legacy'
WHERE cloudflare_url IS NULL;
```

### **🔌 API Response Format:**
```javascript
// NEW photo object format:
{
  id: "photo-id",
  filename: "photo.jpg",
  storage_provider: "cloudflare-r2",
  cloudflare_url: "https://photos.hafiportrait.photography/...",
  google_drive_url: "https://drive.google.com/uc?id=...",
  storage_tier: "primary",
  // ... other fields
}
```

---

## ⏰ **ESTIMATED TIME:**

### **🚀 Quick Update (4-6 hours):**
- API endpoints: 2-3 hours
- Frontend components: 2-3 hours
- Basic testing: 1 hour

### **🔧 Complete Update (8-10 hours):**
- All high priority: 4-6 hours
- Database migration: 1-2 hours
- Integration testing: 2-3 hours
- Mobile optimization: 1-2 hours

---

## 🎯 **SUCCESS CRITERIA:**

### **✅ When Update is Complete:**
- [ ] Web gallery loads photos from Cloudflare R2
- [ ] Admin upload goes to new storage system
- [ ] Database stores new storage URLs
- [ ] DSLR → Web integration working
- [ ] Mobile experience optimized
- [ ] All tests passing

### **📊 Performance Targets:**
- [ ] Gallery loading: <2 seconds
- [ ] Image optimization: Working
- [ ] Mobile responsiveness: Maintained
- [ ] SEO: Not degraded
- [ ] Accessibility: Maintained

---

## 🚨 **CRITICAL REMINDERS:**

### **🔒 Security:**
- Storage credentials stay LOCAL only
- Web uses PUBLIC URLs only
- No sensitive data in Vercel environment

### **🔄 Backward Compatibility:**
- Support old Supabase URLs during transition
- Graceful fallback for missing images
- Migration script for existing data

### **📱 User Experience:**
- No downtime during update
- Faster loading with CDN
- Better mobile performance

---

**📝 CHECKLIST SAVED - Ready untuk systematic update!** ✅