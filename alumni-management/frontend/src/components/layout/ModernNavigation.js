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
  Backdrop
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

  // จำลองการแจ้งเตือน (ในอนาคตสามารถดึงจาก API)
  const [notifications] = useState(3);

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
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                            borderRadius: '12px'
                          }}
                        >
                          <Badge badgeContent={notifications} color="error">
                            <NotificationsIcon />
                          </Badge>
                        </IconButton>
                      </Tooltip>

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
