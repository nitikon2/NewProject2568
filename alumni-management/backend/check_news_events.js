const mysql = require('mysql2/promise');

async function checkNewsAndEvents() {
    const connection = await mysql.createConnection({
        host: 'localhost', 
        user: 'root', 
        password: '', 
        database: 'alumni_db'
    });
    
    console.log('=== ข้อมูลข่าวสารที่เพิ่มใหม่ ===');
    const [news] = await connection.execute(`
        SELECT n.id, n.title, n.created_at, u.name as author_name 
        FROM news n 
        LEFT JOIN users u ON n.author_id = u.id 
        ORDER BY n.created_at DESC
    `);
    news.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`   โดย: ${item.author_name || 'ไม่ระบุ'} | วันที่: ${item.created_at.toLocaleDateString('th-TH')}`);
        console.log('');
    });
    
    console.log('=== ข้อมูลกิจกรรมที่เพิ่มใหม่ ===');
    const [events] = await connection.execute(`
        SELECT e.id, e.title, e.event_date, e.location,
               COUNT(er.user_id) as registered_count
        FROM events e 
        LEFT JOIN event_registrations er ON e.id = er.event_id
        GROUP BY e.id, e.title, e.event_date, e.location
        ORDER BY e.event_date ASC
    `);
    events.forEach((event, index) => {
        const eventDate = new Date(event.event_date);
        console.log(`${index + 1}. ${event.title}`);
        console.log(`   วันที่: ${eventDate.toLocaleDateString('th-TH')} เวลา ${eventDate.toLocaleTimeString('th-TH', {hour: '2-digit', minute: '2-digit'})}`);
        console.log(`   สถานที่: ${event.location}`);
        console.log(`   ลงทะเบียนแล้ว: ${event.registered_count} คน`);
        console.log('');
    });
    
    console.log('=== สถิติการลงทะเบียนกิจกรรม ===');
    const [registrationStats] = await connection.execute(`
        SELECT e.title as event_title, u.name as user_name, er.registered_at
        FROM event_registrations er
        JOIN events e ON er.event_id = e.id
        JOIN users u ON er.user_id = u.id
        ORDER BY e.title, er.registered_at
    `);
    
    // จัดกลุ่มตามกิจกรรม
    const groupedRegistrations = {};
    registrationStats.forEach(reg => {
        if (!groupedRegistrations[reg.event_title]) {
            groupedRegistrations[reg.event_title] = [];
        }
        groupedRegistrations[reg.event_title].push(reg.user_name);
    });
    
    Object.keys(groupedRegistrations).forEach(eventTitle => {
        console.log(`📅 ${eventTitle}`);
        console.log(`   ผู้ลงทะเบียน: ${groupedRegistrations[eventTitle].join(', ')}`);
        console.log('');
    });
    
    console.log('=== สรุปสถิติโดยรวม ===');
    const [overallStats] = await connection.execute(`
        SELECT 
            (SELECT COUNT(*) FROM news) as total_news,
            (SELECT COUNT(*) FROM events) as total_events,
            (SELECT COUNT(*) FROM event_registrations) as total_registrations,
            (SELECT COUNT(DISTINCT user_id) FROM event_registrations) as unique_participants
    `);
    
    const stats = overallStats[0];
    console.log(`📰 จำนวนข่าวสารทั้งหมด: ${stats.total_news} ข่าว`);
    console.log(`🎉 จำนวนกิจกรรมทั้งหมด: ${stats.total_events} กิจกรรม`);
    console.log(`📝 จำนวนการลงทะเบียนทั้งหมด: ${stats.total_registrations} การลงทะเบียน`);
    console.log(`👥 จำนวนผู้เข้าร่วมที่ไม่ซ้ำ: ${stats.unique_participants} คน`);
    
    await connection.end();
}

checkNewsAndEvents().catch(console.error);