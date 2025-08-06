# 🚀 PRODUCTION DEPLOYMENT GUIDE - VPS

## 📋 **CURRENT STATUS:**
- **VPS IP:** 47.79.99.223
- **Port:** 3000
- **Current Mode:** Development (`next dev`)
- **Target Mode:** Production (`next start`)

## 🔄 **LANGKAH BERALIH KE PRODUCTION:**

### **Option 1: Simple Production Start**
```bash
# Stop development server
pkill -f "next dev"

# Build for production
npm run build

# Start production server
npm start
```

### **Option 2: Using Production Script (Recommended)**
```bash
# Use the script I created
./start-production.sh
```

### **Option 3: Using PM2 (Best for VPS)**
```bash
# Install PM2 and start with auto-restart
./start-production-pm2.sh
```

## 🌐 **PRODUCTION URLs:**
- **Main Site:** http://47.79.99.223:3000
- **Admin Dashboard:** http://47.79.99.223:3000/admin
- **API Health Check:** http://47.79.99.223:3000/api/test/db

## ⚙️ **PRODUCTION OPTIMIZATIONS:**

### **Performance Improvements:**
- ✅ **Static Generation** - Pages pre-built for faster loading
- ✅ **Code Splitting** - Only load needed JavaScript
- ✅ **Image Optimization** - Automatic image compression
- ✅ **Caching** - Browser and server-side caching
- ✅ **Minification** - Smaller file sizes

### **Security Enhancements:**
- ✅ **Production JWT Secret** - Secure authentication
- ✅ **Rate Limiting** - Prevent abuse
- ✅ **HTTPS Ready** - SSL certificate support
- ✅ **Environment Isolation** - Production-specific configs

## 🔧 **MONITORING & MANAGEMENT:**

### **With PM2 (Recommended):**
```bash
pm2 status              # Check app status
pm2 logs hafiportrait   # View real-time logs
pm2 restart hafiportrait # Restart app
pm2 monit               # Performance monitoring
pm2 save                # Save current processes
```

### **Manual Monitoring:**
```bash
# Check if app is running
ps aux | grep node

# Check port usage
netstat -tulpn | grep :3000

# View logs
tail -f ~/.pm2/logs/hafiportrait-out.log
```

## 🚨 **TROUBLESHOOTING:**

### **If Build Fails:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### **If Port 3000 is Busy:**
```bash
# Kill process on port 3000
sudo lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### **If Database Connection Issues:**
```bash
# Test database connection
node -e "console.log('Testing DB...'); require('./src/lib/database.ts')"
```

## 📊 **PERFORMANCE COMPARISON:**

### **Development vs Production:**
```
DEVELOPMENT (next dev):
- Hot reload: ✅
- Source maps: ✅
- Build time: Fast
- Runtime: Slower
- Memory usage: Higher
- File watching: ✅

PRODUCTION (next start):
- Hot reload: ❌
- Source maps: ❌
- Build time: Slower (one-time)
- Runtime: Faster
- Memory usage: Lower
- File watching: ❌
- Optimizations: ✅
```

## 🎯 **NEXT STEPS AFTER PRODUCTION:**

### **1. SSL Certificate (Optional):**
```bash
# Install Certbot for free SSL
sudo apt install certbot
sudo certbot --nginx -d yourdomain.com
```

### **2. Reverse Proxy with Nginx:**
```bash
# Install Nginx
sudo apt install nginx

# Configure reverse proxy
sudo nano /etc/nginx/sites-available/hafiportrait
```

### **3. Firewall Configuration:**
```bash
# Allow port 3000
sudo ufw allow 3000
sudo ufw enable
```

## ✅ **PRODUCTION CHECKLIST:**
- [ ] Stop development server
- [ ] Build application successfully
- [ ] Start production server
- [ ] Test main website
- [ ] Test admin dashboard
- [ ] Test photo upload
- [ ] Test database connection
- [ ] Monitor performance
- [ ] Setup auto-restart (PM2)

---

**🚀 Ready to deploy? Choose your preferred method above!**