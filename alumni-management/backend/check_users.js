const db = require('./db');

async function checkUser() {
    try {
        console.log('🔍 ตรวจสอบ users ในระบบ...');
        const [users] = await db.execute('SELECT id, email, name FROM users LIMIT 5');
        console.log('Users:', users);
        
        // สร้าง user ทดสอบถ้าไม่มี
        if (users.length === 0) {
            console.log('ไม่มี user ในระบบ กำลังสร้าง user ทดสอบ...');
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('123456', 10);
            
            await db.execute(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                ['Test User', 'test@test.com', hashedPassword, 'user']
            );
            
            console.log('✅ สร้าง user ทดสอบสำเร็จ: test@test.com / 123456');
        }
        
    } catch(e) { 
        console.log('Error:', e.message); 
    } finally { 
        process.exit(); 
    } 
} 

checkUser();
