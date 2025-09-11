import React from 'react';
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
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Forum as ForumIcon,
  Article as NewsIcon,
  Event as EventIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', icon: DashboardIcon, text: 'แดชบอร์ด', color: '#3b82f6' },
    { path: '/admin/alumni', icon: SchoolIcon, text: 'จัดการศิษย์เก่า', color: '#10b981' },
    { path: '/admin/posts', icon: ForumIcon, text: 'จัดการกระดานสนทนา', color: '#f59e0b' },
    { path: '/admin/news', icon: NewsIcon, text: 'จัดการข่าวสาร', color: '#ef4444' },
    { path: '/admin/events', icon: EventIcon, text: 'จัดการกิจกรรม', color: '#8b5cf6' }
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
          }
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '16px',
            bgcolor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            mb: 2,
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}
        >
          <AdminIcon sx={{ fontSize: 32, color: 'white' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.2 }}>
          ระบบจัดการศิษย์เก่า
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', lineHeight: 1.3 }}>
          มหาวิทยาลัยราชภัฏมหาสารคาม
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />

      {/* User Info */}
      <Box 
        sx={{ 
          p: 3,
          mx: 2,
          borderRadius: '16px',
          bgcolor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.15)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
          }
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              width: 50,
              height: 50,
              border: '2px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            <AccountIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              ผู้ดูแลระบบ
            </Typography>
            <Chip 
              label="Administrator"
              size="small"
              sx={{ 
                bgcolor: 'rgba(34, 197, 94, 0.2)',
                color: '#86efac',
                fontSize: '0.75rem',
                fontWeight: 500,
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}
            />
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, px: 2, py: 2 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            px: 2, 
            color: 'rgba(255,255,255,0.7)', 
            fontWeight: 600,
            letterSpacing: 1
          }}
        >
          เมนูหลัก
        </Typography>
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    px: 2,
                    bgcolor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                    '&:hover': {
                      bgcolor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                      transform: 'translateX(4px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: isActive ? 'blur(10px)' : 'none',
                    border: isActive ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': isActive ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '4px',
                      height: '100%',
                      bgcolor: 'white',
                      borderRadius: '0 2px 2px 0'
                    } : {}
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <IconComponent 
                      sx={{ 
                        color: isActive ? 'white' : 'rgba(255,255,255,0.8)',
                        fontSize: 22,
                        transition: 'all 0.3s ease'
                      }} 
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'white' : 'rgba(255,255,255,0.9)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  {isActive && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'white',
                        opacity: 0.8
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            bgcolor: 'rgba(239, 68, 68, 0.2)',
            '&:hover': {
              bgcolor: 'rgba(239, 68, 68, 0.3)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: '#fca5a5', fontSize: 22 }} />
          </ListItemIcon>
          <ListItemText 
            primary="ออกจากระบบ"
            primaryTypographyProps={{
              fontSize: '0.95rem',
              fontWeight: 500,
              color: '#fca5a5'
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}

export default AdminSidebar;