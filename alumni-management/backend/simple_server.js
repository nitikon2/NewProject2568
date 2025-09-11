const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Add logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Test endpoint
app.get('/', (req, res) => {
    console.log('Root endpoint hit');
    res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Test register endpoint
app.post('/api/users/register', (req, res) => {
    console.log('Register endpoint hit!');
    console.log('Body:', req.body);
    res.json({ 
        success: true, 
        message: 'Registration endpoint working!',
        received_data: req.body 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Simple test server running on port ${PORT}`);
    console.log(`📅 Started at: ${new Date().toISOString()}`);
}).on('error', (err) => {
    console.error('❌ Server failed to start:', err);
});

process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});
