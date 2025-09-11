const axios = require('axios');

async function testProfileAPIWithAddress() {
    try {
        console.log('🧪 ทดสอบ Profile API - Address Data');
        
        const response = await axios.get('http://localhost:5000/api/users/2');
        
        console.log('✅ Status:', response.status);
        
        const user = response.data;
        console.log('\n📊 ข้อมูลผู้ใช้ที่ได้รับ:');
        console.log('- ID:', user.id);
        console.log('- Name:', user.name);
        console.log('- Email:', user.email);
        console.log('\n🏠 ข้อมูลที่อยู่:');
        console.log('- Address:', user.address || 'ไม่มี');
        console.log('- Province:', user.province || 'ไม่มี');
        console.log('- District:', user.district || 'ไม่มี');
        console.log('- Subdistrict:', user.subdistrict || 'ไม่มี');
        console.log('- Zipcode:', user.zipcode || 'ไม่มี');
        
        console.log('\n📋 JSON ทั้งหมด:');
        console.log(JSON.stringify(user, null, 2));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testProfileAPIWithAddress();
