# ระบบประวัติการทำงาน (Work History) - รายละเอียดข้อมูลที่เก็บ

## 📋 ตารางหลัก: `work_history`

### 🏢 ข้อมูลบริษัท/หน่วยงาน
- **company_name** - ชื่อบริษัท/หน่วยงาน
- **company_type** - ประเภทองค์กร (เอกชน, รัฐ, รัฐวิสาหกิจ, NGO, Startup, Freelance)
- **industry** - อุตสาหกรรม/สาขาธุรกิจ
- **company_size** - ขนาดบริษัท (Startup, Small, Medium, Large, Enterprise)
- **company_website** - เว็บไซต์บริษัท
- **linkedin_company_url** - LinkedIn บริษัท

### 👤 ข้อมูลตำแหน่งงาน
- **position** - ตำแหน่งงาน
- **department** - แผนก/ฝ่าย
- **job_level** - ระดับตำแหน่ง (Entry, Junior, Senior, Lead, Manager, Director, Executive, C-Level)
- **job_description** - รายละเอียด/หน้าที่ความรับผิดชอบ
- **key_achievements** - ผลงาน/ความสำเร็จที่สำคัญ
- **skills_used** - ทักษะที่ใช้ในงาน (JSON format)

### 📅 ข้อมูลช่วงเวลา
- **start_date** - วันที่เริ่มงาน
- **end_date** - วันที่ลาออก/สิ้นสุดสัญญา
- **is_current** - เป็นงานปัจจุบันหรือไม่
- **employment_type** - ประเภทการจ้างงาน (Full-time, Part-time, Contract, Internship, Freelance, Volunteer)

### 💰 ข้อมูลค่าตอบแทน
- **salary_range** - ช่วงเงินเดือน (แบบข้อความ)
- **salary_min/max** - เงินเดือนขั้นต่ำ/สูงสุด (สำหรับคำนวณ)
- **salary_currency** - สกุลเงิน
- **benefits** - สวัสดิการที่ได้รับ

### 📍 ข้อมูลสถานที่ทำงาน
- **location** - สถานที่ทำงาน
- **work_province** - จังหวัดที่ทำงาน
- **work_district** - อำเภอที่ทำงาน
- **work_country** - ประเทศที่ทำงาน
- **is_remote** - ทำงาน Remote หรือไม่
- **travel_percentage** - เปอร์เซ็นต์การเดินทาง (0-100%)

### 🔄 ข้อมูลเหตุผลและการพัฒนา
- **reason_for_leaving** - เหตุผลที่ลาออก/เปลี่ยนงาน
- **supervisor_name** - ชื่อผู้บังคับบัญชา
- **supervisor_contact** - ข้อมูลติดต่อผู้บังคับบัญชา
- **can_contact_supervisor** - สามารถติดต่อขอรับรองได้หรือไม่
- **professional_development** - การพัฒนาตนเองในระหว่างทำงาน

### ⭐ ข้อมูลความพึงพอใจและการให้คะแนน
- **job_satisfaction_rating** - ความพึงพอใจในงาน (1-5)
- **work_life_balance_rating** - Work-life balance (1-5)
- **company_culture_rating** - วัฒนธรรมองค์กร (1-5)
- **salary_satisfaction_rating** - ความพอใจเรื่องเงินเดือน (1-5)
- **would_recommend** - แนะนำให้คนอื่นทำงานที่นี่หรือไม่

### 🔐 ข้อมูลเพิ่มเติมและความปลอดภัย
- **notes** - หมายเหตุเพิ่มเติม
- **is_public** - แสดงในโปรไฟล์สาธารณะหรือไม่
- **is_verified** - ได้รับการยืนยันแล้วหรือไม่
- **verification_document** - เอกสารยืนยัน (ชื่อไฟล์)

---

## 📊 ตารางเสริม

### 1. `work_skills` - ทักษะและความเชี่ยวชาญ
- skill_name - ชื่อทักษะ
- skill_category - หมวดหมู่ (Technical, Soft Skill, Language, Certification, Tool)
- proficiency_level - ระดับความชำนาญ (Beginner, Intermediate, Advanced, Expert)
- is_primary - ทักษะหลักหรือไม่

