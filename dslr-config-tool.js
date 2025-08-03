#!/usr/bin/env node

/**
 * DSLR Configuration Tool
 * Command-line tool for managing DSLR service configuration
 */

const { config, validateConfig, updateConfig, getCameraConfig } = require('./dslr.config.js');
const { DSLRConfigManager } = require('./src/lib/dslr-config-manager.js');
const fs = require('fs').promises;
const path = require('path');

const configManager = new DSLRConfigManager(config);

// Command line argument parsing
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  try {
    switch (command) {
      case 'show':
        await showConfig();
        break;
      case 'validate':
        await validateConfiguration();
        break;
      case 'set':
        await setConfigValue(args[1], args[2]);
        break;
      case 'get':
        await getConfigValue(args[1]);
        break;
      case 'detect':
        await detectCamera();
        break;
      case 'export':
        await exportConfig(args[1]);
        break;
      case 'import':
        await importConfig(args[1]);
        break;
      case 'reset':
        await resetConfig();
        break;
      case 'profile':
        await setPerformanceProfile(args[1]);
        break;
      case 'test':
        await testConfiguration();
        break;
      case 'watermark':
        await manageWatermark(args[1], args[2]);
        break;
      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function showConfig() {
  console.log('📋 Current DSLR Configuration:');
  console.log('=' .repeat(50));
  
  const summary = configManager.getSummary();
  
  console.log('\n📷 Camera Configuration:');
  console.log(`  Model: ${summary.camera.model}`);
  console.log(`  Watch Folder: ${summary.camera.watchFolder}`);
  console.log(`  Auto Detect: ${summary.camera.autoDetect}`);
  
  console.log('\n📸 Event Configuration:');
  console.log(`  Event ID: ${summary.event.id}`);
  console.log(`  Uploader: ${summary.event.uploader}`);
  console.log(`  Album: ${summary.event.album}`);
  
  console.log('\n⚡ Performance Configuration:');
  console.log(`  Profile: ${summary.performance.profile}`);
  console.log(`  Batch Size: ${summary.performance.batchSize}`);
  console.log(`  Stability Threshold: ${summary.performance.stabilityThreshold}ms`);
  
  console.log('\n🌐 API Configuration:');
  console.log(`  Base URL: ${summary.api.baseUrl}`);
  console.log(`  Timeout: ${summary.api.timeout}ms`);
  
  console.log('\n🔔 Notification Configuration:');
  console.log(`  Enabled: ${summary.notifications.enabled}`);
  console.log(`  Local Logging: ${summary.notifications.localLogging}`);
  console.log(`  Milestones: ${summary.notifications.milestones.join(', ')}`);
  
  console.log('\n💾 Storage Configuration:');
  console.log(`  Enable Backup: ${summary.storage.enableBackup}`);
  console.log(`  Backup Folder: ${summary.storage.backupFolder}`);
  console.log(`  Max Backup Size: ${summary.storage.maxBackupSizeGB}GB`);
}

async function validateConfiguration() {
  console.log('🔍 Validating configuration...');
  
  const errors = validateConfig();
  
  if (errors.length === 0) {
    console.log('✅ Configuration is valid');
  } else {
    console.log('❌ Configuration errors found:');
    errors.forEach(error => console.log(`  - ${error}`));
    process.exit(1);
  }
}

async function setConfigValue(path, value) {
  if (!path || value === undefined) {
    console.error('Usage: node dslr-config-tool.js set <path> <value>');
    console.error('Example: node dslr-config-tool.js set EVENT.ID my-event-123');
    process.exit(1);
  }
  
  // Parse value (try to convert to appropriate type)
  let parsedValue = value;
  if (value === 'true') parsedValue = true;
  else if (value === 'false') parsedValue = false;
  else if (!isNaN(value)) parsedValue = Number(value);
  
  configManager.set(path, parsedValue);
  await configManager.saveRuntimeConfig();
  
  console.log(`✅ Configuration updated: ${path} = ${parsedValue}`);
}

async function getConfigValue(path) {
  if (!path) {
    console.error('Usage: node dslr-config-tool.js get <path>');
    console.error('Example: node dslr-config-tool.js get EVENT.ID');
    process.exit(1);
  }
  
  const value = configManager.get(path);
  if (value !== undefined) {
    console.log(`${path} = ${JSON.stringify(value, null, 2)}`);
  } else {
    console.log(`❌ Configuration path not found: ${path}`);
    process.exit(1);
  }
}

async function detectCamera() {
  console.log('🔍 Auto-detecting camera...');
  
  const detectedCamera = await configManager.autoDetectCamera();
  
  if (detectedCamera) {
    console.log(`✅ Camera detected: ${detectedCamera}`);
    await configManager.saveRuntimeConfig();
  } else {
    console.log('❌ No camera detected');
  }
}

async function exportConfig(filename) {
  const exportFile = filename || `dslr-config-${new Date().toISOString().split('T')[0]}.json`;
  
  const configData = configManager.exportConfig();
  await fs.writeFile(exportFile, JSON.stringify(configData, null, 2));
  
  console.log(`✅ Configuration exported to: ${exportFile}`);
}

async function importConfig(filename) {
  if (!filename) {
    console.error('Usage: node dslr-config-tool.js import <filename>');
    process.exit(1);
  }
  
  try {
    const data = await fs.readFile(filename, 'utf8');
    const configData = JSON.parse(data);
    
    configManager.importConfig(configData);
    await configManager.saveRuntimeConfig();
    
    console.log(`✅ Configuration imported from: ${filename}`);
  } catch (error) {
    console.error(`❌ Failed to import configuration: ${error.message}`);
    process.exit(1);
  }
}

async function resetConfig() {
  console.log('🔄 Resetting configuration to defaults...');
  
  configManager.resetToDefaults();
  await configManager.saveRuntimeConfig();
  
  console.log('✅ Configuration reset to defaults');
}

async function setPerformanceProfile(profile) {
  if (!profile) {
    console.error('Usage: node dslr-config-tool.js profile <DEVELOPMENT|PRODUCTION|HIGH_VOLUME|LOW_BANDWIDTH>');
    process.exit(1);
  }
  
  const validProfiles = ['DEVELOPMENT', 'PRODUCTION', 'HIGH_VOLUME', 'LOW_BANDWIDTH'];
  if (!validProfiles.includes(profile)) {
    console.error(`❌ Invalid profile. Valid options: ${validProfiles.join(', ')}`);
    process.exit(1);
  }
  
  const { PERFORMANCE_PROFILES } = require('./dslr.config.js');
  const profileConfig = PERFORMANCE_PROFILES[profile];
  
  configManager.updateConfig({
    PERFORMANCE: {
      PROFILE: profile,
      ...profileConfig
    }
  });
  
  await configManager.saveRuntimeConfig();
  
  console.log(`✅ Performance profile set to: ${profile}`);
  console.log(`  Stability Threshold: ${profileConfig.stabilityThreshold}ms`);
  console.log(`  Poll Interval: ${profileConfig.pollInterval}ms`);
  console.log(`  Batch Size: ${profileConfig.batchSize}`);
  console.log(`  Max Retries: ${profileConfig.maxRetries}`);
}

async function testConfiguration() {
  console.log('🧪 Testing configuration...');
  
  // Test 1: Validate configuration
  console.log('\n1. Validating configuration...');
  const errors = validateConfig();
  if (errors.length > 0) {
    console.log('❌ Configuration validation failed');
    errors.forEach(error => console.log(`  - ${error}`));
    return;
  }
  console.log('✅ Configuration is valid');
  
  // Test 2: Check camera folder
  console.log('\n2. Checking camera folder...');
  try {
    await fs.access(config.CAMERA.WATCH_FOLDER);
    console.log(`✅ Camera folder accessible: ${config.CAMERA.WATCH_FOLDER}`);
  } catch (error) {
    console.log(`❌ Camera folder not accessible: ${config.CAMERA.WATCH_FOLDER}`);
  }
  
  // Test 3: Check backup folders
  console.log('\n3. Checking backup folders...');
  if (config.STORAGE.ENABLE_BACKUP) {
    try {
      await fs.access(config.STORAGE.BACKUP_FOLDER);
      console.log(`✅ Backup folder accessible: ${config.STORAGE.BACKUP_FOLDER}`);
    } catch (error) {
      console.log(`⚠️ Backup folder not found (will be created): ${config.STORAGE.BACKUP_FOLDER}`);
    }
  } else {
    console.log('📁 Backup disabled');
  }
  
  // Test 4: Test API connectivity
  console.log('\n4. Testing API connectivity...');
  try {
    const fetch = require('node-fetch');
    const response = await fetch(`${config.API.BASE_URL}/api/test/db`, {
      timeout: config.API.HEALTH_CHECK_TIMEOUT
    });
    
    if (response.ok) {
      console.log(`✅ API accessible: ${config.API.BASE_URL}`);
    } else {
      console.log(`⚠️ API responded with status: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ API not accessible: ${error.message}`);
  }
  
  console.log('\n✅ Configuration test completed');
}

async function manageWatermark(action, value) {
  if (!action) {
    console.error('Usage: node dslr-config-tool.js watermark <action> [value]');
    console.error('Actions: enable, disable, status, logo, test');
    process.exit(1);
  }

  try {
    switch (action) {
      case 'enable':
        configManager.set('WATERMARK.ENABLED', true);
        await configManager.saveRuntimeConfig();
        console.log('✅ Watermark enabled');
        break;
        
      case 'disable':
        configManager.set('WATERMARK.ENABLED', false);
        await configManager.saveRuntimeConfig();
        console.log('✅ Watermark disabled');
        break;
        
      case 'status':
        await showWatermarkStatus();
        break;
        
      case 'logo':
        await setLogoPath(value);
        break;
        
      case 'test':
        await testWatermarkSystem();
        break;
        
      default:
        console.error(`Unknown watermark action: ${action}`);
        console.error('Available actions: enable, disable, status, logo, test');
        process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Watermark management failed: ${error.message}`);
    process.exit(1);
  }
}

async function showWatermarkStatus() {
  console.log('🏷️ Watermark Configuration Status:');
  console.log('=' .repeat(40));
  
  const watermarkConfig = configManager.get('WATERMARK');
  
  console.log(`Status: ${watermarkConfig.ENABLED ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`Logo Path: ${watermarkConfig.LOGO_PATH}`);
  console.log(`Position: ${watermarkConfig.POSITION}`);
  console.log(`Offset Y: ${watermarkConfig.OFFSET_Y}px`);
  console.log(`Opacity: ${watermarkConfig.OPACITY}`);
  console.log(`Size Ratio: ${watermarkConfig.SIZE_RATIO} (${Math.round(watermarkConfig.SIZE_RATIO * 100)}% of image width)`);
  console.log(`Quality: ${watermarkConfig.QUALITY}%`);
  
  // Check logo file
  try {
    await fs.access(watermarkConfig.LOGO_PATH);
    console.log(`Logo File: ✅ Found`);
  } catch (error) {
    console.log(`Logo File: ❌ Not found (${watermarkConfig.LOGO_PATH})`);
  }
}

async function setLogoPath(logoPath) {
  if (!logoPath) {
    console.error('Usage: node dslr-config-tool.js watermark logo <path>');
    console.error('Example: node dslr-config-tool.js watermark logo ./assets/my-logo.png');
    process.exit(1);
  }
  
  try {
    // Check if logo file exists
    await fs.access(logoPath);
    
    // Update configuration
    configManager.set('WATERMARK.LOGO_PATH', logoPath);
    await configManager.saveRuntimeConfig();
    
    console.log(`✅ Logo path updated: ${logoPath}`);
  } catch (error) {
    console.error(`❌ Logo file not found: ${logoPath}`);
    process.exit(1);
  }
}

async function testWatermarkSystem() {
  console.log('🧪 Testing Watermark System...');
  console.log('=' .repeat(40));
  
  const { WatermarkProcessor } = require('./src/lib/watermark-processor.js');
  const watermarkProcessor = new WatermarkProcessor(config);
  
  // Test 1: Check configuration
  console.log('\n1. Checking watermark configuration...');
  const status = watermarkProcessor.getStatus();
  console.log(`   Enabled: ${status.enabled}`);
  console.log(`   Logo Path: ${status.logoPath}`);
  console.log(`   Position: ${status.position}`);
  
  if (!status.enabled) {
    console.log('⚠️ Watermark is disabled. Enable it first with: watermark enable');
    return;
  }
  
  // Test 2: Initialize processor
  console.log('\n2. Initializing watermark processor...');
  const initResult = await watermarkProcessor.initialize();
  if (initResult) {
    console.log('✅ Watermark processor initialized successfully');
  } else {
    console.log('❌ Failed to initialize watermark processor');
    return;
  }
  
  // Test 3: Check dependencies
  console.log('\n3. Checking image processing dependencies...');
  const hasSharp = await watermarkProcessor.checkSharpAvailability();
  console.log(`   Sharp library: ${hasSharp ? '✅ Available' : '⚠️ Not available (will use fallback)'}`);
  
  console.log('\n✅ Watermark system test completed');
  console.log('\n💡 To test with actual images:');
  console.log('   1. Enable watermark: node dslr-config-tool.js watermark enable');
  console.log('   2. Start DSLR service: node dslr-auto-upload-service.js');
  console.log('   3. Add test images to camera folder');
}

function showHelp() {
  console.log('🛠️  DSLR Configuration Tool');
  console.log('=' .repeat(50));
  console.log('\nUsage: node dslr-config-tool.js <command> [options]');
  console.log('\nCommands:');
  console.log('  show                    Show current configuration');
  console.log('  validate                Validate configuration');
  console.log('  set <path> <value>      Set configuration value');
  console.log('  get <path>              Get configuration value');
  console.log('  detect                  Auto-detect camera');
  console.log('  export [filename]       Export configuration to file');
  console.log('  import <filename>       Import configuration from file');
  console.log('  reset                   Reset to default configuration');
  console.log('  profile <name>          Set performance profile');
  console.log('  watermark <action>      Manage watermark settings');
  console.log('  test                    Test configuration');
  console.log('  help                    Show this help');
  console.log('\nExamples:');
  console.log('  node dslr-config-tool.js show');
  console.log('  node dslr-config-tool.js set EVENT.ID my-wedding-2024');
  console.log('  node dslr-config-tool.js get CAMERA.WATCH_FOLDER');
  console.log('  node dslr-config-tool.js profile PRODUCTION');
  console.log('  node dslr-config-tool.js watermark enable');
  console.log('  node dslr-config-tool.js watermark status');
  console.log('  node dslr-config-tool.js detect');
  console.log('  node dslr-config-tool.js test');
}

// Run the tool
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { configManager };