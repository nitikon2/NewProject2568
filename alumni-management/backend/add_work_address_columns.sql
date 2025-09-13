-- เพิ่ม column สำหรับที่อยู่การทำงาน
-- ตรวจสอบว่าตาราง work_history มีอยู่หรือไม่
-- และเพิ่ม column work_subdistrict และ work_zipcode

-- เพิ่ม column work_subdistrict และ work_zipcode ถ้ายังไม่มี
ALTER TABLE work_history 
ADD COLUMN IF NOT EXISTS work_subdistrict VARCHAR(100) COMMENT 'ตำบลที่ทำงาน';

ALTER TABLE work_history 
ADD COLUMN IF NOT EXISTS work_zipcode VARCHAR(10) COMMENT 'รหัสไปรษณีย์ที่ทำงาน';

-- อัปเดต index ให้รวม work_subdistrict ด้วย
DROP INDEX IF EXISTS idx_work_history_location;
CREATE INDEX idx_work_history_location ON work_history(work_province, work_district, work_subdistrict);

-- แสดงโครงสร้างตารางที่อัปเดตแล้ว
DESCRIBE work_history;