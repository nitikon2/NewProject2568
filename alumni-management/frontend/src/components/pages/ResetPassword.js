import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress,
  InputAdornment,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  LockReset as LockResetIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import logo from '../../assets/images/logo.png';

function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: กรอกอีเมล, 2: กรอกรหัสผ่านใหม่
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    securityAnswer: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securityQuestion, setSecurityQuestion] = useState('');

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      setError('กรุณากรอกอีเมล');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ตรวจสอบว่าอีเมลมีในระบบหรือไม่
      const response = await axios.post('http://localhost:5000/api/users/check-email', {
        email: formData.email
      });

      if (response.data.success) {
        // ใช้คำถามความปลอดภัยง่าย ๆ แทน OTP
        setSecurityQuestion('ชื่อเต็มของคุณ (ชื่อ + นามสกุล)');
        setStep(2);
      } else {
        setError('ไม่พบอีเมลนี้ในระบบ');
      }
    } catch (err) {
      console.error('Check email error:', err);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการตรวจสอบอีเมล');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.securityAnswer.trim()) {
      setError('กรุณากรอกชื่อเต็มของคุณ');
      return;
    }

    if (!formData.newPassword) {
      setError('กรุณากรอกรหัสผ่านใหม่');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/users/reset-password-simple', {
        email: formData.email,
        securityAnswer: formData.securityAnswer,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'รีเซ็ตรหัสผ่านสำเร็จ!',
          text: 'คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว',
          confirmButtonText: 'เข้าสู่ระบบ',
          confirmButtonColor: '#2f4b3f'
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError('');
    setSecurityQuestion('');
    setFormData(prev => ({
      ...prev,
      securityAnswer: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2f4b3f 0%, #3a5c4b 100%)',
        py: 4,
        position: 'relative'
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2f4b3f 0%, #1f3329 100%)',
              color: 'white',
              p: 4,
              textAlign: 'center'
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                backdropFilter: 'blur(10px)'
              }}
            >
              <LockResetIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h4" fontWeight={700} mb={1}>
              รีเซ็ตรหัสผ่าน
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {step === 1 ? 'กรอกอีเมลที่ใช้ลงทะเบียน' : 'ยืนยันตัวตนและตั้งรหัสผ่านใหม่'}
            </Typography>
          </Box>

          {/* Content */}
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                  border: '1px solid #fca5a5'
                }}
              >
                {error}
              </Alert>
            )}

            {/* Step 1: กรอกอีเมล */}
            {step === 1 && (
              <Box component="form" onSubmit={handleStep1Submit}>
                <TextField
                  fullWidth
                  type="email"
                  label="อีเมล"
                  placeholder="กรอกอีเมลที่ใช้ลงทะเบียน"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoFocus
                  sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        boxShadow: '0 0 0 3px rgba(47, 75, 63, 0.1)'
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#6b7280' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    background: '#2f4b3f',
                    boxShadow: '0 2px 8px rgba(47, 75, 63, 0.3)',
                    mb: 3,
                    '&:hover': {
                      background: '#1f3329',
                      boxShadow: '0 4px 12px rgba(47, 75, 63, 0.4)',
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      กำลังตรวจสอบ...
                    </>
                  ) : (
                    'ดำเนินการต่อ'
                  )}
                </Button>
              </Box>
            )}

            {/* Step 2: ยืนยันตัวตนและตั้งรหัสผ่านใหม่ */}
            {step === 2 && (
              <Box component="form" onSubmit={handleStep2Submit}>
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    border: '1px solid #93c5fd'
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    เพื่อความปลอดภัย กรุณายืนยันตัวตน
                  </Typography>
                </Alert>

                <TextField
                  fullWidth
                  label="ชื่อเต็มของคุณ (ชื่อ + นามสกุล)"
                  placeholder="กรอกชื่อและนามสกุลที่ใช้ลงทะเบียน"
                  value={formData.securityAnswer}
                  onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                  required
                  autoFocus
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        boxShadow: '0 0 0 3px rgba(249, 199, 79, 0.1)'
                      }
                    }
                  }}
                />

                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="รหัสผ่านใหม่"
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  required
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        boxShadow: '0 0 0 3px rgba(47, 75, 63, 0.1)'
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#6b7280' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#6b7280' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="ยืนยันรหัสผ่านใหม่"
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  error={formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== ''}
                  helperText={formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== '' ? 'รหัสผ่านไม่ตรงกัน' : ''}
                  sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        boxShadow: '0 0 0 3px rgba(47, 75, 63, 0.1)'
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#6b7280' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: '#6b7280' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      borderColor: '#d1d5db',
                      color: '#6b7280',
                      '&:hover': {
                        borderColor: '#9ca3af',
                        backgroundColor: '#f9fafb'
                      }
                    }}
                  >
                    ย้อนกลับ
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      flex: 2,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      background: '#2f4b3f',
                      boxShadow: '0 2px 8px rgba(47, 75, 63, 0.3)',
                      '&:hover': {
                        background: '#1f3329',
                        boxShadow: '0 4px 12px rgba(47, 75, 63, 0.4)',
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                        กำลังรีเซ็ต...
                      </>
                    ) : (
                      'รีเซ็ตรหัสผ่าน'
                    )}
                  </Button>
                </Box>
              </Box>
            )}

            {/* Back to Login Link */}
            <Box sx={{ textAlign: 'center', mt: 3, pt: 3, borderTop: '1px solid rgba(203, 213, 225, 0.3)' }}>
              <Button
                component={Link}
                to="/login"
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  color: '#6b7280',
                  fontWeight: 500,
                  '&:hover': { backgroundColor: 'transparent', color: '#2f4b3f' }
                }}
              >
                กลับไปหน้าเข้าสู่ระบบ
              </Button>
            </Box>
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
