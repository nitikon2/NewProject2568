const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');

// ดึงประวัติการทำงานทั้งหมดของผู้ใช้
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [rows] = await db.execute(
            `SELECT * FROM work_history 
             WHERE user_id = ? 
             ORDER BY is_current DESC, start_date DESC`,
            [userId]
        );
        
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching work history:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการทำงาน'
        });
    }
});

// ดึงประวัติการทำงานของผู้ใช้คนอื่น (สำหรับดูโปรไฟล์และ admin)
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const [rows] = await db.execute(
            `SELECT wh.*, u.name as user_name 
             FROM work_history wh
             JOIN users u ON wh.user_id = u.id
             WHERE wh.user_id = ? 
             ORDER BY wh.is_current DESC, wh.start_date DESC`,
            [userId]
        );
        
        // ส่งเฉพาะ array ของข้อมูลประวัติการทำงาน
        res.json(rows);
    } catch (error) {
        console.error('Error fetching user work history:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการทำงาน'
        });
    }
});

// เพิ่มประวัติการทำงานใหม่
router.post('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            company_name,
            company_type,
            industry,
            company_size,
            position,
            department,
            job_level,
            job_description,
            start_date,
            end_date,
            is_current,
            employment_type,
            salary_range,
            location,
            work_province,
            work_district,
            work_subdistrict,
            work_zipcode,
            team_size,
            skills_used,
            technologies_used,
            key_achievements
        } = req.body;

        // ตรวจสอบข้อมูลที่จำเป็น
        if (!company_name || !position || !start_date) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกข้อมูลที่จำเป็น: ชื่อบริษัท, ตำแหน่ง, และวันที่เริ่มงาน'
            });
        }

        // ถ้าเป็นงานปัจจุบัน ให้อัปเดตงานอื่นๆ ให้ไม่เป็น current
        if (is_current) {
            await db.execute(
                'UPDATE work_history SET is_current = false WHERE user_id = ?',
                [userId]
            );
        }

        const [result] = await db.execute(
            `INSERT INTO work_history 
             (user_id, company_name, company_type, industry, company_size, position, department, job_level, 
              job_description, start_date, end_date, is_current, employment_type, salary_range, 
              location, work_province, work_district, work_subdistrict, work_zipcode, team_size, skills_used, technologies_used, key_achievements)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, company_name || null, company_type || null, industry || null, company_size || null, 
             position || null, department || null, job_level || null, job_description || null, 
             start_date || null, end_date || null, is_current || false, employment_type || null, 
             salary_range || null, location || null, work_province || null, work_district || null, 
             work_subdistrict || null, work_zipcode || null, team_size || null, skills_used || null, 
             technologies_used || null, key_achievements || null]
        );

        res.status(201).json({
            success: true,
            message: 'เพิ่มประวัติการทำงานสำเร็จ',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Error adding work history:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            sqlState: error.sqlState,
            sql: error.sql
        });
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการเพิ่มประวัติการทำงาน',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// แก้ไขประวัติการทำงาน
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const {
            company_name,
            company_type,
            industry,
            company_size,
            position,
            department,
            job_level,
            job_description,
            start_date,
            end_date,
            is_current,
            employment_type,
            salary_range,
            location,
            work_province,
            work_district,
            work_subdistrict,
            work_zipcode,
            team_size,
            skills_used,
            technologies_used,
            key_achievements
        } = req.body;

        // ตรวจสอบว่าประวัติการทำงานนี้เป็นของผู้ใช้หรือไม่
        const [existing] = await db.execute(
            'SELECT * FROM work_history WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบประวัติการทำงานที่ต้องการแก้ไข'
            });
        }

        // ถ้าเป็นงานปัจจุบัน ให้อัปเดตงานอื่นๆ ให้ไม่เป็น current
        if (is_current) {
            await db.execute(
                'UPDATE work_history SET is_current = false WHERE user_id = ? AND id != ?',
                [userId, id]
            );
        }

        await db.execute(
            `UPDATE work_history 
             SET company_name = ?, company_type = ?, industry = ?, company_size = ?, position = ?, 
                 department = ?, job_level = ?, job_description = ?, start_date = ?, end_date = ?, 
                 is_current = ?, employment_type = ?, salary_range = ?, location = ?, work_province = ?, 
                 work_district = ?, work_subdistrict = ?, work_zipcode = ?, team_size = ?, skills_used = ?, technologies_used = ?, key_achievements = ?
             WHERE id = ? AND user_id = ?`,
            [company_name || null, company_type || null, industry || null, company_size || null, 
             position || null, department || null, job_level || null, job_description || null, 
             start_date || null, end_date || null, is_current || false, employment_type || null,
             salary_range || null, location || null, work_province || null, work_district || null, 
             work_subdistrict || null, work_zipcode || null, team_size || null, skills_used || null, 
             technologies_used || null, key_achievements || null, id, userId]
        );

        res.json({
            success: true,
            message: 'อัปเดตประวัติการทำงานสำเร็จ'
        });
    } catch (error) {
        console.error('Error updating work history:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            sqlState: error.sqlState,
            sql: error.sql
        });
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการอัปเดตประวัติการทำงาน',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// ลบประวัติการทำงาน
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // ตรวจสอบว่าประวัติการทำงานนี้เป็นของผู้ใช้หรือไม่
        const [existing] = await db.execute(
            'SELECT * FROM work_history WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบประวัติการทำงานที่ต้องการลบ'
            });
        }

        await db.execute(
            'DELETE FROM work_history WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        res.json({
            success: true,
            message: 'ลบประวัติการทำงานสำเร็จ'
        });
    } catch (error) {
        console.error('Error deleting work history:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการลบประวัติการทำงาน'
        });
    }
});

// ดึงประวัติการทำงานเฉพาะรายการ
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const [rows] = await db.execute(
            'SELECT * FROM work_history WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบประวัติการทำงานที่ต้องการ'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching work history item:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการทำงาน'
        });
    }
});

module.exports = router;
