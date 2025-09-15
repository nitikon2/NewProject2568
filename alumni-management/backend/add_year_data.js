const db = require('./db');

async function addMoreYearData() {
    try {
        console.log('=== เพิ่มข้อมูลปีที่จบที่หลากหลาย ===');
        
        // อัพเดตข้อมูลให้มีปีที่จบที่หลากหลายมากขึ้น
        await db.query(`
            UPDATE users 
            SET graduation_year = CASE 
                WHEN id = 6 THEN 2020
                WHEN id = 11 THEN 2021  
                WHEN id = 12 THEN 2022
                WHEN id = 7 THEN 2019
                WHEN id = 8 THEN 2018
                ELSE graduation_year
            END
            WHERE role = 'user'
        `);
        
        console.log('อัพเดตข้อมูลเสร็จแล้ว');
        
        // ตรวจสอบข้อมูลใหม่
        const [yearStats] = await db.query(`
            SELECT graduation_year, COUNT(*) as count
            FROM users 
            WHERE role = 'user'
            GROUP BY graduation_year
            ORDER BY graduation_year DESC
        `);
        
        console.log('\n=== ข้อมูลปีที่จบทั้งหมด ===');
        yearStats.forEach(stat => {
            console.log(`ปี ${stat.graduation_year}: ${stat.count} คน`);
        });

        // แสดงรายชื่อศิษย์เก่าทั้งหมด
        const [users] = await db.query(`
            SELECT id, name, graduation_year, faculty
            FROM users 
            WHERE role = 'user' 
            ORDER BY graduation_year DESC, name
        `);
        
        console.log('\n=== รายชื่อศิษย์เก่าทั้งหมด ===');
        users.forEach(user => {
            console.log(`${user.name} (ปี ${user.graduation_year}) - ${user.faculty}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

addMoreYearData();