const axios = require('axios');

async function testAlumniAPI() {
    try {
        console.log('🔍 ทดสอบ API: GET /api/alumni');
        
        const response = await axios.get('http://localhost:5000/api/alumni');
        
        console.log('✅ Status:', response.status);
        console.log('✅ Status Text:', response.statusText);
        console.log('Type:', typeof response.data);
        console.log('Is Array:', Array.isArray(response.data));
        
        if (Array.isArray(response.data)) {
            console.log('Length:', response.data.length);
            if (response.data.length > 0) {
                console.log('✅ First item:', JSON.stringify(response.data[0], null, 2));
            } else {
                console.log('❌ Array ว่าง - ไม่มีข้อมูลศิษย์เก่า');
                console.log('📝 สาเหตุที่เป็นไปได้:');
                console.log('   1. ไม่มีข้อมูลใน database');
                console.log('   2. ไม่มี users ที่มี role = "user"');
                console.log('   3. Database connection ยังไม่ได้ถูกสร้าง');
            }
        } else {
            console.log('Data:', JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testAlumniAPI();
