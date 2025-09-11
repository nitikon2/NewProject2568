const http = require('http');

const data = JSON.stringify({
  title: "นาย",
  name: "ทดสอบ ระบบ",
  password: "password123",
  student_id: "1234567890",
  email: "nitikon0469@gmail.com",
  phone: "0812345678",
  graduation_year: 2023,
  faculty: "วิทยาศาสตร์",
  major: "วิทยาการคอมพิวเตอร์"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/users/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  res.on('data', (chunk) => {
    console.log('Response:', chunk.toString());
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
