const axios = require('axios');

// ข้อมูลทดสอบการสมัครสมาชิก
const testData = {
    title: 'นาย',
    name: 'ทดสอบ ที่อยู่',
    password: '123456',
    student_id: '630001234569',
    email: 'test_address_final@test.com',
    phone: '0812345678',
    graduation_year: 2566,
    faculty: 'คณะเทคโนโลยีสารสนเทศ',
    major: 'เทคโนโลยีสารสนเทศ',
    address: '123 หมู่ 5 บ้านทดสอบ ถนนทดลอง',
    province: 'ขอนแก่น',
    district: 'เมืองขอนแก่น',
    subdistrict: 'ในเมือง',
    zipcode: '40000'
};

async function testRegisterWithAddress() {
    try {
        console.log('Testing register with address...');
        console.log('Test data:', testData);
        
        const response = await axios.post('http://localhost:5000/api/users/register', testData);
        console.log('✅ Registration successful!');
        console.log('Response:', response.data);
        
        // ตรวจสอบข้อมูลในฐานข้อมูล
        const db = require('./db');
        const [users] = await db.query(
            'SELECT id, name, address, current_address FROM users WHERE email = ?',
            [testData.email]
        );
        
        if (users.length > 0) {
            console.log('\n📋 User data in database:');
            console.log('ID:', users[0].id);
            console.log('Name:', users[0].name);
            console.log('Address:', users[0].address);
            console.log('Current Address:', users[0].current_address);
        }
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Registration failed!');
        console.error('Error:', err.response?.data || err.message);
        console.error('Full error:', err);
        process.exit(1);
    }
}

testRegisterWithAddress();