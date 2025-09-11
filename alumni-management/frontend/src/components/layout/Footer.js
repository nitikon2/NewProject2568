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
  Paper
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Facebook as FacebookIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        mt: 'auto',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* University Info Section */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SchoolIcon sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700}>
                  มหาวิทยาลัยราชภัฏมหาสารคาม
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
                ระบบจัดการศิษย์เก่า เพื่อเชื่อมโยงและสร้างเครือข่ายระหว่างศิษย์เก่า
              </Typography>
            </Stack>
          </Grid>

          {/* Contact Info Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              ติดต่อเรา
            </Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="flex-start" spacing={1}>
                <LocationIcon sx={{ fontSize: 18, mt: 0.2, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  80 ถนนนครสวรรค์ ตำบลตลาด<br />
                  อำเภอเมือง จังหวัดมหาสารคาม 44000
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  043-722-118
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  alumni@rmu.ac.th
                </Typography>
              </Stack>
            </Stack>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              ลิงก์ด่วน
            </Typography>
            <Stack spacing={1}>
              <Link
                component={RouterLink}
                to="/news"
                color="inherit"
                underline="hover"
                sx={{
                  opacity: 0.9,
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 1 }
                }}
              >
                ข่าวสาร
              </Link>
              <Link
                component={RouterLink}
                to="/events"
                color="inherit"
                underline="hover"
                sx={{
                  opacity: 0.9,
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 1 }
                }}
              >
                กิจกรรม
              </Link>
              <Link
                component={RouterLink}
                to="/forum"
                color="inherit"
                underline="hover"
                sx={{
                  opacity: 0.9,
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 1 }
                }}
              >
                พูดคุย
              </Link>
              <Link
                component={RouterLink}
                to="/alumni"
                color="inherit"
                underline="hover"
                sx={{
                  opacity: 0.9,
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 1 }
                }}
              >
                ทำเนียบศิษย์เก่า
              </Link>
            </Stack>

            {/* Social Media */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                ติดตามเรา
              </Typography>
              <IconButton
                component="a"
                href="https://www.facebook.com/www.rmu.ac.th"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                <FacebookIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            &copy; {new Date().getFullYear()} ระบบศิษย์เก่า มหาวิทยาลัยราชภัฏมหาสารคาม. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
