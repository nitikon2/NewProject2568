const axios = require('axios');

async function testPort3001() {
    try {
        console.log('🔍 ทดสอบการเชื่อมต่อ port 3001...');
        
        const response = await axios.get('http://localhost:3001/', {
            timeout: 3000
        });
        console.log('✅ Server ตอบกลับ:', response.data);
        
        // ทดสอบ register endpoint
        console.log('🔄 ทดสอบ register endpoint...');
        const regResponse = await axios.post('http://localhost:3001/api/users/register', {
            title: 'นาย',
            name: 'ทดสอบ ระบบ',
            email: 'test@test.com'
        });
        console.log('✅ Register endpoint ตอบกลับ:', regResponse.data);
        
    } catch (error) {
        console.log('❌ Error:', error.code || error.message);
    }
}

testPort3001();
