const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// กำหนดการเชื่อมต่อฐานข้อมูล
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'alumni_db',
    charset: 'utf8mb4'
};

// ข้อมูลจำลองผู้ใช้ 15 คน
const mockUsers = [
    {
        title: 'นาย',
        first_name: 'สมชาย',
        last_name: 'ใจดี',
        student_id: '6501234001',
        email: 'somchai.jaidee@gmail.com',
        phone: '0812345001',
        graduation_year: 2565,
        faculty: 'คณะเทคโนโลยีสารสนเทศ',
        major: 'วิทยาการคอมพิวเตอร์',
        gpa: 3.25,
        bio: 'มีความสนใจในการพัฒนาเว็บแอปพลิเคชันและระบบฐานข้อมูล',
        occupation: 'นักพัฒนาระบบ',
        position: 'Software Developer',
        workplace: 'บริษัท เทคโนโลยีเพื่อชีวิต จำกัด',
        salary: '25,000-35,000 บาท',
        address: '123/45 หมู่ 2 ตำบลบางปะกอก',
        province: 'กรุงเทพมหานคร',
        district: 'บางขุนเทียน',
        subdistrict: 'บางปะกอก',
        zipcode: '10180'
    },
    {
        title: 'นางสาว',
        first_name: 'สุภา',
        last_name: 'รักเรียน',
        student_id: '6501234002',
        email: 'supha.learn@hotmail.com',
        phone: '0812345002',
        graduation_year: 2565,
        faculty: 'คณะบริหารธุรกิจ',
        major: 'การตลาด',
        gpa: 3.65,
        bio: 'ชอบงานด้านการตลาดดิจิทัลและการสื่อสารองค์กร',
        occupation: 'นักการตลาด',
        position: 'Digital Marketing Specialist',
        workplace: 'บริษัท โฆษณาสร้างสรรค์ จำกัด',
        salary: '22,000-30,000 บาท',
        address: '67/89 ซอยพหลโยธิน 15',
        province: 'กรุงเทพมหานคร',
        district: 'จตุจักร',
        subdistrict: 'ลาดยาว',
        zipcode: '10900'
    },
    {
        title: 'นาย',
        first_name: 'วิชาญ',
        last_name: 'เก่งมาก',
        student_id: '6401234003',
        email: 'wichan.skill@yahoo.com',
        phone: '0812345003',
        graduation_year: 2564,
        faculty: 'คณะวิศวกรรมศาสตร์',
        major: 'วิศวกรรมไฟฟ้า',
        gpa: 3.85,
        bio: 'มีประสบการณ์ในการออกแบบระบบไฟฟ้าและพลังงานทดแทน',
        occupation: 'วิศวกรไฟฟ้า',
        position: 'Electrical Engineer',
        workplace: 'การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย',
        salary: '35,000-45,000 บาท',
        address: '456 ถนนงามวงศ์วาน แขวงลาดยาว',
        province: 'กรุงเทพมหานคร',
        district: 'จตุจักร',
        subdistrict: 'ลาดยาว',
        zipcode: '10900'
    },
    {
        title: 'นางสาว',
        first_name: 'มนัสวี',
        last_name: 'สวยงาม',
        student_id: '6401234004',
        email: 'manasawee.beauty@gmail.com',
        phone: '0812345004',
        graduation_year: 2564,
        faculty: 'คณะศิลปศาสตร์',
        major: 'ภาษาอังกฤษ',
        gpa: 3.45,
        bio: 'รักการสอนและการแปลภาษา มีประสบการณ์ทำงานกับองค์กรต่างชาติ',
        occupation: 'ครูภาษาอังกฤษ',
        position: 'English Teacher',
        workplace: 'โรงเรียนนานาชาติกรุงเทพ',
        salary: '28,000-35,000 บาท',
        address: '789/12 ซอยสุขุมวิท 39',
        province: 'กรุงเทพมหานคร',
        district: 'วัฒนา',
        subdistrict: 'คลองตันเหนือ',
        zipcode: '10110'
    },
    {
        title: 'นาย',
        first_name: 'ธนกร',
        last_name: 'มั่งมี',
        student_id: '6301234005',
        email: 'thanakorn.rich@outlook.com',
        phone: '0812345005',
        graduation_year: 2563,
        faculty: 'คณะเศรษฐศาสตร์',
        major: 'เศรษฐศาสตร์',
        gpa: 3.75,
        bio: 'สนใจในการวิเคราะห์ตลาดการเงินและการลงทุน',
        occupation: 'นักวิเคราะห์การลงทุน',
        position: 'Investment Analyst',
        workplace: 'บริษัท หลักทรัพย์ไทยพาณิชย์ จำกัด',
        salary: '40,000-55,000 บาท',
        address: '321 อาคารสาทรซิตี้ ถนนสาทรใต้',
        province: 'กรุงเทพมหานคร',
        district: 'บางรัก',
        subdistrict: 'สีลม',
        zipcode: '10500'
    },
    {
        title: 'นางสาว',
        first_name: 'อรุณี',
        last_name: 'สายแสง',
        student_id: '6301234006',
        email: 'arunee.morning@gmail.com',
        phone: '0812345006',
        graduation_year: 2563,
        faculty: 'คณะพยาบาลศาสตร์',
        major: 'พยาบาลศาสตร์',
        gpa: 3.95,
        bio: 'มีใจรักในการดูแลผู้ป่วยและสนใจงานด้านสาธารณสุข',
        occupation: 'พยาบาลวิชาชีพ',
        position: 'Registered Nurse',
        workplace: 'โรงพยาบาลราชวิถี',
        salary: '25,000-32,000 บาท',
        address: '555 ถนนราชวิถี แขวงทุ่งพญาไท',
        province: 'กรุงเทพมหานคร',
        district: 'ราชเทวี',
        subdistrict: 'ทุ่งพญาไท',
        zipcode: '10400'
    },
    {
        title: 'นาย',
        first_name: 'ปรเมษฐ์',
        last_name: 'ดีใจ',
        student_id: '6201234007',
        email: 'porames.happy@hotmail.com',
        phone: '0812345007',
        graduation_year: 2562,
        faculty: 'คณะเทคโนโลยีสารสนเทศ',
        major: 'เทคโนโลยีสารสนเทศ',
        gpa: 3.55,
        bio: 'มีประสบการณ์ในการพัฒนาแอปพลิเคชันมือถือและระบบ AI',
        occupation: 'นักพัฒนาแอปพลิเคชัน',
        position: 'Mobile App Developer',
        workplace: 'สตาร์ทอัพ TechInnovate',
        salary: '35,000-50,000 บาท',
        address: '888/99 ถนนพญาไท แขวงปทุมวัน',
        province: 'กรุงเทพมหานคร',
        district: 'ปทุมวัน',
        subdistrict: 'ปทุมวัน',
        zipcode: '10330'
    },
    {
        title: 'นางสาว',
        first_name: 'วรรณดี',
        last_name: 'เพียรมุ่ง',
        student_id: '6201234008',
        email: 'wandee.effort@yahoo.com',
        phone: '0812345008',
        graduation_year: 2562,
        faculty: 'คณะสถาปัตยกรรมศาสตร์',
        major: 'สถาปัตยกรรม',
        gpa: 3.35,
        bio: 'ชอบการออกแบบอาคารที่เป็นมิตรกับสิ่งแวดล้อม',
        occupation: 'สถาปนิก',
        position: 'Architect',
        workplace: 'บริษัท A+ Design จำกัด',
        salary: '30,000-40,000 บาท',
        address: '147/25 ซอยอารีย์ 2 ถนนพหลโยธิน',
        province: 'กรุงเทพมหานคร',
        district: 'ปทุมวัน',
        subdistrict: 'ลุมพินี',
        zipcode: '10330'
    },
    {
        title: 'นาย',
        first_name: 'กิตติพงษ์',
        last_name: 'สูงส่ง',
        student_id: '6101234009',
        email: 'kittipong.tall@gmail.com',
        phone: '0812345009',
        graduation_year: 2561,
        faculty: 'คณะนิติศาสตร์',
        major: 'นิติศาสตร์',
        gpa: 3.65,
        bio: 'สนใจกฎหมายธุรกิจและทรัพย์สินทางปัญญา',
        occupation: 'ทนายความ',
        position: 'Associate Lawyer',
        workplace: 'สำนักงานกฎหมาย ABC & Partners',
        salary: '45,000-60,000 บาท',
        address: '789/456 อาคารจีพีเอฟ ถนนวิทยุ',
        province: 'กรุงเทพมหานคร',
        district: 'ปทุมวัน',
        subdistrict: 'ลุมพินี',
        zipcode: '10330'
    },
    {
        title: 'นางสาว',
        first_name: 'ปิยนุช',
        last_name: 'น่ารัก',
        student_id: '6101234010',
        email: 'piyanuch.cute@outlook.com',
        phone: '0812345010',
        graduation_year: 2561,
        faculty: 'คณะครุศาสตร์',
        major: 'การศึกษาปฐมวัย',
        gpa: 3.85,
        bio: 'รักเด็กและสนใจในการพัฒนาการเรียนรู้ในวัยเด็ก',
        occupation: 'ครูปฐมวัย',
        position: 'Kindergarten Teacher',
        workplace: 'โรงเรียนอนุบาลสายรุ้ง',
        salary: '20,000-28,000 บาท',
        address: '258/74 หมู่บ้านสวนผึ้ง ถนนสุขาภิบาล 5',
        province: 'กรุงเทพมหานคร',
        district: 'สายไหม',
        subdistrict: 'สายไหม',
        zipcode: '10220'
    },
    {
        title: 'นาย',
        first_name: 'รัฐพล',
        last_name: 'แข็งแกร่ง',
        student_id: '6001234011',
        email: 'ratthapol.strong@gmail.com',
        phone: '0812345011',
        graduation_year: 2560,
        faculty: 'คณะแพทยศาสตร์',
        major: 'แพทยศาสตร์',
        gpa: 3.95,
        bio: 'มีความสนใจในการรักษาโรคทางเดินหายใจและการแพทย์ฉุกเฉิน',
        occupation: 'แพทย์',
        position: 'Medical Doctor',
        workplace: 'โรงพยาบาลศิริราช',
        salary: '80,000-120,000 บาท',
        address: '999 ถนนพรานนก แขวงบางขุนพรหม',
        province: 'กรุงเทพมหานคร',
        district: 'บางกอกน้อย',
        subdistrict: 'บางขุนพรหม',
        zipcode: '10700'
    },
    {
        title: 'นางสาว',
        first_name: 'สุวรรณา',
        last_name: 'ทองคำ',
        student_id: '6001234012',
        email: 'suwanna.gold@hotmail.com',
        phone: '0812345012',
        graduation_year: 2560,
        faculty: 'คณะเภสัชศาสตร์',
        major: 'เภสัชศาสตร์',
        gpa: 3.75,
        bio: 'สนใจในการวิจัยยาและการให้คำปรึกษาด้านการใช้ยา',
        occupation: 'เภสัชกร',
        position: 'Clinical Pharmacist',
        workplace: 'โรงพยาบาลจุฬาลงกรณ์',
        salary: '35,000-50,000 บาท',
        address: '1873 ถนนพระรามสี่ แขวงปทุมวัน',
        province: 'กรุงเทพมหานคร',
        district: 'ปทุมวัน',
        subdistrict: 'ปทุมวัน',
        zipcode: '10330'
    },
    {
        title: 'นาย',
        first_name: 'อดิศักดิ์',
        last_name: 'เจริญรุ่ง',
        student_id: '5901234013',
        email: 'adisak.prosper@yahoo.com',
        phone: '0812345013',
        graduation_year: 2559,
        faculty: 'คณะวิศวกรรมศาสตร์',
        major: 'วิศวกรรมโยธา',
        gpa: 3.45,
        bio: 'มีประสบการณ์ในการออกแบบและก่อสร้างโครงสร้างขนาดใหญ่',
        occupation: 'วิศวกรโยธา',
        position: 'Civil Engineer',
        workplace: 'บริษัท ไทยคอนสตรัคชั่น จำกัด',
        salary: '40,000-55,000 บาท',
        address: '741/85 ถนนลาดพร้าว แขวงลาดพร้าว',
        province: 'กรุงเทพมหานคร',
        district: 'ลาดพร้าว',
        subdistrict: 'ลาดพร้าว',
        zipcode: '10230'
    },
    {
        title: 'นางสาว',
        first_name: 'นิภา',
        last_name: 'ใสสุข',
        student_id: '5901234014',
        email: 'nipha.clear@gmail.com',
        phone: '0812345014',
        graduation_year: 2559,
        faculty: 'คณะวิทยาศาสตร์',
        major: 'เคมี',
        gpa: 3.55,
        bio: 'สนใจในการวิจัยและพัฒนาผลิตภัณฑ์เคมีเพื่อสิ่งแวดล้อม',
        occupation: 'นักเคมี',
        position: 'Research Chemist',
        workplace: 'สถาบันวิจัยวิทยาศาสตร์และเทคโนโลยี',
        salary: '28,000-38,000 บาท',
        address: '963/124 ถนนรามคำแหง แขวงหัวหมาก',
        province: 'กรุงเทพมหานคร',
        district: 'บางกะปิ',
        subdistrict: 'หัวหมาก',
        zipcode: '10240'
    },
    {
        title: 'นาย',
        first_name: 'สุรเชษฐ์',
        last_name: 'มีเงิน',
        student_id: '5801234015',
        email: 'surachet.money@outlook.com',
        phone: '0812345015',
        graduation_year: 2558,
        faculty: 'คณะบัญชี',
        major: 'บัญชี',
        gpa: 3.65,
        bio: 'มีประสบการณ์ในการตรวจสอบบัญชีและการวางแผนทางการเงิน',
        occupation: 'นักบัญชี',
        position: 'Senior Accountant',
        workplace: 'บริษัท สำนักงานบัญชีมืออาชีพ จำกัด',
        salary: '35,000-45,000 บาท',
        address: '147/258 ถนนสีลม แขวงสีลม',
        province: 'กรุงเทพมหานคร',
        district: 'บางรัก',
        subdistrict: 'สีลม',
        zipcode: '10500'
    }
];

