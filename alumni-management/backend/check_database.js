const db = require('./db');

async function checkDatabase() {
    try {
        console.log('🔍 ตรวจสอบการเชื่อมต่อ database...');
        
        // Test connection
        await db.query('SELECT 1');
        console.log('✅ เชื่อมต่อ database สำเร็จ');
        
        // Check users table
        console.log('\n📊 ตรวจสอบตาราง users:');
        const [users] = await db.query('SELECT COUNT(*) as count FROM users');
        console.log('จำนวน users ทั้งหมด:', users[0].count);
        
        // Check users by role
        console.log('\n📊 ตรวจสอบ users แยกตาม role:');
        const [roles] = await db.query('SELECT role, COUNT(*) as count FROM users GROUP BY role');
        roles.forEach(r => console.log(`Role ${r.role}: ${r.count} คน`));
        
        // Check table structure  
        console.log('\n🏗️ ตรวจสอบโครงสร้างตาราง users:');
        const [columns] = await db.query('DESCRIBE users');
        columns.forEach(col => console.log(`${col.Field} (${col.Type})`));
        
        // Test alumni query
        console.log('\n🎓 ทดสอบ query ศิษย์เก่า:');
        const [alumni] = await db.query(`
            SELECT 
                id, title, name, student_id, graduation_year, faculty, major, 
                occupation, position, workplace, salary, email, phone, created_at
            FROM users
            WHERE role = 'user'
            ORDER BY graduation_year DESC, created_at DESC
        `);
        console.log('จำนวนศิษย์เก่า:', alumni.length);
        
        if (alumni.length > 0) {
            console.log('ตัวอย่างศิษย์เก่าคนแรก:', JSON.stringify(alumni[0], null, 2));
        }
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

checkDatabase();
