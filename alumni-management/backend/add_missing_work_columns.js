const db = require('./db');

async function addMissingColumns() {
    try {
        console.log('🔧 เพิ่มฟิลด์ที่ขาดหายไปในตาราง work_history...');
        
        // ตรวจสอบฟิลด์ที่มีอยู่
        const [columns] = await db.execute('DESCRIBE work_history');
        const existingColumns = columns.map(col => col.Field);
        
        // เพิ่มฟิลด์ team_size ถ้ายังไม่มี
        if (!existingColumns.includes('team_size')) {
            await db.execute('ALTER TABLE work_history ADD COLUMN team_size INT DEFAULT NULL COMMENT "ขนาดทีมงาน"');
            console.log('✅ เพิ่มฟิลด์ team_size สำเร็จ');
        } else {
            console.log('ℹ️ ฟิลด์ team_size มีอยู่แล้ว');
        }
        
        // เพิ่มฟิลด์ technologies_used ถ้ายังไม่มี
        if (!existingColumns.includes('technologies_used')) {
            await db.execute('ALTER TABLE work_history ADD COLUMN technologies_used TEXT DEFAULT NULL COMMENT "เทคโนโลยีที่ใช้ในงาน"');
            console.log('✅ เพิ่มฟิลด์ technologies_used สำเร็จ');
        } else {
            console.log('ℹ️ ฟิลด์ technologies_used มีอยู่แล้ว');
        }
        
        // แสดงโครงสร้างตารางใหม่
        const [newColumns] = await db.execute('DESCRIBE work_history');
        console.log('\n🏗️ โครงสร้างตาราง work_history ใหม่:');
        newColumns.forEach(row => {
            if (['team_size', 'technologies_used', 'key_achievements', 'skills_used'].includes(row.Field)) {
                console.log(`✨ ${row.Field} (${row.Type}) - ฟิลด์สำหรับข้อมูลที่ต้องการ`);
            }
        });
        
        console.log('\n🎉 อัปเดตฐานข้อมูลเรียบร้อยแล้ว!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit();
    }
}

addMissingColumns();
