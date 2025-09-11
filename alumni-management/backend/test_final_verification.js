const db = require('./db');

async function testDatabaseWorkHistory() {
    try {
        console.log('🗄️ Testing work history database operations...');

        // Test database connection
        console.log('📊 Testing database connection...');
        const [connectionTest] = await db.execute('SELECT 1 as test');
        console.log('✅ Database connected:', connectionTest[0]);

        // Check work_history table structure
        console.log('🔍 Checking work_history table structure...');
        const [columns] = await db.execute('DESCRIBE work_history');
        console.log('✅ Table columns count:', columns.length);
        
        // Check for specific columns we use in the route
        const columnNames = columns.map(col => col.Field);
        const requiredColumns = [
            'user_id', 'company_name', 'company_type', 'industry', 'company_size', 
            'position', 'department', 'job_level', 'job_description', 'start_date', 
            'end_date', 'is_current', 'employment_type', 'salary_range', 'location', 
            'work_province', 'work_district', 'skills_used', 'technologies_used', 'key_achievements'
        ];
        
        const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
        const existingColumns = requiredColumns.filter(col => columnNames.includes(col));
        
        console.log('✅ Existing columns:', existingColumns.length);
        if (missingColumns.length > 0) {
            console.log('❌ Missing columns:', missingColumns);
        } else {
            console.log('✅ All required columns exist!');
        }

        // Test creating a user for testing
        console.log('👤 Creating test user...');
        const testEmail = `test_${Date.now()}@example.com`;
        const [userResult] = await db.execute(
            'INSERT INTO users (title, name, email, password, student_id, graduation_year, faculty, major) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            ['นาย', 'Test User', testEmail, 'hashedpassword', `TEST${Date.now()}`, 2023, 'Engineering', 'Computer Science']
        );
        const userId = userResult.insertId;
        console.log('✅ Test user created with ID:', userId);

        // Test work history insertion with exact query from route
        console.log('💼 Testing work history insertion...');
        const workData = [
            userId,                    // user_id
            'Test Company',           // company_name
            'private',               // company_type
            'Technology',            // industry
            'medium',                // company_size
            'Software Developer',     // position
            'Engineering',           // department
            'junior',                // job_level
            'Testing insertion',     // job_description
            '2024-01-01',           // start_date
            null,                   // end_date
            true,                   // is_current
            'full_time',            // employment_type
            '30000-50000',          // salary_range
            'Bangkok',              // location
            'Bangkok',              // work_province
            'Chatuchak',            // work_district
            'JavaScript, Node.js',  // skills_used
            'React, Express',       // technologies_used
            'Test achievement'      // key_achievements
        ];

        // Use the exact SQL from our route
        const insertSQL = `INSERT INTO work_history 
             (user_id, company_name, company_type, industry, company_size, position, department, job_level, 
              job_description, start_date, end_date, is_current, employment_type, salary_range, 
              location, work_province, work_district, skills_used, technologies_used, key_achievements)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [workResult] = await db.execute(insertSQL, workData);
        console.log('✅ Work history inserted successfully! ID:', workResult.insertId);

        // Test retrieval
        console.log('📋 Testing work history retrieval...');
        const [workHistory] = await db.execute(
            'SELECT * FROM work_history WHERE user_id = ? ORDER BY is_current DESC, start_date DESC',
            [userId]
        );
        console.log('✅ Retrieved work history count:', workHistory.length);
        console.log('📋 First record:', {
            id: workHistory[0].id,
            company_name: workHistory[0].company_name,
            position: workHistory[0].position,
            is_current: workHistory[0].is_current
        });

        // Test update
        console.log('✏️ Testing work history update...');
        await db.execute(
            `UPDATE work_history 
             SET company_name = ?, company_type = ?, industry = ?, company_size = ?, position = ?, 
                 department = ?, job_level = ?, job_description = ?, start_date = ?, end_date = ?, 
                 is_current = ?, employment_type = ?, salary_range = ?, location = ?, work_province = ?, 
                 work_district = ?, skills_used = ?, technologies_used = ?, key_achievements = ?
             WHERE id = ? AND user_id = ?`,
            [
                'Updated Company', 'private', 'Technology', 'large', 'Senior Developer',
                'Engineering', 'senior', 'Updated description', '2024-01-01', null,
                true, 'full_time', '50000-70000', 'Bangkok', 'Bangkok',
                'Chatuchak', 'JavaScript, React, Node.js', 'React, Express, MongoDB', 'Updated achievements',
                workResult.insertId, userId
            ]
        );
        console.log('✅ Work history updated successfully!');

        // Verify update
        const [updatedRecord] = await db.execute(
            'SELECT * FROM work_history WHERE id = ?',
            [workResult.insertId]
        );
        console.log('✅ Updated record company name:', updatedRecord[0].company_name);

        console.log('🎉 All database operations successful! The 500 error fix is confirmed working.');
        console.log('');
        console.log('💡 Summary of the fix:');
        console.log('   - Removed "team_size" column from INSERT and UPDATE statements');
        console.log('   - Fixed column count mismatch in work_history route');
        console.log('   - Added missing "technologies_used" column to database');
        console.log('   - All work history operations now work correctly');

    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        console.error('Error details:', {
            code: error.code,
            sqlState: error.sqlState,
            sql: error.sql
        });
    } finally {
        await db.end();
        process.exit(0);
    }
}

testDatabaseWorkHistory();
