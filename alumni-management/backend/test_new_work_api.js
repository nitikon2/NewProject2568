const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testWorkHistoryAPI() {
    try {
        console.log('🔍 ทดสอบ API ประวัติการทำงานฟิลด์ใหม่...\n');

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

        // ขั้นตอน 1: สร้างผู้ใช้ทดสอบและเข้าสู่ระบบ
        console.log('1️⃣ ลงทะเบียนผู้ใช้ทดสอบ...');
        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
            student_id: 'TEST001',
            name: 'Test User',
            email: 'testwork@example.com',
            password: 'password123'
        });

        if (registerResponse.data.success) {
            console.log('✅ ลงทะเบียนสำเร็จ');
        }

        console.log('\n2️⃣ เข้าสู่ระบบ...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'testwork@example.com',
            password: 'password123'
        });

        if (!loginResponse.data.success) {
            throw new Error('Login failed');
        }

        const token = loginResponse.data.token;
        console.log('✅ เข้าสู่ระบบสำเร็จ');

        // ขั้นตอน 2: เพิ่มประวัติการทำงาน
        console.log('\n3️⃣ เพิ่มประวัติการทำงานใหม่...');
        const addWorkResponse = await axios.post(`${BASE_URL}/work-history`, testWorkData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (addWorkResponse.data.success) {
            console.log('✅ เพิ่มประวัติการทำงานสำเร็จ');
            console.log('   ID:', addWorkResponse.data.data.id);
        } else {
            console.log('❌ เพิ่มประวัติการทำงานไม่สำเร็จ:', addWorkResponse.data.message);
        }

        // ขั้นตอน 3: ดึงข้อมูลประวัติการทำงาน
        console.log('\n4️⃣ ดึงข้อมูลประวัติการทำงาน...');
        const getWorkResponse = await axios.get(`${BASE_URL}/work-history`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (getWorkResponse.data.success) {
            console.log('✅ ดึงข้อมูลสำเร็จ');
            console.log('   จำนวนรายการ:', getWorkResponse.data.data.length);
            
            if (getWorkResponse.data.data.length > 0) {
                const work = getWorkResponse.data.data[0];
                console.log('   รายการแรก:');
                console.log('     - บริษัท:', work.company_name);
                console.log('     - ตำแหน่ง:', work.position);
                console.log('     - ประเภทบริษัท:', work.company_type);
                console.log('     - อุตสาหกรรม:', work.industry);
                console.log('     - แผนก:', work.department);
                console.log('     - ระดับงาน:', work.job_level);
                console.log('     - ประเภทการจ้าง:', work.employment_type);
                console.log('     - จังหวัด:', work.work_province);
                console.log('     - อำเภอ:', work.work_district);
                console.log('     - ทักษะ:', work.skills_used);
                console.log('     - เทคโนโลยี:', work.technologies_used);
                console.log('     - ผลงาน:', work.key_achievements);
            }
        } else {
            console.log('❌ ดึงข้อมูลไม่สำเร็จ:', getWorkResponse.data.message);
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
testWorkHistoryAPI();
