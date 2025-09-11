-- ========================================
-- Enhanced Work History Database Schema
-- ========================================

-- อัปเดตตาราง work_history ที่มีอยู่เดิม
DROP TABLE IF EXISTS work_history;

CREATE TABLE work_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    
    -- ข้อมูลบริษัท/หน่วยงาน
    company_name VARCHAR(255) NOT NULL,           -- ชื่อบริษัท/หน่วยงาน
    company_type ENUM('private', 'government', 'state_enterprise', 'nonprofit', 'startup', 'freelance', 'other') DEFAULT 'private', -- ประเภทองค์กร
    industry VARCHAR(255),                        -- อุตสาหกรรม/สาขาธุรกิจ
    company_size ENUM('startup', 'small', 'medium', 'large', 'enterprise') DEFAULT 'medium', -- ขนาดบริษัท
    
    -- ข้อมูลตำแหน่งงาน
    position VARCHAR(255) NOT NULL,               -- ตำแหน่งงาน
    department VARCHAR(255),                      -- แผนก/ฝ่าย
    job_level ENUM('entry', 'junior', 'senior', 'lead', 'manager', 'director', 'executive', 'c_level') DEFAULT 'entry', -- ระดับตำแหน่ง
    job_description TEXT,                         -- รายละเอียด/หน้าที่ความรับผิดชอบ
    key_achievements TEXT,                        -- ผลงาน/ความสำเร็จที่สำคัญ
    skills_used TEXT,                            -- ทักษะที่ใช้ในงาน (JSON format)
    
    -- ข้อมูลช่วงเวลา
    start_date DATE NOT NULL,                     -- วันที่เริ่มงาน
    end_date DATE NULL,                           -- วันที่ลาออก/สิ้นสุดสัญญา
    is_current BOOLEAN DEFAULT false,             -- เป็นงานปัจจุบันหรือไม่
    employment_type ENUM('full_time', 'part_time', 'contract', 'internship', 'freelance', 'volunteer') DEFAULT 'full_time', -- ประเภทการจ้างงาน
    
    -- ข้อมูลค่าตอบแทน
    salary_range VARCHAR(50),                     -- ช่วงเงินเดือน
    salary_min DECIMAL(12,2),                     -- เงินเดือนขั้นต่ำ (สำหรับคำนวณ)
    salary_max DECIMAL(12,2),                     -- เงินเดือนสูงสุด (สำหรับคำนวณ)
    salary_currency VARCHAR(3) DEFAULT 'THB',     -- สกุลเงิน
    benefits TEXT,                               -- สวัสดิการที่ได้รับ
    
    -- ข้อมูลสถานที่ทำงาน
    location VARCHAR(255),                        -- สถานที่ทำงาน
    work_province VARCHAR(100),                   -- จังหวัดที่ทำงาน
    work_district VARCHAR(100),                   -- อำเภอที่ทำงาน
    work_country VARCHAR(100) DEFAULT 'Thailand', -- ประเทศที่ทำงาน
    is_remote BOOLEAN DEFAULT false,              -- ทำงาน Remote หรือไม่
    travel_percentage INT DEFAULT 0,              -- เปอร์เซ็นต์การเดินทาง (0-100)
    
    -- ข้อมูลเหตุผลและการพัฒนา
    reason_for_leaving TEXT,                      -- เหตุผลที่ลาออก/เปลี่ยนงาน
    supervisor_name VARCHAR(255),                 -- ชื่อผู้บังคับบัญชา
    supervisor_contact VARCHAR(255),              -- ข้อมูลติดต่อผู้บังคับบัญชา
    can_contact_supervisor BOOLEAN DEFAULT true,  -- สามารถติดต่อขอรับรองได้หรือไม่
    professional_development TEXT,                -- การพัฒนาตนเองในระหว่างทำงาน
    
    -- ข้อมูลความพึงพอใจและการให้คะแนน
    job_satisfaction_rating INT DEFAULT NULL,     -- ความพึงพอใจในงาน (1-5)
    work_life_balance_rating INT DEFAULT NULL,    -- Work-life balance (1-5)
    company_culture_rating INT DEFAULT NULL,      -- วัฒนธรรมองค์กร (1-5)
    salary_satisfaction_rating INT DEFAULT NULL,  -- ความพอใจเรื่องเงินเดือน (1-5)
    would_recommend BOOLEAN DEFAULT NULL,         -- แนะนำให้คนอื่นทำงานที่นี่หรือไม่
    
    -- ข้อมูลเพิ่มเติม
    company_website VARCHAR(255),                 -- เว็บไซต์บริษัท
    linkedin_company_url VARCHAR(255),            -- LinkedIn บริษัท
    notes TEXT,                                  -- หมายเหตุเพิ่มเติม
    is_public BOOLEAN DEFAULT true,               -- แสดงในโปรไฟล์สาธารณะหรือไม่
    is_verified BOOLEAN DEFAULT false,            -- ได้รับการยืนยันแล้วหรือไม่
    verification_document VARCHAR(255),           -- เอกสารยืนยัน (ชื่อไฟล์)
    
    -- ข้อมูลระบบ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,                              -- ใครเป็นคนสร้าง (กรณี admin เพิ่มให้)
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Constraints
    CHECK (start_date <= COALESCE(end_date, CURDATE())),
    CHECK (salary_min <= salary_max),
    CHECK (job_satisfaction_rating >= 1 AND job_satisfaction_rating <= 5),
    CHECK (work_life_balance_rating >= 1 AND work_life_balance_rating <= 5),
    CHECK (company_culture_rating >= 1 AND company_culture_rating <= 5),
    CHECK (salary_satisfaction_rating >= 1 AND salary_satisfaction_rating <= 5),
    CHECK (travel_percentage >= 0 AND travel_percentage <= 100)
);

