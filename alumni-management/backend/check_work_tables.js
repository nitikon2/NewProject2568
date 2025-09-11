const db = require('./db');

async function checkWorkTables() {
    try {
        // ตรวจสอบตารางที่เกี่ยวข้องกับ work
        const [tables] = await db.execute('SHOW TABLES LIKE "work_%"');
        console.log('🗂️ ตารางที่เกี่ยวข้องกับ work:');
        tables.forEach(row => console.log(Object.values(row)[0]));
        
        // ตรวจสอบว่ามีตาราง work_projects หรือไม่
        const projectTable = tables.find(row => Object.values(row)[0] === 'work_projects');
        if (projectTable) {
            const [projects] = await db.execute('DESCRIBE work_projects');
            console.log('\n🏗️ โครงสร้างตาราง work_projects:');
            projects.forEach(row => console.log(row.Field + ' (' + row.Type + ')'));
        } else {
            console.log('\n❌ ไม่พบตาราง work_projects');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit();
    }
}

checkWorkTables();
