const mysql = require('mysql2/promise');

// กำหนดการเชื่อมต่อฐานข้อมูล
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'alumni_db',
    charset: 'utf8mb4'
};

// ข้อมูลโพสต์จำลอง
const mockPosts = [
    {
        title: 'ขอแบ่งปันประสบการณ์หางานใหม่ของตัวเอง',
        content: `สวัสดีครับทุกคน ผมเพิ่งเปลี่ยนงานใหม่เมื่อเดือนที่แล้ว อยากมาแบ่งปันประสบการณ์ให้น้องๆ ฟังครับ

        ประสบการณ์ที่ผ่านมา:
        - ทำงานที่บริษัทเก่า 3 ปี
        - เงินเดือนขึ้นช้า โอกาสก้าวหน้าจำกัด
        - สมัครงานใหม่ไป 15 บริษัท ได้รับเรียกสัมภาษณ์ 8 แห่ง
        - ได้ข้อเสนองานจาก 3 บริษัท

        Tips การหางาน:
        1. ปรับปรุง Resume ให้โดดเด่น
        2. เตรียมตัวสัมภาษณ์ดีๆ
        3. Research บริษัทก่อนสัมภาษณ์
        4. แสดงความกระตือรือร้น
        5. ถามคำถามที่ดีกลับไป

        ตอนนี้เงินเดือนเพิ่มขึ้น 40% แล้ว งานก็น่าสนใจมากครับ

        มีใครอยากปรึกษาเรื่องการหางานบ้างครับ ยินดีช่วยเหลือ 😊`,
        user_id: 16, // สมชาย ใจดี
        status: 'active',
        image_url: 'https://example.com/job-hunting-tips.jpg'
    },
    {
        title: 'สอนทำเว็บไฟล์ฟรีให้น้องๆ ที่สนใจ',
        content: `สวัสดีครับ ผมทำงานเป็น Web Developer มา 2 ปีแล้ว อยากจะแบ่งปันความรู้ให้น้องๆ ที่กำลังเริ่มต้นเรียน Programming

        สิ่งที่จะสอน:
        • HTML, CSS พื้นฐาน
        • JavaScript เบื้องต้น  
        • React.js สำหรับ Frontend
        • Node.js สำหรับ Backend
        • Database MySQL
        • Git และ GitHub

        รูปแบบการสอน:
        - สอนออนไลน์ผ่าน Google Meet
        - เสาร์-อาทิตย์ 14:00-17:00 น.
        - จำกัดรับ 10 คนเท่านั้น
        - ฟรี 100% ไม่มีค่าใช้จ่าย

        เงื่อนไข:
        - ต้องมีพื้นฐานคอมพิวเตอร์
        - ตั้งใจเรียนจริงๆ
        - มี Laptop ใช้เขียนโค้ด

        ใครสนใจแคปหน้าจอนี้แล้ว comment ไว้เลยครับ จะส่ง Line มาให้`,
        user_id: 22, // ปรเมษฐ์ ดีใจ
        status: 'active',
        image_url: 'https://example.com/web-development-course.jpg'
    },
    {
        title: 'มองหาทีมงาน Startup ด้าน Health Tech',
        content: `สวัสดีครับทุกคน ผมกำลังเริ่มต้น Startup ใหม่ในด้าน Health Technology มองหาเพื่อนร่วมงานที่มี Passion เหมือนกัน

        ไอเดียของเรา:
        - แอปติดตามสุขภาพแบบ AI
        - เชื่อมต่อกับ Wearable Device
        - ให้คำแนะนำเรื่องการออกกำลังกายและโภชนาการ
        - ระบบแจ้งเตือนเมื่อค่าสุขภาพผิดปกติ

        ตำแหน่งที่หา:
        1. Mobile App Developer (iOS/Android)
        2. AI/ML Engineer
        3. UX/UI Designer  
        4. Marketing Manager
        5. Business Developer

        ข้อเสนอ:
        - Equity ตามความสามารถ
        - เงินเดือนเริ่มต้นเมื่อได้ Funding
        - ทำงานแบบ Flexible
        - โอกาสเรียนรู้และเติบโตสูง

        ใครสนใจหรือมีคำถาม PM มาได้เลยครับ เรามี MVP แล้ว อยากให้ดู Demo ได้`,
        user_id: 26, // รัฐพล แข็งแกร่ง
        status: 'active',
        image_url: 'https://example.com/health-tech-startup.jpg'
    },
    {
        title: 'แนะนำร้านอาหารใกล้มหาลัย รสชาติดี ราคาถูก',
        content: `สวัสดีค่ะทุกคน วันนี้อยากมาแนะนำร้านอาหารดีๆ ใกล้มหาลัยให้ฟัง ที่พอจะกินได้เวลาไปธุระหรือเอาลูกไปเที่ยว

        🍜 ร้านข้าวซอยแม่สาย
        - ข้าวซอยไก่/เนื้อ 45 บาท
        - รสชาติแบบเหนือแท้ๆ
        - เปิด 10:00-20:00 น.
        - ที่จอดรรถสะดวก

        🍛 ข้าวแกงป้าใหม่
        - กับข้าวหลากหลาย 15-25 บาท
        - ข้าวเปล่า 10 บาท
        - อิ่มคุ้ม เหมาะกับงบจำกัด
        - เปิดตั้งแต่ 11:00-19:00 น.

        🧋 ชาไข่มุก ป้าแหวน
        - ชาไทย ชาเขียว ขนาดใหญ่ 25 บาท
        - หวานน้อย กำลังดี
        - มีโปรโมชั่นซื้อ 10 แก้ว ฟรี 1 แก้ว

        🍨 ไอศกรีมผัด ลุงสมศักดิ์
        - ไอศกรีมผัดสด 15-20 บาท
        - รสชาติเยอะ แบ่งครึ่งได้
        - เด็กๆ ชอบมาก

        ใครรู้จักร้านดีๆ มาแชร์กันต่อนะคะ อยากไปลองใหม่ๆ บ้าง`,
        user_id: 19, // มนัสวี สวยงาม
        status: 'active',
        image_url: 'https://example.com/food-review.jpg'
    },
    {
        title: 'ขอขายของใช้ไฟฟ้า ย้ายบ้านใหม่',
        content: `สวัสดีค่ะ เนื่องจากกำลังจะย้ายบ้านใหม่ มีของใช้ไฟฟ้าหลายชิ้นที่อยากขาย สภาพดี ใช้งานได้ปกติ

        📺 ทีวี Samsung 43 นิ้ว Smart TV
        - รุ่น: UA43TU7000K
        - ซื้อเมื่อ: 2 ปีที่แล้ว
        - สภาพ: 90% ใช้งานปกติ
        - ราคา: 8,500 บาท (เดิม 15,900)

        ❄️ ตู้เย็น 2 ประตู Electrolux
        - ขนาด: 7.7 คิว
        - สภาพ: 85% ทำความเย็นดีมาก
        - ราคา: 4,200 บาท (เดิม 12,900)

        🌀 พัดลมเพดาน KDK
        - 5 ใบพัด ลมแรงมาก
        - พร้อมรีโมท
        - สภาพ: 95% เกือบใหม่
        - ราคา: 1,200 บาท (เดิม 2,500)

        📱 ไมโครเวฟ Sharp
        - ขนาด: 25 ลิตร
        - ใช้งานได้ปกติ เสียงเบา
        - ราคา: 1,800 บาท (เดิม 4,500)

        🏡 สถานที่: รามคำแหง
        💰 ซื้อครบสามชิ้นลด 10%
        📞 สนใจติดต่อทาง Line หรือโทรได้เลย
        🚗 ขนส่งตามสภาพจริง

        ขอบคุณค่ะ`,
        user_id: 27, // สุวรรณา ทองคำ
        status: 'active',
        image_url: 'https://example.com/appliances-sale.jpg'
    },
    {
        title: 'มีใครเก่งเรื่องภาษีไหมคะ อยากปรึกษา',
        content: `สวัสดีค่ะ ตอนนี้มีปัญหาเรื่องภาษีอยากปรึกษา ไม่รู้ว่าต้องทำยังไงดี

        สถานการณ์:
        - ทำงานประจำที่บริษัท A
        - มีงาน Freelance ที่บริษัท B ด้วย
        - รายได้ Freelance ประมาณ 15,000 บาท/เดือน
        - บริษัท B หักภาษี ณ ที่จ่าย 5%

        คำถาม:
        1. ต้องยื่นภาษีเพิ่มเติมไหมคะ?
        2. งาน Freelance ถือเป็นรายได้ประเภทไหน?
        3. มีค่าใช้จ่ายอะไรหักได้บ้าง?
        4. ถ้าไม่ยื่นจะมีปัญหาไหม?
        5. ใครมีนักบัญชีดีๆ แนะนำไหมคะ?

        ขอบคุณทุกคนที่ช่วยตอบนะคะ หรือถ้าใครเจอปัญหาแบบนี้บ้าง มาแลกเปลี่ยนกันค่ะ`,
        user_id: 21, // อรุณี สายแสง
        status: 'pending',
        image_url: null
    },
    {
        title: 'ประสบการณ์เรียนปริญญาโทที่ต่างประเทศ',
        content: `สวัสดีครับ ผมเพิ่งจบ Master ที่ออสเตรเลียกลับมาเมื่อปีที่แล้ว อยากแบ่งปันประสบการณ์ให้น้องๆ ที่กำลังคิดจะไปเรียนต่อ

        📚 หลักสูตรที่เรียน:
        - Master of Information Technology
        - มหาวิทยาลัย: University of Sydney
        - ระยะเวลา: 2 ปี
        - ค่าใช้จ่าย: ประมาณ 1.8 ล้านบาท

        💰 เรื่องเงิน:
        - ทุนส่วนตัว 60%
        - ทุนจากมหาวิทยาลัย 40%
        - ทำงาน Part-time ได้ 20 ชม./สัปดาห์
        - รายได้จากงาน Part-time ประมาณ 15,000 บาท/เดือน

        🏠 ที่พัก:
        - ปี 1: อยู่หอพัก On-campus
        - ปี 2: เช่าบ้านกับเพื่อน
        - ค่าครองชีพเฉลี่ย 35,000 บาท/เดือน

        📖 เรื่องเรียน:
        - อาจารย์ใจดี แต่เข้มงวดเรื่องงาน
        - Assignment เยอะมาก
        - ต้องทำ Project จริงกับบริษัท
        - มีโอกาส Internship หลังจบ

        🌟 ข้อดี:
        - ได้ประสบการณ์ทำงานระหว่างเรียน
        - เครือข่ายกว้าง เพื่อนหลากหลายชาติ
        - ความรู้ทันสมัย อัปเดตเทรนด์โลก
        - โอกาสงานดีหลังกลับไทย

        😅 ข้อเสีย:
        - เหงา โดยเฉพาะช่วงแรก
        - อากาศหนาว ปรับตัวยาก
        - ค่าใช้จ่ายสูง
        - ห่างไกลครอบครัว

        ใครอยากปรึกษาเรื่องไปเรียนต่อ ยินดีครับ มีข้อมูลเยอะมากที่อยากแชร์`,
        user_id: 18, // วิชาญ เก่งมาก
        status: 'active',
        image_url: 'https://example.com/study-abroad.jpg'
    },
    {
        title: 'จัดกิจกรรมวิ่งเพื่อการกุศลรุ่น 65 ใครสนใจมาร่วมกัน',
        content: `สวัสดีทุกคนครับ ผมในนามรุ่น 65 อยากเชิญชวนพี่ๆ น้องๆ มาร่วมกิจกรรมวิ่งการกุศล

        🏃‍♂️ รายละเอียดกิจกรรม:
        - ชื่อ: "RMU RUN FOR HOPE 2567"
        - วันที่: 25 พฤศจิกายน 2567
        - เวลา: 05:30-09:00 น.
        - สถานที่: สวนลุมพินี

        🎯 วัตถุประสงค์:
        - ระดมทุนซื้ออุปกรณ์การเรียนให้น้องๆ
        - กิจกรรมสาธารณประโยชน์
        - สร้างความสามัคคีศิษย์เก่า
        - ส่งเสริมการออกกำลังกาย

        🏃‍♀️ ระยะทางและค่าสมัคร:
        - 3 กม. = 300 บาท
        - 5 กม. = 500 บาท  
        - 10 กม. = 800 บาท
        - 21 กม. = 1,200 บาท

        🎁 ของขวัญที่ได้รับ:
        - เสื้อวิ่งสกรีนชื่อ
        - เหรียญรางวัล
        - อาหารเช้าหลังวิ่ง
        - ประกันอุบัติเหตุ

        🏆 รางวัล:
        - Top 3 ทุกระยะ ได้รางวัลเงินสด
        - รางวัลชุดวิ่งสวยสุด
        - รางวัลคอสเพลย์

        📝 สมัครได้ที่:
        - เว็บไซต์: rmurun2567.com
        - Line: @rmurun65
        - หรือสแกน QR Code ในรูป

        เป้าหมาย 500 คน ตอนนี้มี 180 คนแล้ว
        รีบสมัครก่อนที่จะเต็มนะครับ!`,
        user_id: 17, // สุภา รักเรียน
        status: 'active',
        image_url: 'https://example.com/charity-run.jpg'
    },
    {
        title: 'หาคนไปดูคอนเสิร์ต Charlie Puth ใครอยากไปบ้าง?',
        content: `ฮัลโหลค่ะ! มีใครชอบ Charlie Puth บ้างไหมคะ? 

        เพลงนี้กำลังจะมาจัดคอนเสิร์ตที่ไทยค่ะ!

        📅 วันที่: 15 ธันวาคม 2567
        📍 สถานที่: Impact Arena เมืองทองธานี
        🎵 เพลงฮิต: Attention, We Don't Talk Anymore, See You Again

        💳 ราคาบัตร:
        - CAT A: 4,500 บาท
        - CAT B: 3,500 บาท  
        - CAT C: 2,500 บาท
        - CAT D: 1,500 บาท

        ตอนนี้มีตัวคนเดียว อยากหาเพื่อนไปด้วยค่ะ คิดว่าจะซื้อบัตร CAT B หรือ C 

        ใครสนใจมาคอมเมนต์ไว้นะคะ จะได้จัดกรุ๊ปแล้วไปซื้อบัตรพร้อมกัน

        ป.ล. ถ้าใครเป็นแฟนคลับตัวยง มีของสะสมอะไรแบ่งปันกันได้นะคะ ^^`,
        user_id: 25, // ปิยนุช น่ารัก
        status: 'pending',
        image_url: 'https://example.com/charlie-puth-concert.jpg'
    },
    {
        title: 'แนะนำคอร์สเรียนออนไลน์ฟรีสำหรับพัฒนาทักษะ',
        content: `สวัสดีครับทุกคน อยากแนะนำคอร์สเรียนออนไลน์ฟรีๆ ที่ผมเรียนมาแล้วรู้สึกว่าได้ประโยชน์มาก

        💻 เทคโนโลยี:
        - Coursera: Machine Learning (Stanford) ⭐⭐⭐⭐⭐
        - edX: CS50 Introduction to Computer Science ⭐⭐⭐⭐⭐
        - FreeCodeCamp: Full Stack Development ⭐⭐⭐⭐
        - YouTube: The Net Ninja (Web Development) ⭐⭐⭐⭐

        📊 ธุรกิจและการตลาด:
        - Google Digital Marketing ⭐⭐⭐⭐⭐
        - HubSpot Content Marketing ⭐⭐⭐⭐
        - Coursera: Financial Markets (Yale) ⭐⭐⭐⭐
        - Khan Academy: Entrepreneurship ⭐⭐⭐

        🎨 ดิจิทัลและการออกแบบ:
        - Adobe Creative Suite (YouTube) ⭐⭐⭐⭐
        - Canva Design School ⭐⭐⭐⭐
        - Figma Academy ⭐⭐⭐⭐⭐

        🧠 ทักษะชีวิต:
        - Mindfulness Apps (Headspace, Calm) ⭐⭐⭐⭐
        - TED-Ed Critical Thinking ⭐⭐⭐⭐⭐
        - Coursera: Learning How to Learn ⭐⭐⭐⭐⭐

        📈 เคล็ดลับการเรียนออนไลน์:
        1. ตั้งเป้าหมายชัดเจน
        2. จัดตารางเรียนสม่ำเสมอ
        3. ฝึกปฏิบัติจริง ไม่ใช่แค่ดู
        4. หาเพื่อนเรียนร่วมกัน
        5. สรุปสิ่งที่เรียนรู้

        ใครมีคอร์สดีๆ แนะนำเพิ่มเติม มาแชร์กันครับ!`,
        user_id: 30, // สุรเชษฐ์ มีเงิน
        status: 'active',
        image_url: 'https://example.com/online-courses.jpg'
    }
];

