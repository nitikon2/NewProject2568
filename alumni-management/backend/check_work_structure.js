const db = require('./db');

async function checkWorkHistoryTable() {
    try {
        console.log('🔍 ตรวจสอบโครงสร้างตาราง work_history...\n');

        // ตรวจสอบว่าตารางมีอยู่หรือไม่
        const [tables] = await db.execute("SHOW TABLES LIKE 'work_history'");
        if (tables.length === 0) {
            console.log('❌ ไม่พบตาราง work_history');
            return;
        }
        console.log('✅ พบตาราง work_history');

        // ตรวจสอบโครงสร้างตาราง
        console.log('\n📋 โครงสร้างตาราง work_history:');
        const [columns] = await db.execute("DESCRIBE work_history");
        
        columns.forEach((column, index) => {
            console.log(`${index + 1}. ${column.Field} - ${column.Type} ${column.Null === 'NO' ? '(NOT NULL)' : '(NULL)'}`);
        });

        // ตรวจสอบคอลัมน์ใหม่ที่เราต้องการ
        console.log('\n🔍 ตรวจสอบคอลัมน์ใหม่:');
        const requiredColumns = [
            'company_type', 'industry', 'company_size', 
            'department', 'job_level', 'employment_type',
            'work_province', 'work_district', 'skills_used', 
            'technologies_used', 'key_achievements'
        ];

        const existingColumns = columns.map(col => col.Field);
        const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

        if (missingColumns.length > 0) {
            console.log('❌ คอลัมน์ที่ขาดหายไป:', missingColumns.join(', '));
            console.log('\n🔧 สร้าง SQL สำหรับเพิ่มคอลัมน์ที่ขาดหายไป:');
            
            const alterStatements = [];
            missingColumns.forEach(col => {
                switch(col) {
                    case 'company_type':
                        alterStatements.push("ALTER TABLE work_history ADD COLUMN company_type ENUM('private', 'government', 'state_enterprise', 'nonprofit', 'startup', 'other') DEFAULT 'private'");
                        break;
                    case 'industry':
                        alterStatements.push("ALTER TABLE work_history ADD COLUMN industry VARCHAR(255)");
                        break;
                    case 'company_size':
                        alterStatements.push("ALTER TABLE work_history ADD COLUMN company_size ENUM('startup', 'small', 'medium', 'large', 'enterprise') DEFAULT 'medium'");
                        break;
                    case 'department':
                        alterStatements.push("ALTER TABLE work_history ADD COLUMN department VARCHAR(255)");
                        break;
                    case 'job_level':
                        alterStatements.push("ALTER TABLE work_history ADD COLUMN job_level ENUM('entry', 'junior', 'senior', 'lead', 'manager', 'director', 'executive') DEFAULT 'entry'");
                        break;
                    case 'employment_type':
                        alterStatements.push("ALTER TABLE work_history ADD COLUMN employment_type ENUM('full_time', 'part_time', 'contract', 'internship', 'freelance', 'volunteer') DEFAULT 'full_time'");
                        break;
                    case 'work_province':
                        alterStatements.push("ALTER TABLE work_history ADD COLUMN work_province VARCHAR(100)");
                        break;
                    case 'work_district':
                        alterStatements.push("ALTER TABLE work_history ADD COLUMN work_district VARCHAR(100)");
                        break;
                    case 'skills_used':
                        alterStatements.push("ALTER TABLE work_history ADD COLUMN skills_used TEXT");
                        break;
                    case 'technologies_used':
                        alterStatements.push("ALTER TABLE work_history ADD COLUMN technologies_used TEXT");
                        break;
                    case 'key_achievements':
                        alterStatements.push("ALTER TABLE work_history ADD COLUMN key_achievements TEXT");
                        break;
                }
            });

            console.log('\n📝 รัน SQL commands เหล่านี้:');
            alterStatements.forEach((sql, index) => {
                console.log(`${index + 1}. ${sql};`);
            });

            // เพิ่มคอลัมน์อัตโนมัติ
            console.log('\n🔧 กำลังเพิ่มคอลัมน์ที่ขาดหายไป...');
            for (const sql of alterStatements) {
                try {
                    await db.execute(sql);
                    console.log(`✅ สำเร็จ: ${sql.split('ADD COLUMN ')[1].split(' ')[0]}`);
                } catch (error) {
                    console.log(`❌ ล้มเหลว: ${sql.split('ADD COLUMN ')[1].split(' ')[0]} - ${error.message}`);
                }
            }
        } else {
            console.log('✅ มีคอลัมน์ครบถ้วนแล้ว');
        }

        // ตรวจสอบข้อมูลในตาราง
        console.log('\n📊 ตรวจสอบข้อมูลในตาราง:');
        const [rows] = await db.execute("SELECT COUNT(*) as count FROM work_history");
        console.log(`จำนวนรายการ: ${rows[0].count} รายการ`);

        if (rows[0].count > 0) {
            const [sample] = await db.execute("SELECT * FROM work_history LIMIT 1");
            console.log('\n📄 ตัวอย่างข้อมูล:');
            console.log(sample[0]);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit(0);
    }
}

checkWorkHistoryTable();
