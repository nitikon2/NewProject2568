const mysql = require('mysql2/promise');

// กำหนดการเชื่อมต่อฐานข้อมูล
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'alumni_db',
    charset: 'utf8mb4'
};

// ข้อมูลข่าวสารจำลอง
const mockNews = [
    {
        title: 'มหาวิทยาลัยเปิดรับสมัครงานวิจัยนวัตกรรมใหม่',
        content: `มหาวิทยาลัยฯ ขอเชิญชวนศิษย์เก่าที่มีความสนใจในการวิจัยและพัฒนานวัตกรรม สมัครเข้าร่วมโครงการวิจัยใหม่ในสาขาเทคโนโลยีสารสนเทศ

        รายละเอียดโครงการ:
        - ระยะเวลา: 2 ปี
        - งบประมาณ: 5 ล้านบาท
        - สาขาที่เปิดรับ: AI, IoT, Blockchain, Data Science
        - วุฒิการศึกษา: ปริญญาโทขึ้นไป
        
        สนใจสมัครติดต่อ: research@rmu.ac.th
        กำหนดส่งใบสมัคร: 30 ตุลาคม 2567`,
        image_url: 'https://example.com/research-news.jpg',
        author_id: 1 // admin
    },
    {
        title: 'ศิษย์เก่าคณะวิศวกรรมฯ คว้ารางวัลนวัตกรรมระดับชาติ',
        content: `ขอแสดงความยินดีกับ นายสมชาติ วิศวกรรม ศิษย์เก่าคณะวิศวกรรมศาสตร์ รุ่น 58 ที่ได้รับรางวัลนวัตกรรมระดับชาติ จากการประดิษฐ์ระบบจัดการพลังงานอัจฉริยะ

        ผลงานที่ได้รับรางวัล:
        - ระบบจัดการพลังงานอัจฉริยะสำหรับอาคาร
        - ช่วยประหยัดพลังงาน 40%
        - ลดค่าใช้จ่ายด้านไฟฟ้า 30%
        
        นับเป็นความภาคภูมิใจของมหาวิทยาลัยที่ศิษย์เก่านำความรู้ไปสร้างประโยชน์ให้สังคม`,
        image_url: 'https://example.com/award-news.jpg',
        author_id: 1
    },
    {
        title: 'เปิดรับสมัครทุนการศึกษาต่อปริญญาโทในต่างประเทศ',
        content: `มหาวิทยาลัยฯ ร่วมกับหน่วยงานพันธมิตรในต่างประเทศ เปิดรับสมัครทุนการศึกษาต่อปริญญาโทสำหรับศิษย์เก่า

        รายละเอียดทุน:
        - ประเทศเป้าหมาย: สหรัฐอเมริกา, แคนาดา, ออสเตรเลีย, ญี่ปุ่น
        - ครอบคลุม: ค่าเล่าเรียน, ค่าครองชีพ, ค่าตั๋วเครื่องบิน
        - จำนวน: 20 ทุน
        - สาขาวิชา: วิทยาศาสตร์ เทคโนโลยี วิศวกรรม คณิตศาสตร์
        
        เงื่อนไข: เกรดเฉลี่ย 3.5 ขึ้นไป, IELTS 6.5 ขึ้นไป
        สมัครภายใน: 15 พฤศจิกายน 2567`,
        image_url: 'https://example.com/scholarship-news.jpg',
        author_id: 1
    },
    {
        title: 'ประกาศผลการสำรวจความพึงพอใจศิษย์เก่า ปี 2567',
        content: `ผลการสำรวจความพึงพอใจศิษย์เก่าต่อมหาวิทยาลัย ประจำปี 2567

        ผลสำรวจโดยรวม:
        - ความพึงพอใจโดยรวม: 4.2/5.0
        - คุณภาพการศึกษา: 4.3/5.0
        - สิ่งอำนวยความสะดวก: 4.0/5.0
        - การบริการศิษย์เก่า: 4.1/5.0
        
        จุดเด่น:
        - คุณภาพอาจารย์ผู้สอน
        - หลักสูตรที่ทันสมัย
        - เครือข่ายศิษย์เก่าที่แข็งแกร่ง
        
        จุดที่ควรพัฒนา:
        - สิ่งอำนวยความสะดวกด้านกีฬา
        - ระบบจองห้องสมุด
        - แอปพลิเคชันมือถือของมหาวิทยาลัย`,
        image_url: 'https://example.com/survey-news.jpg',
        author_id: 1
    },
    {
        title: 'จัดตั้งกองทุนช่วยเหลือศิษย์เก่าในสถานการณ์วิกฤต',
        content: `ด้วยสถานการณ์เศรษฐกิจที่ผันผวน มหาวิทยาลัยจึงจัดตั้งกองทุนช่วยเหลือศิษย์เก่าในสถานการณ์วิกฤต

        วัตถุประสงค์:
        - ช่วยเหลือศิษย์เก่าที่ตกงาน
        - สนับสนุนการเริ่มต้นธุรกิจใหม่
        - ให้คำปรึกษาด้านการเงิน
        - จัดหาแหล่งงานใหม่
        
        รูปแบบการช่วยเหลือ:
        - เงินกู้ดอกเบียยต่ำ
        - การฝึกอบรมทักษะใหม่
        - การแนะแนวการทำงาน
        - เครือข่ายการหางาน
        
        ติดต่อสอบถาม: alumni.fund@rmu.ac.th`,
        image_url: 'https://example.com/fund-news.jpg',
        author_id: 1
    },
    {
        title: 'เปิดตัวแอปพลิเคชัน "RMU Alumni Connect" เชื่อมต่อศิษย์เก่า',
        content: `มหาวิทยาลัยเปิดตัวแอปพลิเคชัน "RMU Alumni Connect" เพื่อเชื่อมต่อศิษย์เก่าทั่วโลก

        ฟีเจอร์หลัก:
        - ค้นหาเพื่อนร่วมรุ่น
        - แชร์ข่าวสารและประสบการณ์
        - หางานและโอกาสทางธุรกิจ
        - จองเข้าร่วมกิจกรรม
        - ระบบแจ้งเตือนข่าวสารสำคัญ
        
        ฟีเจอร์พิเศษ:
        - ระบบ Mentorship เชื่อมต่อรุ่นใหญ่-รุ่นเล็ก
        - กลุ่มสนทนาตามสาขาอาชีพ
        - แผนที่ศิษย์เก่าทั่วโลก
        - ระบบให้คะแนนและรีวิวการทำงาน
        
        ดาวน์โหลดได้แล้วที่ App Store และ Google Play Store`,
        image_url: 'https://example.com/app-news.jpg',
        author_id: 1
    },
    {
        title: 'คณะบริหารธุรกิจจัดสัมมนา "Digital Transformation for SMEs"',
        content: `คณะบริหารธุรกิจจัดสัมมนาพิเศษ "Digital Transformation for SMEs" สำหรับศิษย์เก่าที่เป็นเจ้าของธุรกิจ

        หัวข้อการบรรยาย:
        - การตลาดดิจิทัลยุคใหม่
        - E-commerce และการขายออนไลน์
        - ระบบจัดการลูกค้าสัมพันธ์ (CRM)
        - การเงินดิจิทัลสำหรับธุรกิจ
        - การใช้ AI ในการบริหารธุรกิจ
        
        วิทยากร:
        - นักธุรกิจชั้นนำ
        - ผู้เชียวชาญด้านเทคโนโลยี
        - ศิษย์เก่าที่ประสบความสำเร็จ
        
        วันที่: 25 พฤศจิกายน 2567
        เวลา: 9:00-16:00 น.
        สถานที่: ห้องประชุมใหญ่ อาคารคณะบริหารธุรกิจ
        ค่าธรรมเนียม: ฟรีสำหรับศิษย์เก่า`,
        image_url: 'https://example.com/seminar-news.jpg',
        author_id: 1
    },
    {
        title: 'ศิษย์เก่าคณะแพทย์ทำวิจัยโควิด-19 ได้รับการยอมรับระดับสากล',
        content: `นพ.สมพงษ์ ใจแพทย์ ศิษย์เก่าคณะแพทยศาสตร์ รุ่น 55 นำทีมวิจัยค้นพบวิธีการรักษาโควิด-19 แบบใหม่

        ผลงานวิจัย:
        - การใช้ยาสมุนไพรร่วมกับการแพทย์แผนปัจจุบัน
        - ลดระยะเวลาการรักษา 50%
        - ลดอาการแทรกซ้อน 30%
        - ต้นทุนการรักษาถูกลง 40%
        
        ผลกระทบ:
        - บทความถูกตีพิมพ์ใน Nature Medicine
        - ได้รับการอ้างอิงจากนักวิจัยทั่วโลก
        - มีแผนนำไปใช้ในประเทศกำลังพัฒนา
        
        ความภาคภูมิใจของคณะแพทยศาสตร์และมหาวิทยาลัย`,
        image_url: 'https://example.com/research-covid.jpg',
        author_id: 1
    },
    {
        title: 'เปิดรับสมัครการแข่งขัน "Alumni Innovation Challenge 2567"',
        content: `มหาวิทยาลัยจัดการแข่งขัน "Alumni Innovation Challenge 2567" ครั้งแรก!

        รายละเอียดการแข่งขัน:
        - ประเภท: การแข่งขันนำเสนอนวัตกรรม
        - ผู้เข้าแข่งขัน: ศิษย์เก่าทุกรุ่น
        - หมวดหมู่: Technology, Social Impact, Business Innovation, Green Innovation
        
        รางวัล:
        - รางวัลชนะเลิศ: 500,000 บาท + โอกาสได้รับทุนต่อยอด
        - รางวัลรองชนะเลิศอันดับ 1: 300,000 บาท
        - รางวัลรองชนะเลิศอันดับ 2: 200,000 บาท
        - รางวัลชมเชย: 50,000 บาท (4 รางวัล)
        
        กำหนดการ:
        - รับสมัคร: 1-30 พฤศจิกายน 2567
        - คัดเลือกรอบแรก: ธันวาคม 2567
        - นำเสนอผลงานรอบสุดท้าย: มกราคม 2568`,
        image_url: 'https://example.com/innovation-challenge.jpg',
        author_id: 1
    },
    {
        title: 'จัดงาน "RMU Alumni Job Fair 2567" หางานและเครือข่าย',
        content: `งาน "RMU Alumni Job Fair 2567" งานแรกที่จัดโดยศิษย์เก่า เพื่อศิษย์เก่า

        ไฮไลท์ของงาน:
        - บริษัทชั้นนำมากกว่า 100 บริษัท
        - ตำแหน่งงานมากกว่า 1,000 ตำแหน่ง
        - เงินเดือนเริ่มต้น 25,000-150,000 บาท
        - ทั้งงาน Full-time, Part-time, Freelance
        
        กิจกรรมพิเศษ:
        - เวิร์กช็อป "เทคนิคการสัมภาษณ์งาน"
        - การปรึกษาปรับปรุง Resume
        - การ Networking กับศิษย์เก่าในวงการต่างๆ
        - การแนะแนวอาชีพ
        
        วันที่: 15-16 ธันวาคม 2567
        เวลา: 10:00-18:00 น.
        สถานที่: ศูนย์ประชุมนานาชาติ RMU
        ค่าเข้างาน: ฟรี (ลงทะเบียนล่วงหน้า)`,
        image_url: 'https://example.com/job-fair.jpg',
        author_id: 1
    }
];

