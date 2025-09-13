const mysql = require('mysql2/promise');

async function insertTestData() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'alumni_db'
        });

        console.log('🧪 Inserting test work history with complete address data...');

        const testData = {
            user_id: 1, // สมมติมี user id = 1
            company_name: 'บริษัททดสอบระบบ จำกัด',
            position: 'นักพัฒนาเว็บแอปพลิเคชัน',
            job_description: 'พัฒนาระบบจัดการศิษย์เก่าด้วย React และ Node.js',
            start_date: '2023-06-01',
            end_date: '2024-05-31',
            is_current: false,
            salary_range: '35,000-45,000 บาท',
            location: 'อาคารไอทีพาร์ค ชั้น 8',
            work_province: 'กรุงเทพมหานคร',
            work_district: 'วัฒนา',
            work_subdistrict: 'ลุมพินี',
            work_zipcode: '10330',
            skills_used: 'JavaScript, React, Node.js, MySQL, CSS',
            technologies_used: 'React, Express.js, MySQL, Material-UI, Axios',
            key_achievements: 'พัฒนาระบบจัดการศิษย์เก่าสำเร็จ, ลดเวลาการทำงาน 50%',
            team_size: 8
        };

        const [result] = await connection.execute(
            `INSERT INTO work_history 
             (user_id, company_name, position, job_description, start_date, end_date, is_current, 
              salary_range, location, work_province, work_district, work_subdistrict, work_zipcode, 
              skills_used, technologies_used, key_achievements, team_size)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                testData.user_id,
                testData.company_name,
                testData.position,
                testData.job_description,
                testData.start_date,
                testData.end_date,
                testData.is_current,
                testData.salary_range,
                testData.location,
                testData.work_province,
                testData.work_district,
                testData.work_subdistrict,
                testData.work_zipcode,
                testData.skills_used,
                testData.technologies_used,
                testData.key_achievements,
                testData.team_size
            ]
        );

        console.log('✅ Test data inserted with ID:', result.insertId);

        // ดึงข้อมูลที่เพิ่งเพิ่มมาตรวจสอบ
        const [rows] = await connection.execute(
            'SELECT * FROM work_history WHERE id = ?',
            [result.insertId]
        );

        console.log('📋 Inserted data verification:');
        const item = rows[0];
        console.log(`Company: ${item.company_name}`);
        console.log(`Position: ${item.position}`);
        console.log(`Location: ${item.location}`);
        console.log(`Province: ${item.work_province}`);
        console.log(`District: ${item.work_district}`);
        console.log(`Subdistrict: ${item.work_subdistrict}`);
        console.log(`Zipcode: ${item.work_zipcode}`);

        await connection.end();
        console.log('✅ Database connection closed.');
        
    } catch (error) {
        console.error('❌ Database error:', error.message);
    }
}

insertTestData();