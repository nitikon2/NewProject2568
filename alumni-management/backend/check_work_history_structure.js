const mysql = require('mysql2/promise');

async function checkWorkHistoryStructure() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'alumni_db'
        });

        console.log('🔍 ตรวจสอบโครงสร้างตาราง work_history...\n');

        // ตรวจสอบโครงสร้างตาราง
        const [columns] = await connection.execute("DESCRIBE work_history");
        
        console.log('📋 คอลัมน์ทั้งหมดในตาราง work_history:');
        console.log('=' .repeat(80));
        
        const addressColumns = [];
        columns.forEach((column, index) => {
            console.log(`${(index + 1).toString().padStart(2, '0')}. ${column.Field.padEnd(25)} | ${column.Type.padEnd(20)} | ${column.Null} | ${column.Default || 'NULL'}`);
            
            // ตรวจสอบคอลัมน์ที่เกี่ยวข้องกับที่อยู่
            if (column.Field.includes('work_') && (
                column.Field.includes('province') || 
                column.Field.includes('district') || 
                column.Field.includes('subdistrict') || 
                column.Field.includes('zipcode')
            )) {
                addressColumns.push(column.Field);
            }
        });

        console.log('\n🏠 คอลัมน์ที่เกี่ยวข้องกับที่อยู่:');
        console.log('=' .repeat(50));
        
        const requiredColumns = ['work_province', 'work_district', 'work_subdistrict', 'work_zipcode'];
        const missingColumns = [];
        
        requiredColumns.forEach(col => {
            if (addressColumns.includes(col)) {
                console.log(`✅ ${col} - มีอยู่แล้ว`);
            } else {
                console.log(`❌ ${col} - ไม่มี (ต้องเพิ่ม)`);
                missingColumns.push(col);
            }
        });

        // ตรวจสอบข้อมูลในตาราง
        console.log('\n📊 ตรวจสอบข้อมูลที่มีอยู่:');
        const [rows] = await connection.execute(`
            SELECT COUNT(*) as total,
                   COUNT(work_province) as has_province,
                   COUNT(work_district) as has_district,
                   COUNT(work_subdistrict) as has_subdistrict,
                   COUNT(work_zipcode) as has_zipcode
            FROM work_history
        `);
        
        if (rows[0]) {
            const data = rows[0];
            console.log(`📈 จำนวนข้อมูลทั้งหมด: ${data.total}`);
            console.log(`🗺️  มีข้อมูลจังหวัด: ${data.has_province} รายการ`);
            console.log(`🏘️  มีข้อมูลอำเภอ: ${data.has_district} รายการ`);
            console.log(`🏠 มีข้อมูลตำบล: ${data.has_subdistrict} รายการ`);
            console.log(`📮 มีข้อมูลรหัสไปรษณีย์: ${data.has_zipcode} รายการ`);
        }

        // แสดงตัวอย่างข้อมูลที่มีที่อยู่
        console.log('\n📋 ตัวอย่างข้อมูลที่มีที่อยู่:');
        const [sampleData] = await connection.execute(`
            SELECT id, company_name, position, location, 
                   work_province, work_district, work_subdistrict, work_zipcode
            FROM work_history 
            WHERE work_province IS NOT NULL OR work_district IS NOT NULL 
            ORDER BY id DESC 
            LIMIT 3
        `);
        
        if (sampleData.length > 0) {
            sampleData.forEach((row, index) => {
                console.log(`\n--- ตัวอย่างที่ ${index + 1} ---`);
                console.log(`ID: ${row.id} | บริษัท: ${row.company_name}`);
                console.log(`ตำแหน่ง: ${row.position}`);
                console.log(`สถานที่: ${row.location || 'ไม่ระบุ'}`);
                console.log(`จังหวัด: ${row.work_province || 'ไม่ระบุ'}`);
                console.log(`อำเภอ: ${row.work_district || 'ไม่ระบุ'}`);
                console.log(`ตำบล: ${row.work_subdistrict || 'ไม่ระบุ'}`);
                console.log(`รหัสไปรษณีย์: ${row.work_zipcode || 'ไม่ระบุ'}`);
            });
        } else {
            console.log('❌ ไม่พบข้อมูลที่มีที่อยู่');
        }

        await connection.end();
        
        return missingColumns;
        
    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาด:', error.message);
        return null;
    }
}

checkWorkHistoryStructure();