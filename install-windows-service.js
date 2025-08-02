/**
 * Install DSLR Auto Upload as Windows Service
 * Run: node install-windows-service.js
 */

const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
  name: 'DSLR Auto Upload Service',
  description: 'Automatically uploads photos from Nikon D7100 to Supabase',
  script: path.join(__dirname, 'dslr-auto-upload-service.js'),
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ],
  env: [
    {
      name: "NODE_ENV",
      value: "production"
    },
    {
      name: "DSLR_SERVICE_MODE", 
      value: "windows_service"
    }
  ]
});

// Listen for the "install" event, which indicates the process is available as a service.
svc.on('install', function() {
  console.log('✅ DSLR Auto Upload Service installed successfully!');
  console.log('🚀 Starting service...');
  svc.start();
});

svc.on('start', function() {
  console.log('✅ DSLR Auto Upload Service started!');
  console.log('📊 Check Windows Services (services.msc) to manage the service');
  console.log('📁 Service logs: C:\\ProgramData\\DSLR Auto Upload Service\\daemon\\');
});

svc.on('error', function(err) {
  console.error('❌ Service error:', err);
});

console.log('🔧 Installing DSLR Auto Upload Service...');
svc.install();