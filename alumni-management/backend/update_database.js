const mysql = require('mysql2/promise');

async function addMissingColumns() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'alumni_db'
        });

        console.log('Connected to database');

        // เพิ่มคอลัมน์ทีละอัน
        const queries = [
            "ALTER TABLE work_history ADD COLUMN work_subdistrict VARCHAR(100) AFTER work_district",
            "ALTER TABLE work_history ADD COLUMN work_zipcode VARCHAR(10) AFTER work_subdistrict", 
            "ALTER TABLE work_history ADD COLUMN team_size VARCHAR(50) AFTER work_zipcode",
            "ALTER TABLE work_history ADD COLUMN technologies_used TEXT AFTER skills_used"
        ];

        for (const query of queries) {
            try {
                await connection.execute(query);
                console.log('✅ Executed:', query);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log('⚠️  Column already exists:', query);
                } else {
                    console.log('❌ Error:', err.message);
                }
            }
        }

        // ตรวจสอบโครงสร้างตาราง
        const [rows] = await connection.execute("DESCRIBE work_history");
        console.log('\n📋 Current table structure:');
        rows.forEach(row => {
            console.log(`${row.Field}: ${row.Type}`);
        });

        await connection.end();
        console.log('\n✅ Database update completed!');
        
    } catch (error) {
        console.error('❌ Database error:', error.message);
    }
}

addMissingColumns();