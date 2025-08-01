# 🧪 Testing Guide - Upload Photo Fixes

## 📋 **Pre-Testing Setup:**

### 1. **Database Schema Update**
Jalankan script berikut di Supabase SQL Editor:
```sql
-- Jalankan file DATABASE_SCHEMA_UPDATE.sql
```

### 2. **Supabase Storage Setup**
1. Buka Supabase Dashboard > Storage
2. Buat bucket baru:
   - Name: `photos`
   - Public: ✅ True
   - File size limit: 10MB
   - Allowed MIME types: `image/*`

### 3. **Environment Variables**
Pastikan file `.env.local` memiliki:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=photos
```

## 🧪 **Test Cases:**

### **Test 1: Homepage Photo Upload (Admin Dashboard)**

**Steps:**
1. Buka `/admin`
2. Klik tab "Foto"
3. Pilih "Galeri Homepage"
4. Klik "Upload Foto"
5. Pilih file image (JPG/PNG < 10MB)
6. Klik upload

**Expected Results:**
- ✅ Upload berhasil
- ✅ Foto muncul di grid
- ✅ Toast success message
- ✅ Loading indicator saat upload

**Error Cases:**
- Upload file non-image → Error message
- Upload file > 10MB → Error message
- Upload tanpa file → Error message

### **Test 2: Event Official Photo Upload (Admin Dashboard)**

**Steps:**
1. Buka `/admin`
2. Klik tab "Foto"
3. Pilih "Galeri Event"
4. Pilih event dari dropdown
5. Klik "Upload Foto Official"
6. Pilih file image
7. Upload

**Expected Results:**
- ✅ Foto masuk ke album "Official"
- ✅ Uploader name = "Admin"
- ✅ Album name = "Official"

### **Test 3: Event Guest Photo Upload (Event Page)**

**Steps:**
1. Buka `/event/[event-id]`
2. Masukkan access code jika diperlukan
3. Pilih album "Tamu" atau "Bridesmaid"
4. Isi nama uploader
5. Upload foto

**Expected Results:**
- ✅ Foto masuk ke album yang dipilih
- ✅ Uploader name tersimpan
- ✅ Album name sesuai pilihan

### **Test 4: Photo Delete Function**

**Steps:**
1. Hover foto di grid
2. Klik tombol delete (trash icon)
3. Konfirmasi delete

**Expected Results:**
- ✅ Foto hilang dari grid
- ✅ File terhapus dari storage
- ✅ Record terhapus dari database

### **Test 5: Photo Lightbox**

**Steps:**
1. Klik foto di grid
2. Navigate dengan arrow keys/buttons
3. Test download button
4. Test close button

**Expected Results:**
- ✅ Lightbox terbuka
- ✅ Navigation berfungsi
- ✅ Download berfungsi
- ✅ Close berfungsi

## 🔍 **Debug Checklist:**

### **Jika Upload Gagal:**

1. **Check Network Tab:**
   - Status code 400/500?
   - Error message di response?

2. **Check Console:**
   - JavaScript errors?
   - Network errors?

3. **Check Supabase:**
   - Bucket 'photos' exists?
   - RLS policies correct?
   - Database columns exist?

4. **Check File:**
   - File type = image/*?
   - File size < 10MB?
   - File name valid?

### **Common Issues & Solutions:**

**❌ "No file uploaded"**
- Solution: Check FormData parameter name (`file` not `photo`)

**❌ "Only image files are allowed"**
- Solution: Check file.type validation

**❌ "File size must be less than 10MB"**
- Solution: Compress image or check file.size

**❌ "Failed to upload photo: [Supabase error]"**
- Solution: Check Supabase bucket permissions and RLS

**❌ "Column 'is_homepage' does not exist"**
- Solution: Run DATABASE_SCHEMA_UPDATE.sql

## 📊 **Performance Testing:**

### **Load Testing:**
- Upload 10 photos simultaneously
- Check memory usage
- Check upload speed

### **File Size Testing:**
- 1KB image ✅
- 1MB image ✅
- 5MB image ✅
- 10MB image ✅
- 11MB image ❌ (should fail)

### **File Type Testing:**
- JPG ✅
- PNG ✅
- GIF ✅
- WEBP ✅
- PDF ❌ (should fail)
- TXT ❌ (should fail)

## 📱 **Mobile Testing:**

### **Responsive Upload:**
- Upload dari mobile browser
- Touch targets adequate (44px min)
- File picker works on mobile
- Progress indicators visible

### **Cross-Browser Testing:**
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅

---

**Testing Status**: 🔄 **Ready for Testing**  
**Last Updated**: Current Date  
**Tester**: [Your Name]