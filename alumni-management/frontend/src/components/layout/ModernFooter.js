import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  Divider,
  IconButton,
  Paper,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Facebook as FacebookIcon,
  School as SchoolIcon,
  Language as WebsiteIcon,
  AccessTime as TimeIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

function ModernFooter() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const quickLinks = [
    { label: 'ข่าวสาร', path: '/news', description: 'ข่าวสารและประกาศ' },
    { label: 'กิจกรรม', path: '/events', description: 'กิจกรรมของมหาวิทยาลัย' },
    { label: 'พูดคุย', path: '/forum', description: 'เสวนาและแลกเปลี่ยน' },
    { label: 'ทำเนียบศิษย์เก่า', path: '/alumni', description: 'ค้นหาศิษย์เก่า' }
  ];

  const contactInfo = [
    {
      icon: <LocationIcon />,
      title: 'ที่อยู่',
      content: '80 ถนนนครสวรรค์ ตำบลตลาด อำเภอเมือง จังหวัดมหาสารคาม 44000'
    },
    {
      icon: <PhoneIcon />,
      title: 'โทรศัพท์',
      content: '043-722-118'
    },
    {
      icon: <EmailIcon />,
      title: 'อีเมล',
      content: 'alumni@rmu.ac.th'
    },
    {
      icon: <WebsiteIcon />,
      title: 'เว็บไซต์',
      content: 'www.rmu.ac.th'
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #2f4b3f 0%, #243d33 100%)',
        color: 'white',
        mt: 'auto',
        pt: 8,
        pb: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
        }
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
          backgroundSize: '50px 50px'
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Grid container spacing={4}>
          {/* University Info Section */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.08)',
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {/* Logo and Title */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <SchoolIcon sx={{ fontSize: 32, color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700} sx={{ 
                        color: 'white',
                        lineHeight: 1.2
                      }}>
                        มหาวิทยาลัยราชภัฏมหาสารคาม
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'white', opacity: 0.9 }}>
                        Rajabhat Maha Sarakham University
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ 
                    opacity: 0.9, 
                    lineHeight: 1.8,
                    color: 'rgba(255,255,255,0.8)'
                  }}>
                    ระบบจัดการศิษย์เก่า เพื่อเชื่อมโยงและสร้างเครือข่ายระหว่างศิษย์เก่า 
                    อดีตนักศึกษา และมหาวิทยาลัย
                  </Typography>

                  {/* Stats */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<StarIcon />}
                      label="ศิษย์เก่า 10,000+"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                    <Chip
                      icon={<TimeIcon />}
                      label="ก่อตั้ง พ.ศ. 2538"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Info Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: 'white' }}>
              ติดต่อเรา
            </Typography>
            <Stack spacing={2.5}>
              {contactInfo.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateX(8px)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #2f4b3f 0%, #3a5c4b 100%)',
                    }}
                  >
                    {React.cloneElement(item.icon, { 
                      sx: { fontSize: 20, color: 'white' } 
                    })}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      opacity: 0.8, 
                      lineHeight: 1.6,
                      wordBreak: 'break-word'
                    }}>
                      {item.content}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: 'white' }}>
              ลิงก์ด่วน
            </Typography>
            <Stack spacing={1.5}>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  component={RouterLink}
                  to={link.path}
                  underline="none"
                  sx={{
                    display: 'block',
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateX(8px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} sx={{ 
                    color: 'white',
                    mb: 0.5
                  }}>
                    {link.label}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255,255,255,0.7)'
                  }}>
                    {link.description}
                  </Typography>
                </Link>
              ))}
            </Stack>

            {/* Social Media */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'white' }}>
                ติดตามเรา
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  component="a"
                  href="https://www.facebook.com/www.rmu.ac.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 50,
                    height: 50,
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#1877f2',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(24, 119, 242, 0.4)'
                    }
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                {/* เพิ่ม Social Media อื่นๆ ได้ตรงนี้ */}
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Box sx={{ my: 6 }}>
          <Divider 
            sx={{ 
              borderColor: 'rgba(255,255,255,0.1)',
              '&::before, &::after': {
                borderColor: 'rgba(255,255,255,0.1)'
              }
            }} 
          />
        </Box>

        {/* Bottom Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="body2" sx={{ 
            opacity: 0.8,
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            &copy; {new Date().getFullYear()} ระบบศิษย์เก่า มหาวิทยาลัยราชภัฏมหาสารคาม. 
            สงวนลิขสิทธิ์ทุกข้อมูล
          </Typography>
          
          <Stack direction="row" spacing={3} sx={{ opacity: 0.8 }}>
            <Link href="#" color="inherit" underline="hover" variant="body2">
              นโยบายความเป็นส่วนตัว
            </Link>
            <Link href="#" color="inherit" underline="hover" variant="body2">
              เงื่อนไขการใช้งาน
            </Link>
          </Stack>
        </Box>

        {/* Version Info */}
        <Box sx={{ 
          textAlign: 'center', 
          mt: 3, 
          pt: 2,
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            เวอร์ชัน 2.0 • พัฒนาด้วย React & Material-UI
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default ModernFooter;
