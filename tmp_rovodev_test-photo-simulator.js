/**
 * Photo Upload Simulator
 * Simulate real DSLR photo capture dan upload process
 */

const fs = require('fs').promises;
const path = require('path');
const DSLRAutoUploader = require('./dslr-auto-upload-service');

class PhotoUploadSimulator {
  constructor() {
    this.simulationFolder = './tmp_rovodev_simulation';
    this.targetFolder = 'C:/DCIM/100NIKON'; // Default DSLR folder
    this.photoCount = 0;
    this.isRunning = false;
  }

  async startSimulation(options = {}) {
    const {
      photoCount = 5,
      interval = 3000, // 3 seconds between photos
      useCustomFolder = true
    } = options;

    console.log('📸 Starting Photo Upload Simulation...\n');
    console.log(`📊 Configuration:`);
    console.log(`   - Photos to simulate: ${photoCount}`);
    console.log(`   - Interval: ${interval}ms`);
    console.log(`   - Target folder: ${useCustomFolder ? this.simulationFolder : this.targetFolder}\n`);

    try {
      // Setup simulation environment
      await this.setupSimulation(useCustomFolder);
      
      this.isRunning = true;
      
      // Simulate photo captures
      for (let i = 1; i <= photoCount && this.isRunning; i++) {
        await this.simulatePhotoCapture(i, useCustomFolder);
        
        if (i < photoCount) {
          console.log(`⏳ Waiting ${interval}ms for next photo...\n`);
          await this.delay(interval);
        }
      }
      
      console.log('🎉 Photo simulation completed!\n');
      
      // Show summary
      this.showSimulationSummary();
      
    } catch (error) {
      console.error('❌ Simulation failed:', error);
    }
  }

  async setupSimulation(useCustomFolder) {
    console.log('🔧 Setting up simulation environment...');
    
    if (useCustomFolder) {
      // Create simulation folder
      await fs.mkdir(this.simulationFolder, { recursive: true });
      console.log(`✅ Created simulation folder: ${this.simulationFolder}`);
    } else {
      // Check if DSLR folder exists
      try {
        await fs.access(this.targetFolder);
        console.log(`✅ DSLR folder found: ${this.targetFolder}`);
      } catch (error) {
        console.log(`⚠️  DSLR folder not found: ${this.targetFolder}`);
        console.log('📁 Creating DSLR folder for simulation...');
        await fs.mkdir(this.targetFolder, { recursive: true });
      }
    }
    
    console.log('✅ Simulation environment ready\n');
  }

  async simulatePhotoCapture(photoNumber, useCustomFolder) {
    const fileName = `DSC_${String(photoNumber).padStart(4, '0')}.jpg`;
    const targetFolder = useCustomFolder ? this.simulationFolder : this.targetFolder;
    const filePath = path.join(targetFolder, fileName);
    
    console.log(`📸 Simulating photo capture: ${fileName}`);
    
    try {
      // Create realistic JPEG file with metadata
      const jpegData = await this.createRealisticJPEG(photoNumber);
      
      // Simulate camera write delay
      console.log('   💾 Writing to camera memory...');
      await this.delay(500);
      
      // Write file
      await fs.writeFile(filePath, jpegData);
      
      // Simulate file stabilization (camera finishing write)
      console.log('   ⏳ File stabilizing...');
      await this.delay(1000);
      
      const stats = await fs.stat(filePath);
      
      console.log(`   ✅ Photo captured successfully!`);
      console.log(`   📁 File: ${filePath}`);
      console.log(`   📏 Size: ${this.formatFileSize(stats.size)}`);
      console.log(`   🕐 Time: ${new Date().toLocaleTimeString()}`);
      
      this.photoCount++;
      
    } catch (error) {
      console.error(`   ❌ Failed to capture ${fileName}:`, error.message);
    }
  }

  async createRealisticJPEG(photoNumber) {
    // Create a more realistic JPEG with EXIF-like data
    const jpegHeader = Buffer.from([
      // JPEG SOI
      0xFF, 0xD8,
      
      // APP0 segment (JFIF)
      0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
      
      // APP1 segment (EXIF simulation)
      0xFF, 0xE1, 0x00, 0x16, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00,
      0x4D, 0x4D, 0x00, 0x2A, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00,
      
      // Quantization table
      0xFF, 0xDB, 0x00, 0x43, 0x00
    ]);
    
    // Add some dummy quantization data
    const quantData = Buffer.alloc(64, 0x10 + (photoNumber % 16));
    
    // Add minimal image data
    const imageData = Buffer.alloc(1000 + (photoNumber * 100), 0x80 + (photoNumber % 128));
    
    // JPEG EOI
    const jpegFooter = Buffer.from([0xFF, 0xD9]);
    
    return Buffer.concat([jpegHeader, quantData, imageData, jpegFooter]);
  }

  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  showSimulationSummary() {
    console.log('📊 SIMULATION SUMMARY');
    console.log('=====================');
    console.log(`📸 Total photos simulated: ${this.photoCount}`);
    console.log(`🕐 Completed at: ${new Date().toLocaleString()}`);
    console.log(`📁 Files location: ${this.simulationFolder}`);
    console.log('\n💡 Tips:');
    console.log('   - Check notification center for upload notifications');
    console.log('   - Monitor DSLR service logs for upload progress');
    console.log('   - Verify photos in admin dashboard\n');
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    console.log('🛑 Stopping simulation...');
    this.isRunning = false;
  }

  async cleanup() {
    console.log('🧹 Cleaning up simulation files...');
    
    try {
      await fs.rmdir(this.simulationFolder, { recursive: true });
      console.log('✅ Simulation files cleaned up');
    } catch (error) {
      console.log('⚠️  Cleanup warning:', error.message);
    }
  }
}

// Interactive CLI
async function runInteractiveSimulation() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  console.log('🎮 INTERACTIVE PHOTO SIMULATION');
  console.log('================================\n');

  try {
    const photoCount = await question('📸 How many photos to simulate? (default: 5): ') || '5';
    const interval = await question('⏱️  Interval between photos in seconds? (default: 3): ') || '3';
    const useCustom = await question('📁 Use custom simulation folder? (y/n, default: y): ') || 'y';

    console.log('\n🚀 Starting simulation...\n');

    const simulator = new PhotoUploadSimulator();
    
    // Handle Ctrl+C
    process.on('SIGINT', async () => {
      console.log('\n🛑 Simulation interrupted by user');
      simulator.stop();
      await simulator.cleanup();
      rl.close();
      process.exit(0);
    });

    await simulator.startSimulation({
      photoCount: parseInt(photoCount),
      interval: parseInt(interval) * 1000,
      useCustomFolder: useCustom.toLowerCase() === 'y'
    });

    const cleanup = await question('\n🧹 Clean up simulation files? (y/n): ');
    if (cleanup.toLowerCase() === 'y') {
      await simulator.cleanup();
    }

  } catch (error) {
    console.error('❌ Interactive simulation failed:', error);
  } finally {
    rl.close();
  }
}

// Run interactive mode if executed directly
if (require.main === module) {
  runInteractiveSimulation().catch(console.error);
}

module.exports = PhotoUploadSimulator;