// ข้อมูลความคิดเห็นจำลอง
const mockComments = [
    // Comments สำหรับโพสต์ที่ 1 (ขอแบ่งปันประสบการณ์หางานใหม่)
    {
        post_id: 1,
        content: 'ขอบคุณครับพี่ที่แบ่งปัน มีคำถามนิดหนึ่งครับ การเตรียมตัวสัมภาษณ์ควรเตรียมยังไงบ้างครับ?',
        user_id: 17, // สุภา รักเรียน
        parent_comment_id: null
    },
    {
        post_id: 1,
        content: 'สำหรับการเตรียมสัมภาษณ์ แนะนำให้ศึกษาบริษัทก่อน ดูข่าวสาร วิสัยทัศน์ แล้วก็เตรียมคำตอบสำหรับคำถามพื้นฐาน เช่น ทำไมถึงสนใจตำแหน่งนี้ จุดแข็ง-จุดอ่อน ครับ',
        user_id: 16, // สมชาย ใจดี (เจ้าของโพสต์)
        parent_comment_id: 1
    },
    {
        post_id: 1,
        content: 'เก่งมากครับพี่! ขอเทคนิคการเจรจาเงินเดือนหน่อยครับ กลัวเอาต่ำไป 😅',
        user_id: 22, // ปรเมษฐ์ ดีใจ
        parent_comment_id: null
    },
    {
        post_id: 1,
        content: 'การเจรจาเงินเดือนควรรู้ Market Rate ก่อน ดู Salary Survey จาก JobsDB หรือ LinkedIn แล้วขอสูงกว่า Market Rate 10-15% ครับ มีที่ต่อรองได้',
        user_id: 16, // สมชาย ใจดี
        parent_comment_id: 3
    },

    // Comments สำหรับโพสต์ที่ 2 (สอนทำเว็บไฟล์ฟรี)
    {
        post_id: 2,
        content: 'สนใจมากครับ! ผมเพิ่งจบ ยังไม่รู้อะไรเลย ขอเข้าร่วมได้ไหมครับ?',
        user_id: 19, // มนัสวี สวยงาม
        parent_comment_id: null
    },
    {
        post_id: 2,
        content: 'ได้ครับ ยินดีต้อนรับ! จะส่ง Line ให้ในช่วงเย็นนะครับ',
        user_id: 22, // ปรเมษฐ์ ดีใจ
        parent_comment_id: 5
    },
    {
        post_id: 2,
        content: 'ว้าว ใจดีมากเลยครับพี่ ผมก็สนใจครับ ตอนนี้ยังว่างเสาร์-อาทิตย์',
        user_id: 28, // อดิศักดิ์ เจริญรุ่ง
        parent_comment_id: null
    },
    {
        post_id: 2,
        content: 'ขอถามครับ จะสอนตั้งแต่พื้นฐานเลยใช่ไหมครับ? ผมเรียน IT แต่ยังงงๆ อยู่',
        user_id: 20, // ธนกร มั่งมี
        parent_comment_id: null
    },
    {
        post_id: 2,
        content: 'ใช่ครับ จะเริ่มตั้งแต่พื้นฐานสุดๆ ไม่ต้องกังวลครับ จะสอนทีละขั้น อย่าลืมเตรียม Laptop มาด้วยนะ',
        user_id: 22, // ปรเมษฐ์ ดีใจ
        parent_comment_id: 8
    },

    // Comments สำหรับโพสต์ที่ 3 (Startup Health Tech)
    {
        post_id: 3,
        content: 'ไอเดียดีมากครับ! ผมเป็น UX/UI Designer มีประสบการณ์ 3 ปี สนใจครับ',
        user_id: 23, // วรรณดี เพียรมุ่ง
        parent_comment_id: null
    },
    {
        post_id: 3,
        content: 'เยี่ยมเลยครับ! จะ PM ไปให้ ขอดู Portfolio หน่อยได้ไหมครับ',
        user_id: 26, // รัฐพล แข็งแกร่ง
        parent_comment_id: 10
    },
    {
        post_id: 3,
        content: 'ตอนนี้มี Funding มาแล้วหรือยังครับ? เห็นใจดีนะ แต่อยากรู้เรื่องการเงินก่อน',
        user_id: 24, // กิตติพงษ์ สูงส่ง
        parent_comment_id: null
    },
    {
        post_id: 3,
        content: 'ตอนนี้ยังครับ กำลัง Pitch Investor อยู่ คาดว่าเดือนหน้าจะได้ข่าวคราวครับ',
        user_id: 26, // รัฐพล แข็งแกร่ง
        parent_comment_id: 12
    },

    // Comments สำหรับโพสต์ที่ 4 (แนะนำร้านอาหาร)
    {
        post_id: 4,
        content: 'ร้านข้าวซอยแม่สายอร่อยจริงค่ะ! ไปกินมาแล้ว แนะนำเพิ่มร้านส้มตำป้าอ้อมหน้าเซเว่นด้วยค่ะ',
        user_id: 21, // อรุณี สายแสง
        parent_comment_id: null
    },
    {
        post_id: 4,
        content: 'ขอบคุณค่ะ! จะไปลองร้านส้มตำด้วย ชอบกินเผ็ดๆ มากค่ะ',
        user_id: 19, // มนัสวี สวยงาม
        parent_comment_id: 14
    },
    {
        post_id: 4,
        content: 'เพิ่มร้าน "ก๋วยเตี๋ยวลุงเสี่ยน" ก๋วยเตี๋ยวต้มยำเด็ดมาก 40 บาท คุ้มมาก!',
        user_id: 27, // สุวรรณา ทองคำ
        parent_comment_id: null
    },

    // Comments สำหรับโพสต์ที่ 8 (จัดกิจกรรมวิ่ง)
    {
        post_id: 8,
        content: 'สนใจมากครับ! สมัครระยะ 5 กม. ได้ไหมครับ นานๆ จะได้วิ่งทีนึง',
        user_id: 18, // วิชาญ เก่งมาก
        parent_comment_id: null
    },
    {
        post_id: 8,
        content: 'ได้ครับ! ไปสมัครที่เว็บเลยครับ ยังมีที่อีกเยอะ',
        user_id: 17, // สุภา รักเรียน
        parent_comment_id: 17
    },
    {
        post_id: 8,
        content: 'กิจกรรมดีมากครับ ผมสมัคร 10 กม. แล้ว หวังว่าจะได้รางวัลนะ 😂',
        user_id: 30, // สุรเชษฐ์ มีเงิน
        parent_comment_id: null
    },
    {
        post_id: 8,
        content: 'เก่งครับพี่! ผมยังวิ่ง 3 กม. ไม่ไหวเลย ต้องฝึกอีกสักพัก',
        user_id: 29, // นิภา ใสสุข
        parent_comment_id: 19
    },

    // Comments สำหรับโพสต์ที่ 9 (หาคนไปคอนเสิร์ต)
    {
        post_id: 9,
        content: 'ชอบ Charlie Puth มากเลยค่ะ! สนใจไปด้วย แต่คิดจะซื้อ CAT C ค่ะ',
        user_id: 25, // ปิยนุช น่ารัก
        parent_comment_id: null
    },
    {
        post_id: 9,
        content: 'CAT C ก็ดีค่ะ เราไปด้วยกันเลยค่ะ จะส่ง Line ให้นะคะ',
        user_id: 25, // ปิยนุช น่ารัก (เจ้าของโพสต์ตอบตัวเอง - แก้ไข)
        parent_comment_id: 21
    },
    {
        post_id: 9,
        content: 'เพลง See You Again เพราะมากเลย อยากไปฟังสดจัง แต่งบไม่ค่อยพอ 😢',
        user_id: 19, // มนัสวี สวยงาม
        parent_comment_id: null
    }
];

