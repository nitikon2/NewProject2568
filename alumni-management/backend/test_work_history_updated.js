const axios = require('axios');

async function testWorkHistoryAPI() {
    try {
        const baseURL = 'http://localhost:3001';
        
        console.log('🔍 ทดสอบ API ประวัติการทำงานที่อัปเดตแล้ว...\n');
        
        // ทดสอบเพิ่มประวัติการทำงานใหม่พร้อมฟิลด์ที่เพิ่มมา
        const testData = {
            company_name: 'บริษัททดสอบ จำกัด',
            position: 'Senior Developer',
            job_description: 'พัฒนาระบบเว็บแอปพลิเคชัน',
            start_date: '2024-01-15',
            is_current: true,
            salary_range: '50,000-70,000',
            location: 'กรุงเทพฯ',
            team_size: 5,
            skills_used: 'JavaScript, React, Node.js, MySQL',
            technologies_used: 'React.js, Express.js, MySQL, Docker, Git',
            key_achievements: 'พัฒนาระบบที่ลดเวลาการประมวลผลลง 30%, นำทีมพัฒนาฟีเจอร์ใหม่ 5 โปรเจค'
        };
        
        // ต้องมี token สำหรับทดสอบ - ใช้ user ID 3 ที่มีในระบบ
        const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
            email: 'aaa@gmail.com',
            password: 'your_password' // ต้องใส่รหัสผ่านจริง
        });
        
        if (loginResponse.data.success) {
            const token = loginResponse.data.token;
            console.log('✅ เข้าสู่ระบบสำเร็จ');
            
            // ทดสอบเพิ่มประวัติการทำงาน
            const addResponse = await axios.post(`${baseURL}/api/work-history`, testData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('📝 ผลการเพิ่มประวัติการทำงาน:');
            console.log(JSON.stringify(addResponse.data, null, 2));
            
            if (addResponse.data.success) {
                const workHistoryId = addResponse.data.data.id;
                
                // ทดสอบดึงประวัติการทำงานที่เพิ่มมา
                const getResponse = await axios.get(`${baseURL}/api/work-history/${workHistoryId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                console.log('\n📊 ข้อมูลประวัติการทำงานที่เพิ่มมา:');
                console.log(JSON.stringify(getResponse.data, null, 2));
                
                // ตรวจสอบว่าฟิลด์ใหม่ถูกบันทึกหรือไม่
                const workData = getResponse.data.data;
                console.log('\n🔍 ตรวจสอบฟิลด์ที่เพิ่มมา:');
                console.log(`- ขนาดทีม: ${workData.team_size}`);
                console.log(`- ทักษะที่ใช้: ${workData.skills_used}`);
                console.log(`- เทคโนโลยีที่ใช้: ${workData.technologies_used}`);
                console.log(`- ผลงานและความสำเร็จ: ${workData.key_achievements}`);
                
                if (workData.team_size && workData.skills_used && workData.technologies_used && workData.key_achievements) {
                    console.log('\n✅ ฟิลด์ใหม่ถูกบันทึกเรียบร้อยแล้ว!');
                } else {
                    console.log('\n❌ ยังมีฟิลด์ที่ไม่ได้ถูกบันทึก');
                }
            }
            
        } else {
            console.log('❌ ไม่สามารถเข้าสู่ระบบได้ - ต้องตรวจสอบรหัสผ่าน');
        }
        
    } catch (error) {
        if (error.response) {
            console.error('❌ API Error:', error.response.data);
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

console.log('🚀 เริ่มทดสอบ API ประวัติการทำงาน...');
testWorkHistoryAPI();
