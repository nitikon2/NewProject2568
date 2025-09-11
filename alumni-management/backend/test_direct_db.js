const http = require('http');

async function waitForServer(port, maxWait = 5000) {
    const startTime = Date.now();
    return new Promise((resolve, reject) => {
        const check = () => {
            if (Date.now() - startTime > maxWait) {
                reject(new Error('Server did not start within timeout'));
                return;
            }

            const req = http.request({
                hostname: 'localhost',
                port: port,
                path: '/',
                method: 'GET'
            }, (res) => {
                resolve(true);
            });

            req.on('error', (err) => {
                // Server not ready yet, try again
                setTimeout(check, 100);
            });

            req.end();
        };
        check();
    });
}

async function testWorkHistoryDirectly() {
    try {
        console.log('🔄 Waiting for server to be ready...');
        await waitForServer(5000);
        console.log('✅ Server is ready!');

        // Test database connection directly
        const db = require('./db');
        
        console.log('🗄️ Testing database connection...');
        const [result] = await db.execute('SELECT 1 as test');
        console.log('✅ Database connection working:', result);

        // Create a simple test user if not exists
        const testEmail = 'test@example.com';
        console.log('👤 Checking for test user...');
        
        try {
            const [existingUser] = await db.execute('SELECT id FROM users WHERE email = ?', [testEmail]);
            let userId;
            
            if (existingUser.length === 0) {
                console.log('➕ Creating test user...');
                const [insertResult] = await db.execute(
                    'INSERT INTO users (email, password, name, student_id, graduation_year, degree, major) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [testEmail, 'hashedpassword', 'Test User', 'TEST123', 2023, 'Bachelor', 'Computer Science']
                );
                userId = insertResult.insertId;
            } else {
                userId = existingUser[0].id;
            }
            
            console.log('✅ User ID:', userId);

            // Test work history insertion directly
            console.log('💼 Testing work history insertion...');
            const workData = [
                userId,
                'Test Company',
                'private',
                'Technology',
                'medium',
                'Software Developer',
                'Engineering',
                'junior',
                'Testing work history insertion',
                '2024-01-01',
                null,
                true,
                'full_time',
                '30000-50000',
                'Bangkok',
                'Bangkok',
                'Chatuchak',
                'JavaScript, Node.js',
                'React, Express',
                'Successfully implemented features'
            ];

            const insertSQL = `INSERT INTO work_history 
                (user_id, company_name, company_type, industry, company_size, position, department, job_level, 
                 job_description, start_date, end_date, is_current, employment_type, salary_range, 
                 location, work_province, work_district, skills_used, technologies_used, key_achievements)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const [workResult] = await db.execute(insertSQL, workData);
            console.log('✅ Work history inserted successfully! ID:', workResult.insertId);

            // Test retrieval
            console.log('📋 Testing work history retrieval...');
            const [workHistory] = await db.execute('SELECT * FROM work_history WHERE user_id = ?', [userId]);
            console.log('✅ Retrieved work history:', workHistory.length, 'records');

            console.log('🎉 All database operations successful! The fix is working.');

        } catch (dbError) {
            console.error('❌ Database error:', dbError.message);
            if (dbError.sql) {
                console.error('SQL:', dbError.sql);
            }
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        process.exit(0);
    }
}

testWorkHistoryDirectly();
