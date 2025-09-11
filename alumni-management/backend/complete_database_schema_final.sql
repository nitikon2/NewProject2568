-- ========================================
-- Alumni Management System - Complete Database Schema (Fixed)
-- ระบบจัดการศิษย์เก่า - โครงสร้างฐานข้อมูลที่แก้ไขสมบูรณ์
-- ========================================

CREATE DATABASE IF NOT EXISTS alumni_db;
USE alumni_db;

-- ปิดการตรวจสอบ Foreign Key ชั่วคราว
SET FOREIGN_KEY_CHECKS = 0;

-- ลบตารางเดิม (หากมี)
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS event_registrations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS work_history;
DROP TABLE IF EXISTS users;

-- เปิดการตรวจสอบ Foreign Key กลับ
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- ตารางผู้ใช้ (Users)
-- ========================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- ข้อมูลส่วนตัว
    title VARCHAR(20) NOT NULL,                    -- คำนำหน้า
    name VARCHAR(100) NOT NULL,                    -- ชื่อ-นามสกุล
    first_name VARCHAR(50) NULL,                   -- ชื่อ
    last_name VARCHAR(50) NULL,                    -- นามสกุล
    email VARCHAR(100) NOT NULL UNIQUE,            -- อีเมล
    phone VARCHAR(15),                             -- เบอร์โทร
    bio TEXT NULL,                                 -- แนะนำตัว
    
    -- ข้อมูลการศึกษา
    student_id VARCHAR(12) NOT NULL UNIQUE,        -- รหัสนักศึกษา
    graduation_year INT NOT NULL,                  -- ปีที่จบการศึกษา
    faculty VARCHAR(100) NOT NULL,                 -- คณะ
    major VARCHAR(100) NOT NULL,                   -- สาขาวิชา
    gpa DECIMAL(3,2) NULL,                        -- เกรดเฉลี่ย
    
    -- ข้อมูลการทำงานปัจจุบัน
    occupation VARCHAR(100),                       -- อาชีพปัจจุบัน
    position VARCHAR(100) NULL,                    -- ตำแหน่งงาน
    workplace VARCHAR(255) NULL,                   -- สถานที่ทำงาน
    salary VARCHAR(50) NULL,                       -- เงินเดือน
    
    -- ข้อมูลที่อยู่
    address TEXT,                                  -- ที่อยู่
    province VARCHAR(100) NULL,                    -- จังหวัด
    district VARCHAR(100) NULL,                    -- อำเภอ
    subdistrict VARCHAR(100) NULL,                 -- ตำบล
    zipcode VARCHAR(10) NULL,                      -- รหัสไปรษณีย์
    
    -- ข้อมูลระบบ
    password VARCHAR(255) NOT NULL,                -- รหัสผ่าน
    profile_image VARCHAR(255) NULL,               -- รูปโปรไฟล์
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user', -- บทบาท
    is_verified BOOLEAN DEFAULT false,             -- ยืนยันตัวตนแล้วหรือไม่
    reset_code VARCHAR(10) NULL,                   -- รหัสรีเซ็ตรหัสผ่าน
    
    -- วันที่
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- ตารางประวัติการทำงาน (Work History)
-- ========================================
CREATE TABLE work_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    
    -- ข้อมูลบริษัท/หน่วยงาน
    company_name VARCHAR(255) NOT NULL,            -- ชื่อบริษัท/หน่วยงาน
    company_type ENUM('private', 'government', 'state_enterprise', 'nonprofit', 'startup', 'other') DEFAULT 'private',
    industry VARCHAR(255),                         -- อุตสาหกรรม
    company_size ENUM('startup', 'small', 'medium', 'large', 'enterprise') DEFAULT 'medium',
    
    -- ข้อมูลตำแหน่งงาน
    position VARCHAR(255) NOT NULL,                -- ตำแหน่งงาน
    department VARCHAR(255),                       -- แผนก/ฝ่าย
    job_level ENUM('entry', 'junior', 'senior', 'lead', 'manager', 'director', 'executive') DEFAULT 'entry',
    job_description TEXT,                          -- รายละเอียดงาน
    key_achievements TEXT,                         -- ผลงานสำคัญ
    skills_used TEXT,                             -- ทักษะที่ใช้
    
    -- ข้อมูลช่วงเวลา
    start_date DATE NOT NULL,                      -- วันที่เริ่มงาน
    end_date DATE NULL,                            -- วันที่สิ้นสุดงาน
    is_current BOOLEAN DEFAULT false,              -- เป็นงานปัจจุบันหรือไม่
    employment_type ENUM('full_time', 'part_time', 'contract', 'internship', 'freelance', 'volunteer') DEFAULT 'full_time',
    
    -- ข้อมูลเงินเดือน
    salary_range VARCHAR(100),                     -- ช่วงเงินเดือน
    salary_min DECIMAL(12,2),                      -- เงินเดือนขั้นต่ำ
    salary_max DECIMAL(12,2),                      -- เงินเดือนสูงสุด
    salary_currency VARCHAR(3) DEFAULT 'THB',      -- สกุลเงิน
    benefits TEXT,                                -- สวัสดิการ
    
    -- ข้อมูลสถานที่ทำงาน
    location VARCHAR(255),                         -- สถานที่ทำงาน
    work_province VARCHAR(100),                    -- จังหวัดที่ทำงาน
    work_district VARCHAR(100),                    -- อำเภอที่ทำงาน
    work_country VARCHAR(100) DEFAULT 'Thailand',  -- ประเทศ
    is_remote BOOLEAN DEFAULT false,               -- Remote work
    travel_percentage INT DEFAULT 0,               -- เปอร์เซ็นต์การเดินทาง
    
    -- ข้อมูลเพิ่มเติม
    reason_for_leaving TEXT,                       -- เหตุผลที่ลาออก
    supervisor_name VARCHAR(255),                  -- ชื่อผู้บังคับบัญชา
    supervisor_contact VARCHAR(255),               -- ติดต่อผู้บังคับบัญชา
    can_contact_supervisor BOOLEAN DEFAULT true,   -- สามารถติดต่อได้หรือไม่
    
    -- คะแนนความพึงพอใจ (1-5)
    job_satisfaction_rating INT DEFAULT NULL,      -- ความพึงพอใจในงาน
    work_life_balance_rating INT DEFAULT NULL,     -- Work-life balance
    company_culture_rating INT DEFAULT NULL,       -- วัฒนธรรมองค์กร
    salary_satisfaction_rating INT DEFAULT NULL,   -- ความพอใจเงินเดือน
    would_recommend BOOLEAN DEFAULT NULL,          -- แนะนำให้คนอื่น
    
    -- ข้อมูลระบบ
    is_public BOOLEAN DEFAULT true,                -- แสดงสาธารณะ
    is_verified BOOLEAN DEFAULT false,             -- ยืนยันแล้ว
    notes TEXT,                                   -- หมายเหตุ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- ตารางข่าวสาร (News)
