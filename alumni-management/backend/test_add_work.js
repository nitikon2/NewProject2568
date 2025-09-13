const axios = require('axios');

async function testAddWorkHistory() {
    try {
        console.log('🧪 Testing add work history with address data...');
        
        const testData = {
            company_name: 'บริษัททดสอบ จำกัด',
            position: 'นักพัฒนาซอฟต์แวร์',
            job_description: 'พัฒนาระบบเว็บแอปพลิเคชัน',
            start_date: '2024-01-01',
            end_date: '2024-12-31', 
            is_current: false,
            salary_range: '30,000-40,000 บาท',
            location: 'อาคารทดสอบ ชั้น 5',
            work_province: 'ตาก',
            work_district: 'พบพระ',
            work_subdistrict: 'ช่องแคบ',
            work_zipcode: '63160',
            skills_used: 'JavaScript, React, Node.js',
            technologies_used: 'React, MySQL, AWS',
            key_achievements: 'พัฒนาระบบสำเร็จ 100%',
            team_size: '5-10 คน'
        };
        
        console.log('📤 Sending data:', JSON.stringify(testData, null, 2));
        
        // ต้องใส่ token ที่ valid 
        const response = await axios.post('http://localhost:5000/api/work-history', testData, {
            headers: { 
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlhdCI6MTczNjc1OTE1OCwiZXhwIjoxNzM2ODQ1NTU4fQ.TFMQLt6q4KbGmFqP4c1ue9cKBkPMnmyqngtG7JLG2ds',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Response:', response.data);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testAddWorkHistory();