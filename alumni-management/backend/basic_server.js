const http = require('http');

const server = http.createServer((req, res) => {
    console.log('📡 Request received:', req.method, req.url);
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.url === '/test') {
        console.log('✅ Test endpoint hit');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Basic server working!' }));
        return;
    }
    
    console.log('❌ Unknown endpoint');
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.on('error', (err) => {
    console.error('💥 Server Error:', err);
});

const PORT = 5002;
server.listen(PORT, () => {
    console.log(`🚀 Basic Server running on port ${PORT}`);
});

console.log('Server starting...');