-- สร้าง Indexes เพื่อเพิ่มประสิทธิภาพ
CREATE INDEX idx_work_history_user_id ON work_history(user_id);
CREATE INDEX idx_work_history_is_current ON work_history(is_current);
CREATE INDEX idx_work_history_company_name ON work_history(company_name);
CREATE INDEX idx_work_history_position ON work_history(position);
CREATE INDEX idx_work_history_industry ON work_history(industry);
CREATE INDEX idx_work_history_dates ON work_history(start_date, end_date);
CREATE INDEX idx_work_history_location ON work_history(work_province, work_district);
CREATE INDEX idx_work_history_public ON work_history(is_public);

-- ========================================
-- ตารางเพิ่มเติมสำหรับข้อมูลที่เกี่ยวข้อง
-- ========================================

-- ตารางทักษะและความเชี่ยวชาญ
CREATE TABLE work_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    work_history_id INT NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    skill_category ENUM('technical', 'soft', 'language', 'certification', 'tool', 'other') DEFAULT 'technical',
    proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
    is_primary BOOLEAN DEFAULT false,            -- ทักษะหลักหรือไม่
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (work_history_id) REFERENCES work_history(id) ON DELETE CASCADE,
    UNIQUE KEY unique_work_skill (work_history_id, skill_name)
);

-- ตารางผลงาน/Project ที่ทำในแต่ละงาน
CREATE TABLE work_projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    work_history_id INT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT,
    role_in_project VARCHAR(255),               -- บทบาทในโปรเจค
    technologies_used TEXT,                     -- เทคโนโลยีที่ใช้
    project_url VARCHAR(255),                   -- URL โปรเจค (ถ้ามี)
    start_date DATE,
    end_date DATE,
    impact_description TEXT,                    -- ผลกระทบ/ผลลัพธ์ของโปรเจค
    team_size INT,                             -- ขนาดทีม
    budget_range VARCHAR(50),                   -- งบประมาณโปรเจค (ถ้าเหมาะสม)
    is_featured BOOLEAN DEFAULT false,          -- เป็นโปรเจคเด่นหรือไม่
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (work_history_id) REFERENCES work_history(id) ON DELETE CASCADE
);

-- ตารางใบรับรอง/รางวัลที่ได้รับในช่วงทำงาน
CREATE TABLE work_achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    work_history_id INT NOT NULL,
    achievement_type ENUM('award', 'certification', 'promotion', 'recognition', 'milestone', 'other') DEFAULT 'recognition',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    issuer VARCHAR(255),                        -- หน่วยงานที่ออกใบรับรอง/รางวัล
    date_received DATE,
    certificate_url VARCHAR(255),               -- URL ใบรับรอง
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (work_history_id) REFERENCES work_history(id) ON DELETE CASCADE
);

