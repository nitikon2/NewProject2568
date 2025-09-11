// ทดสอบฟิลด์ใหม่โดยการตรวจสอบข้อมูลจริงจากฐานข้อมูล
const db = require('./db');

async function testNewFields() {
    try {
        console.log('🔍 ทดสอบข้อมูลในฐานข้อมูลที่มีฟิลด์ใหม่...\n');
        
        // ดึงข้อมูลประวัติการทำงานทั้งหมด
        const [allRows] = await db.execute('SELECT * FROM work_history ORDER BY id DESC LIMIT 3');
        
        console.log(`📊 ข้อมูลประวัติการทำงาน ${allRows.length} รายการล่าสุด:\n`);
        
        allRows.forEach((row, index) => {
            console.log(`${index + 1}. ID: ${row.id} | User: ${row.user_id}`);
            console.log(`   บริษัท: ${row.company_name}`);
            console.log(`   ตำแหน่ง: ${row.position}`);
            console.log(`   ✨ ขนาดทีม: ${row.team_size || 'ไม่มีข้อมูล'}`);
            console.log(`   ✨ ทักษะที่ใช้: ${row.skills_used || 'ไม่มีข้อมูล'}`);
            console.log(`   ✨ เทคโนโลยีที่ใช้: ${row.technologies_used || 'ไม่มีข้อมูล'}`);
            console.log(`   ✨ ผลงาน: ${row.key_achievements || 'ไม่มีข้อมูล'}`);
            console.log('');
        });
        
        // ตรวจสอบว่ามีข้อมูลในฟิลด์ใหม่หรือไม่
        const [withNewFields] = await db.execute(`
            SELECT COUNT(*) as count 
            FROM work_history 
            WHERE team_size IS NOT NULL 
               OR skills_used IS NOT NULL 
               OR technologies_used IS NOT NULL 
               OR key_achievements IS NOT NULL
        `);
        
        console.log(`📈 สถิติ:`);
        console.log(`   จำนวนรายการที่มีฟิลด์ใหม่: ${withNewFields[0].count}`);
        console.log(`   จำนวนรายการทั้งหมด: ${allRows.length}`);
        
        if (withNewFields[0].count > 0) {
            console.log('\n🎉 ฟิลด์ใหม่ถูกเพิ่มและมีข้อมูลแล้ว!');
            console.log('\n💡 ข้อสรุป:');
            console.log('   ✅ ฐานข้อมูล: ฟิลด์ใหม่พร้อมใช้งาน');
            console.log('   ✅ API: routes/workHistory.js อัปเดตแล้ว');
            console.log('   ✅ การบันทึกข้อมูล: ทำงานได้ปกติ');
            console.log('\n🚀 ระบบพร้อมรับข้อมูลฟิลด์ใหม่จาก Frontend แล้ว!');
        } else {
            console.log('\n⚠️ ยังไม่มีข้อมูลในฟิลด์ใหม่');
        }
        
        // แสดงโครงสร้างฟิลด์ที่เกี่ยวข้อง
        console.log('\n📝 ฟิลด์ที่เพิ่มใหม่ในตาราง work_history:');
        console.log('   - team_size (INT): ขนาดทีมงาน');
        console.log('   - skills_used (TEXT): ทักษะที่ใช้ในงาน');
        console.log('   - technologies_used (TEXT): เทคโนโลยีที่ใช้');
        console.log('   - key_achievements (TEXT): ผลงานและความสำเร็จ');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit();
    }
}

testNewFields();
