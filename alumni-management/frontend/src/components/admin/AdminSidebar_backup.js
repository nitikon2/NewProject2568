import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Chip,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Forum as ForumIcon,
  Article as NewsIcon,
  Event as EventIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Star as StarIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { keyframes } from '@mui/system';

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  // Furni Modern Theme animations
  const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  `;

  const pulse = keyframes`
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  `;

  const shimmer = keyframes`
    0% { background-position: -200px 0; }
    100% { background-position: 200px 0; }
  `;

  const menuItems = [
    { 
      path: '/admin', 
      icon: DashboardIcon, 
      text: 'แดชบอร์ด', 
      color: '#f9c74f',
      badge: null,
      description: 'ภาพรวมระบบ'
    },
    { 
      path: '/admin/alumni', 
      icon: SchoolIcon, 
      text: 'จัดการศิษย์เก่า', 
      color: '#22c55e',
      badge: '2,568',
      description: 'ข้อมูลศิษย์เก่า'
    },
    { 
      path: '/admin/posts', 
      icon: ForumIcon, 
      text: 'จัดการกระดานสนทนา', 
      color: '#3b82f6',
      badge: '24',
      description: 'กระดานสนทนา'
    },
    { 
      path: '/admin/news', 
      icon: NewsIcon, 
      text: 'จัดการข่าวสาร', 
      color: '#f59e0b',
      badge: '12',
      description: 'ข่าวสารและประกาศ'
    },
    { 
      path: '/admin/events', 
      icon: EventIcon, 
      text: 'จัดการกิจกรรม', 
      color: '#8b5cf6',
      badge: '8',
      description: 'กิจกรรมและอีเวนต์'
    }
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'ยืนยันการออกจากระบบ',
      text: 'คุณต้องการออกจากระบบหรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      Swal.fire('สำเร็จ', 'ออกจากระบบเรียบร้อยแล้ว', 'success');
    }
  };

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        background: 'linear-gradient(135deg, #2f4b3f 0%, #3a5c4b 50%, #243d33 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: '50%',
          background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1.5" fill="%23f9c74f" opacity="0.2"/><circle cx="80" cy="30" r="1" fill="%23f9c74f" opacity="0.15"/><circle cx="40" cy="70" r="1.2" fill="%23f9c74f" opacity="0.25"/><circle cx="90" cy="80" r="0.8" fill="%23f9c74f" opacity="0.2"/></svg>') repeat`,
          backgroundSize: '100px 100px',
          animation: `${float} 20s ease-in-out infinite`,
          opacity: 0.1
        }
      }}
    >
      {/* Header with enhanced styling */}
      <Box 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(249,199,79,0.6), transparent)'
          }
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(249,199,79,0.2), rgba(255,255,255,0.1))',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            mb: 2,
            border: '2px solid rgba(249,199,79,0.3)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            animation: `${pulse} 3s ease-in-out infinite`,
            boxShadow: '0 8px 32px rgba(249, 199, 79, 0.3)',
            '&:hover': {
              transform: 'scale(1.1) rotate(5deg)',
              boxShadow: '0 12px 40px rgba(249, 199, 79, 0.4)',
              background: 'linear-gradient(135deg, rgba(249,199,79,0.3), rgba(255,255,255,0.2))'
            }
          }}
        >
          <AdminIcon sx={{ fontSize: 36, color: '#f9c74f' }} />
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700, 
            mb: 0.5, 
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, #ffffff, #f9c74f)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          ระบบจัดการศิษย์เก่า
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            opacity: 0.9, 
            display: 'block', 
            lineHeight: 1.4,
            color: '#fbd36b',
            fontWeight: 500
          }}
        >
          Furni Modern Admin Panel
        </Typography>
      </Box>

      {/* Enhanced User Info Card */}
      <Box 
        sx={{ 
          p: 3,
          mx: 2,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(249,199,79,0.1))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: `linear-gradient(90deg, transparent, rgba(249,199,79,0.1), transparent)`,
            animation: `${shimmer} 3s infinite`
          },
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(249,199,79,0.15))',
            transform: 'translateY(-4px) scale(1.02)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
          }
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              sx={{ 
                background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                width: 56,
                height: 56,
                border: '3px solid rgba(249,199,79,0.4)',
                transition: 'all 0.4s ease',
                boxShadow: '0 4px 20px rgba(249, 199, 79, 0.3)',
                '&:hover': {
                  transform: 'scale(1.15) rotate(5deg)',
                  boxShadow: '0 8px 30px rgba(249, 199, 79, 0.5)'
                }
              }}
            >
              <AccountIcon sx={{ fontSize: 32, color: '#2f4b3f' }} />
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                border: '2px solid #ffffff',
                animation: `${pulse} 2s ease-in-out infinite`
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: '#ffffff' }}>
              ผู้ดูแลระบบ
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip 
                label="Administrator"
                size="small"
                icon={<StarIcon sx={{ fontSize: 14 }} />}
                sx={{ 
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                  }
                }}
              />
              <IconButton
                size="small"
                sx={{
                  color: '#fbd36b',
                  '&:hover': {
                    backgroundColor: 'rgba(249, 199, 79, 0.1)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ my: 2, bgcolor: 'rgba(249,199,79,0.3)' }} />

      {/* Enhanced Navigation Menu */}
      <Box sx={{ flex: 1, px: 2, py: 1, position: 'relative', zIndex: 2 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            px: 2, 
            color: 'rgba(249,199,79,0.9)', 
            fontWeight: 700,
            letterSpacing: 1.5,
            fontSize: '0.75rem'
          }}
        >
          MAIN MENU
        </Typography>
        <List sx={{ mt: 2 }}>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  sx={{
                    borderRadius: '16px',
                    py: 2,
                    px: 2.5,
                    position: 'relative',
                    overflow: 'hidden',
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(249,199,79,0.2), rgba(255,255,255,0.1))'
                      : 'transparent',
                    backdropFilter: isActive ? 'blur(10px)' : 'none',
                    WebkitBackdropFilter: isActive ? 'blur(10px)' : 'none',
                    border: isActive 
                      ? '2px solid rgba(249,199,79,0.4)' 
                      : '2px solid transparent',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: isActive 
                      ? '0 8px 32px rgba(249, 199, 79, 0.2)'
                      : 'none',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: isActive ? 0 : '-100%',
                      width: '4px',
                      height: '100%',
                      background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                      borderRadius: '0 2px 2px 0',
                      transition: 'left 0.3s ease'
                    },
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(249,199,79,0.15), rgba(255,255,255,0.1))',
                      transform: 'translateX(8px) scale(1.02)',
                      boxShadow: '0 8px 25px rgba(249, 199, 79, 0.2)',
                      border: '2px solid rgba(249,199,79,0.3)',
                      '&::before': {
                        left: 0
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Badge 
                      badgeContent={item.badge} 
                      color="error"
                      invisible={!item.badge}
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.6rem',
                          minWidth: '16px',
                          height: '16px'
                        }
                      }}
                    >
                      <IconComponent 
                        sx={{ 
                          color: isActive ? '#f9c74f' : 'rgba(255,255,255,0.8)',
                          fontSize: 24,
                          transition: 'all 0.3s ease',
                          filter: isActive ? 'drop-shadow(0 2px 4px rgba(249, 199, 79, 0.5))' : 'none',
                          transform: hoveredItem === item.path ? 'scale(1.2) rotate(5deg)' : 'scale(1)'
                        }} 
                      />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    secondary={hoveredItem === item.path ? item.description : null}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.9)',
                      transition: 'all 0.3s ease'
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                      color: 'rgba(249,199,79,0.8)',
                      fontWeight: 400
                    }}
                  />
                  {(isActive || hoveredItem === item.path) && (
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                        boxShadow: '0 2px 8px rgba(249, 199, 79, 0.4)',
                        animation: `${pulse} 2s ease-in-out infinite`
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(249,199,79,0.3)' }} />

      {/* Enhanced Logout Button */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.2))',
              transform: 'translateY(-4px) scale(1.05)',
              boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
              border: '2px solid rgba(239, 68, 68, 0.5)'
            }
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: '#fca5a5', fontSize: 24 }} />
          </ListItemIcon>
          <ListItemText 
            primary="ออกจากระบบ"
            primaryTypographyProps={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#fca5a5'
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}

export default AdminSidebar;