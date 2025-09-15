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
  LinearProgress,
  Fade,
  Slide,
  IconButton,
  Badge,
  Tooltip
} from '@mui/material';
import {
  School as SchoolIcon,
  Forum as ForumIcon,
  Event as EventIcon,
  Article as NewsIcon,
  Person as PersonIcon,
  Verified as VerifiedIcon,
  HourglassEmpty as PendingIcon,
  TrendingUp as TrendingIcon,
  Analytics as AnalyticsIcon,
  Groups as GroupsIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';
import { keyframes } from '@mui/system';
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    setIsVisible(true);
  }, []);

  // Furni animations
  const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  `;

  const pulse = keyframes`
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
  `;

  const shimmer = keyframes`
    0% { background-position: -200px 0; }
    100% { background-position: 200px 0; }
  `;

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

  const StatCard = ({ icon, title, value, subtitle, color, progress, index }) => (
    <Slide in={isVisible} direction="up" timeout={1000 + (index * 200)}>
      <Card 
        elevation={0}
        sx={{
          height: '100%',
          borderRadius: '24px',
          border: '2px solid transparent',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: color,
            borderRadius: '24px 24px 0 0',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.4s ease'
          },
          '&:hover': {
            transform: 'translateY(-12px) scale(1.02)',
            boxShadow: '0 20px 60px rgba(47, 75, 63, 0.15)',
            borderColor: 'rgba(249, 199, 79, 0.3)',
            '&::before': {
              transform: 'scaleX(1)'
            }
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Box
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -8,
                  left: -8,
                  right: -8,
                  bottom: -8,
                  background: color,
                  borderRadius: '20px',
                  opacity: 0.1,
                  animation: `${pulse} 3s ease-in-out infinite`
                }
              }}
            >
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  background: color,
                  color: 'white',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(5deg) scale(1.1)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
                  }
                }}
              >
                {icon}
              </Avatar>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  background: 'linear-gradient(135deg, #2f4b3f, #f9c74f)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 1,
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                {value?.toLocaleString() || 0}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#2a3b3d',
                  mb: 0.5
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6c757d',
                    fontWeight: 500
                  }}
                >
                  {subtitle}
                </Typography>
              )}
              {progress !== undefined && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ 
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(249, 199, 79, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        background: color,
                        borderRadius: 4
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ mt: 1, color: '#6c757d', fontWeight: 600 }}>
                    {Math.round(progress)}% ปีนี้
                  </Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Slide>
  );

  if (loading) {
    return (
      <AdminLayout>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh',
            background: 'linear-gradient(135deg, #f7f5f3, #f0ede8)'
          }}
        >
          <Stack alignItems="center" spacing={3}>
            <Box sx={{ position: 'relative' }}>
              <CircularProgress 
                size={80} 
                thickness={4}
                sx={{
                  color: '#f9c74f',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round'
                  }
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: `${pulse} 2s ease-in-out infinite`
                }}
              >
                <AnalyticsIcon sx={{ fontSize: 40, color: '#2f4b3f' }} />
              </Box>
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#2a3b3d',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #2f4b3f, #f9c74f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              กำลังโหลดข้อมูลแดชบอร์ด...
            </Typography>
          </Stack>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f7f5f3 0%, #f0ede8 100%)' }}>
        {/* Enhanced Header */}
        <Fade in={isVisible} timeout={1000}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2f4b3f 0%, #3a5c4b 50%, #243d33 100%)',
              color: 'white',
              py: 6,
              mb: 4,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: '50%',
                background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1.5" fill="%23f9c74f" opacity="0.3"/><circle cx="80" cy="30" r="1" fill="%23f9c74f" opacity="0.2"/><circle cx="40" cy="70" r="1.2" fill="%23f9c74f" opacity="0.4"/><circle cx="90" cy="80" r="0.8" fill="%23f9c74f" opacity="0.3"/></svg>') repeat`,
                backgroundSize: '100px 100px',
                animation: `${float} 20s ease-in-out infinite`,
                opacity: 0.1
              }
            }}
          >
            <Container maxWidth="xl" sx={{ pl: 4, position: 'relative', zIndex: 2 }}>
              <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                    border: '4px solid rgba(249, 199, 79, 0.3)',
                    animation: `${pulse} 3s ease-in-out infinite`
                  }}
                >
                  <AnalyticsIcon sx={{ fontSize: 40, color: '#2f4b3f' }} />
                </Avatar>
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800, 
                      mb: 1,
                      background: 'linear-gradient(135deg, #ffffff, #f9c74f)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    แดชบอร์ดผู้ดูแลระบบ
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      opacity: 0.9,
                      fontWeight: 500,
                      color: '#fbd36b'
                    }}
                  >
                    ภาพรวมระบบจัดการศิษย์เก่า
                  </Typography>
                </Box>
              </Stack>
            </Container>
          </Box>
        </Fade>

        <Container maxWidth="xl" sx={{ pb: 4, pl: 4 }}>
          {/* Enhanced Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<GroupsIcon sx={{ fontSize: 32 }} />}
                title="ศิษย์เก่าทั้งหมด"
                value={stats.totalUsers}
                subtitle="ผู้ใช้ที่ลงทะเบียน"
                color="linear-gradient(135deg, #2f4b3f 0%, #3a5c4b 100%)"
                progress={(stats.verifiedUsers / stats.totalUsers) * 100}
                index={0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<EventIcon sx={{ fontSize: 32 }} />}
                title="กิจกรรมทั้งหมด"
                value={stats.totalEvents}
                subtitle="กิจกรรมที่จัด"
                color="linear-gradient(135deg, #f9c74f 0%, #fbd36b 100%)"
                index={1}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<CampaignIcon sx={{ fontSize: 32 }} />}
                title="ข่าวสารทั้งหมด"
                value={stats.totalNews}
                subtitle="ข่าวที่เผยแพร่"
                color="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                index={2}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<ForumIcon sx={{ fontSize: 32 }} />}
                title="กระดานสนทนา"
                value={stats.totalPosts}
                subtitle="โพสต์ทั้งหมด"
                color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                index={3}
              />
            </Grid>
          </Grid>

          {/* Enhanced Recent Users Section */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Slide in={isVisible} direction="up" timeout={1400}>
                <Card 
                  elevation={0}
                  sx={{
                    borderRadius: '24px',
                    border: '2px solid rgba(249, 199, 79, 0.2)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, rgba(249,199,79,0.02), transparent)`,
                      animation: `${shimmer} 3s infinite`
                    },
                    '&:hover': {
                      boxShadow: '0 20px 60px rgba(47, 75, 63, 0.1)',
                      borderColor: 'rgba(249, 199, 79, 0.4)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 4 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                          animation: `${pulse} 3s ease-in-out infinite`
                        }}
                      >
                        <TrendingIcon sx={{ fontSize: 28, color: '#2f4b3f' }} />
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #2f4b3f, #f9c74f)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >
                          ศิษย์เก่าที่ลงทะเบียนล่าสุด
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ข้อมูลล่าสุดของผู้ใช้ที่เข้าร่วมระบบ
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <TableContainer 
                      component={Paper} 
                      elevation={0} 
                      sx={{ 
                        border: '2px solid rgba(249, 199, 79, 0.1)', 
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #fefcfb 100%)'
                      }}
                    >
                      <Table>
                        <TableHead 
                          sx={{ 
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                          }}
                        >
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: '#2a3b3d' }}>ผู้ใช้</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#2a3b3d' }}>คณะ</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#2a3b3d' }}>ปีที่จบ</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#2a3b3d' }}>ตำแหน่งปัจจุบัน</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#2a3b3d' }}>สถานที่ทำงานปัจจุบัน</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#2a3b3d' }}>อุตสาหกรรม</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#2a3b3d' }}>วันที่ลงทะเบียน</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {stats.recentUsers.map((user, idx) => (
                            <TableRow 
                              key={user.id} 
                              sx={{ 
                                '&:nth-of-type(odd)': { 
                                  bgcolor: 'rgba(249, 199, 79, 0.03)' 
                                },
                                '&:hover': { 
                                  bgcolor: 'rgba(249, 199, 79, 0.1)',
                                  transform: 'scale(1.01)',
                                  transition: 'all 0.2s ease'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <TableCell>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Avatar
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
                                      fontSize: '0.875rem'
                                    }}
                                  >
                                    <PersonIcon fontSize="small" />
                                  </Avatar>
                                  <Typography fontWeight={600} color="#2a3b3d">
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
                                    background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                                    color: '#2a3b3d',
                                    fontWeight: 600,
                                    border: '1px solid rgba(249, 199, 79, 0.3)'
                                  }}
                                />
                              </TableCell>
                              <TableCell>{user.current_position || '-'}</TableCell>
                              <TableCell>{user.current_workplace || '-'}</TableCell>
                              <TableCell>{user.current_industry || '-'}</TableCell>
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
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AdminLayout>
  );
}

export default AdminDashboard;
