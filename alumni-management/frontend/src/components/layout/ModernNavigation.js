import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Container, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar, 
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Chip,
  Badge,
  Tooltip,
  Zoom,
  Fade,
  Backdrop,
  Paper,
  Card,
  CardContent
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Home as HomeIcon,
  Newspaper as NewsIcon,
  Event as EventIcon,
  Forum as ForumIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

function ModernNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null);

  // ข้อมูลการแจ้งเตือน
  const [notifications, setNotifications] = useState({
    events: [
      {
        id: 1,
        title: 'งานสัมมนาศิษย์เก่า 2024',
        type: 'event',
        date: '2024-02-15',
        description: 'งานสัมมนาศิษย์เก่าประจำปี 2024',
        isNew: true
      },
      {
        id: 2,
        title: 'กิจกรรมกีฬาสีประจำปี',
        type: 'event',
        date: '2024-02-20',
        description: 'กิจกรรมกีฬาสีประจำปีของมหาวิทยาลัย',
        isNew: true
      }
    ],
    news: [
      {
        id: 3,
        title: 'ประกาศผลการรับสมัครนิสิตใหม่',
        type: 'news',
        date: '2024-02-10',
        description: 'ประกาศรายชื่อผู้ผ่านการคัดเลือก',
        isNew: true
      },
      {
        id: 4,
        title: 'การปรับปรุงระบบสารสนเทศ',
        type: 'news',
        date: '2024-02-08',
        description: 'ประกาศปรับปรุงระบบสารสนเทศของมหาวิทยาลัย',
        isNew: false
      }
    ],
    updates: [
      {
        id: 5,
        title: 'อัปเดทฟีเจอร์ใหม่ในระบบ',
        type: 'update',
        date: '2024-02-12',
        description: 'เพิ่มฟีเจอร์การค้นหาศิษย์เก่าขั้นสูง',
        isNew: true
      },
      {
        id: 6,
        title: 'ปรับปรุงระบบความปลอดภัย',
        type: 'update',
        date: '2024-02-05',
        description: 'เพิ่มระบบรักษาความปลอดภัยข้อมูล',
        isNew: false
      }
    ]
  });

  // นับการแจ้งเตือนทั้งหมด
  const totalNotifications = [
    ...notifications.events,
    ...notifications.news,
    ...notifications.updates
  ].filter(item => item.isNew).length;

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setProfileMenuAnchor(null);
    setMobileDrawerOpen(false);
    navigate('/login');
  };

  const menuItems = [
    { 
      label: 'หน้าหลัก', 
      path: '/', 
      icon: <HomeIcon />,
      description: 'กลับสู่หน้าหลัก'
    },
    { 
      label: 'ข่าวสาร', 
      path: '/news', 
      icon: <NewsIcon />,
      description: 'ข่าวสารและประกาศ'
    },
    { 
      label: 'กิจกรรม', 
      path: '/events', 
      icon: <EventIcon />,
      description: 'กิจกรรมของมหาวิทยาลัย'
    },
    { 
      label: 'พูดคุย', 
      path: '/forum', 
      icon: <ForumIcon />, 
      requireAuth: true,
      description: 'เสวนาและแลกเปลี่ยนความคิดเห็น'
    },
    { 
      label: 'ทำเนียบศิษย์เก่า', 
      path: '/alumni', 
      icon: <PeopleIcon />, 
      requireAuth: true,
      description: 'ค้นหาและติดต่อศิษย์เก่า'
    },
    ...(user?.role === 'admin' ? [{ 
      label: 'จัดการระบบ', 
      path: '/admin', 
      icon: <AdminIcon />,
      description: 'แผงควบคุมสำหรับผู้ดูแลระบบ'
    }] : [])
  ];

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: 300,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0,0,0,0.3)'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{
            width: 45,
            height: 45,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            mr: 2
          }}>
            <img
              src={logo}
              width="30"
              height="30"
              alt="Logo"
              style={{ borderRadius: '6px' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <SchoolIcon sx={{ fontSize: 30, display: 'none' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              RMU Alumni
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
              ระบบศิษย์เก่า
            </Typography>
          </Box>
        </Box>
        <IconButton 
          onClick={() => setMobileDrawerOpen(false)}
          sx={{ 
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.1)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      {/* User Profile Section */}
      {user && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Box sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            <Avatar sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: 'rgba(255,255,255,0.2)',
              fontSize: '1.5rem',
              fontWeight: 600
            }}>
              {user.name?.charAt(0)}
            </Avatar>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {user.name}
          </Typography>
          <Chip 
            label={user.faculty || 'ศิษย์เก่า'} 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontWeight: 500,
              backdropFilter: 'blur(10px)'
            }} 
          />
          
          {/* Notifications Badge in Mobile */}
          {totalNotifications > 0 && (
            <Box sx={{ mt: 2 }}>
              <Chip 
                label={`การแจ้งเตือน ${totalNotifications} รายการ`}
                size="small" 
                color="error"
                sx={{ 
                  color: 'white',
                  fontWeight: 500
                }} 
              />
            </Box>
          )}
        </Box>
      )}
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      
      {/* Menu Items */}
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => {
          if (item.requireAuth && !user) return null;
          const isActive = isActivePath(item.path);
          return (
            <ListItem 
              key={item.path}
              component={Link}
              to={item.path}
              onClick={() => setMobileDrawerOpen(false)}
              sx={{ 
                color: 'white',
                borderRadius: '12px',
                mb: 1,
                py: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateX(8px)'
                },
                ...(isActive && {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  transform: 'translateX(8px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                })
              }}
            >
              <ListItemIcon sx={{ 
                color: 'white', 
                minWidth: 40,
                '& .MuiSvgIcon-root': {
                  fontSize: '1.3rem'
                }
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                secondary={item.description}
                secondaryTypographyProps={{
                  sx: { color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }
                }}
              />
            </ListItem>
          );
        })}
        
        {/* Auth Buttons */}
        {!user && (
          <Box sx={{ px: 1, mt: 2 }}>
            <Button
              component={Link}
              to="/login"
              fullWidth
              variant="outlined"
              startIcon={<LoginIcon />}
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                borderRadius: '12px',
                py: 1.5,
                mb: 1,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              เข้าสู่ระบบ
            </Button>
            <Button
              component={Link}
              to="/register"
              fullWidth
              variant="contained"
              startIcon={<RegisterIcon />}
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                py: 1.5,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              สมัครสมาชิก
            </Button>
          </Box>
        )}
      </List>
      
      {/* User Actions */}
      {user && (
        <>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
          <List sx={{ px: 2 }}>
            <ListItem 
              component={Link}
              to="/profile"
              onClick={() => setMobileDrawerOpen(false)}
              sx={{ 
                color: 'white',
                borderRadius: '12px',
                mb: 1,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="โปรไฟล์" />
            </ListItem>
            <ListItem 
              component={Link}
              to="/work-history"
              onClick={() => setMobileDrawerOpen(false)}
              sx={{ 
                color: 'white',
                borderRadius: '12px',
                mb: 1,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary="ประวัติการทำงาน" />
            </ListItem>
            
            {/* Notifications in Mobile */}
            <ListItem 
              onClick={() => {
                // Show mobile notifications - you could implement a separate mobile notification modal
                setMobileDrawerOpen(false);
              }}
              sx={{ 
                color: 'white',
                borderRadius: '12px',
                mb: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <Badge badgeContent={totalNotifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary="การแจ้งเตือน" 
                secondary={totalNotifications > 0 ? `${totalNotifications} รายการใหม่` : 'ไม่มีรายการใหม่'}
                secondaryTypographyProps={{
                  sx: { color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }
                }}
              />
            </ListItem>
            
            <ListItem 
              onClick={handleLogout}
              sx={{ 
                color: 'white',
                borderRadius: '12px',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="ออกจากระบบ" />
            </ListItem>
          </List>
        </>
      )}
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: scrolled 
            ? 'rgba(102, 126, 234, 0.95)' 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
          transition: 'all 0.3s ease',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ 
            minHeight: { xs: '60px', sm: '70px' },
            px: { xs: 1, sm: 2 }
          }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setMobileDrawerOpen(true)}
                sx={{ 
                  mr: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  borderRadius: '12px'
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo and Brand */}
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: 'inherit',
                flexGrow: isMobile ? 1 : 0,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              <Box sx={{
                width: { xs: 45, sm: 50 },
                height: { xs: 45, sm: 50 },
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                mr: 1.5
              }}>
                <img
                  src={logo}
                  width="35"
                  height="35"
                  alt="Logo"
                  style={{ borderRadius: '8px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <SchoolIcon sx={{ fontSize: 35, display: 'none' }} />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  lineHeight: 1.2,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}>
                  ระบบศิษย์เก่า
                </Typography>
                <Typography variant="caption" sx={{ 
                  opacity: 0.9, 
                  fontSize: '0.75rem',
                  fontWeight: 400
                }}>
                  มหาวิทยาลัยราชภัฏมหาสารคาม
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', mx: 4 }}>
                  {menuItems.map((item) => {
                    if (item.requireAuth && !user) return null;
                    const isActive = isActivePath(item.path);
                    return (
                      <Tooltip 
                        key={item.path}
                        title={item.description}
                        TransitionComponent={Zoom}
                        arrow
                      >
                        <Button
                          component={Link}
                          to={item.path}
                          color="inherit"
                          startIcon={item.icon}
                          sx={{
                            mx: 0.5,
                            px: 3,
                            py: 1.5,
                            borderRadius: '16px',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            position: 'relative',
                            transition: 'all 0.3s ease',
                            textTransform: 'none',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.15)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                            },
                            ...(isActive && {
                              bgcolor: 'rgba(255,255,255,0.2)',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60%',
                                height: '3px',
                                bgcolor: 'white',
                                borderRadius: '2px',
                                boxShadow: '0 2px 10px rgba(255,255,255,0.3)'
                              }
                            })
                          }}
                        >
                          {item.label}
                        </Button>
                      </Tooltip>
                    );
                  })}
                </Box>

                {/* User Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {user ? (
                    <>
                      {/* Notifications */}
                      <Tooltip title="การแจ้งเตือน" arrow>
                        <IconButton
                          color="inherit"
                          onClick={(e) => setNotificationMenuAnchor(e.currentTarget)}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                            borderRadius: '12px'
                          }}
                        >
                          <Badge badgeContent={totalNotifications} color="error">
                            <NotificationsIcon />
                          </Badge>
                        </IconButton>
                      </Tooltip>

                      {/* Notification Menu */}
                      <Menu
                        anchorEl={notificationMenuAnchor}
                        open={Boolean(notificationMenuAnchor)}
                        onClose={() => setNotificationMenuAnchor(null)}
                        PaperProps={{
                          sx: {
                            mt: 2,
                            borderRadius: '16px',
                            minWidth: 400,
                            maxWidth: 500,
                            maxHeight: 600,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            overflow: 'hidden'
                          }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        {/* Notification Header */}
                        <Box sx={{ 
                          px: 3, 
                          py: 2.5, 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white'
                        }}>
                          <Typography variant="h6" fontWeight="600">
                            การแจ้งเตือน
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            ข้อมูลล่าสุดและกิจกรรม
                          </Typography>
                        </Box>

                        {/* Notification Content */}
                        <Box sx={{ maxHeight: 450, overflow: 'auto' }}>
                          {/* Events Section */}
                          {notifications.events.length > 0 && (
                            <Box>
                              <Box sx={{ px: 3, py: 2, bgcolor: 'rgba(102, 126, 234, 0.05)' }}>
                                <Typography variant="subtitle2" fontWeight="600" color="primary">
                                  <EventIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                  กิจกรรม
                                </Typography>
                              </Box>
                              {notifications.events.map((event) => (
                                <MenuItem
                                  key={event.id}
                                  onClick={() => {
                                    setNotificationMenuAnchor(null);
                                    navigate('/events');
                                  }}
                                  sx={{ 
                                    py: 2, 
                                    px: 3,
                                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                                    '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.05)' }
                                  }}
                                >
                                  <Box sx={{ width: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                      <Typography variant="body2" fontWeight="500" sx={{ mb: 0.5 }}>
                                        {event.title}
                                        {event.isNew && (
                                          <Chip 
                                            label="ใหม่" 
                                            size="small" 
                                            color="error"
                                            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                          />
                                        )}
                                      </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                      {new Date(event.date).toLocaleDateString('th-TH')}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {event.description}
                                    </Typography>
                                  </Box>
                                </MenuItem>
                              ))}
                            </Box>
                          )}

                          {/* News Section */}
                          {notifications.news.length > 0 && (
                            <Box>
                              <Box sx={{ px: 3, py: 2, bgcolor: 'rgba(76, 175, 80, 0.05)' }}>
                                <Typography variant="subtitle2" fontWeight="600" color="success.main">
                                  <NewsIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                  ข่าวสาร
                                </Typography>
                              </Box>
                              {notifications.news.map((news) => (
                                <MenuItem
                                  key={news.id}
                                  onClick={() => {
                                    setNotificationMenuAnchor(null);
                                    navigate('/news');
                                  }}
                                  sx={{ 
                                    py: 2, 
                                    px: 3,
                                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                                    '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.05)' }
                                  }}
                                >
                                  <Box sx={{ width: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                      <Typography variant="body2" fontWeight="500" sx={{ mb: 0.5 }}>
                                        {news.title}
                                        {news.isNew && (
                                          <Chip 
                                            label="ใหม่" 
                                            size="small" 
                                            color="error"
                                            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                          />
                                        )}
                                      </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                      {new Date(news.date).toLocaleDateString('th-TH')}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {news.description}
                                    </Typography>
                                  </Box>
                                </MenuItem>
                              ))}
                            </Box>
                          )}

                          {/* Updates Section */}
                          {notifications.updates.length > 0 && (
                            <Box>
                              <Box sx={{ px: 3, py: 2, bgcolor: 'rgba(255, 152, 0, 0.05)' }}>
                                <Typography variant="subtitle2" fontWeight="600" color="warning.main">
                                  <SettingsIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                  การอัปเดท
                                </Typography>
                              </Box>
                              {notifications.updates.map((update) => (
                                <MenuItem
                                  key={update.id}
                                  onClick={() => {
                                    setNotificationMenuAnchor(null);
                                  }}
                                  sx={{ 
                                    py: 2, 
                                    px: 3,
                                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                                    '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.05)' }
                                  }}
                                >
                                  <Box sx={{ width: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                      <Typography variant="body2" fontWeight="500" sx={{ mb: 0.5 }}>
                                        {update.title}
                                        {update.isNew && (
                                          <Chip 
                                            label="ใหม่" 
                                            size="small" 
                                            color="error"
                                            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                          />
                                        )}
                                      </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                      {new Date(update.date).toLocaleDateString('th-TH')}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {update.description}
                                    </Typography>
                                  </Box>
                                </MenuItem>
                              ))}
                            </Box>
                          )}

                          {/* Empty State */}
                          {totalNotifications === 0 && (
                            <Box sx={{ py: 4, px: 3, textAlign: 'center' }}>
                              <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                              <Typography variant="body2" color="text.secondary">
                                ไม่มีการแจ้งเตือนใหม่
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Footer */}
                        <Divider />
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <Button 
                            size="small" 
                            onClick={() => {
                              setNotificationMenuAnchor(null);
                              // Mark all as read
                              setNotifications(prev => ({
                                events: prev.events.map(item => ({ ...item, isNew: false })),
                                news: prev.news.map(item => ({ ...item, isNew: false })),
                                updates: prev.updates.map(item => ({ ...item, isNew: false }))
                              }));
                            }}
                            sx={{ borderRadius: '8px' }}
                          >
                            ทำเครื่องหมายว่าอ่านแล้วทั้งหมด
                          </Button>
                        </Box>
                      </Menu>

                      {/* Profile Menu */}
                      <Tooltip title={`สวัสดี ${user.name}`} arrow>
                        <IconButton
                          color="inherit"
                          onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
                          sx={{
                            p: 0.5,
                            border: '2px solid rgba(255,255,255,0.2)',
                            borderRadius: '14px',
                            '&:hover': { borderColor: 'rgba(255,255,255,0.4)' }
                          }}
                        >
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              bgcolor: 'rgba(255,255,255,0.2)',
                              fontWeight: 600,
                              fontSize: '1.1rem'
                            }}
                          >
                            {user.name?.charAt(0)}
                          </Avatar>
                        </IconButton>
                      </Tooltip>
                      
                      <Menu
                        anchorEl={profileMenuAnchor}
                        open={Boolean(profileMenuAnchor)}
                        onClose={() => setProfileMenuAnchor(null)}
                        PaperProps={{
                          sx: {
                            mt: 2,
                            borderRadius: '16px',
                            minWidth: 240,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            overflow: 'hidden'
                          }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        {/* Profile Header */}
                        <Box sx={{ 
                          px: 3, 
                          py: 2.5, 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar sx={{ 
                              width: 45, 
                              height: 45, 
                              bgcolor: 'rgba(255,255,255,0.2)',
                              mr: 2,
                              fontWeight: 600
                            }}>
                              {user.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="600">
                                {user.name}
                              </Typography>
                              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                {user.faculty || 'ศิษย์เก่า'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Menu Items */}
                        <MenuItem 
                          component={Link} 
                          to="/profile"
                          onClick={() => setProfileMenuAnchor(null)}
                          sx={{ 
                            py: 1.5, 
                            px: 3,
                            '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.05)' }
                          }}
                        >
                          <PersonIcon sx={{ mr: 2, fontSize: 20, color: '#667eea' }} />
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              โปรไฟล์
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              จัดการข้อมูลส่วนตัว
                            </Typography>
                          </Box>
                        </MenuItem>

                        <MenuItem 
                          component={Link} 
                          to="/work-history"
                          onClick={() => setProfileMenuAnchor(null)}
                          sx={{ 
                            py: 1.5, 
                            px: 3,
                            '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.05)' }
                          }}
                        >
                          <WorkIcon sx={{ mr: 2, fontSize: 20, color: '#667eea' }} />
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              ประวัติการทำงาน
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              จัดการประวัติการทำงาน
                            </Typography>
                          </Box>
                        </MenuItem>

                        {user.role === 'admin' && (
                          <MenuItem 
                            component={Link}
                            to="/admin"
                            onClick={() => setProfileMenuAnchor(null)}
                            sx={{ 
                              py: 1.5, 
                              px: 3,
                              '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.05)' }
                            }}
                          >
                            <DashboardIcon sx={{ mr: 2, fontSize: 20, color: '#667eea' }} />
                            <Box>
                              <Typography variant="body2" fontWeight="500">
                                แผงควบคุม
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                จัดการระบบ
                              </Typography>
                            </Box>
                          </MenuItem>
                        )}

                        <Divider sx={{ my: 1 }} />

                        <MenuItem 
                          onClick={handleLogout}
                          sx={{ 
                            py: 1.5, 
                            px: 3,
                            color: 'error.main',
                            '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.05)' }
                          }}
                        >
                          <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                          <Typography variant="body2" fontWeight="500">
                            ออกจากระบบ
                          </Typography>
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <>
                      <Button
                        component={Link}
                        to="/login"
                        color="inherit"
                        startIcon={<LoginIcon />}
                        sx={{ 
                          mr: 1,
                          borderRadius: '12px',
                          px: 2.5,
                          py: 1,
                          fontWeight: 600,
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                        }}
                      >
                        เข้าสู่ระบบ
                      </Button>
                      <Button
                        component={Link}
                        to="/register"
                        variant="outlined"
                        startIcon={<RegisterIcon />}
                        sx={{
                          color: 'white',
                          borderColor: 'rgba(255,255,255,0.3)',
                          borderRadius: '12px',
                          px: 2.5,
                          py: 1,
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: 'white',
                            bgcolor: 'rgba(255,255,255,0.1)'
                          }
                        }}
                      >
                        สมัครสมาชิก
                      </Button>
                    </>
                  )}
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <MobileDrawer />
    </>
  );
}

export default ModernNavigation;
