-- เพิ่มคอลัมน์ที่หายไปในตาราง work_history

-- ตรวจสอบและเพิ่มคอลัมน์ work_subdistrict
ALTER TABLE work_history 
ADD COLUMN IF NOT EXISTS work_subdistrict VARCHAR(100) AFTER work_district;

-- ตรวจสอบและเพิ่มคอลัมน์ work_zipcode  
ALTER TABLE work_history 
ADD COLUMN IF NOT EXISTS work_zipcode VARCHAR(10) AFTER work_subdistrict;

-- ตรวจสอบและเพิ่มคอลัมน์ team_size
ALTER TABLE work_history 
ADD COLUMN IF NOT EXISTS team_size VARCHAR(50) AFTER work_zipcode;

-- ตรวจสอบและเพิ่มคอลัมน์ technologies_used
ALTER TABLE work_history 
ADD COLUMN IF NOT EXISTS technologies_used TEXT AFTER skills_used;

-- แสดงโครงสร้างตารางเพื่อยืนยัน
DESCRIBE work_history;