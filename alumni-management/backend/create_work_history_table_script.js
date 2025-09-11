const mysql = require('mysql2/promise');
const db = require('./db');

async function createWorkHistoryTable() {
    try {
        console.log('เริ่มสร้างตารางประวัติการทำงาน...');
        
        // อ่านไฟล์ SQL
        const fs = require('fs');
        const path = require('path');
        const sqlFile = path.join(__dirname, 'create_work_history_table.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');
        
        // แยก SQL statements
        const statements = sql.split(';').filter(statement => statement.trim());
        
        // รัน SQL statements ทีละตัว
        for (const statement of statements) {
            if (statement.trim()) {
                await db.execute(statement);
                console.log('รัน SQL statement สำเร็จ');
            }
        }
        
        console.log('สร้างตารางประวัติการทำงานสำเร็จ!');
        
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสร้างตารางประวัติการทำงาน:', error);
    } finally {
        process.exit(0);
    }
}

// รันสคริปต์
createWorkHistoryTable();
