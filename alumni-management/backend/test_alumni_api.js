const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/alumni',
  method: 'GET'
};

console.log('🔍 ทดสอบ API: GET /api/alumni');
const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('\n📊 Response:');
    try {
      const json = JSON.parse(data);
      console.log('Type:', typeof json);
      console.log('Is Array:', Array.isArray(json));
      if (Array.isArray(json)) {
        console.log('Length:', json.length);
        if (json.length > 0) {
          console.log('First item:', JSON.stringify(json[0], null, 2));
        } else {
          console.log('❌ Array ว่าง - ไม่มีข้อมูลศิษย์เก่า');
        }
      } else {
        console.log('Data:', JSON.stringify(json, null, 2));
      }
    } catch (e) {
      console.log('Raw data:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
});

req.end();