// ข้อมูลประวัติการทำงานสำหรับแต่ละคน
const workHistoryData = [
    // สมชาย ใจดี - งานปัจจุบัน + งานเก่า 1 งาน
    [
        {
            company_name: 'บริษัท เทคโนโลยีเพื่อชีวิต จำกัด',
            company_type: 'private',
            industry: 'เทคโนโลยีสารสนเทศ',
            company_size: 'medium',
            position: 'Software Developer',
            department: 'IT Development',
            job_level: 'junior',
            job_description: 'พัฒนาเว็บแอปพลิเคชันด้วย React และ Node.js',
            key_achievements: 'พัฒนาระบบจัดการลูกค้าที่ช่วยเพิ่มประสิทธิภาพ 30%',
            skills_used: 'React, Node.js, MySQL, Git',
            start_date: '2023-06-15',
            end_date: null,
            is_current: true,
            employment_type: 'full_time',
            salary_range: '25,000-35,000 บาท',
            salary_min: 25000,
            salary_max: 35000,
            work_province: 'กรุงเทพมหานคร',
            job_satisfaction_rating: 4,
            work_life_balance_rating: 4,
            company_culture_rating: 4
        },
        {
            company_name: 'บริษัท สตาร์ทอัพ ABC จำกัด',
            company_type: 'startup',
            industry: 'เทคโนโลยีสารสนเทศ',
            company_size: 'small',
            position: 'Junior Developer',
            department: 'Development',
            job_level: 'entry',
            job_description: 'เรียนรู้การพัฒนาเว็บและช่วยงานทีม',
            start_date: '2022-08-01',
            end_date: '2023-06-10',
            is_current: false,
            employment_type: 'full_time',
            salary_range: '18,000-22,000 บาท',
            salary_min: 18000,
            salary_max: 22000,
            work_province: 'กรุงเทพมหานคร',
            reason_for_leaving: 'ย้ายไปบริษัทที่ใหญ่กว่าเพื่อความก้าวหน้า',
            job_satisfaction_rating: 3,
            work_life_balance_rating: 3,
            company_culture_rating: 4
        }
    ],
    // สุภา รักเรียน - งานปัจจุบัน
    [
        {
            company_name: 'บริษัท โฆษณาสร้างสรรค์ จำกัด',
            company_type: 'private',
            industry: 'การตลาดและโฆษณา',
            company_size: 'medium',
            position: 'Digital Marketing Specialist',
            department: 'Marketing',
            job_level: 'junior',
            job_description: 'วางแผนและดำเนินการตลาดดิจิทัล รวมถึง Social Media',
            key_achievements: 'เพิ่ม engagement ใน Social Media 50% ภายใน 6 เดือน',
            skills_used: 'Facebook Ads, Google Ads, Analytics, Photoshop',
            start_date: '2023-03-01',
            end_date: null,
            is_current: true,
            employment_type: 'full_time',
            salary_range: '22,000-30,000 บาท',
            salary_min: 22000,
            salary_max: 30000,
            work_province: 'กรุงเทพมหานคร',
            job_satisfaction_rating: 5,
            work_life_balance_rating: 4,
            company_culture_rating: 5
        }
    ],
    // วิชาญ เก่งมาก - งานปัจจุบัน + งานเก่า 1 งาน
    [
        {
            company_name: 'การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย',
            company_type: 'state_enterprise',
            industry: 'พลังงานและสาธารณูปโภค',
            company_size: 'enterprise',
            position: 'Electrical Engineer',
            department: 'Power Generation',
            job_level: 'junior',
            job_description: 'ออกแบบและบำรุงรักษาระบบไฟฟ้าโรงงาน',
            key_achievements: 'ลดการสูญเสียพลังงาน 15% จากการปรับปรุงระบบ',
            skills_used: 'AutoCAD, MATLAB, PLC Programming',
            start_date: '2022-10-01',
            end_date: null,
            is_current: true,
            employment_type: 'full_time',
            salary_range: '35,000-45,000 บาท',
            salary_min: 35000,
            salary_max: 45000,
            work_province: 'กรุงเทพมหานคร',
            job_satisfaction_rating: 4,
            work_life_balance_rating: 3,
            company_culture_rating: 4
        },
        {
            company_name: 'บริษัท วิศวกรรมไฟฟ้า XYZ จำกัด',
            company_type: 'private',
            industry: 'วิศวกรรม',
            company_size: 'medium',
            position: 'Trainee Engineer',
            department: 'Engineering',
            job_level: 'entry',
            job_description: 'ฝึกงานและช่วยงานวิศวกรอาวุโส',
            start_date: '2022-01-01',
            end_date: '2022-09-30',
            is_current: false,
            employment_type: 'internship',
            salary_range: '15,000 บาท',
            salary_min: 15000,
            salary_max: 15000,
            work_province: 'กรุงเทพมหานคร',
            reason_for_leaving: 'จบการฝึกงานและย้ายไปทำงานประจำ',
            job_satisfaction_rating: 4,
            work_life_balance_rating: 4,
            company_culture_rating: 4
        }
    ]
];

