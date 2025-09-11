const http = require('http');

function testEndpoint(path, port = 5001) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: port,
            path: path,
            method: 'GET',
            timeout: 5000
        };

        console.log(`🔍 Testing: http://localhost:${port}${path}`);

        const req = http.request(options, (res) => {
            console.log('✅ Status:', res.statusCode);
            
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    console.log('✅ Response:', JSON.stringify(json, null, 2));
                    resolve(json);
                } catch (e) {
                    console.log('Raw data:', data);
                    resolve(data);
                }
            });
        });

        req.on('error', (e) => {
            console.error('❌ Error:', e.message);
            reject(e);
        });

        req.on('timeout', () => {
            console.error('❌ Timeout');
            req.destroy();
            reject(new Error('Timeout'));
        });

        req.end();
    });
}

async function runTests() {
    try {
        console.log('=== Testing Test Server ===');
        await testEndpoint('/test', 5001);
        
        console.log('\n=== Testing Alumni API ===');
        await testEndpoint('/api/alumni', 5001);
        
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

runTests();
