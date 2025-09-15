-- สร้างตาราง admin_requests สำหรับเก็บข้อมูลการขอสิทธิ์แอดมิน
CREATE TABLE IF NOT EXISTS admin_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by INT NULL,
    admin_notes TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_event (user_id, event_id)
);

-- เพิ่ม index สำหรับการค้นหาที่เร็วขึ้น
CREATE INDEX idx_admin_requests_status ON admin_requests(status);
CREATE INDEX idx_admin_requests_event_id ON admin_requests(event_id);
CREATE INDEX idx_admin_requests_user_id ON admin_requests(user_id);