// ข้อมูลกิจกรรมจำลอง
const mockEvents = [
    {
        title: 'งานประชุมใหญ่สามัญประจำปี สมาคมศิษย์เก่า 2567',
        description: `การประชุมใหญ่สามัญประจำปี สมาคมศิษย์เก่ามหาวิทยาลัย ประจำปี 2567

        วาระการประชุม:
        1. รับรองรายงานการประชุมครั้งที่แล้ว
        2. รายงานผลการดำเนินงานประจำปี 2566
        3. รายงานการเงิน และการอนุมัติงบประมาณ
        4. การเลือกตั้งคณะกรรมการชุดใหม่
        5. การกำหนดทิศทางการดำเนินงานปี 2568
        6. เรื่องอื่นๆ
        
        กิจกรรม:
        - พิธีมอบรางวัลศิษย์เก่าดีเด่น
        - การแสดงจากชมรมต่างๆ
        - มื้อเย็นสังสรรค์
        
        *ขอเชิญศิษย์เก่าทุกท่านเข้าร่วม*`,
        event_date: '2024-12-20 13:00:00',
        location: 'หอประชุมใหญ่ มหาวิทยาลัย',
        image_url: 'https://example.com/annual-meeting.jpg'
    },
    {
        title: 'งานวิ่งการกุศล "RMU Fun Run for Education 2567"',
        description: `งานวิ่งการกุศลประจำปี เพื่อระดมทุนสนับสนุนทุนการศึกษาสำหรับนักศึกษาที่ขาดแคลนทุนทรัพย์

        รายละเอียดการวิ่ง:
        - ระยะทาง: 3 กม., 5 กม., 10 กม.
        - ค่าสมัคร: 500 บาท (3 กม.), 800 บาท (5 กม.), 1,200 บาท (10 กม.)
        - ของที่ระลึก: เสื้อวิ่ง, เหรียญรางวัล, ถุงผ้า
        
        กิจกรรมเสริม:
        - บูธอาหารและเครื่องดื่ม
        - บูธกิจกรรมสำหรับครอบครัว
        - การแสดงจากนักศึกษา
        - การออกบูธของศิษย์เก่าที่ทำธุรกิจ
        
        เป้าหมาย: ระดมทุนได้ 2 ล้านบาท
        รางวัล: รางวัลสำหรับ 10 อันดับแรกในแต่ละระยะ`,
        event_date: '2024-11-15 06:00:00',
        location: 'สวนสาธารณะแห่งชาติ เขาใหญ่',
        image_url: 'https://example.com/fun-run.jpg'
    },
    {
        title: 'สัมมนาวิชาการ "AI & Future of Work"',
        description: `สัมมนาวิชาการนานาชาติ หัวข้อ "Artificial Intelligence and the Future of Work"

        หัวข้อบรรยาย:
        1. "AI Revolution: Opportunities and Challenges" - Dr. John Smith (MIT)
        2. "Machine Learning in Business Applications" - ศ.ดร.สมชาย วิทยากร
        3. "Ethics in AI Development" - Prof. Sarah Johnson (Oxford)
        4. "การเตรียมความพร้อมสำหรับยุค AI" - ผศ.ดร.วิชาญ เทคโนโลยี
        
        Workshop:
        - การใช้ ChatGPT ในการทำงาน
        - Python สำหรับ Data Science เบื้องต้น
        - การออกแบบ UX/UI ด้วย AI Tools
        
        เป้าหมาย: นักศึกษา อาจารย์ ศิษย์เก่า และผู้สนใจทั่วไป
        จำนวนที่นั่ง: 500 ที่นั่ง
        ค่าธรรมเนียม: 2,000 บาท (ศิษย์เก่าลด 50%)`,
        event_date: '2024-11-30 09:00:00',
        location: 'ศูนย์ประชุมนานาชาติ RMU',
        image_url: 'https://example.com/ai-seminar.jpg'
    },
    {
        title: 'งานเลี้ยงสังสรรค์ปีใหม่ 2568',
        description: `งานเลี้ยงสังสรรค์ต้อนรับปีใหม่ 2568 สำหรับศิษย์เก่าและครอบครัว

        กิจกรรมในงาน:
        - การแสดงดนตรี คลาสสิกและสากล
        - การแสดงละครเวทีจากชมรมศิษย์เก่า
        - เกมส์และกิจกรรมสำหรับเด็ก
        - การจับสลากรางวัล
        - ถ่ายรูปที่ระลึกกับเพื่อนร่วมรุ่น
        
        อาหารและเครื่องดื่ม:
        - บุฟเฟ่ต์นานาชาติ
        - อาหารไทยพื้นเมือง
        - ของหวานและผลไม้
        - เครื่องดื่มไม่มีแอลกอฮอล์
        
        Dress Code: Smart Casual
        ค่าบัตร: 1,500 บาท/ท่าน (เด็กต่ำกว่า 12 ปี ฟรี)
        *มีที่จอดรถ และรถรับส่งจากสถานี BTS*`,
        event_date: '2025-01-04 18:00:00',
        location: 'โรงแรมแกรนด์ ไฮแอท เอราวัณ',
        image_url: 'https://example.com/new-year-party.jpg'
    },
    {
        title: 'กิจกรรม "Startup Pitching Day" นำเสนอไอเดียธุรกิจ',
        description: `กิจกรรม "Startup Pitching Day" สำหรับศิษย์เก่าที่มีไอเดียธุรกิจ หรือ Startup ใหม่

        รูปแบบกิจกรรม:
        - การนำเสนอไอเดีย 10 นาที
        - การตอบคำถามจาก Investor 5 นาที
        - การให้คำปรึกษาจาก Mentor
        - การ Networking หลังงาน
        
        คณะกรรมการและ Investor:
        - ผู้บริหารจาก Venture Capital
        - นักลงทุนเทวดา (Angel Investor)
        - ศิษย์เก่าที่ประสบความสำเร็จทางธุรกิจ
        - ผู้เชียวชาญด้านต่างๆ
        
        รางวัล:
        - รางวัลที่ 1: เงินลงทุน 2 ล้านบาท
        - รางวัลที่ 2: เงินลงทุน 1 ล้านบาท
        - รางวัลที่ 3: เงินลงทุน 500,000 บาท
        - รางวัลชมเชย: การ Mentoring 6 เดือน
        
        เปิดรับสมัคร: 50 ทีม
        ค่าสมัคร: ฟรี`,
        event_date: '2025-02-14 10:00:00',
        location: 'ห้องประชุม Innovation Hub, อาคาร IT',
        image_url: 'https://example.com/startup-pitch.jpg'
    },
    {
        title: 'ทริปท่องเที่ยวศิษย์เก่า "เชียงใหม่ มนต์เสน่ห์ล้านนา"',
        description: `ทริปท่องเที่ยวศิษย์เก่าและครอบครัว "เชียงใหม่ มนต์เสน่ห์ล้านนา" 3 วัน 2 คืน

        กำหนดการเดินทาง:
        วันที่ 1:
        - เดินทางจากกรุงเทพฯ (เครื่องบิน)
        - เที่ยวตลาดวโรรส
        - เยื่อมวัดพระสิงห์
        - ดินเนอร์ข้าวซอยโบราณ
        
        วันที่ 2:
        - ดอยสุเทพ และ วัดพระธาตุ
        - หมู่บ้านม้งดอยปุย
        - ช้อปปิ้งที่ Walking Street
        - งานเลี้ยงสังสรรค์ริมปิง
        
        วันที่ 3:
        - วัดร่องขุ่น (วัดขาว)
        - โรงงานร่มบ่อสร้าง
        - เดินทางกลับกรุงเทพฯ
        
        ราคา: 15,900 บาท/ท่าน (รวมเครื่องบิน, โรงแรม, อาหาร, รถทัวร์)
        จำนวนรับ: 40 ท่าน
        *Early Bird ลด 2,000 บาท (จองก่อน 30 พ.ย.)`,
        event_date: '2025-03-15 06:00:00',
        location: 'เชียงใหม่',
        image_url: 'https://example.com/chiangmai-trip.jpg'
    },
    {
        title: 'การบรรยายพิเศษ "Leadership in Digital Age"',
        description: `การบรรยายพิเศษ "Leadership in Digital Age" โดย CEO ชั้นนำแห่งประเทศไทย

        วิทยากร:
        - คุณสมศักดิ์ ดิจิทัล - CEO บริษัท Tech Giant Thailand
        - คุณสุดา ผู้นำ - Managing Director บริษัท Future Corp
        - ศิษย์เก่าที่ประสบความสำเร็จระดับ C-Level
        
        หัวข้อการบรรยาย:
        1. "Digital Leadership Mindset"
        2. "Building High-Performance Digital Teams"
        3. "Innovation Management in Digital Era"
        4. "Customer-Centric Digital Strategy"
        
        กิจกรรม:
        - Q&A Session กับวิทยากร
        - กรณีศึกษาจากบริษัทจริง
        - การ Networking Coffee Break
        - รับใบประกาศนียบัตรเข้าร่วม
        
        เหมาะสำหรับ: ผู้บริหาร, ผู้จัดการ, ผู้ที่สนใจพัฒนาทักษะผู้นำ
        ค่าเข้าร่วม: 3,500 บาท (ศิษย์เก่า 2,500 บาท)`,
        event_date: '2024-12-07 13:00:00',
        location: 'ห้องประชุมเจ้าพระยา โรงแรมชาเทรียม ริเวอร์ไซด์',
        image_url: 'https://example.com/leadership-talk.jpg'
    },
    {
        title: 'งาน "RMU Alumni Health & Wellness Day"',
        description: `งาน "RMU Alumni Health & Wellness Day" ดูแลสุขภาพศิษย์เก่า

        บริการตรวจสุขภาพฟรี:
        - ตรวจร่างกายทั่วไป
        - วัดความดันโลหิต
        - ตรวจระดับน้ำตาลในเลือด
        - ตรวจระดับคอเลสเตอรอล
        - วัดดัชนีมวลกาย (BMI)
        - ตรวจสายตา เบื้องต้น
        
        กิจกรรม Wellness:
        - โยคะเพื่อสุขภาพ
        - แอโรบิคเบา ๆ
        - การนวดแผนไทย
        - การสาธิตการปรุงอาหารเพื่อสุขภาพ
        
        เวิร์กช็อป:
        - "การจัดการความเครียด"
        - "การออกกำลังกายในวัยทำงาน"
        - "โภชนาการสำหรับคนทำงาน"
        - "Work-Life Balance"
        
        ของขวัญ: ชุดตรวจสุขภาพที่บ้าน, คู่มือดูแลสุขภาพ
        ค่าใช้จ่าย: ฟรี (ลงทะเบียนล่วงหน้า)`,
        event_date: '2024-11-23 08:00:00',
        location: 'ศูนย์กีฬาและสุขภาพ RMU',
        image_url: 'https://example.com/health-wellness.jpg'
    },
    {
        title: 'การประกวด "RMU Alumni Talent Show 2567"',
        description: `การประกวด "RMU Alumni Talent Show 2567" แสดงความสามารถพิเศษของศิษย์เก่า

        ประเภทการแข่งขัน:
        1. การร้องเพลง (เดี่ยว/กลุ่ม)
        2. การเต้น (Modern, Traditional, K-Pop)
        3. การเล่นดนตรี (เครื่องดนตรีใดก็ได้)
        4. การแสดงตลก/ละครสั้น
        5. Magic Show / ศิลปะการแสดง
        6. การประกวดกีฬา (โบว์ลิ่ง, ปิงปอง)
        
        รางวัล:
        - รางวัลชนะเลิศแต่ละประเภท: 20,000 บาท + โล่รางวัล
        - รางวัล Popular Vote: 15,000 บาท
        - รางวัลมิตรภาพ: 10,000 บาท
        
        กิจกรรมเสริม:
        - บูธอาหารจากศิษย์เก่าที่ทำธุรกิจร้านอาหาร
        - การจำหน่ายสินค้าทำมือจากศิษย์เก่า
        - โซนถ่ายรูปที่ระลึก
        
        ค่าสมัคร: 500 บาท/ทีม
        ค่าเข้าชม: 200 บาท/ท่าน`,
        event_date: '2025-01-25 18:00:00',
        location: 'หอประชุมใหญ่ มหาวิทยาลัย',
        image_url: 'https://example.com/talent-show.jpg'
    },
    {
        title: 'โครงการ "RMU Alumni Mentorship Program Launch"',
        description: `เปิดตัวโครงการ "RMU Alumni Mentorship Program" เชื่อมต่อรุ่นพี่-รุ่นน้อง

        วัตถุประสงค์:
        - เชื่อมต่อศิษย์เก่าทุกรุ่น
        - ถ่ายทอดประสบการณ์การทำงาน
        - สร้างเครือข่ายทางธุรกิจ
        - พัฒนาทักษะการเป็นผู้นำ
        
        รูปแบบโครงการ:
        - การจับคู่ Mentor-Mentee
        - การประชุมรายเดือน
        - เวิร์กช็อปพัฒนาทักษะ
        - การติดตามและประเมินผล
        
        กิจกรรมในงานเปิดตัว:
        - การบรรยายพิเศษ "The Power of Mentorship"
        - การแบ่งปันประสบการณ์จากศิษย์เก่า
        - การลงทะเบียน Mentor และ Mentee
        - การจับคู่เบื้องต้น
        - งานเลี้ยงต้อนรับ
        
        เป้าหมาย: จับคู่ 200 คู่ในปีแรก
        การสมัคร: เปิดรับตลอดปี ผ่านเว็บไซต์และแอป`,
        event_date: '2024-12-14 14:00:00',
        location: 'ศูนย์ประชุม Alumni Hall',
        image_url: 'https://example.com/mentorship-launch.jpg'
    }
];

