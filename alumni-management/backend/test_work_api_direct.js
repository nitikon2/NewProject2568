const axios = require('axios');

async function testWorkHistoryAPI() {
    try {
        console.log('🔍 ทดสอบ Work History API...\n');

        // ข้อมูลทดสอบ
        const testData = {
            company_name: 'บริษัททดสอบ',
            company_type: 'private',
            industry: 'IT',
            company_size: 'medium',
            position: 'Developer',
            department: 'IT',
            job_level: 'junior',
            job_description: 'ทดสอบ',
            start_date: '2024-01-01',
            end_date: null,
            is_current: true,
            employment_type: 'full_time',
            salary_range: '30000-40000',
            location: 'กรุงเทพ',
            work_province: 'กรุงเทพมหานคร',
            work_district: 'วัฒนา',
            team_size: 5,
            skills_used: 'JavaScript',
            technologies_used: 'React',
            key_achievements: 'ทดสอบ'
        };

        // ใช้ token จากการ login จริง (ต้องมี user_id = 2 ในฐานข้อมูล)
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJuaXRpa29uMDQ2OUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsIm5hbWUiOiLguJnguLTguJjguLTguIHguKMg4Lit4Li44LiU4Liy4LiB4Liy4LijIiwidGl0bGUiOiLguJnguLLguIciLCJmYWN1bHR5Ijoi4LiE4LiT4Liw4Lin4Li04LiX4Lii4Liy4LiB4Liy4Lij4LiI4Lix4LiU4LiB4Liy4LijIiwic3R1ZGVudF9pZCI6IjEyMzEyMzEyMzEyMyIsImlhdCI6MTc1NzU5MTU4MSwiZXhwIjoxNzU3Njc3OTgxfQ.KvmA7qvwvmD7YdbBn63RAA6LKEQwAybgWEvK4VwIHk4';

        console.log('📤 กำลังส่งข้อมูล:');
        console.log(JSON.stringify(testData, null, 2));

        const response = await axios.post('http://localhost:5000/api/work-history', testData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('\n✅ สำเร็จ!');
        console.log('📥 Response:', response.data);

    } catch (error) {
        console.log('\n❌ เกิดข้อผิดพลาด:');
        
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
            console.log('Headers:', error.response.headers);
        } else if (error.request) {
            console.log('Request error:', error.request);
        } else {
            console.log('Error:', error.message);
        }
    }
}

testWorkHistoryAPI();