// แก้ไข comment ที่ตอบตัวเอง
mockComments[21].user_id = 27; // เปลี่ยนเป็นคนอื่น

// ฟังก์ชันสำหรับเพิ่มข้อมูลโพสต์และความคิดเห็น
async function addPostsAndComments() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');

        // เพิ่มโพสต์
        console.log('\n=== เพิ่มข้อมูลโพสต์ ===');
        for (let i = 0; i < mockPosts.length; i++) {
            const post = mockPosts[i];
            try {
                const [result] = await connection.execute(
                    `INSERT INTO posts (title, content, user_id, status, image_url) VALUES (?, ?, ?, ?, ?)`,
                    [post.title, post.content, post.user_id, post.status, post.image_url]
                );
                console.log(`✅ เพิ่มโพสต์: ${post.title.substring(0, 50)}...`);
            } catch (error) {
                console.error(`❌ ไม่สามารถเพิ่มโพสต์: ${post.title}`, error.message);
            }
        }

        // เพิ่มความคิดเห็น
        console.log('\n=== เพิ่มข้อมูลความคิดเห็น ===');
        for (let i = 0; i < mockComments.length; i++) {
            const comment = mockComments[i];
            try {
                const [result] = await connection.execute(
                    `INSERT INTO comments (post_id, content, user_id, parent_comment_id) VALUES (?, ?, ?, ?)`,
                    [comment.post_id, comment.content, comment.user_id, comment.parent_comment_id]
                );
                console.log(`✅ เพิ่มความคิดเห็น: ${comment.content.substring(0, 30)}...`);
            } catch (error) {
                console.error(`❌ ไม่สามารถเพิ่มความคิดเห็น: ${comment.content}`, error.message);
            }
        }

        // สรุปข้อมูลที่เพิ่ม
        console.log('\n=== สรุปข้อมูลที่เพิ่ม ===');
        const [postsCount] = await connection.execute('SELECT COUNT(*) as total FROM posts');
        const [commentsCount] = await connection.execute('SELECT COUNT(*) as total FROM comments');
        const [repliesCount] = await connection.execute('SELECT COUNT(*) as total FROM comments WHERE parent_comment_id IS NOT NULL');
        
        console.log(`📝 โพสต์ทั้งหมด: ${postsCount[0].total} โพสต์`);
        console.log(`💬 ความคิดเห็นทั้งหมด: ${commentsCount[0].total} ความคิดเห็น`);
        console.log(`↩️ การตอบกลับ: ${repliesCount[0].total} การตอบกลับ`);
        
        // แสดงสถิติโพสต์ตามสถานะ
        const [statusStats] = await connection.execute(`
            SELECT status, COUNT(*) as count 
            FROM posts 
            GROUP BY status
        `);
        
        console.log('\n📊 สถิติโพสต์ตามสถานะ:');
        statusStats.forEach(stat => {
            console.log(`   ${stat.status}: ${stat.count} โพสต์`);
        });
        
        console.log('\n🎉 เพิ่มข้อมูลโพสต์และความคิดเห็นเสร็จสิ้น!');
        
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
addPostsAndComments();