// ทดสอบ API การเพิ่มประวัติการทำงานพร้อมที่อยู่
const axios = require('axios');

async function testWorkHistoryAPI() {
    const baseURL = 'http://localhost:5000/api';
    
    // ข้อมูลทดสอบ
    const testData = {
        company_name: 'บริษัท เทสต์ จำกัด',
        company_type: 'private',
        industry: 'เทคโนโลยี',
        company_size: 'medium',
        position: 'นักพัฒนาเว็บไซต์',
        department: 'IT',
        job_level: 'senior',
        job_description: 'พัฒนาเว็บไซต์และระบบฐานข้อมูล',
        start_date: '2023-01-01',
        end_date: null,
        is_current: true,
        employment_type: 'full_time',
        salary_range: '30,000 - 40,000 บาท',
        location: 'อาคารเทส ชั้น 10',
        work_province: 'กรุงเทพมหานคร',
        work_district: 'วัฒนา',
        work_subdistrict: 'ลุมพินี',
        work_zipcode: '10330',
        skills_used: 'JavaScript, React, Node.js, MySQL',
        technologies_used: 'React, Express, MySQL, Git',
        key_achievements: 'พัฒนาระบบจัดการลูกค้าใหม่',
        team_size: '5'
    };

    try {
        console.log('🧪 ทดสอบ API เพิ่มประวัติการทำงานพร้อมที่อยู่...\n');

        // สำหรับการทดสอบ ให้ใช้ token ของ admin (หรือ user ที่มีอยู่แล้ว)
        const loginResponse = await axios.post(`${baseURL}/auth/login`, {
            email: 'admin@rmu.ac.th',
            password: 'admin123456'
        });

        const token = loginResponse.data.token;
        console.log('✅ เข้าสู่ระบบสำเร็จ');

        // ทดสอบเพิ่มประวัติการทำงาน
        const response = await axios.post(`${baseURL}/work-history`, testData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ เพิ่มประวัติการทำงานสำเร็จ');
        console.log('📋 Response:', response.data);

        const workHistoryId = response.data.data.id;

        // ทดสอบดึงข้อมูลประวัติการทำงาน
        const getResponse = await axios.get(`${baseURL}/work-history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('\n✅ ดึงข้อมูลประวัติการทำงานสำเร็จ');
        const addedWork = getResponse.data.data.find(work => work.id === workHistoryId);
        
        if (addedWork) {
            console.log('📄 ข้อมูลที่อยู่ที่บันทึก:');
            console.log(`  จังหวัด: ${addedWork.work_province}`);
            console.log(`  อำเภอ: ${addedWork.work_district}`);
            console.log(`  ตำบล: ${addedWork.work_subdistrict}`);
            console.log(`  รหัสไปรษณีย์: ${addedWork.work_zipcode}`);
        }

        // ทดสอบอัปเดตข้อมูล
        const updateData = {
            ...testData,
            work_subdistrict: 'สีลม',
            work_zipcode: '10500'
        };

        const updateResponse = await axios.put(`${baseURL}/work-history/${workHistoryId}`, updateData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('\n✅ อัปเดตประวัติการทำงานสำเร็จ');
        console.log('📋 Update Response:', updateResponse.data);

        // ตรวจสอบข้อมูลหลังอัปเดต
        const getUpdatedResponse = await axios.get(`${baseURL}/work-history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const updatedWork = getUpdatedResponse.data.data.find(work => work.id === workHistoryId);
        
        if (updatedWork) {
            console.log('\n📄 ข้อมูลที่อยู่หลังอัปเดต:');
            console.log(`  จังหวัด: ${updatedWork.work_province}`);
            console.log(`  อำเภอ: ${updatedWork.work_district}`);
            console.log(`  ตำบล: ${updatedWork.work_subdistrict}`);
            console.log(`  รหัสไปรษณีย์: ${updatedWork.work_zipcode}`);
        }

        // ลบข้อมูลทดสอบ
        await axios.delete(`${baseURL}/work-history/${workHistoryId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('\n🗑️ ลบข้อมูลทดสอบแล้ว');
        console.log('\n🎉 การทดสอบ API เสร็จสิ้น - ระบบทำงานปกติ!');

    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาด:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            console.error('🔐 ปัญหาการยืนยันตัวตน - ตรวจสอบ token');
        } else if (error.response?.status === 400) {
            console.error('📝 ข้อมูลไม่ถูกต้อง:', error.response.data);
        } else if (error.response?.status === 500) {
            console.error('🖥️ ข้อผิดพลาดเซิร์ฟเวอร์');
        }
    }
}

// รันการทดสอบ
if (require.main === module) {
    testWorkHistoryAPI();
}

module.exports = testWorkHistoryAPI;