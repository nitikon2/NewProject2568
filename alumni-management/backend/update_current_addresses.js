const db = require('./db');

async function updateCurrentAddresses() {
    try {
        // อัพเดทข้อมูล current_address ให้กับผู้ใช้ที่มีอยู่
        const updates = [
            { id: 6, current_address: '123 ถนนเทสต์ แขวงทดสอบ เขตตัวอย่าง กรุงเทพมหานคร 10110' },
            { id: 7, current_address: '456 ซอยทดลอง ตำบลสมมุติ อำเภอจินตนาการ จังหวัดนครพนม 48000' },
            { id: 8, current_address: '789 หมู่บ้านใหม่ ตำบลป่าไผ่ อำเภอเมือง จังหวัดขอนแก่น 40000' },
            { id: 9, current_address: '321 ถนนมหาวิทยาลัย ตำบลในเมือง อำเภอเมือง จังหวัดราชบุรี 70000' }
        ];
        
        for (const update of updates) {
            await db.query(
                'UPDATE users SET current_address = ? WHERE id = ?',
                [update.current_address, update.id]
            );
            console.log(`Updated current_address for user ID ${update.id}`);
        }
        
        // ตรวจสอบผลลัพธ์
        const [rows] = await db.query('SELECT id, name, current_address FROM users WHERE role = "user" AND current_address IS NOT NULL');
        console.log('\nUpdated current_address data:');
        console.log('=============================');
        rows.forEach(row => {
            console.log(`ID: ${row.id}, Name: ${row.name}, Current Address: ${row.current_address}`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

updateCurrentAddresses();