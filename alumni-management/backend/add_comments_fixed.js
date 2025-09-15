const mysql = require('mysql2/promise');

// กำหนดการเชื่อมต่อฐานข้อมูล
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'alumni_db',
    charset: 'utf8mb4'
};

// ฟังก์ชันเพิ่มความคิดเห็นที่แก้ไขแล้ว
async function addCommentsFixed() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');

        // ดึงข้อมูล post_id ที่มีอยู่จริง
        const [posts] = await connection.execute('SELECT id FROM posts ORDER BY id');
        const postIds = posts.map(p => p.id);
        
        console.log(`มีโพสต์ทั้งหมด ${postIds.length} โพสต์: ${postIds.join(', ')}`);
        
        // สร้างความคิดเห็นใหม่ที่ใช้ post_id ที่ถูกต้อง
        const comments = [
            // Comments สำหรับโพสต์แรก (หางาน)
            {
                post_id: postIds[0],
                content: 'ขอบคุณครับพี่ที่แบ่งปัน มีคำถามนิดหนึ่งครับ การเตรียมตัวสัมภาษณ์ควรเตรียมยังไงบ้างครับ?',
                user_id: 17,
                parent_comment_id: null
            },
            {
                post_id: postIds[0],
                content: 'เก่งมากครับพี่! ขอเทคนิคการเจรจาเงินเดือนหน่อยครับ กลัวเอาต่ำไป 😅',
                user_id: 22,
                parent_comment_id: null
            },
            {
                post_id: postIds[0],
                content: 'แชร์ประสบการณ์ดีมากครับ ผมก็กำลังมองหางานใหม่อยู่พอดี',
                user_id: 18,
                parent_comment_id: null
            },

            // Comments สำหรับโพสต์ที่ 2 (สอนเว็บ)
            {
                post_id: postIds[1],
                content: 'สนใจมากครับ! ผมเพิ่งจบ ยังไม่รู้อะไรเลย ขอเข้าร่วมได้ไหมครับ?',
                user_id: 19,
                parent_comment_id: null
            },
            {
                post_id: postIds[1],
                content: 'ว้าว ใจดีมากเลยครับพี่ ผมก็สนใจครับ ตอนนี้ยังว่างเสาร์-อาทิตย์',
                user_id: 28,
                parent_comment_id: null
            },
            {
                post_id: postIds[1],
                content: 'ขอถามครับ จะสอนตั้งแต่พื้นฐานเลยใช่ไหมครับ? ผมเรียน IT แต่ยังงงๆ อยู่',
                user_id: 20,
                parent_comment_id: null
            },

            // Comments สำหรับโพสต์ที่ 3 (Startup)
            {
                post_id: postIds[2],
                content: 'ไอเดียดีมากครับ! ผมเป็น UX/UI Designer มีประสบการณ์ 3 ปี สนใจครับ',
                user_id: 23,
                parent_comment_id: null
            },
            {
                post_id: postIds[2],
                content: 'ตอนนี้มี Funding มาแล้วหรือยังครับ? เห็นใจดีนะ แต่อยากรู้เรื่องการเงินก่อน',
                user_id: 24,
                parent_comment_id: null
            },

            // Comments สำหรับโพสต์ที่ 4 (ร้านอาหาร)
            {
                post_id: postIds[3],
                content: 'ร้านข้าวซอยแม่สายอร่อยจริงค่ะ! ไปกินมาแล้ว แนะนำเพิ่มร้านส้มตำป้าอ้อมหน้าเซเว่นด้วยค่ะ',
                user_id: 21,
                parent_comment_id: null
            },
            {
                post_id: postIds[3],
                content: 'เพิ่มร้าน "ก๋วยเตี๋ยวลุงเสี่ยน" ก๋วยเตี๋ยวต้มยำเด็ดมาก 40 บาท คุ้มมาก!',
                user_id: 27,
                parent_comment_id: null
            },

            // Comments สำหรับโพสต์ที่ 5 (ขายของ)
            {
                post_id: postIds[4],
                content: 'ทีวียังอยู่ไหมคะ สนใจตัวนี้เลย ราคาดีมากค่ะ',
                user_id: 25,
                parent_comment_id: null
            },
            {
                post_id: postIds[4],
                content: 'ตู้เย็นกับไมโครเวฟยังมีไหมครับ อยากได้ 2 ชิ้นนี้',
                user_id: 29,
                parent_comment_id: null
            },

            // Comments สำหรับโพสต์ที่ 7 (เรียนต่อ)
            {
                post_id: postIds[6],
                content: 'ข้อมูลดีมากครับ ผมกำลังสนใจไปเรียนต่อที่ออสเตรเลียเหมือนกัน',
                user_id: 30,
                parent_comment_id: null
            },
            {
                post_id: postIds[6],
                content: 'เรื่องงาน Part-time หาง่ายไหมครับ? กังวลเรื่องเงินใช้จ่าย',
                user_id: 16,
                parent_comment_id: null
            },

            // Comments สำหรับโพสต์ที่ 8 (วิ่ง)
            {
                post_id: postIds[7],
                content: 'สนใจมากครับ! สมัครระยะ 5 กม. ได้ไหมครับ นานๆ จะได้วิ่งทีนึง',
                user_id: 18,
                parent_comment_id: null
            },
            {
                post_id: postIds[7],
                content: 'กิจกรรมดีมากครับ ผมสมัคร 10 กม. แล้ว หวังว่าจะได้รางวัลนะ 😂',
                user_id: 30,
                parent_comment_id: null
            },

            // Comments สำหรับโพสต์ที่ 10 (คอร์สออนไลน์)
            {
                post_id: postIds[9],
                content: 'ขอบคุณครับที่แนะนำ คอร์ส CS50 เรียนแล้วเยี่ยมจริงๆ',
                user_id: 22,
                parent_comment_id: null
            },
            {
                post_id: postIds[9],
                content: 'เพิ่ม Udemy และ Codecademy ด้วยครับ มีคอร์สดีๆ เยอะ',
                user_id: 26,
                parent_comment_id: null
            }
        ];

        console.log('\n=== เพิ่มความคิดเห็น ===');
        let addedComments = 0;
        
        for (let comment of comments) {
            try {
                const [result] = await connection.execute(
                    `INSERT INTO comments (post_id, content, user_id, parent_comment_id) VALUES (?, ?, ?, ?)`,
                    [comment.post_id, comment.content, comment.user_id, comment.parent_comment_id]
                );
                console.log(`✅ เพิ่มความคิดเห็น: ${comment.content.substring(0, 30)}...`);
                addedComments++;
            } catch (error) {
                console.error(`❌ ไม่สามารถเพิ่มความคิดเห็น: ${comment.content.substring(0, 30)}...`, error.message);
            }
        }

        // เพิ่มการตอบกลับบางส่วน
        console.log('\n=== เพิ่มการตอบกลับ ===');
        
        // ดึง comment_id ที่เพิ่งเพิ่มไป
        const [newComments] = await connection.execute(
            'SELECT id, post_id, user_id FROM comments ORDER BY id DESC LIMIT 10'
        );

        const replies = [
            {
                post_id: newComments[0].post_id,
                content: 'สำหรับการเตรียมสัมภาษณ์ แนะนำให้ศึกษาบริษัทก่อน ดูข่าวสาร วิสัยทัศน์ แล้วก็เตรียมคำตอบสำหรับคำถามพื้นฐานครับ',
                user_id: 16, // เจ้าของโพสต์ตอบ
                parent_comment_id: newComments[0].id
            },
            {
                post_id: newComments[1].post_id,
                content: 'การเจรจาเงินเดือนควรรู้ Market Rate ก่อน ดู Salary Survey จาก JobsDB แล้วขอสูงกว่า 10-15% ครับ',
                user_id: 16,
                parent_comment_id: newComments[1].id
            },
            {
                post_id: newComments[3].post_id,
                content: 'ได้ครับ ยินดีต้อนรับ! จะส่ง Line ให้ในช่วงเย็นนะครับ',
                user_id: 22,
                parent_comment_id: newComments[3].id
            },
            {
                post_id: newComments[5].post_id,
                content: 'ใช่ครับ จะเริ่มตั้งแต่พื้นฐานสุดๆ ไม่ต้องกังวลครับ จะสอนทีละขั้น',
                user_id: 22,
                parent_comment_id: newComments[5].id
            },
            {
                post_id: newComments[6].post_id,
                content: 'เยี่ยมเลยครับ! จะ PM ไปให้ ขอดู Portfolio หน่อยได้ไหมครับ',
                user_id: 26,
                parent_comment_id: newComments[6].id
            }
        ];

        let addedReplies = 0;
        for (let reply of replies) {
            try {
                const [result] = await connection.execute(
                    `INSERT INTO comments (post_id, content, user_id, parent_comment_id) VALUES (?, ?, ?, ?)`,
                    [reply.post_id, reply.content, reply.user_id, reply.parent_comment_id]
                );
                console.log(`✅ เพิ่มการตอบกลับ: ${reply.content.substring(0, 30)}...`);
                addedReplies++;
            } catch (error) {
                console.error(`❌ ไม่สามารถเพิ่มการตอบกลับ: ${reply.content.substring(0, 30)}...`, error.message);
            }
        }

        // สรุปผลลัพธ์
        console.log('\n=== สรุปข้อมูลที่เพิ่ม ===');
        const [totalComments] = await connection.execute('SELECT COUNT(*) as total FROM comments');
        const [totalReplies] = await connection.execute('SELECT COUNT(*) as total FROM comments WHERE parent_comment_id IS NOT NULL');
        
        console.log(`💬 ความคิดเห็นทั้งหมด: ${totalComments[0].total} ความคิดเห็น`);
        console.log(`↩️ การตอบกลับ: ${totalReplies[0].total} การตอบกลับ`);
        console.log(`✅ เพิ่มใหม่ในรอบนี้: ${addedComments} ความคิดเห็น, ${addedReplies} การตอบกลับ`);
        
        console.log('\n🎉 เพิ่มข้อมูลความคิดเห็นและการตอบกลับเสร็จสิ้น!');
        
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
addCommentsFixed();