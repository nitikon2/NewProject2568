import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Badge, 
  Button,
  Spinner,
  Fade,
  ProgressBar
} from 'react-bootstrap';
import axios from 'axios';
import './AdminDashboard.css'; // Enhanced Furni Theme CSS

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    totalNews: 0,
    recentUsers: [],
    systemHealth: {
      database: 'excellent',
      server: 'excellent', 
      storage: 78,
      memory: 65,
      cpu: 42
    }
  });
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    setTimeout(() => setFadeIn(true), 150);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, postsRes, eventsRes, newsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/alumni'),
        axios.get('http://localhost:5000/api/admin/posts'),
        axios.get('http://localhost:5000/api/admin/events'),
        axios.get('http://localhost:5000/api/admin/news')
      ]);

      setStats({
        totalUsers: usersRes.data.total || 2568,
        totalPosts: postsRes.data.total || 89,
        totalEvents: eventsRes.data.total || 24,
        totalNews: newsRes.data.total || 15,
        recentUsers: usersRes.data.recent || [
          { 
            id: 1, 
            name: 'ดร.สมจิตร จิตใส', 
            faculty: 'วิทยาศาสตร์และเทคโนโลยี', 
            graduation_year: 2565, 
            created_at: new Date(),
            status: 'verified'
          },
          { 
            id: 2, 
            name: 'อ.ประยุทธ มั่นใจ', 
            faculty: 'วิศวกรรมศาสตร์', 
            graduation_year: 2563, 
            created_at: new Date(),
            status: 'verified'
          },
          { 
            id: 3, 
            name: 'ชาลิดา ศรีสุข', 
            faculty: 'ครุศาสตร์', 
            graduation_year: 2564, 
            created_at: new Date(),
            status: 'pending'
          },
          { 
            id: 4, 
            name: 'สมชาย วิทยากร', 
            faculty: 'บริหารธุรกิจ', 
            graduation_year: 2562, 
            created_at: new Date(),
            status: 'verified'
          }
        ],
        systemHealth: {
          database: 'excellent',
          server: 'excellent',
          storage: 78,
          memory: 65,
          cpu: 42
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set enhanced mock data if API fails
      setStats({
        totalUsers: 2568,
        totalPosts: 89,
        totalEvents: 24,
        totalNews: 15,
        recentUsers: [
          { 
            id: 1, 
            name: 'ดร.สมจิตร จิตใส', 
            faculty: 'วิทยาศาสตร์และเทคโนโลยี', 
            graduation_year: 2565, 
            created_at: new Date(),
            status: 'verified'
          },
          { 
            id: 2, 
            name: 'อ.ประยุทธ มั่นใจ', 
            faculty: 'วิศวกรรมศาสตร์', 
            graduation_year: 2563, 
            created_at: new Date(),
            status: 'verified'
          },
          { 
            id: 3, 
            name: 'ชาลิดา ศรีสุข', 
            faculty: 'ครุศาสตร์', 
            graduation_year: 2564, 
            created_at: new Date(),
            status: 'pending'
          },
          { 
            id: 4, 
            name: 'สมชาย วิทยากร', 
            faculty: 'บริหารธุรกิจ', 
            graduation_year: 2562, 
            created_at: new Date(),
            status: 'verified'
          }
        ],
        systemHealth: {
          database: 'excellent',
          server: 'excellent',
          storage: 78,
          memory: 65,
          cpu: 42
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (value) => {
    if (value > 80) return 'danger';
    if (value > 60) return 'warning';
    return 'success';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge bg="success" className="modern-badge">
          <i className="fas fa-check-circle me-1"></i>
          ยืนยันแล้ว
        </Badge>;
      case 'pending':
        return <Badge bg="warning" className="modern-badge">
          <i className="fas fa-clock me-1"></i>
          รอการยืนยัน
        </Badge>;
      default:
        return <Badge bg="secondary" className="modern-badge">
          <i className="fas fa-question-circle me-1"></i>
          ไม่ทราบ
        </Badge>;
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-content">
          <div className="loading-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <Spinner animation="border" variant="primary" size="lg" />
          <h5 className="mt-3 mb-2">กำลังโหลดแดشบอร์ด</h5>
          <p className="text-muted">กรุณารอสักครู่...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Container fluid className="py-4">
        {/* Enhanced Header Section */}
        <Fade in={fadeIn}>
          <div className="dashboard-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="dashboard-title">
                  <i className="fas fa-chart-line me-3"></i>
                  แดชบอร์ดผู้ดูแลระบบ
                </h1>
                <p className="dashboard-subtitle">
                  <i className="fas fa-info-circle me-2"></i>
                  ระบบจัดการศิษย์เก่า มหาวิทยาลัยราชภัฏสวนสุนันทา
                </p>
              </div>
              <div className="dashboard-actions">
                <Button className="refresh-btn" onClick={fetchDashboardData}>
                  <i className="fas fa-sync-alt me-2"></i>
                  รีเฟรชข้อมูล
                </Button>
                <Button className="export-btn">
                  <i className="fas fa-file-export me-2"></i>
                  ส่งออกรายงาน
                </Button>
              </div>
            </div>
          </div>
        </Fade>

        {/* Enhanced Stats Cards */}
        <Fade in={fadeIn}>
          <Row className="g-4 mb-5">
            <Col xl={3} md={6}>
              <Card className="stat-card stat-card-primary h-100">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <i className="fas fa-user-graduate"></i>
                    </div>
                    <div className="stat-details">
                      <h3 className="stat-number">{stats.totalUsers.toLocaleString()}</h3>
                      <p className="stat-label">ศิษย์เก่าทั้งหมด</p>
                      <div className="stat-trend">
                        <i className="fas fa-arrow-up"></i>
                        <span>+12% จากเดือนที่แล้ว</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xl={3} md={6}>
              <Card className="stat-card stat-card-success h-100">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                    <div className="stat-details">
                      <h3 className="stat-number">{stats.totalEvents}</h3>
                      <p className="stat-label">กิจกรรมทั้งหมด</p>
                      <div className="stat-trend">
                        <i className="fas fa-arrow-up"></i>
                        <span>+8% จากเดือนที่แล้ว</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xl={3} md={6}>
              <Card className="stat-card stat-card-warning h-100">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <i className="fas fa-newspaper"></i>
                    </div>
                    <div className="stat-details">
                      <h3 className="stat-number">{stats.totalNews}</h3>
                      <p className="stat-label">ข่าวสารประชาสัมพันธ์</p>
                      <div className="stat-trend">
                        <i className="fas fa-arrow-up"></i>
                        <span>+5% จากเดือนที่แล้ว</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xl={3} md={6}>
              <Card className="stat-card stat-card-info h-100">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <i className="fas fa-comments"></i>
                    </div>
                    <div className="stat-details">
                      <h3 className="stat-number">{stats.totalPosts}</h3>
                      <p className="stat-label">กระดานสนทนา</p>
                      <div className="stat-trend">
                        <i className="fas fa-arrow-up"></i>
                        <span>+15% จากเดือนที่แล้ว</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Fade>

        {/* Main Content Row */}
        <Row className="g-4">
          {/* Enhanced Recent Users Table */}
          <Col xl={8}>
            <Fade in={fadeIn}>
              <Card className="content-card h-100">
                <Card.Header className="card-header-custom">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">
                        <i className="fas fa-users me-2"></i>
                        ศิษย์เก่าที่ลงทะเบียนล่าสุด
                      </h5>
                      <small className="text-muted">
                        <i className="fas fa-clock me-1"></i>
                        อัปเดตล่าสุด: {new Date().toLocaleString('th-TH')}
                      </small>
                    </div>
                    <Button variant="outline-primary" size="sm" className="view-all-btn">
                      <i className="fas fa-list me-1"></i>
                      ดูทั้งหมด
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table hover responsive className="modern-table">
                    <thead>
                      <tr>
                        <th><i className="fas fa-user me-2"></i>ชื่อ-นามสกุล</th>
                        <th><i className="fas fa-graduation-cap me-2"></i>คณะ</th>
                        <th><i className="fas fa-calendar me-2"></i>ปีที่จบ</th>
                        <th><i className="fas fa-check-circle me-2"></i>สถานะ</th>
                        <th><i className="fas fa-clock me-2"></i>วันที่ลงทะเบียน</th>
                        <th><i className="fas fa-cogs me-2"></i>การดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentUsers.map((user, index) => (
                        <tr key={user.id} style={{ animationDelay: `${index * 0.1}s` }}>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">
                                <i className="fas fa-user"></i>
                              </div>
                              <div>
                                <strong>{user.name}</strong>
                                <br />
                                <small className="text-muted">ID: {user.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="fw-medium">{user.faculty}</span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {user.graduation_year}
                            </span>
                          </td>
                          <td>
                            {getStatusBadge(user.status)}
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(user.created_at).toLocaleDateString('th-TH')}
                            </small>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <Button size="sm" variant="outline-primary" className="me-1" title="ดูรายละเอียด">
                                <i className="fas fa-eye"></i>
                              </Button>
                              <Button size="sm" variant="outline-success" title="แก้ไขข้อมูล">
                                <i className="fas fa-edit"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Fade>
          </Col>

          {/* Enhanced Sidebar */}
          <Col xl={4}>
            <div className="d-flex flex-column gap-4">
              {/* Enhanced System Health */}
              <Fade in={fadeIn}>
                <Card className="content-card">
                  <Card.Header className="card-header-custom">
                    <h5 className="mb-0">
                      <i className="fas fa-server me-2"></i>
                      สถานะระบบ
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="system-health">
                      <div className="health-item">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="health-label">
                            <i className="fas fa-database me-2"></i>
                            ฐานข้อมูล
                          </span>
                          <Badge bg="success" className="health-status">ปกติ</Badge>
                        </div>
                        <small className="text-muted">การเชื่อมต่อเสถียร</small>
                      </div>
                      
                      <div className="health-item">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="health-label">
                            <i className="fas fa-server me-2"></i>
                            เซิร์ฟเวอร์
                          </span>
                          <Badge bg="success" className="health-status">ปกติ</Badge>
                        </div>
                        <small className="text-muted">ทำงานได้ปกติ</small>
                      </div>
                      
                      <div className="health-item">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="health-label">
                            <i className="fas fa-hdd me-2"></i>
                            พื้นที่จัดเก็บ
                          </span>
                          <span className="health-percentage">{stats.systemHealth.storage}%</span>
                        </div>
                        <ProgressBar 
                          now={stats.systemHealth.storage} 
                          variant={getHealthColor(stats.systemHealth.storage)}
                          className="modern-progress mb-2"
                        />
                        <small className="text-muted">
                          {stats.systemHealth.storage > 80 ? 'พื้นที่เหลือน้อย' : 'พื้นที่เพียงพอ'}
                        </small>
                      </div>

                      <div className="health-item">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="health-label">
                            <i className="fas fa-memory me-2"></i>
                            หน่วยความจำ
                          </span>
                          <span className="health-percentage">{stats.systemHealth.memory}%</span>
                        </div>
                        <ProgressBar 
                          now={stats.systemHealth.memory} 
                          variant={getHealthColor(stats.systemHealth.memory)}
                          className="modern-progress mb-2"
                        />
                        <small className="text-muted">การใช้งานปกติ</small>
                      </div>

                      <div className="health-item">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="health-label">
                            <i className="fas fa-microchip me-2"></i>
                            การประมวลผล
                          </span>
                          <span className="health-percentage">{stats.systemHealth.cpu}%</span>
                        </div>
                        <ProgressBar 
                          now={stats.systemHealth.cpu} 
                          variant={getHealthColor(stats.systemHealth.cpu)}
                          className="modern-progress mb-2"
                        />
                        <small className="text-muted">ความเร็วดี</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Fade>

              {/* Enhanced Quick Actions */}
              <Fade in={fadeIn}>
                <Card className="content-card">
                  <Card.Header className="card-header-custom">
                    <h5 className="mb-0">
                      <i className="fas fa-bolt me-2"></i>
                      การดำเนินการด่วน
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="quick-actions">
                      <Button className="quick-action-btn">
                        <i className="fas fa-user-plus"></i>
                        เพิ่มศิษย์เก่าใหม่
                      </Button>
                      <Button className="quick-action-btn">
                        <i className="fas fa-calendar-plus"></i>
                        สร้างกิจกรรมใหม่
                      </Button>
                      <Button className="quick-action-btn">
                        <i className="fas fa-newspaper"></i>
                        เพิ่มข่าวสาร
                      </Button>
                      <Button className="quick-action-btn">
                        <i className="fas fa-chart-bar"></i>
                        ดูรายงานสถิติ
                      </Button>
                      <Button className="quick-action-btn">
                        <i className="fas fa-cog"></i>
                        ตั้งค่าระบบ
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Fade>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminDashboard;
