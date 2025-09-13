const db = require('./db');

async function testAdminAlumniQuery() {
    try {
        console.log('🔍 ทดสอบ SQL query ที่ใช้ใน admin/alumni endpoint...');
        
        const [alumni] = await db.query(`
            SELECT id, student_id, title, name, faculty, major, graduation_year, email, phone,
                   occupation, position, workplace, salary, bio, address, profile_image,
                   province, district, subdistrict, zipcode, created_at
            FROM users WHERE role = 'user'
            ORDER BY created_at DESC
        `);
        
        console.log('✅ Query สำเร็จ');
        console.log('จำนวนศิษย์เก่า:', alumni.length);
        
        if (alumni.length > 0) {
            console.log('ตัวอย่างข้อมูลคนแรก:');
            console.log(JSON.stringify(alumni[0], null, 2));
        }
        
        const result = {
            status: 'success',
            alumni: alumni
        };
        
        console.log('\n📤 Response ที่จะส่งกลับ:');
        console.log('Type:', typeof result);
        console.log('Alumni count:', result.alumni.length);
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error('Stack:', err.stack);
    } finally {
        process.exit();
    }
}

testAdminAlumniQuery();