const axios = require('axios');

async function testWorkHistoryAPI() {
    try {
        console.log('🧪 Testing work history API...');
        
        // ทดสอบ API โดยตรง (ต้องมี token ที่ valid)
        const response = await axios.get('http://localhost:5000/api/work-history', {
            headers: { 
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlhdCI6MTczNjc1OTE1OCwiZXhwIjoxNzM2ODQ1NTU4fQ.TFMQLt6q4KbGmFqP4c1ue9cKBkPMnmyqngtG7JLG2ds' // ใส่ token ที่ถูกต้อง
            }
        });
        
        console.log('📋 API Response:', JSON.stringify(response.data, null, 2));
        
        if (response.data.success && response.data.data) {
            console.log('📍 Address data in each work history:');
            response.data.data.forEach((item, index) => {
                console.log(`\n--- Item ${index + 1} ---`);
                console.log(`Company: ${item.company_name}`);
                console.log(`Position: ${item.position}`);
                console.log(`Location: ${item.location || 'null'}`);
                console.log(`Province: ${item.work_province || 'null'}`);
                console.log(`District: ${item.work_district || 'null'}`);
                console.log(`Subdistrict: ${item.work_subdistrict || 'null'}`);
                console.log(`Zipcode: ${item.work_zipcode || 'null'}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error testing API:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testWorkHistoryAPI();