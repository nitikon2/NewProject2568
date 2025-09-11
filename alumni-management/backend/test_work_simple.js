const axios = require('axios');

async function testWorkHistoryAPI() {
    try {
        const baseURL = 'http://localhost:5000';
        
        console.log('🔍 ทดสอบ API ประวัติการทำงานโดยไม่ต้อง login...\n');
        
        // ทดสอบดึงข้อมูลประวัติการทำงานของ user ID 3 (ข้อมูลสาธารณะ)
        const getResponse = await axios.get(`${baseURL}/api/work-history/user/3`);
        
        console.log('📊 ข้อมูลประวัติการทำงานปัจจุบันของ User ID 3:');
        console.log(JSON.stringify(getResponse.data, null, 2));
        
        if (getResponse.data.success && getResponse.data.data.length > 0) {
            const workData = getResponse.data.data[0];
            console.log('\n🔍 ตรวจสอบฟิลด์ในข้อมูลปัจจุบัน:');
            console.log(`- ID: ${workData.id || 'ไม่มี'}`);
            console.log(`- บริษัท: ${workData.company_name || 'ไม่มี'}`);
            console.log(`- ตำแหน่ง: ${workData.position || 'ไม่มี'}`);
            console.log(`- ขนาดทีม: ${workData.team_size || 'ไม่มี'}`);
            console.log(`- ทักษะที่ใช้: ${workData.skills_used || 'ไม่มี'}`);
            console.log(`- เทคโนโลยีที่ใช้: ${workData.technologies_used || 'ไม่มี'}`);
            console.log(`- ผลงานและความสำเร็จ: ${workData.key_achievements || 'ไม่มี'}`);
        } else {
            console.log('ไม่มีข้อมูลประวัติการทำงาน');
        }
        
    } catch (error) {
        if (error.response) {
            console.error('❌ API Error:', error.response.status, error.response.data);
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

console.log('🚀 เริ่มทดสอบ API ประวัติการทำงาน...');
testWorkHistoryAPI();
