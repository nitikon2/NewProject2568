const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('💥 Express Error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
});

// Test route
app.get('/test', (req, res) => {
    console.log('✅ Test route hit');
    res.json({ message: 'Server is working!' });
});

// Alumni route with detailed logging
app.get('/api/alumni', async (req, res) => {
    console.log('🎓 Alumni route hit');
    try {
        console.log('📡 Testing database connection...');
        await db.query('SELECT 1');
        console.log('✅ Database connected');
        
        console.log('📊 Querying alumni...');
        const [alumni] = await db.query(`
            SELECT 
                id, title, name, student_id, graduation_year, faculty, major, 
                occupation, position, workplace, salary, email, phone, created_at
            FROM users
            WHERE role = 'user'
            ORDER BY graduation_year DESC, created_at DESC
        `);
        
        console.log('✅ Query completed, found:', alumni.length, 'alumni');
        
        const result = alumni.map(a => ({
            ...a,
            occupation: a.occupation || '',
            position: a.position || '',
            workplace: a.workplace || '',
            salary: a.salary || ''
        }));
        
        console.log('✅ Sending response...');
        res.json(result);
        console.log('✅ Response sent successfully');
        
    } catch (err) {
        console.error('❌ Alumni route error:', err);
        res.status(500).json({ 
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลศิษย์เก่า', 
            error: err.message 
        });
    }
});

// Global error handlers
process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    console.error('Stack:', err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = 5001; // Use different port
const server = app.listen(PORT, () => {
    console.log(`🚀 Test Server running on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('💥 Server Error:', err);
});
