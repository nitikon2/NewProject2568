const mysql = require('mysql2/promise');

async function checkPostsAndComments() {
    const connection = await mysql.createConnection({
        host: 'localhost', 
        user: 'root', 
        password: '', 
        database: 'alumni_db'
    });
    
    console.log('=== ข้อมูลโพสต์ที่เพิ่มใหม่ ===');
    const [posts] = await connection.execute(`
        SELECT p.id, p.title, p.status, u.name as author_name, p.created_at,
               COUNT(c.id) as comment_count
        FROM posts p 
        LEFT JOIN users u ON p.user_id = u.id 
        LEFT JOIN comments c ON p.id = c.post_id
        GROUP BY p.id, p.title, p.status, u.name, p.created_at
        ORDER BY p.created_at DESC
    `);
    
    posts.forEach((post, index) => {
        const statusIcon = post.status === 'active' ? '🟢' : 
                          post.status === 'pending' ? '🟡' : '🔴';
        console.log(`${index + 1}. ${statusIcon} ${post.title}`);
        console.log(`   โดย: ${post.author_name} | ความคิดเห็น: ${post.comment_count} ความคิดเห็น`);
        console.log(`   วันที่: ${post.created_at.toLocaleDateString('th-TH')}`);
        console.log('');
    });
    
    console.log('=== ความคิดเห็นและการตอบกลับ ===');
    const [comments] = await connection.execute(`
        SELECT c.id, c.content, c.parent_comment_id, 
               u.name as commenter_name, p.title as post_title,
               c.created_at
        FROM comments c
        JOIN users u ON c.user_id = u.id
        JOIN posts p ON c.post_id = p.id
        ORDER BY c.post_id, c.parent_comment_id IS NULL DESC, c.created_at ASC
    `);
    
    // จัดกลุ่มความคิดเห็นตามโพสต์
    const groupedComments = {};
    comments.forEach(comment => {
        if (!groupedComments[comment.post_title]) {
            groupedComments[comment.post_title] = {
                main_comments: [],
                replies: []
            };
        }
        
        if (comment.parent_comment_id === null) {
            groupedComments[comment.post_title].main_comments.push(comment);
        } else {
            groupedComments[comment.post_title].replies.push(comment);
        }
    });
    
    Object.keys(groupedComments).forEach(postTitle => {
        console.log(`📝 ${postTitle.substring(0, 50)}...`);
        
        const data = groupedComments[postTitle];
        data.main_comments.forEach(comment => {
            console.log(`   💬 ${comment.commenter_name}: ${comment.content.substring(0, 60)}...`);
            
            // หาการตอบกลับของความคิดเห็นนี้
            const relatedReplies = data.replies.filter(reply => reply.parent_comment_id === comment.id);
            relatedReplies.forEach(reply => {
                console.log(`      ↳ ${reply.commenter_name}: ${reply.content.substring(0, 50)}...`);
            });
        });
        console.log('');
    });
    
    console.log('=== สถิติการมีส่วนร่วม ===');
    const [userStats] = await connection.execute(`
        SELECT u.name, 
               COUNT(DISTINCT p.id) as posts_count,
               COUNT(DISTINCT c.id) as comments_count,
               (COUNT(DISTINCT p.id) + COUNT(DISTINCT c.id)) as total_activity
        FROM users u
        LEFT JOIN posts p ON u.id = p.user_id
        LEFT JOIN comments c ON u.id = c.user_id
        WHERE u.role = 'user'
        GROUP BY u.id, u.name
        HAVING total_activity > 0
        ORDER BY total_activity DESC
    `);
    
    console.log('👑 ผู้ใช้ที่มีส่วนร่วมมากที่สุด:');
    userStats.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}: ${user.posts_count} โพสต์, ${user.comments_count} ความคิดเห็น (รวม ${user.total_activity} กิจกรรม)`);
    });
    
    console.log('\n=== สถิติโพสต์ตามหัวข้อ ===');
    const topicCategories = {
        'งาน': ['หางาน', 'งาน', 'เงินเดือน', 'career', 'job'],
        'การศึกษา': ['สอน', 'เรียน', 'คอร์ส', 'ปริญญา'],
        'ธุรกิจ': ['startup', 'ขาย', 'ธุรกิจ'],
        'ไลฟ์สไตล์': ['อาหาร', 'คอนเสิร์ต', 'วิ่ง', 'ร้าน'],
        'คำปรึกษา': ['ปรึกษา', 'ช่วย', 'แนะนำ']
    };
    
    Object.keys(topicCategories).forEach(category => {
        const keywords = topicCategories[category];
        const categoryPosts = posts.filter(post => 
            keywords.some(keyword => 
                post.title.toLowerCase().includes(keyword.toLowerCase())
            )
        );
        console.log(`${category}: ${categoryPosts.length} โพสต์`);
    });
    
    console.log('\n=== สรุปสถิติโดยรวม ===');
    const [overallStats] = await connection.execute(`
        SELECT 
            (SELECT COUNT(*) FROM posts) as total_posts,
            (SELECT COUNT(*) FROM posts WHERE status = 'active') as active_posts,
            (SELECT COUNT(*) FROM posts WHERE status = 'pending') as pending_posts,
            (SELECT COUNT(*) FROM comments WHERE parent_comment_id IS NULL) as main_comments,
            (SELECT COUNT(*) FROM comments WHERE parent_comment_id IS NOT NULL) as replies,
            (SELECT COUNT(DISTINCT user_id) FROM posts) as post_authors,
            (SELECT COUNT(DISTINCT user_id) FROM comments) as commenters
    `);
    
    const stats = overallStats[0];
    console.log(`📝 จำนวนโพสต์ทั้งหมด: ${stats.total_posts} โพสต์`);
    console.log(`   🟢 อนุมัติแล้ว: ${stats.active_posts} โพสต์`);
    console.log(`   🟡 รออนุมัติ: ${stats.pending_posts} โพสต์`);
    console.log(`💬 ความคิดเห็นหลัก: ${stats.main_comments} ความคิดเห็น`);
    console.log(`↩️ การตอบกลับ: ${stats.replies} การตอบกลับ`);
    console.log(`👥 ผู้เขียนโพสต์: ${stats.post_authors} คน`);
    console.log(`🗣️ ผู้แสดงความคิดเห็น: ${stats.commenters} คน`);
    
    await connection.end();
}

checkPostsAndComments().catch(console.error);