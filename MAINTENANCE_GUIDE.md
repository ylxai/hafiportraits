# 🛠️ Maintenance Guide - Hafi Portrait

## 📋 **Regular Maintenance Tasks:**

### 1. **Database Maintenance:**
- Periksa database constraints secara berkala
- Bersihkan data yang tidak terpakai
- Backup database secara teratur

### 2. **Storage Maintenance:**
- Periksa orphaned files di storage
- Monitor storage usage
- Cleanup temporary files

### 3. **Performance Monitoring:**
- Monitor API response times
- Check database query performance
- Monitor upload/download speeds

## 🔍 **Troubleshooting Guide:**

### Upload Issues:
1. **File tidak terupload:**
   - Periksa parameter di FormData (`file` bukan `photo`)
   - Periksa storage bucket permissions
   - Periksa file size dan type

2. **Database Error:**
   - Periksa database constraints
   - Periksa kolom required
   - Periksa database connection

3. **Storage Error:**
   - Periksa bucket exists
   - Periksa storage permissions
   - Periksa path structure

### Delete Issues:
1. **File tidak terhapus dari storage:**
   - Periksa path generation
   - Periksa storage permissions
   - Periksa file exists

2. **Database record tidak terhapus:**
   - Periksa database constraints
   - Periksa foreign key relationships
   - Periksa database permissions

## 🔧 **Common Fixes:**

### Database Fixes:
```sql
-- Fix NULL values
UPDATE photos 
SET filename = CONCAT(EXTRACT(EPOCH FROM NOW())::text, '_', substr(md5(random()::text), 1, 8), '.jpg')
WHERE filename IS NULL;

-- Fix missing is_homepage
UPDATE photos 
SET is_homepage = false 
WHERE is_homepage IS NULL;

-- Fix missing album_name
UPDATE photos 
SET album_name = 'Tamu' 
WHERE album_name IS NULL;
```

### Storage Fixes:
1. **Recreate Storage Bucket:**
   - Backup existing files
   - Create new bucket with correct permissions
   - Restore files with correct structure

2. **Fix File Paths:**
   - Update database records with correct paths
   - Move files to correct locations

## 📊 **Monitoring Metrics:**

### Performance:
- Upload time (should be < 3s)
- Delete time (should be < 1s)
- API response time (should be < 500ms)

### Storage:
- Total storage used
- Files per event
- Average file size

### Database:
- Query performance
- Row counts
- Index usage

## 🔄 **Update Procedures:**

### Database Schema Update:
1. Backup database
2. Run update script
3. Verify constraints
4. Test functionality

### Storage Structure Update:
1. Backup files
2. Create new structure
3. Migrate files
4. Update database records

## 🚨 **Emergency Procedures:**

### Database Recovery:
1. Restore from backup
2. Run data validation
3. Fix inconsistencies

### Storage Recovery:
1. Restore files from backup
2. Verify file integrity
3. Update database records

---

**Contact**: [Your Contact Info]  
**Last Updated**: Current Date