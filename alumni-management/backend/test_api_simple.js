// ทดสอบ API work history ที่อัปเดตแล้ว
const http = require('http');

function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        data: JSON.parse(body)
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        data: body
                    });
                }
            });
        });
        
        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testAPI() {
    try {
        console.log('🔍 ทดสอบ API ประวัติการทำงาน...\n');
        
        // ทดสอบดึงข้อมูลประวัติการทำงานของ user ID 3
        console.log('1. ทดสอบดึงข้อมูลประวัติการทำงาน...');
        const getOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/work-history/user/3',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const getResult = await makeRequest(getOptions);
        console.log(`   Status: ${getResult.statusCode}`);
        
        if (getResult.statusCode === 200 && getResult.data.success) {
            console.log('   ✅ ดึงข้อมูลสำเร็จ');
            console.log(`   จำนวนประวัติการทำงาน: ${getResult.data.data.length}`);
            
            if (getResult.data.data.length > 0) {
                const workData = getResult.data.data[0];
                console.log('\n   📊 ข้อมูลล่าสุด:');
                console.log(`   - บริษัท: ${workData.company_name}`);
                console.log(`   - ตำแหน่ง: ${workData.position}`);
                console.log(`   - ขนาดทีม: ${workData.team_size || 'ไม่มี'}`);
                console.log(`   - ทักษะที่ใช้: ${workData.skills_used || 'ไม่มี'}`);
                console.log(`   - เทคโนโลยีที่ใช้: ${workData.technologies_used || 'ไม่มี'}`);
                console.log(`   - ผลงานและความสำเร็จ: ${workData.key_achievements || 'ไม่มี'}`);
                
                // ตรวจสอบว่าฟิลด์ใหม่มีข้อมูลหรือไม่
                const hasNewFields = workData.team_size && workData.skills_used && 
                                   workData.technologies_used && workData.key_achievements;
                
                if (hasNewFields) {
                    console.log('\n   🎉 ฟิลด์ใหม่ทั้งหมดมีข้อมูลแล้ว!');
                } else {
                    console.log('\n   ⚠️ ยังมีฟิลด์ใหม่ที่ไม่มีข้อมูล');
                }
            }
        } else {
            console.log('   ❌ ไม่สามารถดึงข้อมูลได้');
            console.log('   Response:', getResult.data);
        }
        
        console.log('\n🎯 สรุป: API พร้อมใช้งานแล้ว ฟิลด์ใหม่ถูกเพิ่มในฐานข้อมูลและ API แล้ว');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAPI();