### 2. `work_projects` - ผลงาน/Project
- project_name - ชื่อโปรเจค
- project_description - รายละเอียดโปรเจค
- role_in_project - บทบาทในโปรเจค
- technologies_used - เทคโนโลยีที่ใช้
- project_url - URL โปรเจค
- impact_description - ผลกระทบ/ผลลัพธ์
- team_size - ขนาดทีม
- budget_range - งบประมาณโปรเจค

### 3. `work_achievements` - ใบรับรอง/รางวัล
- achievement_type - ประเภท (Award, Certification, Promotion, Recognition)
- title - ชื่อรางวัล/ใบรับรอง
- issuer - หน่วยงานที่ออก
- date_received - วันที่ได้รับ
- certificate_url - URL ใบรับรอง

### 4. `work_training` - การอบรม/พัฒนา
- training_name - ชื่อการอบรม
- training_provider - ผู้จัดอบรม
- training_type - ประเภท (Internal, External, Online, Workshop)
- duration_hours - จำนวนชั่วโมง
- skills_gained - ทักษะที่ได้รับ
- cost - ค่าใช้จ่าย
- funded_by - ใครเป็นผู้สนับสนุน

---

## 🎯 การใช้งานข้อมูล

### สำหรับผู้ใช้:
1. **สร้างโปรไฟล์ที่สมบูรณ์** - แสดงประสบการณ์การทำงานแบบละเอียด
2. **ติดตามการเติบโต** - ดูพัฒนาการในสายอาชีพ
3. **แชร์ข้อมูลกับ HR** - ส่งประวัติการทำงานที่ครบถ้วน
4. **เครือข่ายศิษย์เก่า** - ค้นหาเพื่อนที่ทำงานในสายเดียวกัน

### สำหรับระบบ:
1. **วิเคราะห์ข้อมูล** - สถิติการทำงานของศิษย์เก่า
2. **จับคู่งาน** - แนะนำโอกาสงานที่เหมาะสม
3. **รายงานสำหรับมหาวิทยาลัย** - ติดตามผลศิษย์เก่า
4. **การค้นหาและกรอง** - ค้นหาศิษย์เก่าตามเกณฑ์ต่างๆ

### สำหรับ Admin:
1. **จัดการข้อมูล** - ตรวจสอบและยืนยันข้อมูล
2. **สถิติและรายงาน** - วิเคราะห์แนวโน้มการทำงาน
3. **ระบบแนะนำ** - แนะนำศิษย์เก่าให้บริษัทต่างๆ

---

## 🔍 ตัวอย่างการ Query ข้อมูล

```sql
-- ดูประวัติการทำงานแบบสมบูรณ์
SELECT * FROM work_history_complete WHERE user_id = 1;

-- หาศิษย์เก่าที่ทำงานในอุตสาหกรรมเดียวกัน
SELECT DISTINCT u.name, wh.company_name, wh.position 
FROM work_history wh 
JOIN users u ON wh.user_id = u.id 
WHERE wh.industry = 'Technology' AND wh.is_current = 1;

-- สถิติเงินเดือนเฉลี่ยตามคณะ
SELECT u.faculty, AVG((wh.salary_min + wh.salary_max)/2) as avg_salary
FROM work_history wh 
JOIN users u ON wh.user_id = u.id 
WHERE wh.is_current = 1 AND wh.salary_min IS NOT NULL
GROUP BY u.faculty;
```

---

## 🚀 ความสามารถเพิ่มเติม

1. **Dashboard Analytics** - กราฟแสดงสถิติการทำงาน
2. **Export Resume** - ส่งออกประวัติการทำงานเป็น PDF
3. **Job Matching** - แนะนำงานที่เหมาะสมตามประสบการณ์
4. **Network Building** - เชื่อมต่อศิษย์เก่าในสายงานเดียวกัน
5. **Skill Gap Analysis** - วิเคราะห์ทักษะที่ขาดในตลาดงาน
