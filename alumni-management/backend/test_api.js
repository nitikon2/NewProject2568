const axios = require('axios');

// ทดสอบ API ง่ายๆ
async function testAPI() {
    try {
        console.log('🔍 ทดสอบ API Server...');
        
        // ทดสอบ GET request ก่อน
        const response = await axios.get('http://localhost:5000/api/users/search?name=admin');
        console.log('✅ GET Request สำเร็จ!');
        console.log('📄 Response:', response.data);
        
    } catch (error) {
        console.log('❌ API Test ล้มเหลว:');
        
        if (error.code === 'ECONNREFUSED') {
            console.log('🚫 ไม่สามารถเชื่อมต่อ server ได้ - Server อาจจะไม่ทำงาน');
        } else if (error.response) {
            console.log('📝 Status:', error.response.status);
            console.log('💬 Message:', error.response.data);
        } else {
            console.log('⚠️ Error:', error.message);
        }
    }
}

testAPI();
