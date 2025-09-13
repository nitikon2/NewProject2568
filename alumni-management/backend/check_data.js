const mysql = require('mysql2/promise');

async function checkData() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'alumni_db'
        });

        console.log('Checking work_history data...');

        // ตรวจสอบข้อมูลในตาราง
        const [rows] = await connection.execute("SELECT id, company_name, position, location, work_province, work_district, work_subdistrict, work_zipcode FROM work_history LIMIT 5");
        
        if (rows.length === 0) {
            console.log('❌ No data found in work_history table');
        } else {
            console.log('📋 Work history data:');
            rows.forEach(row => {
                console.log(`ID: ${row.id}, Company: ${row.company_name}, Position: ${row.position}`);
                console.log(`   Location: ${row.location}`);
                console.log(`   Province: ${row.work_province}, District: ${row.work_district}`);
                console.log(`   Subdistrict: ${row.work_subdistrict}, Zipcode: ${row.work_zipcode}`);
                console.log('---');
            });
        }

        await connection.end();
        
    } catch (error) {
        console.error('❌ Database error:', error.message);
    }
}

checkData();