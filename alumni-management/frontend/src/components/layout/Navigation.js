import React, { useState } from 'react';
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
  Chip
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
  Close as CloseIcon
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setProfileMenuAnchor(null);
    setMobileDrawerOpen(false);
    navigate('/login');
  };

  const menuItems = [
    { label: 'หน้าหลัก', path: '/', icon: <HomeIcon /> },
    { label: 'ข่าวสาร', path: '/news', icon: <NewsIcon /> },
    { label: 'กิจกรรม', path: '/events', icon: <EventIcon /> },
    { label: 'พูดคุย', path: '/forum', icon: <ForumIcon />, requireAuth: true },
    { label: 'ทำเนียบศิษย์เก่า', path: '/alumni', icon: <PeopleIcon />, requireAuth: true },
    ...(user?.role === 'admin' ? [{ label: 'จัดการระบบ', path: '/admin', icon: <AdminIcon /> }] : [])
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
          width: 280,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logo}
            width="40"
            height="40"
            alt="Logo"
            style={{ borderRadius: '8px' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-logo.png';
            }}
          />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
            RMU Alumni
          </Typography>
        </Box>
        <IconButton 
          onClick={() => setMobileDrawerOpen(false)}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      
      {user && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: 'rgba(255,255,255,0.2)' }}>
            {user.name?.charAt(0)}
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user.name}
          </Typography>
          <Chip 
            label={user.faculty} 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              mt: 0.5
            }} 
          />
        </Box>
      )}
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      
      <List>
        {menuItems.map((item) => {
          if (item.requireAuth && !user) return null;
          return (
            <ListItem 
              key={item.path}
              component={Link}
              to={item.path}
              onClick={() => setMobileDrawerOpen(false)}
              sx={{ 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                bgcolor: isActivePath(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          );
        })}
        
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 1 }} />
        
        {user ? (
          <>
            <ListItem 
              component={Link}
              to="/profile"
              onClick={() => setMobileDrawerOpen(false)}
              sx={{ 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="โปรไฟล์" />
            </ListItem>
            <ListItem 
              onClick={handleLogout}
              sx={{ 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                cursor: 'pointer'
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="ออกจากระบบ" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem 
              component={Link}
              to="/login"
              onClick={() => setMobileDrawerOpen(false)}
              sx={{ 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="เข้าสู่ระบบ" />
            </ListItem>
            <ListItem 
              component={Link}
              to="/register"
              onClick={() => setMobileDrawerOpen(false)}
              sx={{ 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <RegisterIcon />
              </ListItemIcon>
              <ListItemText primary="สมัครสมาชิก" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: '70px !important', px: { xs: 0, sm: 2 } }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setMobileDrawerOpen(true)}
                sx={{ mr: 2 }}
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
                flexGrow: isMobile ? 1 : 0
              }}
            >
              <img
                src={logo}
                width="50"
                height="50"
                alt="Logo"
                style={{ borderRadius: '8px' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-logo.png';
                }}
              />
              <Box sx={{ ml: 1.5, display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  ระบบศิษย์เก่า
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
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
                    return (
                      <Button
                        key={item.path}
                        component={Link}
                        to={item.path}
                        color="inherit"
                        startIcon={item.icon}
                        sx={{
                          mx: 0.5,
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          fontWeight: 500,
                          position: 'relative',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.1)',
                            transform: 'translateY(-2px)'
                          },
                          ...(isActivePath(item.path) && {
                            bgcolor: 'rgba(255,255,255,0.2)',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              bottom: 0,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: '80%',
                              height: '2px',
                              bgcolor: 'white',
                              borderRadius: '1px'
                            }
                          }),
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {item.label}
                      </Button>
                    );
                  })}
                </Box>

                {/* User Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {user ? (
                    <>
                      <IconButton
                        color="inherit"
                        onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
                        sx={{ p: 0.5 }}
                      >
                        <Avatar 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            bgcolor: 'rgba(255,255,255,0.2)',
                            fontWeight: 600
                          }}
                        >
                          {user.name?.charAt(0)}
                        </Avatar>
                      </IconButton>
                      
                      <Menu
                        anchorEl={profileMenuAnchor}
                        open={Boolean(profileMenuAnchor)}
                        onClose={() => setProfileMenuAnchor(null)}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            borderRadius: 2,
                            minWidth: 200,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          <Typography variant="subtitle2" fontWeight="600">
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.faculty}
                          </Typography>
                        </Box>
                        <MenuItem 
                          component={Link} 
                          to="/profile"
                          onClick={() => setProfileMenuAnchor(null)}
                        >
                          <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
                          โปรไฟล์
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                          <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                          ออกจากระบบ
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
                          borderRadius: 2,
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
                          borderColor: 'rgba(255,255,255,0.5)',
                          borderRadius: 2,
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

export default Navigation;