// ฟังก์ชันสำหรับเพิ่มข้อมูลผู้ใช้และประวัติการทำงาน
async function addMockUsers() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');

        // เพิ่มผู้ใช้
        for (let i = 0; i < mockUsers.length; i++) {
            const user = mockUsers[i];
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            // สร้าง name จาก first_name และ last_name
            const fullName = `${user.first_name} ${user.last_name}`;
            
            try {
                const [result] = await connection.execute(
                    `INSERT INTO users (
                        title, name, first_name, last_name, password, student_id, email, phone,
                        graduation_year, faculty, major, gpa, bio, occupation, position, workplace, salary,
                        address, province, district, subdistrict, zipcode, is_verified, role
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        user.title, fullName, user.first_name, user.last_name, hashedPassword,
                        user.student_id, user.email, user.phone, user.graduation_year, user.faculty,
                        user.major, user.gpa, user.bio, user.occupation, user.position, user.workplace,
                        user.salary, user.address, user.province, user.district, user.subdistrict,
                        user.zipcode, true, 'user'
                    ]
                );
                
                const userId = result.insertId;
                console.log(`✅ เพิ่มผู้ใช้ ${fullName} สำเร็จ (ID: ${userId})`);
                
                // เพิ่มประวัติการทำงาน (เฉพาะ 3 คนแรก)
                if (i < 3 && workHistoryData[i]) {
                    for (const work of workHistoryData[i]) {
                        await connection.execute(
                            `INSERT INTO work_history (
                                user_id, company_name, company_type, industry, company_size,
                                position, department, job_level, job_description, key_achievements,
                                skills_used, start_date, end_date, is_current, employment_type,
                                salary_range, salary_min, salary_max, work_province,
                                reason_for_leaving, job_satisfaction_rating, work_life_balance_rating,
                                company_culture_rating
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                                userId, work.company_name, work.company_type, work.industry, work.company_size,
                                work.position, work.department, work.job_level, work.job_description,
                                work.key_achievements, work.skills_used, work.start_date, work.end_date,
                                work.is_current, work.employment_type, work.salary_range, work.salary_min,
                                work.salary_max, work.work_province, work.reason_for_leaving || null,
                                work.job_satisfaction_rating, work.work_life_balance_rating,
                                work.company_culture_rating
                            ]
                        );
                    }
                    console.log(`✅ เพิ่มประวัติการทำงานของ ${fullName} สำเร็จ`);
                }
                
            } catch (error) {
                console.error(`❌ ไม่สามารถเพิ่มผู้ใช้ ${fullName}:`, error.message);
            }
        }

        // เพิ่มประวัติการทำงานแบบง่ายๆ สำหรับผู้ใช้คนอื่นๆ
        const simpleWorkHistories = [
            { position: 'English Teacher', company: 'โรงเรียนนานาชาติกรุงเทพ', industry: 'การศึกษา' },
            { position: 'Investment Analyst', company: 'บริษัท หลักทรัพย์ไทยพาณิชย์ จำกัด', industry: 'การเงินและการลงทุน' },
            { position: 'Registered Nurse', company: 'โรงพยาบาลราชวิถี', industry: 'สาธารณสุข' },
            { position: 'Mobile App Developer', company: 'สตาร์ทอัพ TechInnovate', industry: 'เทคโนโลยีสารสนเทศ' },
            { position: 'Architect', company: 'บริษัท A+ Design จำกัด', industry: 'สถาปัตยกรรม' },
            { position: 'Associate Lawyer', company: 'สำนักงานกฎหมาย ABC & Partners', industry: 'กฎหมาย' },
            { position: 'Kindergarten Teacher', company: 'โรงเรียนอนุบาลสายรุ้ง', industry: 'การศึกษา' },
            { position: 'Medical Doctor', company: 'โรงพยาบาลศิริราช', industry: 'สาธารณสุข' },
            { position: 'Clinical Pharmacist', company: 'โรงพยาบาลจุฬาลงกรณ์', industry: 'สาธารณสุข' },
            { position: 'Civil Engineer', company: 'บริษัท ไทยคอนสตรัคชั่น จำกัด', industry: 'ก่อสร้าง' },
            { position: 'Research Chemist', company: 'สถาบันวิจัยวิทยาศาสตร์และเทคโนโลยี', industry: 'วิทยาศาสตร์และเทคโนโลยี' },
            { position: 'Senior Accountant', company: 'บริษัท สำนักงานบัญชีมืออาชีพ จำกัด', industry: 'บัญชี' }
        ];

        // เพิ่มประวัติการทำงานให้กับผู้ใช้คนที่ 4-15
        const [users] = await connection.execute('SELECT id, first_name, last_name FROM users WHERE role = "user" ORDER BY id DESC LIMIT 12');
        
        for (let i = 0; i < users.length && i < simpleWorkHistories.length; i++) {
            const user = users[i];
            const work = simpleWorkHistories[i];
            
            try {
                await connection.execute(
                    `INSERT INTO work_history (
                        user_id, company_name, industry, position, start_date, is_current,
                        employment_type, work_province, job_satisfaction_rating, 
                        work_life_balance_rating, company_culture_rating
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        user.id, work.company, work.industry, work.position,
                        '2023-01-01', true, 'full_time', 'กรุงเทพมหานคร',
                        Math.floor(Math.random() * 2) + 4, // 4-5
                        Math.floor(Math.random() * 2) + 3, // 3-4
                        Math.floor(Math.random() * 2) + 4  // 4-5
                    ]
                );
                console.log(`✅ เพิ่มประวัติการทำงานของ ${user.first_name} ${user.last_name} สำเร็จ`);
            } catch (error) {
                console.error(`❌ ไม่สามารถเพิ่มประวัติการทำงานของ ${user.first_name} ${user.last_name}:`, error.message);
            }
        }

        console.log('\n🎉 เพิ่มข้อมูลจำลองทั้งหมดเสร็จสิ้น!');
        console.log('📝 ข้อมูลการเข้าสู่ระบบ:');
        console.log('Email: somchai.jaidee@gmail.com, Password: password123');
        console.log('Email: supha.learn@hotmail.com, Password: password123');
        console.log('Email: wichan.skill@yahoo.com, Password: password123');
        console.log('... และอื่นๆ ใช้รหัสผ่าน: password123');
        
    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาด:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('ปิดการเชื่อมต่อฐานข้อมูล');
        }
    }
}

// เรียกใช้ฟังก์ชัน
addMockUsers();