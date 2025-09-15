const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// GET /api/admin-requests/event/:eventId - ตรวจสอบสถานะคำขอของผู้ใช้สำหรับกิจกรรมใดๆ
router.get('/event/:eventId', isAuthenticated, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const [requests] = await db.query(
      'SELECT * FROM admin_requests WHERE user_id = ? AND event_id = ? ORDER BY requested_at DESC LIMIT 1',
      [userId, eventId]
    );

    if (requests.length === 0) {
      return res.json({ status: null });
    }

    res.json(requests[0]);
  } catch (err) {
    console.error('Error checking admin request status:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบสถานะ' });
  }
});

// POST /api/admin-requests - ส่งคำขอสิทธิ์แอดมิน
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { event_id, reason } = req.body;
    const user_id = req.user.id;

    if (!event_id || !reason) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    // ตรวจสอบว่ามีกิจกรรมอยู่จริง
    const [events] = await db.query('SELECT id FROM events WHERE id = ?', [event_id]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'ไม่พบกิจกรรมที่ระบุ' });
    }

    // ตรวจสอบว่าผู้ใช้เป็นแอดมินอยู่แล้วหรือไม่
    if (req.user.role === 'admin') {
      return res.status(400).json({ message: 'คุณมีสิทธิ์แอดมินอยู่แล้ว' });
    }

    // ตรวจสอบว่ามีคำขอที่รอการอนุมัติอยู่แล้วหรือไม่
    const [existingRequests] = await db.query(
      'SELECT id FROM admin_requests WHERE user_id = ? AND event_id = ? AND status = "pending"',
      [user_id, event_id]
    );

    if (existingRequests.length > 0) {
      return res.status(400).json({ message: 'คุณมีคำขอที่รอการอนุมัติอยู่แล้ว' });
    }

    // ลบคำขอเก่าที่ถูกปฏิเสธ (หากมี) เพื่อส่งคำขอใหม่
    await db.query(
      'DELETE FROM admin_requests WHERE user_id = ? AND event_id = ? AND status = "rejected"',
      [user_id, event_id]
    );

    // เพิ่มคำขอใหม่
    const [result] = await db.query(
      'INSERT INTO admin_requests (user_id, event_id, reason) VALUES (?, ?, ?)',
      [user_id, event_id, reason]
    );

    res.status(201).json({
      message: 'ส่งคำขอสิทธิ์แอดมินเรียบร้อย',
      id: result.insertId
    });

  } catch (err) {
    console.error('Error creating admin request:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'คุณมีคำขอสำหรับกิจกรรมนี้อยู่แล้ว' });
    } else {
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการส่งคำขอ' });
    }
  }
});

// GET /api/admin-requests - ดูคำขอทั้งหมด (สำหรับแอดมิน)
router.get('/', isAdmin, async (req, res) => {
  try {
    const [requests] = await db.query(`
      SELECT ar.*, 
             u.name as user_name, 
             u.email as user_email,
             u.faculty,
             u.graduation_year,
             e.title as event_title,
             e.event_date,
             reviewer.name as reviewer_name
      FROM admin_requests ar
      JOIN users u ON ar.user_id = u.id
      JOIN events e ON ar.event_id = e.id
      LEFT JOIN users reviewer ON ar.reviewed_by = reviewer.id
      ORDER BY ar.requested_at DESC
    `);

    res.json(requests);
  } catch (err) {
    console.error('Error fetching admin requests:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

// PUT /api/admin-requests/:id/:action - อนุมัติ/ปฏิเสธคำขอ (สำหรับแอดมิน)
router.put('/:id/:action', isAdmin, async (req, res) => {
  try {
    const { id, action } = req.params;
    const { admin_notes } = req.body;
    const reviewed_by = req.user.id;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'การดำเนินการไม่ถูกต้อง' });
    }

    // ตรวจสอบว่ามีคำขออยู่จริง
    const [requests] = await db.query(
      'SELECT ar.*, u.email, u.name as user_name, e.title as event_title FROM admin_requests ar JOIN users u ON ar.user_id = u.id JOIN events e ON ar.event_id = e.id WHERE ar.id = ?',
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ message: 'ไม่พบคำขอที่ระบุ' });
    }

    const request = requests[0];

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'คำขอนี้ได้รับการพิจารณาแล้ว' });
    }

    const status = action === 'approve' ? 'approved' : 'rejected';

    // อัปเดตสถานะคำขอ
    await db.query(
      'UPDATE admin_requests SET status = ?, reviewed_at = NOW(), reviewed_by = ?, admin_notes = ? WHERE id = ?',
      [status, reviewed_by, admin_notes || null, id]
    );

    // หากอนุมัติ ให้อัปเดตสิทธิ์ผู้ใช้เป็นแอดมิน (แค่สำหรับกิจกรรมนี้)
    if (action === 'approve') {
      // สำหรับตอนนี้ให้เปลี่ยนเป็น admin ทั่วไป
      // ในอนาคตอาจปรับให้เป็น event-specific admin
      await db.query(
        'UPDATE users SET role = "admin" WHERE id = ?',
        [request.user_id]
      );
    }

    res.json({
      message: `${action === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ'}คำขอเรียบร้อย`,
      status: status
    });

  } catch (err) {
    console.error('Error updating admin request:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตคำขอ' });
  }
});

// GET /api/admin-requests/my-requests - ดูคำขอของตัวเอง
router.get('/my-requests', isAuthenticated, async (req, res) => {
  try {
    const [requests] = await db.query(`
      SELECT ar.*, 
             e.title as event_title,
             e.event_date,
             reviewer.name as reviewer_name
      FROM admin_requests ar
      JOIN events e ON ar.event_id = e.id
      LEFT JOIN users reviewer ON ar.reviewed_by = reviewer.id
      WHERE ar.user_id = ?
      ORDER BY ar.requested_at DESC
    `, [req.user.id]);

    res.json(requests);
  } catch (err) {
    console.error('Error fetching user admin requests:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

module.exports = router;