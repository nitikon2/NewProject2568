const mysql = require('mysql2/promise');

async function testWorkAddressUpdate() {
    let connection;
    
    try {
        // เชื่อมต่อฐานข้อมูล
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'alumni_db'
        });

        console.log('🔌 เชื่อมต่อฐานข้อมูลสำเร็จ');

        // เพิ่มคอลัมน์ใหม่ถ้ายังไม่มี
        try {
            await connection.execute(`
                ALTER TABLE work_history 
                ADD COLUMN IF NOT EXISTS work_subdistrict VARCHAR(100) COMMENT 'ตำบลที่ทำงาน'
            `);
            console.log('✅ เพิ่มคอลัมน์ work_subdistrict สำเร็จ');
        } catch (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ คอลัมน์ work_subdistrict มีอยู่แล้ว');
            } else {
                throw error;
            }
        }

        try {
            await connection.execute(`
                ALTER TABLE work_history 
                ADD COLUMN IF NOT EXISTS work_zipcode VARCHAR(10) COMMENT 'รหัสไปรษณีย์ที่ทำงาน'
            `);
            console.log('✅ เพิ่มคอลัมน์ work_zipcode สำเร็จ');
        } catch (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ คอลัมน์ work_zipcode มีอยู่แล้ว');
            } else {
                throw error;
            }
        }

        // แสดงโครงสร้างตารางปัจจุบัน
        const [columns] = await connection.execute('DESCRIBE work_history');
        console.log('\n📋 โครงสร้างตาราง work_history:');
        columns.forEach(col => {
            console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'}`);
        });

        // ทดสอบเพิ่มข้อมูลตัวอย่าง
        console.log('\n🧪 ทดสอบเพิ่มข้อมูลตัวอย่าง...');
        
        const testData = {
            user_id: 1,
            company_name: 'บริษัท ทดสอบ จำกัด',
            position: 'นักพัฒนาระบบ',
            start_date: '2023-01-01',
            is_current: true,
            location: 'อาคารเทสต์ ชั้น 5',
            work_province: 'กรุงเทพมหานคร',
            work_district: 'วัฒนา',
            work_subdistrict: 'ลุมพินี',
            work_zipcode: '10330'
        };

        const [result] = await connection.execute(`
            INSERT INTO work_history 
            (user_id, company_name, position, start_date, is_current, location, 
             work_province, work_district, work_subdistrict, work_zipcode)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            testData.user_id,
            testData.company_name,
            testData.position,
            testData.start_date,
            testData.is_current,
            testData.location,
            testData.work_province,
            testData.work_district,
            testData.work_subdistrict,
            testData.work_zipcode
        ]);

        console.log(`✅ เพิ่มข้อมูลทดสอบสำเร็จ ID: ${result.insertId}`);

        // ดึงข้อมูลที่เพิ่งเพิ่มมาแสดง
        const [rows] = await connection.execute(`
            SELECT * FROM work_history WHERE id = ?
        `, [result.insertId]);

        console.log('\n📄 ข้อมูลที่เพิ่ม:');
        console.log(rows[0]);

        // ลบข้อมูลทดสอบ
        await connection.execute('DELETE FROM work_history WHERE id = ?', [result.insertId]);
        console.log('🗑️ ลบข้อมูลทดสอบแล้ว');

        console.log('\n🎉 การทดสอบเสร็จสิ้น - ระบบพร้อมใช้งาน!');

    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาด:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 ปิดการเชื่อมต่อฐานข้อมูล');
        }
    }
}

// รันการทดสอบ
testWorkAddressUpdate();