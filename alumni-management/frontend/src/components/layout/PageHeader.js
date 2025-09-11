import React from 'react';
import { Box, Paper, Typography, Container, Breadcrumbs, Link, useTheme } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';

function PageHeader({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  action, 
  background,
  sx = {} 
}) {
  const theme = useTheme();
  const location = useLocation();

  // สร้าง breadcrumbs อัตโนมัติจาก path
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbData = [
      { label: 'หน้าหลัก', path: '/', icon: <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> }
    ];

    let currentPath = '';
    pathnames.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // แปลง path เป็นชื่อภาษาไทย
      const pathLabels = {
        'news': 'ข่าวสาร',
        'events': 'กิจกรรม',
        'forum': 'พูดคุย',
        'alumni': 'ทำเนียบศิษย์เก่า',
        'profile': 'โปรไฟล์',
        'admin': 'จัดการระบบ',
        'login': 'เข้าสู่ระบบ',
        'register': 'สมัครสมาชิก'
      };

      const label = pathLabels[segment] || segment;
      const isLast = index === pathnames.length - 1;

      breadcrumbData.push({
        label,
        path: currentPath,
        isLast
      });
    });

    return breadcrumbData;
  };

  const finalBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : generateBreadcrumbs();

  return (
    <Paper
      sx={{
        position: 'relative',
        overflow: 'hidden',
        mb: 4,
        borderRadius: '20px',
        background: background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: {
          xs: '0 4px 20px rgba(0,0,0,0.1)',
          sm: '0 8px 40px rgba(0,0,0,0.12)'
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        },
        ...sx
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ 
          py: { xs: 3, sm: 4, md: 5 },
          px: { xs: 2, sm: 3 },
          position: 'relative',
          zIndex: 1
        }}>
          {/* Breadcrumbs */}
          {finalBreadcrumbs.length > 1 && (
            <Breadcrumbs
              sx={{
                mb: 2,
                '& .MuiBreadcrumbs-separator': {
                  color: 'rgba(255,255,255,0.7)',
                  mx: 1
                }
              }}
            >
              {finalBreadcrumbs.map((crumb, index) => {
                const isLast = index === finalBreadcrumbs.length - 1;
                
                if (isLast) {
                  return (
                    <Typography
                      key={crumb.path}
                      sx={{
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {crumb.icon}
                      {crumb.label}
                    </Typography>
                  );
                }

                return (
                  <Link
                    key={crumb.path}
                    component={RouterLink}
                    to={crumb.path}
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: 'white',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {crumb.icon}
                    {crumb.label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          )}

          {/* Header Content */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'flex-end' },
            justifyContent: 'space-between',
            gap: { xs: 2, sm: 3 }
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: subtitle ? 1 : 0,
                  fontSize: {
                    xs: '1.75rem',
                    sm: '2.25rem',
                    md: '2.75rem'
                  },
                  lineHeight: 1.2,
                  textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                {title}
              </Typography>
              
              {subtitle && (
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 400,
                    fontSize: {
                      xs: '1rem',
                      sm: '1.125rem'
                    },
                    lineHeight: 1.5,
                    maxWidth: '600px'
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>

            {/* Action Button */}
            {action && (
              <Box sx={{
                flexShrink: 0,
                alignSelf: { xs: 'stretch', sm: 'flex-end' }
              }}>
                {action}
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          pointerEvents: 'none'
        }}
      />
    </Paper>
  );
}

export default PageHeader;
