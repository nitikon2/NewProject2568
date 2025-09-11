const axios = require('axios');

async function testProfileAPI() {
    try {
        console.log('🧪 ทดสอบ Profile API');
        
        // ทดสอบ endpoint สำหรับดึงข้อมูลผู้ใช้
        console.log('\n1. ทดสอบ GET /api/users/:id');
        
        // ใช้ user ID ที่เราเห็นในฐานข้อมูล (id: 2)
        const userId = 2;
        
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        
        console.log('✅ Status:', response.status);
        console.log('✅ User Data:');
        console.log(JSON.stringify(response.data, null, 2));
        
        // ตรวจสอบฟิลด์สำคัญ
        const user = response.data;
        console.log('\n📊 ตรวจสอบข้อมูล:');
        console.log('- ID:', user.id);
        console.log('- Name:', user.name);
        console.log('- Email:', user.email);
        console.log('- Phone:', user.phone);
        console.log('- Faculty:', user.faculty);
        console.log('- Major:', user.major);
        console.log('- Profile Image:', user.profile_image || 'ไม่มี');
        
        // ทดสอบ API อื่นๆ ที่เกี่ยวข้อง
        console.log('\n2. ทดสอบ API endpoints อื่นๆ...');
        
        // ทดสอบหาก user ID ไม่มีอยู่
        try {
            await axios.get('http://localhost:5000/api/users/999');
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Error handling: ตรวจจับ user ไม่พบได้ถูกต้อง');
            } else {
                console.log('❌ Error handling: ไม่ได้ตรวจจับ error ถูกต้อง');
            }
        }
        
    } catch (error) {
        console.error('❌ Profile API Error:');
        console.error('Message:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        if (error.code) {
            console.error('Code:', error.code);
        }
    }
}

testProfileAPI();
