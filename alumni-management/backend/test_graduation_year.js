const db = require('./db');

async function testGraduationYear() {
    try {
        // ตรวจสอบข้อมูลปีที่จบในฐานข้อมูล
        const [users] = await db.query(`
            SELECT id, name, graduation_year, faculty, major 
            FROM users 
            WHERE role = 'user' 
            ORDER BY graduation_year DESC
            LIMIT 10
        `);
        
        console.log('=== ข้อมูลศิษย์เก่าปัจจุบัน ===');
        console.log('จำนวนข้อมูล:', users.length);
        users.forEach(user => {
            console.log(`ID: ${user.id}, ชื่อ: ${user.name}, ปีที่จบ: ${user.graduation_year}, คณะ: ${user.faculty}`);
        });

        // ตรวจสอบว่ามีข้อมูลที่ graduation_year เป็น null หรือไม่
        const [nullGraduation] = await db.query(`
            SELECT COUNT(*) as count
            FROM users 
            WHERE role = 'user' AND graduation_year IS NULL
        `);
        
        console.log('\n=== สถิติข้อมูลปีที่จบ ===');
        console.log('จำนวนข้อมูลที่ไม่มีปีที่จบ:', nullGraduation[0].count);

        // แสดงปีที่จบที่มีอยู่
        const [yearStats] = await db.query(`
            SELECT graduation_year, COUNT(*) as count
            FROM users 
            WHERE role = 'user' AND graduation_year IS NOT NULL
            GROUP BY graduation_year
            ORDER BY graduation_year DESC
        `);
        
        console.log('\n=== ปีที่จบที่มีอยู่ในระบบ ===');
        yearStats.forEach(stat => {
            console.log(`ปี ${stat.graduation_year}: ${stat.count} คน`);
        });

        // หากไม่มีข้อมูลปีที่จบ ให้เพิ่มข้อมูลทดสอบ
        if (yearStats.length === 0) {
            console.log('\n=== กำลังเพิ่มข้อมูลทดสอบ ===');
            
            // อัพเดตข้อมูลที่มีอยู่ให้มีปีที่จบ
            await db.query(`
                UPDATE users 
                SET graduation_year = CASE 
                    WHEN id % 4 = 0 THEN 2020
                    WHEN id % 4 = 1 THEN 2021
                    WHEN id % 4 = 2 THEN 2022
                    ELSE 2023
                END
                WHERE role = 'user' AND graduation_year IS NULL
            `);
            
            console.log('เพิ่มข้อมูลปีที่จบเสร็จแล้ว');
            
            // ตรวจสอบข้อมูลใหม่
            const [newYearStats] = await db.query(`
                SELECT graduation_year, COUNT(*) as count
                FROM users 
                WHERE role = 'user'
                GROUP BY graduation_year
                ORDER BY graduation_year DESC
            `);
            
            console.log('\n=== ข้อมูลปีที่จบหลังการอัพเดต ===');
            newYearStats.forEach(stat => {
                console.log(`ปี ${stat.graduation_year}: ${stat.count} คน`);
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

testGraduationYear();