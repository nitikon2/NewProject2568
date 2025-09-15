const db = require('./db');

async function updateTestAddresses() {
    try {
        // อัพเดทข้อมูลที่อยู่ให้กับผู้ใช้ที่มีอยู่
        const updates = [
            { id: 6, address: '123 ถนนเทสต์ แขวงทดสอบ เขตตัวอย่าง กรุงเทพมหานคร 10110' },
            { id: 7, address: '456 ซอยทดลอง ตำบลสมมุติ อำเภอจินตนาการ จังหวัดนครพนม 48000' },
            { id: 8, address: '789 หมู่บ้านใหม่ ตำบลป่าไผ่ อำเภอเมือง จังหวัดขอนแก่น 40000' },
            { id: 9, address: '321 ถนนมหาวิทยาลัย ตำบลในเมือง อำเภอเมือง จังหวัดราชบุรี 70000' }
        ];
        
        for (const update of updates) {
            await db.query(
                'UPDATE users SET address = ? WHERE id = ?',
                [update.address, update.id]
            );
            console.log(`Updated address for user ID ${update.id}`);
        }
        
        // ตรวจสอบผลลัพธ์
        const [rows] = await db.query('SELECT id, name, address FROM users WHERE role = "user" AND address IS NOT NULL');
        console.log('\nUpdated address data:');
        console.log('=====================');
        rows.forEach(row => {
            console.log(`ID: ${row.id}, Name: ${row.name}, Address: ${row.address}`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

updateTestAddresses();