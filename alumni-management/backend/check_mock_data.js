const mysql = require('mysql2/promise');

async function checkData() {
    const connection = await mysql.createConnection({
        host: 'localhost', 
        user: 'root', 
        password: '', 
        database: 'alumni_db'
    });
    
    console.log('=== ข้อมูลผู้ใช้ที่เพิ่มใหม่ ===');
    const [users] = await connection.execute(
        'SELECT id, name, email, faculty, major, graduation_year FROM users WHERE role = "user" ORDER BY id DESC LIMIT 15'
    );
    users.forEach(user => {
        console.log(`${user.id}: ${user.name} | ${user.email} | ${user.faculty} | ปี ${user.graduation_year}`);
    });
    
    console.log('\n=== สรุปประวัติการทำงาน ===');
    const [workStats] = await connection.execute('SELECT COUNT(*) as total FROM work_history');
    console.log(`จำนวนประวัติการทำงานทั้งหมด: ${workStats[0].total} รายการ`);
    
    const [workDetails] = await connection.execute(`
        SELECT u.name, wh.company_name, wh.position, wh.is_current 
        FROM work_history wh 
        JOIN users u ON wh.user_id = u.id 
        WHERE u.role = 'user' 
        ORDER BY u.id DESC
    `);
    workDetails.forEach(work => {
        console.log(`${work.name}: ${work.position} ที่ ${work.company_name} ${work.is_current ? '(ปัจจุบัน)' : ''}`);
    });
    
    console.log('\n=== สถิติตามคณะ ===');
    const [facultyStats] = await connection.execute(`
        SELECT faculty, COUNT(*) as count 
        FROM users 
        WHERE role = 'user' 
        GROUP BY faculty 
        ORDER BY count DESC
    `);
    facultyStats.forEach(stat => {
        console.log(`${stat.faculty}: ${stat.count} คน`);
    });
    
    await connection.end();
}

checkData().catch(console.error);