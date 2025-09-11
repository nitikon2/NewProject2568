const axios = require('axios');

async function testConnection() {
    try {
        console.log('🔍 ทดสอบการเชื่อมต่อ server...');
        
        // ทดสอบ root endpoint
        const response = await axios.get('http://localhost:5000/', {
            timeout: 3000
        });
        console.log('✅ Root endpoint ตอบกลับ:', response.status);
        
    } catch (error) {
        console.log('❌ ไม่สามารถเชื่อมต่อได้:', error.code || error.message);
        
        // ลองเชื่อมต่อ port อื่น
        try {
            console.log('🔄 ลองตรวจสอบ port 5001...');
            const response2 = await axios.get('http://localhost:5001/', { timeout: 1000 });
            console.log('✅ พบ server ที่ port 5001');
        } catch (err2) {
            console.log('❌ ไม่พบ server ที่ port 5001');
        }
    }
}

testConnection();
