import React, { useEffect, useState } from 'react';
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
  NotificationsActive as NotificationIcon,
  Work as WorkIcon,
  PersonAdd as PersonAddIcon,
  BusinessCenter as BusinessIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = JSON.parse(localStorage.getItem('user'));
  const [latestNews, setLatestNews] = useState(null);
  const [latestEvent, setLatestEvent] = useState(null);
  
  // States for tabs and modal
  const [activeTab, setActiveTab] = useState('home');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Services data
  const services = [
    {
      title: 'ข่าวสารและประกาศ',
      description: 'ติดตามข่าวสาร กิจกรรม และประกาศสำคัญจากมหาวิทยาลัย รับข้อมูลข่าวสารที่สำคัญได้ทันเวลา',
      icon: NotificationIcon,
      color: '#2f4b3f',
      link: '/news'
    },
    {
      title: 'กิจกรรมศิษย์เก่า',
      description: 'เข้าร่วมกิจกรรมและงานสังสรรค์กับเพื่อนศิษย์เก่า สร้างเครือข่ายและความสัมพันธ์ที่ดี',
      icon: CelebrationIcon,
      color: '#ffd700',
      link: '/events'
    },
    {
      title: 'เครือข่ายศิษย์เก่า',
      description: 'ค้นหาและติดต่อเพื่อนร่วมรุ่นได้ง่ายดาย สร้างเครือข่ายทางวิชาชีพและการทำงาน',
      icon: SchoolIcon,
      color: '#2f4b3f',
      link: '/alumni'
    },
    {
      title: 'ฟอรัมพูดคุย',
      description: 'แบ่งปันประสบการณ์และสร้างเครือข่ายใหม่ๆ พูดคุยแลกเปลี่ยนความคิดเห็นกับศิษย์เก่า',
      icon: ForumIcon,
      color: '#f59e0b',
      link: '/forum'
    }
  ];

  useEffect(() => {
    // Fetch latest news
    axios.get('http://localhost:5000/api/news?limit=1')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) setLatestNews(res.data[0]);
      })
      .catch(err => console.error('Error fetching news:', err));

    // Fetch latest event
    axios.get('http://localhost:5000/api/events?limit=1')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) setLatestEvent(res.data[0]);
      })
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f7f5f3, #f0ede8)',
      fontFamily: 'Source Sans Pro, sans-serif'
    }}>
      {/* Hero Section - Furni Modern Style */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2f4b3f 0%, #243d33 100%)',
          color: '#ffffff',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Furni-style decorative elements */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          bottom: 0, 
          left: '50%',
          background: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><circle cx=\'20\' cy=\'20\' r=\'1.5\' fill=\'%23f9c74f\' opacity=\'0.3\'/><circle cx=\'80\' cy=\'30\' r=\'1\' fill=\'%23f9c74f\' opacity=\'0.2\'/><circle cx=\'40\' cy=\'70\' r=\'1.2\' fill=\'%23f9c74f\' opacity=\'0.4\'/><circle cx=\'90\' cy=\'80\' r=\'0.8\' fill=\'%23f9c74f\' opacity=\'0.3\'/></svg>") repeat',
          backgroundSize: '100px 100px',
          animation: 'float 20s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' }
          }
        }} />
        
        <Container maxWidth="xl">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={7}>
              <Box className="animate__animated animate__fadeInLeft" sx={{ position: 'relative', zIndex: 2 }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 2,
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  ระบบจัดการข้อมูล
                  <Box component="span" sx={{ color: '#f9c74f', display: 'block' }}>
                    ศิษย์เก่าสมัยใหม่
                  </Box>
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    opacity: 0.9,
                    fontWeight: 400,
                    fontSize: { xs: '1.2rem', md: '1.4rem' },
                    lineHeight: 1.6
                  }}
                >
                  เชื่อมต่อ แบ่งปัน และสร้างเครือข่ายกับศิษย์เก่า พร้อมระบบจัดการข้อมูลที่ทันสมัย
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                      color: '#ffffff',
                      px: 4,
                      py: 1.5,
                      borderRadius: '0.75rem',
                      fontWeight: 600,
                      fontSize: '1rem',
                      boxShadow: '0 0.25rem 0.75rem rgba(249, 199, 79, 0.3)',
                      border: '2px solid #f9c74f',
                      '&:hover': {
                        background: '#f8b42e',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 1rem 2rem rgba(47, 75, 63, 0.25)'
                      }
                    }}
                    startIcon={<PersonAddIcon />}
                  >
                    เริ่มใช้งานเลย
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/alumni"
                    variant="outlined"
                    size="large"
                    sx={{
                      color: '#ffffff',
                      borderColor: 'rgba(255,255,255,0.5)',
                      px: 4,
                      py: 1.5,
                      borderRadius: '0.75rem',
                      fontWeight: 600,
                      fontSize: '1rem',
                      borderWidth: '2px',
                      '&:hover': {
                        borderColor: '#ffffff',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                    startIcon={<ArrowIcon />}
                  >
                    ดูทำเนียบศิษย์เก่า
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box 
                className="animate__animated animate__fadeInRight"
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <Box sx={{
                  width: { xs: 300, md: 400 },
                  height: { xs: 300, md: 400 },
                  borderRadius: '2rem',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '20%',
                    left: '20%',
                    width: '60%',
                    height: '60%',
                    background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                    borderRadius: '50%',
                    opacity: 0.8,
                    filter: 'blur(40px)',
                    animation: 'pulse 3s ease-in-out infinite'
                  },
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' }
                  }
                }}>
                  <SchoolIcon sx={{ fontSize: 'inherit' }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Product Showcase - Furni Style */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h4" 
            sx={{
              fontWeight: 600,
              fontFamily: 'Poppins, sans-serif',
              color: '#2a3b3d',
              mb: 2
            }}
            className="animate__animated animate__fadeInUp"
          >
            บริการเด่นสำหรับศิษย์เก่า
          </Typography>
          <Typography 
            variant="h6" 
            sx={{
              color: '#adb5bd',
              fontSize: '1rem',
              fontWeight: 500
            }}
            className="animate__animated animate__fadeInUp"
          >
            ครบครันทุกความต้องการสำหรับชุมชนศิษย์เก่า พร้อมระบบที่ทันสมัย
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                background: '#ffffff',
                borderRadius: '1.5rem',
                border: '1px solid #e9ecef',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 1rem 2rem rgba(47, 75, 63, 0.25)',
                  '&::before': {
                    opacity: 1
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                  opacity: 0,
                  transition: 'opacity 0.3s'
                }
              }}
              className="animate__animated animate__fadeInUp"
            >
              <Box
                sx={{
                  height: 250,
                  background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '4rem',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, transparent 30%, rgba(249, 199, 79, 0.1) 50%, transparent 70%)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s'
                  }
                }}
              >
                <PeopleIcon sx={{ fontSize: 'inherit' }} />
              </Box>
              <CardContent sx={{ padding: '1.5rem', textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#2a3b3d',
                    marginBottom: '0.5rem'
                  }}
                >
                  ทำเนียบศิษย์เก่า
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#f8b42e',
                    marginBottom: '1rem'
                  }}
                >
                  2,568 คน
                </Typography>
                <Button
                  component={RouterLink}
                  to="/alumni"
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: '#f0ede8',
                    border: '2px solid #dee2e6',
                    color: '#6c757d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    transition: 'all 0.3s ease',
                    fontSize: '1.2rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                      borderColor: '#f9c74f',
                      color: '#ffffff',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <ArrowIcon />
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                background: '#ffffff',
                borderRadius: '1.5rem',
                border: '1px solid #e9ecef',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 1rem 2rem rgba(47, 75, 63, 0.25)',
                  '&::before': {
                    opacity: 1
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                  opacity: 0,
                  transition: 'opacity 0.3s'
                }
              }}
              className="animate__animated animate__fadeInUp"
            >
              <Box
                sx={{
                  height: 250,
                  background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '4rem'
                }}
              >
                <EventIcon sx={{ fontSize: 'inherit' }} />
              </Box>
              <CardContent sx={{ padding: '1.5rem', textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#2a3b3d',
                    marginBottom: '0.5rem'
                  }}
                >
                  กิจกรรมศิษย์เก่า
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#f8b42e',
                    marginBottom: '1rem'
                  }}
                >
                  156 กิจกรรม
                </Typography>
                <Button
                  component={RouterLink}
                  to="/events"
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: '#f0ede8',
                    border: '2px solid #dee2e6',
                    color: '#6c757d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    transition: 'all 0.3s ease',
                    fontSize: '1.2rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                      borderColor: '#f9c74f',
                      color: '#ffffff',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <ArrowIcon />
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                background: '#ffffff',
                borderRadius: '1.5rem',
                border: '1px solid #e9ecef',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 1rem 2rem rgba(47, 75, 63, 0.25)',
                  '&::before': {
                    opacity: 1
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                  opacity: 0,
                  transition: 'opacity 0.3s'
                }
              }}
              className="animate__animated animate__fadeInUp"
            >
              <Box
                sx={{
                  height: 250,
                  background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '4rem'
                }}
              >
                <ForumIcon sx={{ fontSize: 'inherit' }} />
              </Box>
              <CardContent sx={{ padding: '1.5rem', textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#2a3b3d',
                    marginBottom: '0.5rem'
                  }}
                >
                  ฟอรัมพูดคุย
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#f8b42e',
                    marginBottom: '1rem'
                  }}
                >
                  เริ่มใช้งาน
                </Typography>
                <Button
                  component={RouterLink}
                  to="/forum"
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: '#f0ede8',
                    border: '2px solid #dee2e6',
                    color: '#6c757d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    transition: 'all 0.3s ease',
                    fontSize: '1.2rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                      borderColor: '#f9c74f',
                      color: '#ffffff',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <ArrowIcon />
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Features Grid */}
      <Box sx={{ background: '#ffffff', py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
                      borderRadius: '1.5rem',
                      height: 420,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '2.5rem'
                    }}
                  >
                    <WorkIcon sx={{ fontSize: 'inherit' }} />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #a8dadc, #457b9d)',
                      borderRadius: '1.5rem',
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '2.5rem',
                      mb: 2
                    }}
                  >
                    <NotificationIcon sx={{ fontSize: 'inherit' }} />
                  </Box>
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                      borderRadius: '1.5rem',
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '2.5rem'
                    }}
                  >
                    <BusinessIcon sx={{ fontSize: 'inherit' }} />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{
                    fontWeight: 600,
                    fontFamily: 'Poppins, sans-serif',
                    color: '#2a3b3d',
                    mb: 4
                  }}
                >
                  ระบบที่ครบครันสำหรับศิษย์เก่า
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{
                    color: '#adb5bd',
                    mb: 4,
                    lineHeight: 1.7
                  }}
                >
                  ระบบจัดการข้อมูลศิษย์เก่าที่ทันสมัย ช่วยให้คุณเชื่อมต่อกับเพื่อนร่วมรุ่น 
                  แบ่งปันประสบการณ์ และสร้างเครือข่ายทางวิชาชีพได้อย่างง่ายดาย
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                  <Box component="li" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: '50%', 
                      background: '#28a745', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      mr: 2,
                      fontSize: '0.8rem',
                      color: 'white'
                    }}>
                      ✓
                    </Box>
                    <Typography variant="body2">
                      จัดการข้อมูลส่วนตัวและประวัติการศึกษา
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: '50%', 
                      background: '#28a745', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      mr: 2,
                      fontSize: '0.8rem',
                      color: 'white'
                    }}>
                      ✓
                    </Box>
                    <Typography variant="body2">
                      เครือข่ายศิษย์เก่าและการติดต่อ
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: '50%', 
                      background: '#28a745', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      mr: 2,
                      fontSize: '0.8rem',
                      color: 'white'
                    }}>
                      ✓
                    </Box>
                    <Typography variant="body2">
                      ข่าวสารและกิจกรรมต่างๆ
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: '50%', 
                      background: '#28a745', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      mr: 2,
                      fontSize: '0.8rem',
                      color: 'white'
                    }}>
                      ✓
                    </Box>
                    <Typography variant="body2">
                      ฟอรัมและชุมชนออนไลน์
                    </Typography>
                  </Box>
                </Box>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
                    color: '#ffffff',
                    px: 4,
                    py: 1.5,
                    borderRadius: '0.75rem',
                    fontWeight: 600,
                    border: '2px solid #2f4b3f',
                    '&:hover': {
                      background: '#243d33',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  startIcon={<ArrowIcon />}
                >
                  เริ่มใช้งาน
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action - Furni Style */}
      {!user && (
        <Box
          sx={{
            background: '#f0ede8',
            py: 8,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(249, 199, 79, 0.1)'
            }
          }}
        >
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{
                fontWeight: 600,
                fontFamily: 'Poppins, sans-serif',
                color: '#2a3b3d',
                mb: 2
              }}
            >
              พร้อมเข้าร่วมชุมชนศิษย์เก่าแล้วหรือยัง?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{
                color: '#6c757d',
                mb: 4,
                fontSize: '1rem',
                fontWeight: 500
              }}
            >
              สมัครสมาชิกวันนี้และเชื่อมต่อกับเพื่อนศิษย์เก่า ติดตามข่าวสาร และเข้าร่วมกิจกรรมต่างๆ
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                  color: '#ffffff',
                  px: 4,
                  py: 1.5,
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  border: '2px solid #f9c74f',
                  boxShadow: '0 0.25rem 0.75rem rgba(249, 199, 79, 0.3)',
                  '&:hover': {
                    background: '#f8b42e',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 1rem 2rem rgba(47, 75, 63, 0.25)'
                  }
                }}
                startIcon={<PersonAddIcon />}
              >
                เริ่มต้นใช้งาน
              </Button>
              <Button
                component={RouterLink}
                to="/alumni"
                variant="outlined"
                size="large"
                sx={{
                  color: '#2f4b3f',
                  borderColor: '#2f4b3f',
                  px: 4,
                  py: 1.5,
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  borderWidth: '2px',
                  '&:hover': {
                    borderColor: '#2f4b3f',
                    bgcolor: 'rgba(47, 75, 63, 0.05)',
                    transform: 'translateY(-2px)'
                  }
                }}
                startIcon={<ArrowIcon />}
              >
                เรียนรู้เพิ่มเติม
              </Button>
            </Stack>
          </Container>
        </Box>
      )}
    </Box>
  );
}

export default Home;