-- ตารางการอบรม/พัฒนาตนเองในช่วงทำงาน
CREATE TABLE work_training (
    id INT PRIMARY KEY AUTO_INCREMENT,
    work_history_id INT NOT NULL,
    training_name VARCHAR(255) NOT NULL,
    training_provider VARCHAR(255),
    training_type ENUM('internal', 'external', 'online', 'workshop', 'conference', 'seminar') DEFAULT 'internal',
    duration_hours INT,                         -- จำนวนชั่วโมง
    completion_date DATE,
    certificate_received BOOLEAN DEFAULT false,
    certificate_url VARCHAR(255),
    skills_gained TEXT,                         -- ทักษะที่ได้รับ
    cost DECIMAL(10,2),                        -- ค่าใช้จ่าย
    funded_by ENUM('company', 'self', 'government', 'other') DEFAULT 'company',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (work_history_id) REFERENCES work_history(id) ON DELETE CASCADE
);

-- ========================================
-- View สำหรับดึงข้อมูลแบบสมบูรณ์
-- ========================================

CREATE VIEW work_history_complete AS
SELECT 
    wh.*,
    u.name as user_name,
    u.email as user_email,
    u.faculty,
    u.major,
    u.graduation_year,
    
    -- นับจำนวนข้อมูลเพิ่มเติม
    (SELECT COUNT(*) FROM work_skills ws WHERE ws.work_history_id = wh.id) as skills_count,
    (SELECT COUNT(*) FROM work_projects wp WHERE wp.work_history_id = wh.id) as projects_count,
    (SELECT COUNT(*) FROM work_achievements wa WHERE wa.work_history_id = wh.id) as achievements_count,
    (SELECT COUNT(*) FROM work_training wt WHERE wt.work_history_id = wh.id) as training_count,
    
    -- คำนวณระยะเวลาทำงาน
    CASE 
        WHEN wh.is_current = 1 THEN DATEDIFF(CURDATE(), wh.start_date)
        ELSE DATEDIFF(wh.end_date, wh.start_date)
    END as days_worked,
    
    -- สร้าง summary
    CONCAT(wh.position, ' ที่ ', wh.company_name) as job_summary
    
FROM work_history wh
JOIN users u ON wh.user_id = u.id;

-- ========================================
-- ข้อมูลตัวอย่าง (Optional)
-- ========================================

-- INSERT ข้อมูลตัวอย่าง (ถ้าต้องการ)
/*
INSERT INTO work_history (
    user_id, company_name, company_type, industry, position, department,
    job_level, job_description, start_date, is_current, employment_type,
    salary_range, location, work_province, work_country
) VALUES (
    1, 'บริษัท เทคโนโลยี จำกัด', 'private', 'Technology', 'Software Developer', 'IT Department',
    'junior', 'พัฒนาระบบเว็บแอปพลิเคชัน', '2024-01-15', true, 'full_time',
    '25,000-35,000 บาท', 'กรุงเทพมหานคร', 'กรุงเทพมหานคร', 'Thailand'
);
*/

-- ========================================
-- Stored Procedures (Optional)
-- ========================================

DELIMITER //

-- Procedure สำหรับดึงประวัติการทำงานพร้อมข้อมูลเพิ่มเติม
CREATE PROCEDURE GetCompleteWorkHistory(IN userId INT)
BEGIN
    SELECT * FROM work_history_complete WHERE user_id = userId ORDER BY is_current DESC, start_date DESC;
END//

-- Procedure สำหรับคำนวณสถิติการทำงาน
CREATE PROCEDURE GetWorkStatistics(IN userId INT)
BEGIN
    SELECT 
        COUNT(*) as total_jobs,
        SUM(CASE WHEN is_current = 1 THEN 1 ELSE 0 END) as current_jobs,
        AVG(CASE 
            WHEN is_current = 1 THEN DATEDIFF(CURDATE(), start_date)
            ELSE DATEDIFF(end_date, start_date)
        END) as avg_job_duration_days,
        COUNT(DISTINCT industry) as industries_worked,
        COUNT(DISTINCT work_province) as provinces_worked
    FROM work_history 
    WHERE user_id = userId;
END //

DELIMITER ;
