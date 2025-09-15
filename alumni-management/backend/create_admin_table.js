const db = require('./db');
const fs = require('fs');

async function createAdminRequestsTable() {
  try {
    const sql = fs.readFileSync('./create_admin_requests_table.sql', 'utf-8');
    
    // แยกคำสั่ง SQL เพื่อทำการ execute ทีละคำสั่ง
    const commands = sql.split(';').filter(cmd => cmd.trim());
    
    for (const command of commands) {
      if (command.trim()) {
        await db.query(command);
        console.log('Executed:', command.substring(0, 50) + '...');
      }
    }
    
    console.log('✅ Admin requests table created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin requests table:', err);
    process.exit(1);
  }
}

createAdminRequestsTable();