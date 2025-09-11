import React, { useEffect, useState } from 'react';
import BackgroundLayout from '../layout/BackgroundLayout';
import 'animate.css';
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Paper,
  IconButton,
  Chip,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Forum as ForumIcon,
  School as SchoolIcon,
  Celebration as CelebrationIcon,
  ArrowForward as ArrowIcon,
  NotificationsActive as NotificationIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = JSON.parse(localStorage.getItem('user'));
  const [latestNews, setLatestNews] = useState(null);
  const [latestEvent, setLatestEvent] = useState(null);
  const [stats, setStats] = useState({
    totalAlumni: 0,
    totalEvents: 0,
    totalNews: 0
  });

  useEffect(() => {
    // Fetch latest news
    axios.get('http://localhost:5000/api/news?limit=1')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) setLatestNews(res.data[0]);
        else if (res.data.news && res.data.news.length > 0) setLatestNews(res.data.news[0]);
      })
      .catch(err => console.error('Error fetching news:', err));

    // Fetch latest event
    axios.get('http://localhost:5000/api/events?limit=1')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) setLatestEvent(res.data[0]);
      })
      .catch(err => console.error('Error fetching events:', err));

    // Fetch statistics (mock data for now)
    setStats({
      totalAlumni: 2568,
      totalEvents: 48,
      totalNews: 127
    });
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Hero Section with Gradient Background */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative shapes */}
        <Box sx={{ 
          position: 'absolute', 
          top: -50, 
          right: -50, 
          width: 200, 
          height: 200, 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <Box sx={{ 
          position: 'absolute', 
          bottom: -30, 
          left: -30, 
          width: 150, 
          height: 150, 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        
        <Container maxWidth="xl">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={8}>
              <Box className="animate__animated animate__fadeInLeft">
                <Typography 
                  variant="h2" 
                  fontWeight={800} 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 2,
                    lineHeight: 1.1
                  }}
                >
                  ยินดีต้อนรับสู่ชุมชน
                  <Box component="span" sx={{ color: '#ffd700', display: 'block' }}>
                    ศิษย์เก่า RMU
                  </Box>
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    opacity: 0.9,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    fontWeight: 400
                  }}
                >
                  เชื่อมต่อ แบ่งปัน และเติบโตไปด้วยกันกับเครือข่ายศิษย์เก่า
                  <br />มหาวิทยาลัยราชภัฏมหาสารคาม
                </Typography>
                
                {user ? (
                  <Paper 
                    elevation={0}
                    sx={{
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      px: 3, 
                      py: 2.5, 
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      maxWidth: 500
                    }}
                    className="animate__animated animate__fadeIn animate__delay-1s"
                  >
                    <Avatar sx={{ width: 50, height: 50, bgcolor: 'rgba(255,255,255,0.2)' }}>
                      {user.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        สวัสดี, {user.name}
                      </Typography>
                      <Chip 
                        label={user.faculty} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          color: 'white',
                          fontWeight: 500
                        }} 
                      />
                    </Box>
                  </Paper>
                ) : (
                  <Stack direction="row" spacing={2} className="animate__animated animate__fadeIn animate__delay-1s">
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: '#ffd700',
                        color: '#1a1a1a',
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: '#ffed4e',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      เริ่มต้นใช้งาน
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant="outlined"
                      size="large"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.5)',
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      เข้าสู่ระบบ
                    </Button>
                  </Stack>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box 
                className="animate__animated animate__fadeInRight"
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  mt: { xs: 4, md: 0 }
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    สถิติระบบ
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="h4" fontWeight={700} color="#ffd700">
                        {stats.totalAlumni.toLocaleString()}
                      </Typography>
                      <Typography variant="caption">ศิษย์เก่า</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h4" fontWeight={700} color="#ffd700">
                        {stats.totalEvents}
                      </Typography>
                      <Typography variant="caption">กิจกรรม</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h4" fontWeight={700} color="#ffd700">
                        {stats.totalNews}
                      </Typography>
                      <Typography variant="caption">ข่าวสาร</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Quick Access Cards */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          textAlign="center" 
          mb={6}
          className="animate__animated animate__fadeInUp"
        >
          เข้าถึงได้ง่าย ใช้งานได้ทันที
        </Typography>
        
        <Grid container spacing={4} className="animate__animated animate__fadeInUp">
          {/* Latest News Card */}
          <Grid item xs={12} md={6} lg={4}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%', 
                borderRadius: 4,
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  borderColor: '#667eea'
                }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  image={latestNews?.image_url ? `http://localhost:5000${latestNews.image_url}` : process.env.PUBLIC_URL + "/images/news.jpg"}
                  alt="ข่าวสารล่าสุด"
                  sx={{ height: 200, objectFit: 'cover' }}
                  onError={e => { 
                    e.target.onerror = null; 
                    e.target.src = process.env.PUBLIC_URL + "/images/news.jpg"; 
                  }}
                />
                <Chip
                  icon={<TrendingIcon />}
                  label="ข่าวใหม่"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: '#ff6b6b',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  {latestNews?.title || "ข่าวสารล่าสุด"}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  {latestNews?.content?.substring(0, 100) || "ติดตามข่าวสารและประกาศสำคัญสำหรับศิษย์เก่า"}...
                </Typography>
                <Button
                  component={RouterLink}
                  to="/news"
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  ดูข่าวทั้งหมด
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Latest Event Card */}
          <Grid item xs={12} md={6} lg={4}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%', 
                borderRadius: 4,
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  borderColor: '#ffd700'
                }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  image={latestEvent?.image_url ? `http://localhost:5000${latestEvent.image_url}` : process.env.PUBLIC_URL + "/images/events.jpg"}
                  alt="กิจกรรมล่าสุด"
                  sx={{ height: 200, objectFit: 'cover' }}
                  onError={e => { 
                    e.target.onerror = null; 
                    e.target.src = process.env.PUBLIC_URL + "/images/events.jpg"; 
                  }}
                />
                <Chip
                  icon={<EventIcon />}
                  label="กิจกรรม"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: '#ffd700',
                    color: '#1a1a1a',
                    fontWeight: 600
                  }}
                />
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  {latestEvent?.title || "กิจกรรมที่กำลังจะมาถึง"}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  {latestEvent?.description?.substring(0, 100) || "กิจกรรมและงานสังสรรค์ศิษย์เก่าที่น่าสนใจ"}...
                </Typography>
                <Button
                  component={RouterLink}
                  to="/events"
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowIcon />}
                  sx={{ 
                    borderRadius: 2,
                    bgcolor: '#ffd700',
                    color: '#1a1a1a',
                    '&:hover': { bgcolor: '#ffed4e' }
                  }}
                >
                  ดูกิจกรรมทั้งหมด
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Alumni Directory Card */}
          <Grid item xs={12} md={6} lg={4}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%', 
                borderRadius: 4,
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  borderColor: '#10b981'
                }
              }}
            >
              <Box sx={{ position: 'relative', height: 200, bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PeopleIcon sx={{ fontSize: 80, color: '#10b981' }} />
                <Chip
                  icon={<PeopleIcon />}
                  label="ทำเนียบ"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: '#10b981',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  ทำเนียบศิษย์เก่า
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  ค้นหาและติดต่อเพื่อนร่วมรุ่นของคุณ เชื่อมต่อกับเครือข่ายศิษย์เก่า
                </Typography>
                <Button
                  component={RouterLink}
                  to="/alumni"
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowIcon />}
                  sx={{ 
                    borderRadius: 2,
                    bgcolor: '#10b981',
                    '&:hover': { bgcolor: '#059669' }
                  }}
                >
                  ดูทำเนียบศิษย์เก่า
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="xl">
          <Typography 
            variant="h4" 
            fontWeight={700} 
            textAlign="center" 
            mb={2}
            className="animate__animated animate__fadeInUp"
          >
            ฟีเจอร์เด่นของระบบ
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            color="text.secondary" 
            mb={6}
            className="animate__animated animate__fadeInUp"
          >
            ครบครันทุกความต้องการสำหรับชุมชนศิษย์เก่า
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    borderColor: '#667eea'
                  }
                }}
                className="animate__animated animate__fadeInUp"
              >
                <Box sx={{ mb: 3 }}>
                  <NotificationIcon sx={{ fontSize: 48, color: '#667eea' }} />
                </Box>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  ข่าวสารและประกาศ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ติดตามข่าวสาร กิจกรรม และประกาศสำคัญจากมหาวิทยาลัย
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    borderColor: '#ffd700'
                  }
                }}
                className="animate__animated animate__fadeInUp"
              >
                <Box sx={{ mb: 3 }}>
                  <CelebrationIcon sx={{ fontSize: 48, color: '#ffd700' }} />
                </Box>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  กิจกรรมศิษย์เก่า
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  เข้าร่วมกิจกรรมและงานสังสรรค์กับเพื่อนศิษย์เก่า
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    borderColor: '#10b981'
                  }
                }}
                className="animate__animated animate__fadeInUp"
              >
                <Box sx={{ mb: 3 }}>
                  <SchoolIcon sx={{ fontSize: 48, color: '#10b981' }} />
                </Box>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  เครือข่ายศิษย์เก่า
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ค้นหาและติดต่อเพื่อนร่วมรุ่นได้ง่ายดาย
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    borderColor: '#f59e0b'
                  }
                }}
                className="animate__animated animate__fadeInUp"
              >
                <Box sx={{ mb: 3 }}>
                  <ForumIcon sx={{ fontSize: 48, color: '#f59e0b' }} />
                </Box>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  ฟอรัมพูดคุย
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  แบ่งปันประสบการณ์และสร้างเครือข่ายใหม่ๆ
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      {!user && (
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 8,
            textAlign: 'center'
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h4" fontWeight={700} mb={2}>
              พร้อมเข้าร่วมชุมชนศิษย์เก่าแล้วหรือยัง?
            </Typography>
            <Typography variant="h6" mb={4} sx={{ opacity: 0.9 }}>
              สมัครสมาชิกวันนี้และเชื่อมต่อกับเพื่อนศิษย์เก่า
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#ffd700',
                  color: '#1a1a1a',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#ffed4e',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                เริ่มต้นใช้งาน
              </Button>
              <Button
                component={RouterLink}
                to="/alumni"
                variant="outlined"
                size="large"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                เรียนรู้เพิ่มเติม
              </Button>
            </Stack>
          </Container>
        </Box>
      )}

      {/* Floating animation is handled by Material-UI keyframes */}
    </Box>
  );
}

export default Home;