-- ========================================
CREATE TABLE news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    author_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ========================================
-- ตารางโพสต์ (Posts)
-- ========================================
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    user_id INT NOT NULL,
    status ENUM('pending', 'active', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- ตารางความคิดเห็น (Comments)
-- ========================================
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT,
    content TEXT NOT NULL,
    user_id INT,
    parent_comment_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- ========================================
-- ตารางกิจกรรม (Events)
-- ========================================
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_date DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- ตารางการลงทะเบียนกิจกรรม (Event Registrations)
-- ========================================
CREATE TABLE event_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_event_user (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- สร้าง Triggers สำหรับตรวจสอบข้อมูล
-- ========================================

-- ลบ Triggers เดิม (ถ้ามี)
DROP TRIGGER IF EXISTS work_history_before_insert;
DROP TRIGGER IF EXISTS work_history_before_update;

DELIMITER $$

CREATE TRIGGER work_history_before_insert
BEFORE INSERT ON work_history
FOR EACH ROW
BEGIN
    -- ตรวจสอบวันที่
    IF NEW.end_date IS NOT NULL AND NEW.start_date > NEW.end_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'วันที่เริ่มงานต้องไม่เกินวันที่สิ้นสุดงาน';
    END IF;
    
    -- ตรวจสอบเงินเดือน
    IF NEW.salary_min IS NOT NULL AND NEW.salary_max IS NOT NULL AND NEW.salary_min > NEW.salary_max THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'เงินเดือนขั้นต่ำต้องไม่เกินเงินเดือนสูงสุด';
    END IF;
    
    -- ตรวจสอบเปอร์เซ็นต์การเดินทาง
    IF NEW.travel_percentage < 0 OR NEW.travel_percentage > 100 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'เปอร์เซ็นต์การเดินทางต้องอยู่ระหว่าง 0-100';
    END IF;
    
    -- ตรวจสอบคะแนนความพึงพอใจ
    IF NEW.job_satisfaction_rating IS NOT NULL AND (NEW.job_satisfaction_rating < 1 OR NEW.job_satisfaction_rating > 5) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'คะแนนต้องอยู่ระหว่าง 1-5';
    END IF;
    
    IF NEW.work_life_balance_rating IS NOT NULL AND (NEW.work_life_balance_rating < 1 OR NEW.work_life_balance_rating > 5) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'คะแนนต้องอยู่ระหว่าง 1-5';
    END IF;
    
    IF NEW.company_culture_rating IS NOT NULL AND (NEW.company_culture_rating < 1 OR NEW.company_culture_rating > 5) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'คะแนนต้องอยู่ระหว่าง 1-5';
    END IF;
    
    IF NEW.salary_satisfaction_rating IS NOT NULL AND (NEW.salary_satisfaction_rating < 1 OR NEW.salary_satisfaction_rating > 5) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'คะแนนต้องอยู่ระหว่าง 1-5';
    END IF;
END$$

CREATE TRIGGER work_history_before_update
BEFORE UPDATE ON work_history
FOR EACH ROW
BEGIN
    -- ตรวจสอบวันที่
    IF NEW.end_date IS NOT NULL AND NEW.start_date > NEW.end_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'วันที่เริ่มงานต้องไม่เกินวันที่สิ้นสุดงาน';
    END IF;
    
    -- ตรวจสอบเงินเดือน
    IF NEW.salary_min IS NOT NULL AND NEW.salary_max IS NOT NULL AND NEW.salary_min > NEW.salary_max THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'เงินเดือนขั้นต่ำต้องไม่เกินเงินเดือนสูงสุด';
    END IF;
    
    -- ตรวจสอบเปอร์เซ็นต์การเดินทาง
    IF NEW.travel_percentage < 0 OR NEW.travel_percentage > 100 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'เปอร์เซ็นต์การเดินทางต้องอยู่ระหว่าง 0-100';
    END IF;
    
    -- ตรวจสอบคะแนนความพึงพอใจ
    IF NEW.job_satisfaction_rating IS NOT NULL AND (NEW.job_satisfaction_rating < 1 OR NEW.job_satisfaction_rating > 5) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'คะแนนต้องอยู่ระหว่าง 1-5';
    END IF;
    
    IF NEW.work_life_balance_rating IS NOT NULL AND (NEW.work_life_balance_rating < 1 OR NEW.work_life_balance_rating > 5) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'คะแนนต้องอยู่ระหว่าง 1-5';
    END IF;
    
    IF NEW.company_culture_rating IS NOT NULL AND (NEW.company_culture_rating < 1 OR NEW.company_culture_rating > 5) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'คะแนนต้องอยู่ระหว่าง 1-5';
    END IF;
    
    IF NEW.salary_satisfaction_rating IS NOT NULL AND (NEW.salary_satisfaction_rating < 1 OR NEW.salary_satisfaction_rating > 5) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'คะแนนต้องอยู่ระหว่าง 1-5';
    END IF;
END$$

DELIMITER ;

-- ========================================
-- สร้าง Indexes
-- ========================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_faculty ON users(faculty);
CREATE INDEX idx_users_graduation_year ON users(graduation_year);
CREATE INDEX idx_users_role ON users(role);

-- Work History indexes
CREATE INDEX idx_work_history_user_id ON work_history(user_id);
CREATE INDEX idx_work_history_is_current ON work_history(is_current);
CREATE INDEX idx_work_history_company_name ON work_history(company_name);
CREATE INDEX idx_work_history_industry ON work_history(industry);
CREATE INDEX idx_work_history_dates ON work_history(start_date, end_date);
CREATE INDEX idx_work_history_location ON work_history(work_province);

-- Other indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_comments_post_id ON comments(post_id);

-- ========================================
-- สร้าง Views
-- ========================================

-- ลบ Views เดิม (ถ้ามี)
DROP VIEW IF EXISTS work_history_complete;
DROP VIEW IF EXISTS alumni_work_statistics;
DROP VIEW IF EXISTS current_employment;

-- View: ประวัติการทำงานแบบสมบูรณ์
CREATE VIEW work_history_complete AS
SELECT 
    wh.*,
    u.name as user_name,
    u.email as user_email,
    u.faculty,
    u.major,
    u.graduation_year,
    
    -- คำนวณระยะเวลาทำงาน (วัน)
    CASE 
        WHEN wh.is_current = 1 THEN DATEDIFF(CURDATE(), wh.start_date)
        WHEN wh.end_date IS NOT NULL THEN DATEDIFF(wh.end_date, wh.start_date)
        ELSE NULL
    END as days_worked,
    
    -- คำนวณระยะเวลาทำงาน (ข้อความ)
    CASE 
        WHEN wh.is_current = 1 THEN 
            CONCAT(
                FLOOR(DATEDIFF(CURDATE(), wh.start_date) / 365), ' ปี ',
                FLOOR((DATEDIFF(CURDATE(), wh.start_date) % 365) / 30), ' เดือน'
            )
        WHEN wh.end_date IS NOT NULL THEN 
            CONCAT(
                FLOOR(DATEDIFF(wh.end_date, wh.start_date) / 365), ' ปี ',
                FLOOR((DATEDIFF(wh.end_date, wh.start_date) % 365) / 30), ' เดือน'
            )
        ELSE 'ไม่ระบุ'
    END as duration_text,
    
    -- สรุปงาน
    CONCAT(wh.position, ' ที่ ', wh.company_name) as job_summary
    
FROM work_history wh
JOIN users u ON wh.user_id = u.id;

-- View: สถิติการทำงานของศิษย์เก่า
CREATE VIEW alumni_work_statistics AS
SELECT 
    u.faculty,
    u.graduation_year,
    COUNT(DISTINCT u.id) as total_alumni,
    COUNT(DISTINCT CASE WHEN wh.is_current = 1 THEN u.id END) as employed_alumni,
    ROUND(AVG(CASE 
        WHEN wh.is_current = 1 AND wh.salary_min IS NOT NULL AND wh.salary_max IS NOT NULL 
        THEN (wh.salary_min + wh.salary_max) / 2 
        ELSE NULL
    END), 2) as avg_salary,
    COUNT(DISTINCT wh.industry) as industries_count,
    GROUP_CONCAT(DISTINCT wh.industry SEPARATOR ', ') as industries_list
FROM users u
LEFT JOIN work_history wh ON u.id = wh.user_id
GROUP BY u.faculty, u.graduation_year
ORDER BY u.graduation_year DESC, u.faculty;

-- View: ข้อมูลการทำงานปัจจุบัน
CREATE VIEW current_employment AS
SELECT 
    u.id,
    u.name,
    u.faculty,
    u.major,
    u.graduation_year,
    wh.company_name,
    wh.position,
    wh.industry,
    wh.work_province,
    wh.employment_type,
    CASE 
        WHEN wh.salary_min IS NOT NULL AND wh.salary_max IS NOT NULL 
        THEN CONCAT(FORMAT(wh.salary_min, 0), ' - ', FORMAT(wh.salary_max, 0), ' บาท')
        ELSE wh.salary_range
    END as salary_display,
    DATEDIFF(CURDATE(), wh.start_date) as days_in_job,
    wh.is_remote,
    wh.job_satisfaction_rating
FROM users u
INNER JOIN work_history wh ON u.id = wh.user_id
WHERE wh.is_current = 1
ORDER BY u.graduation_year DESC, u.name;

-- ========================================
-- เพิ่มข้อมูลเริ่มต้น
-- ========================================

-- เพิ่ม Admin
INSERT INTO users (
    title, name, first_name, last_name, password, student_id, email, phone,
    graduation_year, faculty, major, role, is_verified
) VALUES (
    'นาย', 'ผู้ดูแล ระบบ', 'ผู้ดูแล', 'ระบบ',
    '$2a$10$S3YxmEcxZBPVVW0nNI7QHuGsV2iJ4nFDQjEBQqVBp40UR6OIHFnGy', -- admin123456
    'admin', 'admin@rmu.ac.th', '0812345678',
    2566, 'คณะเทคโนโลยีสารสนเทศ', 'เทคโนโลยีสารสนเทศ',
    'admin', true
);

-- ========================================
-- สรุปข้อมูล
-- ========================================

/*
✅ ตารางในระบบ:
1. users - ข้อมูลผู้ใช้/ศิษย์เก่า
2. work_history - ประวัติการทำงาน (25+ fields)
3. news - ข่าวสาร
4. posts - โพสต์
5. comments - ความคิดเห็น
6. events - กิจกรรม
7. event_registrations - การลงทะเบียนกิจกรรม

🎯 ข้อมูลหลักใน work_history:
- บริษัท: ชื่อ, ประเภท, อุตสาหกรรม, ขนาด
- ตำแหน่ง: ตำแหน่ง, แผนก, ระดับ, รายละเอียด
- เวลา: วันเริ่ม-สิ้นสุด, งานปัจจุบัน, ประเภทการจ้าง
- เงินเดือน: ช่วง, ต่ำสุด-สูงสุด, สกุลเงิน, สวัสดิการ
- สถานที่: ที่ทำงาน, จังหวัด, ประเทศ, Remote work
- คะแนน: ความพึงพอใจ, Work-life balance, วัฒนธรรม

🔧 Features:
- Triggers สำหรับตรวจสอบข้อมูล
- Indexes สำหรับ performance
- Views สำหรับวิเคราะห์ข้อมูล
- รองรับ MySQL ทุกเวอร์ชัน
*/
