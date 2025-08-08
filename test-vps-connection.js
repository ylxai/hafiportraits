/**
 * Test VPS Connection and API Routes
 */

const domain = 'bwpwwtphgute.ap-southeast-1.clawcloudrun.com';
const protocols = ['http', 'https'];
const ports = ['', ':3000', ':8080', ':80', ':443'];

async function testConnection() {
  console.log('🔍 Testing VPS connection...\n');
  
  for (const protocol of protocols) {
    for (const port of ports) {
      const baseUrl = `${protocol}://${domain}${port}`;
      
      try {
        console.log(`📡 Testing: ${baseUrl}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${baseUrl}/api/test/db`, {
          signal: controller.signal,
          method: 'GET'
        });
        
        clearTimeout(timeoutId);
        
        console.log(`✅ ${baseUrl}: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.text();
          console.log(`📄 Response: ${data.substring(0, 100)}...`);
          console.log(`🎯 WORKING URL: ${baseUrl}\n`);
          return baseUrl;
        }
        
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log(`⏰ ${baseUrl}: Timeout (5s)`);
        } else {
          console.log(`❌ ${baseUrl}: ${error.message}`);
        }
      }
    }
  }
  
  console.log('\n❌ No working connection found!');
  return null;
}

// Test if running in browser
if (typeof window !== 'undefined') {
  testConnection().then(workingUrl => {
    if (workingUrl) {
      console.log(`\n🔧 Update your environment variables to use: ${workingUrl}`);
    }
  });
}

// Export for Node.js
if (typeof module !== 'undefined') {
  module.exports = { testConnection };
}