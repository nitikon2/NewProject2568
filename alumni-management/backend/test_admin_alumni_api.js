const axios = require('axios');

async function testAdminAlumniAPI() {
    try {
        console.log('🔍 ทดสอบ API: GET /api/admin/alumni (ต้องใช้ token admin)');
        
        // ลองเรียกแบบไม่มี token ก่อน
        try {
            const response1 = await axios.get('http://localhost:5000/api/admin/alumni');
            console.log('❌ ไม่ควรเข้าได้เมื่อไม่มี token');
        } catch (err) {
            console.log('✅ ถูกต้อง - ปฏิเสธเมื่อไม่มี token:', err.response?.status, err.response?.data?.message);
        }

        // ลองเรียกด้วย token ที่ไม่ถูกต้อง
        try {
            const response2 = await axios.get('http://localhost:5000/api/admin/alumni', {
                headers: { 'Authorization': 'Bearer invalid-token' }
            });
            console.log('❌ ไม่ควรเข้าได้เมื่อใช้ token ผิด');
        } catch (err) {
            console.log('✅ ถูกต้อง - ปฏิเสธเมื่อใช้ token ผิด:', err.response?.status, err.response?.data?.message);
        }

        // ทดสอบ login เพื่อหา token ที่ถูกต้อง
        console.log('\n🔐 ทดสอบ login admin...');
        const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
            email: 'admin@rmu.ac.th',
            password: 'admin123'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login สำเร็จ, ได้ token:', token.substring(0, 50) + '...');

        // ทดสอบเรียก admin API ด้วย token ที่ถูกต้อง
        console.log('\n🎓 ทดสอบเรียก admin/alumni ด้วย token ที่ถูกต้อง...');
        const response = await axios.get('http://localhost:5000/api/admin/alumni', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Status:', response.status);
        console.log('Data type:', typeof response.data);
        console.log('Is Array:', Array.isArray(response.data));
        
        if (response.data && response.data.alumni) {
            console.log('Alumni count:', response.data.alumni.length);
            console.log('First alumni:', JSON.stringify(response.data.alumni[0], null, 2));
        } else if (Array.isArray(response.data)) {
            console.log('Alumni count:', response.data.length);
            console.log('First alumni:', JSON.stringify(response.data[0], null, 2));
        } else {
            console.log('Response data:', JSON.stringify(response.data, null, 2));
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testAdminAlumniAPI();