import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  School as SchoolIcon,
  Forum as ForumIcon,
  Event as EventIcon,
  Article as NewsIcon,
  Person as PersonIcon,
  Verified as VerifiedIcon,
  HourglassEmpty as PendingIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import axios from 'axios';
import AdminLayout from '../../layout/AdminLayout';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    totalNews: 0,
    recentUsers: [],
    verifiedUsers: 0,
    pendingUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Alumni stats
      const alumniStatsRes = await axios.get('http://localhost:5000/api/admin/alumni/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Posts stats
      const postsRes = await axios.get('http://localhost:5000/api/admin/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Events stats
      const eventsRes = await axios.get('http://localhost:5000/api/admin/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // News stats
      const newsRes = await axios.get('http://localhost:5000/api/admin/news?stats=1', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Recent users
      const recentUsersRes = await axios.get('http://localhost:5000/api/admin/alumni', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats({
        totalUsers: alumniStatsRes.data.total,
        verifiedUsers: alumniStatsRes.data.verified,
        pendingUsers: alumniStatsRes.data.pending,
        totalPosts: postsRes.data.total,
        totalEvents: eventsRes.data.total,
        totalNews: newsRes.data.total,
        recentUsers: Array.isArray(recentUsersRes.data.alumni)
          ? recentUsersRes.data.alumni.slice(0, 5)
          : []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: th });
  };

  const StatCard = ({ icon, title, value, subtitle, color, progress }) => (
    <Card 
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 4,
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderColor: '#667eea'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: color,
              color: 'white'
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={700} color="primary">
              {value?.toLocaleString() || 0}
            </Typography>
            <Typography variant="body1" fontWeight={600} color="text.primary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {progress !== undefined && (
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ mt: 1, borderRadius: 1 }}
              />
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={50} />
            <Typography variant="h6" color="text.secondary">
              กำลังโหลดข้อมูล...
            </Typography>
          </Stack>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 4,
            mb: 4
          }}
        >
          <Container maxWidth="xl" sx={{ pl: 4 }}>
            <Typography variant="h4" fontWeight={700} mb={1}>
              แดชบอร์ดผู้ดูแลระบบ
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              ภาพรวมระบบจัดการศิษย์เก่า มหาวิทยาลัยราชภัฏมหาสารคาม
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ pb: 4, pl: 4 }}>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<SchoolIcon />}
                title="ศิษย์เก่าทั้งหมด"
                value={stats.totalUsers}
                subtitle="ผู้ใช้ที่ลงทะเบียน"
                color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                progress={(stats.verifiedUsers / stats.totalUsers) * 100}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<EventIcon />}
                title="กิจกรรมทั้งหมด"
                value={stats.totalEvents}
                subtitle="กิจกรรมที่จัด"
                color="linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<NewsIcon />}
                title="ข่าวสารทั้งหมด"
                value={stats.totalNews}
                subtitle="ข่าวที่เผยแพร่"
                color="linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<ForumIcon />}
                title="กระดานสนทนา"
                value={stats.totalPosts}
                subtitle="โพสต์ทั้งหมด"
                color="linear-gradient(135deg, #10b981 0%, #059669 100%)"
              />
            </Grid>
          </Grid>

          {/* Recent Users Section */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card 
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  '&:hover': {
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <TrendingIcon sx={{ color: '#667eea' }} />
                    <Typography variant="h6" fontWeight={600} color="primary">
                      ศิษย์เก่าที่ลงทะเบียนล่าสุด
                    </Typography>
                  </Stack>
                  
                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                    <Table>
                      <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                          <TableCell>ผู้ใช้</TableCell>
                          <TableCell>คณะ</TableCell>
                          <TableCell>ปีที่จบ</TableCell>
                          <TableCell>อาชีพ</TableCell>
                          <TableCell>ตำแหน่ง</TableCell>
                          <TableCell>สถานที่ทำงาน</TableCell>
                          <TableCell>วันที่ลงทะเบียน</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stats.recentUsers.map((user, idx) => (
                          <TableRow 
                            key={user.id} 
                            sx={{ 
                              '&:nth-of-type(odd)': { bgcolor: '#f8fafc' },
                              '&:hover': { bgcolor: '#e2e8f0' }
                            }}
                          >
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: 'primary.main',
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  <PersonIcon />
                                </Avatar>
                                <Typography fontWeight={600}>
                                  {user.name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>{user.faculty}</TableCell>
                            <TableCell>
                              <Chip 
                                label={user.graduation_year} 
                                size="small" 
                                sx={{
                                  bgcolor: '#667eea',
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                            </TableCell>
                            <TableCell>{user.occupation || '-'}</TableCell>
                            <TableCell>{user.position || '-'}</TableCell>
                            <TableCell>{user.workplace || '-'}</TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(user.created_at)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AdminLayout>
  );
}

export default AdminDashboard;
