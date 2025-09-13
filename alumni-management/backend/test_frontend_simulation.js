const axios = require('axios');

async function testFrontendAlumniAPI() {
    try {
        console.log('🔍 ทดสอบการเรียกใช้ API เหมือนที่ frontend ทำ...');
        
        // Step 1: ทดสอบ login admin เพื่อรับ token
        console.log('\n📝 Step 1: Login Admin');
        const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
            email: 'admin@rmu.ac.th',
            password: 'admin123'
        });
        
        console.log('✅ Login สำเร็จ');
        const token = loginResponse.data.token;
        
        // Step 2: เรียก /api/admin/alumni ด้วย token
        console.log('\n🎓 Step 2: เรียก API admin/alumni');
        console.log('URL: http://localhost:5000/api/admin/alumni');
        console.log('Headers: Authorization: Bearer [token]');
        
        const alumniResponse = await axios.get('http://localhost:5000/api/admin/alumni', {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ API Response Status:', alumniResponse.status);
        console.log('Response Data Type:', typeof alumniResponse.data);
        console.log('Is Array:', Array.isArray(alumniResponse.data));
        
        if (alumniResponse.data) {
            if (alumniResponse.data.alumni) {
                console.log('Alumni Count:', alumniResponse.data.alumni.length);
                console.log('Structure: { status, alumni }');
                if (alumniResponse.data.alumni.length > 0) {
                    console.log('First Alumni Sample:', {
                        id: alumniResponse.data.alumni[0].id,
                        name: alumniResponse.data.alumni[0].name,
                        student_id: alumniResponse.data.alumni[0].student_id,
                        email: alumniResponse.data.alumni[0].email
                    });
                }
            } else if (Array.isArray(alumniResponse.data)) {
                console.log('Alumni Count:', alumniResponse.data.length);
                console.log('Structure: Array ตรงๆ');
                if (alumniResponse.data.length > 0) {
                    console.log('First Alumni Sample:', {
                        id: alumniResponse.data[0].id,
                        name: alumniResponse.data[0].name,
                        student_id: alumniResponse.data[0].student_id,
                        email: alumniResponse.data[0].email
                    });
                }
            } else {
                console.log('Response data:', alumniResponse.data);
            }
        }
        
        console.log('\n✅ ทดสอบสำเร็จ - API ทำงานปกติ');
        
    } catch (error) {
        console.error('\n❌ Error ในการทดสอบ:');
        console.error('Message:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
        }
        if (error.request) {
            console.error('Request:', error.request);
        }
    }
}

// เรียกใช้ทันที
testFrontendAlumniAPI();