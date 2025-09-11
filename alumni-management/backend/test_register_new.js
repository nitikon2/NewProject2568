const axios = require('axios');

// ข้อมูลทดสอบ
const testData = {
    title: 'นาย',
    name: 'ทดสอบ ระบบ',
    password: '123456',
    student_id: '63001',
    email: 'test@test.com',
    phone: '0812345679',
    graduation_year: 2566,
    faculty: 'คณะเทคโนโลยีสารสนเทศ',
    major: 'เทคโนโลยีสารสนเทศ',
    occupation: 'นักพัฒนาระบบ',
    position: 'โปรแกรมเมอร์',
    workplace: 'บริษัท IT',
    salary: '30000',
    address: '123 หมู่ 1',
    province: 'มหาสารคาม',
    district: 'เมืองมหาสารคาม',
    subdistrict: 'ตลาด',
    zipcode: '44000'
};

async function testRegister() {
    try {
        console.log('🔄 กำลังทดสอบการลงทะเบียน...');
        console.log('📋 ข้อมูลที่ส่ง:', JSON.stringify(testData, null, 2));
        
        const response = await axios.post('http://localhost:5000/api/users/register', testData);
        
        console.log('✅ ลงทะเบียนสำเร็จ!');
        console.log('📝 Response:', response.data);
        
    } catch (error) {
        console.log('❌ เกิดข้อผิดพลาด:');
        
        if (error.response) {
            // Server ตอบกลับมาแต่มี error
            console.log('🔍 Status:', error.response.status);
            console.log('💬 Message:', error.response.data.message);
            console.log('📄 Full Response:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            // ส่ง request ไปแล้วแต่ไม่ได้รับ response
            console.log('🚫 ไม่ได้รับ response จาก server');
            console.log('🔗 Request details:', error.request);
        } else {
            // อื่นๆ
            console.log('⚠️ Error:', error.message);
        }
    }
}

// รันการทดสอบ
testRegister();
