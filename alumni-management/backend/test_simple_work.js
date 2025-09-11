const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testWorkHistorySimple() {
    try {
        console.log('🔍 ทดสอบ API ประวัติการทำงานง่ายๆ...\n');

        // ข้อมูลทดสอบ
        const testWorkData = {
            company_name: 'บริษัท เทคโนโลยี่ ABC จำกัด',
            company_type: 'private',
            industry: 'เทคโนโลยีสารสนเทศ',
            company_size: 'medium',
            position: 'Senior Software Developer',
            department: 'IT Development',
            job_level: 'senior',
            job_description: 'พัฒนาแอปพลิเคชันเว็บและมือถือ ออกแบบระบบฐานข้อมูล จัดการทีมพัฒนา',
            start_date: '2023-01-15',
            end_date: null,
            is_current: true,
            employment_type: 'full_time',
            salary_range: '50,000 - 70,000 บาท',
            location: 'สาทร ซิตี้ ทาวเวอร์',
            work_province: 'กรุงเทพมหานคร',
            work_district: 'สาทร',
            team_size: '8',
            skills_used: 'JavaScript, React, Node.js, MySQL, Git, การจัดการทีม',
            technologies_used: 'React, Express.js, MySQL, Docker, AWS, VS Code',
            key_achievements: 'พัฒนาระบบใหม่ที่เพิ่มประสิทธิภาพ 40%, ลดเวลาประมวลผล 60%, นำทีมสำเร็จ 5 โปรเจค'
        };

        // สร้าง fake token สำหรับทดสอบ
        console.log('1️⃣ ทดสอบการเพิ่มประวัติการทำงาน (โดยไม่ใช้ authentication)...');
        
        // ทดสอบโดยตรงกับ work-history API
        try {
            const addWorkResponse = await axios.post(`${BASE_URL}/work-history`, testWorkData);
            console.log('✅ เพิ่มประวัติการทำงานสำเร็จ');
            console.log('Response:', addWorkResponse.data);
        } catch (error) {
            console.log('❌ การเพิ่มประวัติการทำงานล้มเหลว:', error.response?.data || error.message);
        }

        // ทดสอบการดึงข้อมูล
        console.log('\n2️⃣ ทดสอบการดึงข้อมูลประวัติการทำงาน...');
        try {
            const getWorkResponse = await axios.get(`${BASE_URL}/work-history`);
            console.log('✅ ดึงข้อมูลสำเร็จ');
            console.log('Response:', getWorkResponse.data);
        } catch (error) {
            console.log('❌ การดึงข้อมูลล้มเหลว:', error.response?.data || error.message);
        }

        console.log('\n🎉 ทดสอบเสร็จสิ้น!');

    } catch (error) {
        console.log('\n❌ Error:', error.response?.data?.message || error.message);
        if (error.response?.data) {
            console.log('Response data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// รันการทดสอบ
testWorkHistorySimple();
