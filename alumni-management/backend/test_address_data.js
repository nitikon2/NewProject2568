const db = require('./db');

async function testAddressData() {
    try {
        const [rows] = await db.query('SELECT id, name, address FROM users WHERE role = "user" LIMIT 5');
        console.log('Sample address data from database:');
        console.log('=====================================');
        rows.forEach(row => {
            console.log(`ID: ${row.id}, Name: ${row.name}, Address: ${row.address || 'NULL'}`);
        });
        
        // ตรวจสอบโครงสร้างตาราง
        const [columns] = await db.query(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'alumni_db' 
            AND TABLE_NAME = 'users' 
            AND COLUMN_NAME LIKE '%address%'
        `);
        
        console.log('\nAddress-related columns:');
        console.log('========================');
        columns.forEach(col => {
            console.log(`${col.COLUMN_NAME}: ${col.DATA_TYPE} (Nullable: ${col.IS_NULLABLE})`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

testAddressData();