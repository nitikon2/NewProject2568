# 🎓 Alumni Management System

ระบบจัดการศิษย์เก่า มหาวิทยาลัยราชมงคลอีสาน

## ✨ ฟีเจอร์หลัก

- 📝 การจัดการข้อมูลส่วนตัวของศิษย์เก่า
- 💼 **ประวัติการทำงานพร้อมที่อยู่แบบ dropdown** (ใหม่!)
- 📰 ระบบข่าวสารและประกาศ
- 📅 การจัดการกิจกรรม
- 💬 ระบบฟอรัมและการแสดงความคิดเห็น
- 👥 การค้นหาและเชื่อมต่อกับศิษย์เก่า

## 🆕 ฟีเจอร์ใหม่ล่าสุด

### ระบบที่อยู่การทำงานแบบ Smart Dropdown
- เลือกจังหวัด → อำเภอ/เขต → ตำบล/แขวง
- รหัสไปรษณีย์เติมอัตโนมัติ
- ข้อมูลสม่ำเสมอและถูกต้อง
- UX ที่ดีขึ้น เหมือนกับหน้าสมัครสมาชิก

## 🚀 วิธีการติดตั้งและใช้งาน

### วิธีที่ 1: ใช้ Batch Script (แนะนำ)
```bash
# Double-click ไฟล์นี้
start.bat
```

### วิธีที่ 2: Manual Start

#### Backend
```bash
cd alumni-management/backend
node server.js
```

#### Frontend  
```bash
cd alumni-management/frontend
npx react-scripts start
```

## 📖 คู่มือการใช้งาน

📋 **คู่มือฉบับเต็ม:** [USER_GUIDE.md](USER_GUIDE.md)

### การใช้งานฟีเจอร์ที่อยู่ใหม่

1. **เข้าหน้าประวัติการทำงาน**
2. **คลิก "เพิ่มประวัติการทำงานใหม่"**
3. **ในขั้นตอนที่ 2 - รายละเอียด:**
   - เลือกจังหวัด
   - เลือกอำเภอ (จะเปิดหลังเลือกจังหวัด)
   - เลือกตำบล (จะเปิดหลังเลือกอำเภอ)
   - รหัสไปรษณีย์จะเติมอัตโนมัติ

## 🛠️ Technical Details

### Database Schema
```sql
-- ฟิลด์ใหม่ในตาราง work_history
work_subdistrict VARCHAR(100) -- ตำบล/แขวงที่ทำงาน
work_zipcode VARCHAR(10)      -- รหัสไปรษณีย์ที่ทำงาน
```

### API Endpoints
```javascript
// POST /api/work-history - เพิ่มประวัติการทำงาน
// PUT /api/work-history/:id - แก้ไขประวัติการทำงาน
// รองรับฟิลด์ work_subdistrict และ work_zipcode
```

## 📁 โครงสร้างโปรเจค

```
alumni-management/
├── backend/                 # Node.js + Express API
│   ├── routes/workHistory.js   # API ประวัติการทำงาน (อัปเดต)
│   ├── server.js              # Main server
│   └── ...
├── frontend/               # React Application  
│   ├── src/components/pages/
│   │   └── WorkHistoryNew.js  # หน้าประวัติการทำงาน (อัปเดต)
│   └── ...
├── start.bat              # Quick launcher
├── USER_GUIDE.md          # คู่มือการใช้งาน
└── README.md              # ไฟล์นี้
```

## 🔧 Requirements

- **Node.js** 14.0.0 หรือใหม่กว่า
- **MySQL** 5.7 หรือใหม่กว่า
- **Web Browser** (Chrome, Firefox, Safari, Edge)

## 📝 การอัปเดตล่าสุด

### Version 1.1.0 (13 กันยายน 2025)
- ✅ เพิ่มระบบที่อยู่การทำงานแบบ dropdown
- ✅ รหัสไปรษณีย์เติมอัตโนมัติ
- ✅ อัปเดต UI/UX ให้สม่ำเสมอกับหน้าสมัครสมาชิก
- ✅ เพิ่มฟิลด์ work_subdistrict และ work_zipcode ในฐานข้อมูล

## 🐛 การรายงานปัญหา

หากพบปัญหาการใช้งาน:

1. ตรวจสอบ [USER_GUIDE.md](USER_GUIDE.md) ก่อน
2. ดู Console Log ใน browser (F12)
3. ตรวจสอบ Terminal output
4. ตรวจสอบ MySQL connection

## 📞 การติดต่อ

- **Repository:** NewProject2568
- **Owner:** nitikon2
- **Branch:** main

## 📄 License

© 2025 มหาวิทยาลัยราชมงคลอีสาน

---

**🎯 พร้อมใช้งาน!** ใช้ `start.bat` เพื่อเริ่มต้นระบบ