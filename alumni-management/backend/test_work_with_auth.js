const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testWorkHistoryWithAuth() {
    try {
        console.log('🔍 ทดสอบ API ประวัติการทำงานพร้อม Authentication...\n');

        // ข้อมูลทดสอบ
        const testWorkData = {
            company_name: 'บริษัท ทดสอบ จำกัด',
            company_type: 'private',
            industry: 'เทคโนโลยีสารสนเทศ',
            company_size: 'medium',
            position: 'Software Developer',
            department: 'IT',
            job_level: 'senior',
            job_description: 'พัฒนาระบบและดูแลเซิร์ฟเวอร์',
            start_date: '2023-01-01',
            end_date: null,
            is_current: true,
            employment_type: 'full_time',
            salary_range: '40,000 - 50,000 บาท',
            location: 'อาคารทดสอบ',
            work_province: 'กรุงเทพมหานคร',
            work_district: 'วัฒนา',
            team_size: '5',
            skills_used: 'JavaScript, React, Node.js',
            technologies_used: 'React, Express.js, MySQL',
            key_achievements: 'พัฒนาระบบใหม่สำเร็จ'
        };

        // ใช้ token ของผู้ใช้ที่มีอยู่แล้ว (ต้องมี user_id = 1 หรือ 2 ในฐานข้อมูล)
        // สร้าง token fake สำหรับทดสอบ (ในการใช้งานจริงต้องได้จากการ login)
        const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjk0NTIwMDAwfQ.test';

        console.log('1️⃣ ทดสอบการเพิ่มประวัติการทำงาน...');
        console.log('📤 ข้อมูลที่ส่ง:', JSON.stringify(testWorkData, null, 2));

        try {
            const addWorkResponse = await axios.post(`${BASE_URL}/work-history`, testWorkData, {
                headers: { 
                    'Authorization': `Bearer ${fakeToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ เพิ่มประวัติการทำงานสำเร็จ');
            console.log('📥 Response:', addWorkResponse.data);
        } catch (error) {
            console.log('❌ การเพิ่มประวัติการทำงานล้มเหลว');
            console.log('📥 Error Response:', error.response?.data);
            console.log('📥 Error Status:', error.response?.status);
            
            if (error.response?.status === 401) {
                console.log('🔐 ปัญหาการยืนยันตัวตน - ต้องใช้ token ที่ถูกต้อง');
            } else if (error.response?.status === 500) {
                console.log('💥 Server Error - ตรวจสอบ backend logs สำหรับรายละเอียด');
            }
        }

        console.log('\n🎉 ทดสอบเสร็จสิ้น!');

    } catch (error) {
        console.log('\n❌ Unexpected Error:', error.message);
    }
}

// รันการทดสอบ
testWorkHistoryWithAuth();
