import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Grid, 
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/images/logo.png';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        // ตรวจสอบข้อมูลก่อนส่ง
        if (!formData.email || !formData.password) {
            setError('กรุณากรอกอีเมลและรหัสผ่าน');
            setLoading(false);
            return;
        }

        const response = await axios.post('http://localhost:5000/api/users/login', formData);
        console.log('Login response:', response.data);

        const { token, user } = response.data;
        if (!token || !user) {
            throw new Error('ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง');
        }

        // เก็บข้อมูลใน localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // ตั้งค่า axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Redirect ตาม role
        if (user.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    } catch (err) {
        console.error('Login error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
        setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2f4b3f 0%, #3a5c4b 100%)',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, md: 0 }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={0} sx={{ minHeight: { md: '80vh' } }}>
          {/* Left Side - Branding (Hidden on mobile) */}
          {!isMobile && (
            <Grid 
              item 
              md={6} 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                p: 4
              }}
            >
              <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
                <SchoolIcon sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
                <Typography variant="h3" fontWeight={700} mb={2}>
                  ยินดีต้อนรับ
                </Typography>
                <Typography variant="h5" mb={4} sx={{ opacity: 0.9 }}>
                  ระบบศิษย์เก่า RMU
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
                  เชื่อมต่อกับเครือข่ายศิษย์เก่า มหาวิทยาลัยราชภัฏมหาสารคาม 
                  แบ่งปันประสบการณ์ และเติบโตไปด้วยกัน
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Right Side - Login Form */}
          <Grid 
            item 
            xs={12} 
            md={6}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              p: { xs: 2, md: 4 }
            }}
          >
            <Paper
              elevation={24}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                width: '100%',
                maxWidth: 450,
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.95)'
              }}
            >
              {/* Mobile Logo */}
              {isMobile && (
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <img
                    src={logo}
                    alt="Logo"
                    style={{ width: 60, height: 60, borderRadius: 8 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-logo.png';
                    }}
                  />
                  <Typography variant="h5" fontWeight={700} mt={2} color="primary">
                    ระบบศิษย์เก่า RMU
                  </Typography>
                </Box>
              )}

              <Typography 
                variant="h4" 
                fontWeight={700} 
                textAlign="center" 
                mb={1}
                color="text.primary"
              >
                เข้าสู่ระบบ
              </Typography>
              
              <Typography 
                variant="body2" 
                textAlign="center" 
                color="text.secondary" 
                mb={4}
              >
                กรอกข้อมูลเพื่อเข้าสู่ระบบ
              </Typography>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      fontSize: '1.2rem'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  type="email"
                  label="อีเมล"
                  variant="outlined"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 }
                  }}
                />

                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="รหัสผ่าน"
                  variant="outlined"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 }
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #2f4b3f 0%, #3a5c4b 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3a5c4b 0%, #2d4a3a 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(47, 75, 63, 0.3)'
                    },
                    '&:disabled': {
                      background: '#e2e8f0'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    component={Link}
                    to="/reset-password"
                    variant="text"
                    sx={{ 
                      color: 'primary.main',
                      textDecoration: 'underline',
                      '&:hover': { textDecoration: 'none' }
                    }}
                  >
                    ลืมรหัสผ่าน?
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    หรือ
                  </Typography>
                </Divider>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    ยังไม่มีบัญชี?{' '}
                    <Button
                      component={Link}
                      to="/register"
                      variant="text"
                      sx={{ 
                        fontWeight: 600,
                        textDecoration: 'underline',
                        '&:hover': { textDecoration: 'none' }
                      }}
                    >
                      สมัครสมาชิกที่นี่
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Login;

