/**
 * Debug Network Issues
 * Test API endpoints and network connectivity
 */

const testEndpoints = [
  '/api/test/db',
  '/api/auth/me', 
  '/api/auth/login'
];

async function testAPI() {
  console.log('🔍 Testing API endpoints...');
  console.log('Current URL:', typeof window !== 'undefined' ? window.location.origin : 'Server-side');
  
  for (const endpoint of testEndpoints) {
    try {
      console.log(`\n📡 Testing ${endpoint}...`);
      
      const response = await fetch(endpoint, {
        method: endpoint === '/api/auth/login' ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: endpoint === '/api/auth/login' ? JSON.stringify({
          username: 'test',
          password: 'test'
        }) : undefined
      });
      
      console.log(`✅ ${endpoint}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.text();
        console.log(`📄 Response: ${data.substring(0, 100)}...`);
      }
      
    } catch (error) {
      console.error(`❌ ${endpoint}: ${error.message}`);
    }
  }
}

// Test immediately if in browser
if (typeof window !== 'undefined') {
  testAPI();
}

// Export for Node.js testing
if (typeof module !== 'undefined') {
  module.exports = { testAPI };
}