// ทดสอบการบันทึกข้อมูลประวัติการทำงานใหม่โดยตรงกับฐานข้อมูล
const db = require('./db');

async function testDirectInsert() {
    try {
        console.log('🔧 ทดสอบการบันทึกข้อมูลประวัติการทำงานโดยตรง...\n');
        
        // ข้อมูลทดสอบ
        const testData = {
            user_id: 3, // ใช้ user ที่มีอยู่
            company_name: 'บริษัท เทคโนโลยี้ ทดสอบ จำกัด',
            position: 'Full Stack Developer',
            job_description: 'พัฒนาเว็บแอปพลิเคชันแบบครบวงจร',
            start_date: '2024-01-15',
            is_current: true,
            salary_range: '45,000-60,000',
            location: 'กรุงเทพฯ',
            team_size: 8,
            skills_used: 'JavaScript, TypeScript, React, Node.js, Express, MySQL, Git',
            technologies_used: 'React.js, Express.js, MySQL, Docker, AWS, Git, VS Code',
            key_achievements: 'พัฒนาระบบ CRM ที่เพิ่มประสิทธิภาพการขายขึ้น 25%, ลดเวลาการประมวลผลข้อมูลลง 40%, นำทีมพัฒนาฟีเจอร์ใหม่ 3 โปรเจค'
        };
        
        // ลบข้อมูลเก่าของ user นี้ก่อน (ถ้ามี)
        await db.execute('DELETE FROM work_history WHERE user_id = ?', [testData.user_id]);
        console.log('🗑️ ลบข้อมูลเก่าแล้ว');
        
        // เพิ่มข้อมูลใหม่
        const [result] = await db.execute(
            `INSERT INTO work_history 
             (user_id, company_name, position, job_description, start_date, is_current, 
              salary_range, location, team_size, skills_used, technologies_used, key_achievements)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                testData.user_id,
                testData.company_name,
                testData.position,
                testData.job_description,
                testData.start_date,
                testData.is_current,
                testData.salary_range,
                testData.location,
                testData.team_size,
                testData.skills_used,
                testData.technologies_used,
                testData.key_achievements
            ]
        );
        
        console.log('✅ เพิ่มข้อมูลใหม่สำเร็จ! ID:', result.insertId);
        
        // ดึงข้อมูลที่เพิ่มมาตรวจสอบ
        const [rows] = await db.execute(
            'SELECT * FROM work_history WHERE id = ?',
            [result.insertId]
        );
        
        if (rows.length > 0) {
            const workData = rows[0];
            console.log('\n📊 ข้อมูลที่บันทึกแล้ว:');
            console.log(`- ID: ${workData.id}`);
            console.log(`- บริษัท: ${workData.company_name}`);
            console.log(`- ตำแหน่ง: ${workData.position}`);
            console.log(`- ขนาดทีม: ${workData.team_size}`);
            console.log(`- ทักษะที่ใช้: ${workData.skills_used}`);
            console.log(`- เทคโนโลยีที่ใช้: ${workData.technologies_used}`);
            console.log(`- ผลงานและความสำเร็จ: ${workData.key_achievements}`);
            
            // ตรวจสอบว่าฟิลด์ใหม่ถูกบันทึกครบหรือไม่
            const missingFields = [];
            if (!workData.team_size) missingFields.push('team_size');
            if (!workData.skills_used) missingFields.push('skills_used');
            if (!workData.technologies_used) missingFields.push('technologies_used');
            if (!workData.key_achievements) missingFields.push('key_achievements');
            
            if (missingFields.length === 0) {
                console.log('\n🎉 ฟิลด์ใหม่ทั้งหมดถูกบันทึกเรียบร้อยแล้ว!');
            } else {
                console.log('\n⚠️ ฟิลด์ที่ไม่ได้ถูกบันทึก:', missingFields.join(', '));
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit();
    }
}

testDirectInsert();
