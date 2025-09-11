const axios = require('axios');

async function testWorkHistoryAPI() {
    try {
        console.log('🧪 Testing Work History API fix...');
        
        // First, let's test user registration and login
        const registerData = {
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            name: 'Test User',
            student_id: `TEST${Date.now()}`,
            graduation_year: 2020,
            degree: 'Bachelor',
            major: 'Computer Science'
        };

        console.log('📝 Registering test user...');
        const registerResponse = await axios.post('http://localhost:5000/api/auth/register', registerData);
        console.log('✅ Registration successful');

        console.log('🔐 Logging in...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: registerData.email,
            password: registerData.password
        });
        console.log('✅ Login successful');

        const token = loginResponse.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        // Test adding work history
        const workHistoryData = {
            company_name: 'Test Company',
            company_type: 'private',
            industry: 'Technology',
            company_size: 'medium',
            position: 'Software Developer',
            department: 'Engineering',
            job_level: 'junior',
            job_description: 'Developing software applications',
            start_date: '2023-01-01',
            end_date: null,
            is_current: true,
            employment_type: 'full_time',
            salary_range: '30000-50000',
            location: 'Bangkok',
            work_province: 'Bangkok',
            work_district: 'Chatuchak',
            skills_used: 'JavaScript, Node.js, React',
            technologies_used: 'MongoDB, Express.js, React, Node.js',
            key_achievements: 'Developed user management system'
        };

        console.log('💼 Adding work history...');
        const workResponse = await axios.post('http://localhost:5000/api/work-history', workHistoryData, { headers });
        console.log('✅ Work history added successfully!');
        console.log('📊 Response:', workResponse.data);

        // Test getting work history
        console.log('📋 Getting work history...');
        const getResponse = await axios.get('http://localhost:5000/api/work-history', { headers });
        console.log('✅ Work history retrieved successfully!');
        console.log('📊 Data count:', getResponse.data.data.length);

        console.log('🎉 All tests passed! The 500 error has been fixed.');

    } catch (error) {
        console.error('❌ Test failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testWorkHistoryAPI();
