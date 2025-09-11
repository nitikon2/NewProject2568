const db = require('./db');

async function addAddressColumn() {
    try {
        // เช็คว่ามีคอลัมน์ address อยู่แล้วหรือไม่
        const [columns] = await db.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'alumni_db' 
            AND TABLE_NAME = 'users' 
            AND COLUMN_NAME = 'address'
        `);

        if (columns.length === 0) {
            // เพิ่มคอลัมน์ address
            await db.query('ALTER TABLE users ADD COLUMN address TEXT NULL');
            console.log('✓ เพิ่มคอลัมน์ address สำเร็จ');
        } else {
            console.log('✓ คอลัมน์ address มีอยู่แล้ว');
        }

        process.exit(0);
    } catch (err) {
        console.error('เกิดข้อผิดพลาด:', err);
        process.exit(1);
    }
}

addAddressColumn();
