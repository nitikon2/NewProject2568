const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/alumni',
  method: 'GET',
  timeout: 5000
};

console.log('🔍 ทดสอบ API: GET /api/alumni');
console.log('URL: http://localhost:5000/api/alumni');

const req = http.request(options, (res) => {
  console.log('✅ Status:', res.statusCode);
  console.log('✅ Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
    console.log('📦 Chunk received:', chunk.length, 'bytes');
  });
  
  res.on('end', () => {
    console.log('\n📊 Complete Response:');
    console.log('Raw Length:', data.length);
    console.log('Raw Data:', data);
    
    if (data) {
      try {
        const json = JSON.parse(data);
        console.log('✅ Parsed JSON:', JSON.stringify(json, null, 2));
        
        if (Array.isArray(json)) {
          console.log('✅ Is Array, Length:', json.length);
        }
      } catch (e) {
        console.log('❌ JSON Parse Error:', e.message);
      }
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request Error:', e.message);
  console.error('❌ Code:', e.code);
});

req.on('timeout', () => {
  console.error('❌ Request Timeout');
  req.destroy();
});

console.log('📡 Sending request...');
req.end();