// ฟังก์ชันสำหรับเพิ่มข้อมูลข่าวสารและกิจกรรม
async function addNewsAndEvents() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');

        // เพิ่มข่าวสาร
        console.log('\n=== เพิ่มข้อมูลข่าวสาร ===');
        for (let i = 0; i < mockNews.length; i++) {
            const news = mockNews[i];
            try {
                const [result] = await connection.execute(
                    `INSERT INTO news (title, content, image_url, author_id) VALUES (?, ?, ?, ?)`,
                    [news.title, news.content, news.image_url, news.author_id]
                );
                console.log(`✅ เพิ่มข่าวสาร: ${news.title.substring(0, 50)}...`);
            } catch (error) {
                console.error(`❌ ไม่สามารถเพิ่มข่าวสาร: ${news.title}`, error.message);
            }
        }

        // เพิ่มกิจกรรม
        console.log('\n=== เพิ่มข้อมูลกิจกรรม ===');
        for (let i = 0; i < mockEvents.length; i++) {
            const event = mockEvents[i];
            try {
                const [result] = await connection.execute(
                    `INSERT INTO events (title, description, event_date, location, image_url) VALUES (?, ?, ?, ?, ?)`,
                    [event.title, event.description, event.event_date, event.location, event.image_url]
                );
                console.log(`✅ เพิ่มกิจกรรม: ${event.title.substring(0, 50)}...`);
            } catch (error) {
                console.error(`❌ ไม่สามารถเพิ่มกิจกรรม: ${event.title}`, error.message);
            }
        }

        // เพิ่มการลงทะเบียนกิจกรรมจำลอง
        console.log('\n=== เพิ่มการลงทะเบียนกิจกรรมจำลอง ===');
        
        // ดึงข้อมูลผู้ใช้และกิจกรรม
        const [users] = await connection.execute('SELECT id FROM users WHERE role = "user" LIMIT 10');
        const [events] = await connection.execute('SELECT id FROM events LIMIT 5');
        
        // สุ่มการลงทะเบียน
        for (const event of events) {
            // สุ่มผู้ใช้ 3-7 คน ต่อกิจกรรม
            const participantCount = Math.floor(Math.random() * 5) + 3;
            const shuffledUsers = users.sort(() => 0.5 - Math.random());
            const selectedUsers = shuffledUsers.slice(0, participantCount);
            
            for (const user of selectedUsers) {
                try {
                    await connection.execute(
                        `INSERT INTO event_registrations (event_id, user_id) VALUES (?, ?)`,
                        [event.id, user.id]
                    );
                } catch (error) {
                    // ข้าม error ถ้าซ้ำ (unique constraint)
                    if (!error.message.includes('Duplicate entry')) {
                        console.error(`❌ ไม่สามารถเพิ่มการลงทะเบียน:`, error.message);
                    }
                }
            }
            console.log(`✅ เพิ่มการลงทะเบียนสำหรับกิจกรรม ID ${event.id}: ${participantCount} คน`);
        }

        // สรุปข้อมูลที่เพิ่ม
        console.log('\n=== สรุปข้อมูลที่เพิ่ม ===');
        const [newsCount] = await connection.execute('SELECT COUNT(*) as total FROM news');
        const [eventsCount] = await connection.execute('SELECT COUNT(*) as total FROM events');
        const [registrationsCount] = await connection.execute('SELECT COUNT(*) as total FROM event_registrations');
        
        console.log(`📰 ข่าวสารทั้งหมด: ${newsCount[0].total} ข่าว`);
        console.log(`🎉 กิจกรรมทั้งหมด: ${eventsCount[0].total} กิจกรรม`);
        console.log(`📝 การลงทะเบียนทั้งหมด: ${registrationsCount[0].total} การลงทะเบียน`);
        
        console.log('\n🎉 เพิ่มข้อมูลข่าวสารและกิจกรรมเสร็จสิ้น!');
        
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
addNewsAndEvents();