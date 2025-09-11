import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
  Paper,
  Grid
} from '@mui/material';
import {
  Email as EmailIcon,
  LockReset as LockResetIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import BackgroundLayout from '../layout/BackgroundLayout';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email.trim()) {
      setError('กรุณากรอกอีเมล');
      return;
    }
    setSending(true);
    try {
      await axios.post('http://localhost:5000/api/users/forgot-password', { email });
      setSuccess('ส่งรหัสยืนยันไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบอีเมล');
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setSending(false);
    }
  };

  return (
    <BackgroundLayout>
      <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
        <Grid container spacing={0} sx={{ minHeight: '80vh' }}>
          {/* Left Side - Branding */}
          <Grid item xs={12} md={6} sx={{
            background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
            borderRadius: { xs: '24px 24px 0 0', md: '24px 0 0 24px' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            p: 4,
            textAlign: 'center'
          }}>
            <LockResetIcon sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              textShadow: '0 2px 8px rgba(255,255,255,0.2)'
            }}>
              ลืมรหัสผ่าน?
            </Typography>
            <Typography variant="h6" sx={{ 
              opacity: 0.9, 
              maxWidth: 400, 
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}>
              ไม่ต้องกังวล! เราจะช่วยคุณรีเซ็ตรหัสผ่านและกลับมาใช้งานระบบได้อีกครั้ง
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmailIcon sx={{ fontSize: 28 }} />
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                ระบบจะส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณ
              </Typography>
            </Box>
          </Grid>

          {/* Right Side - Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{
              height: '100%',
              borderRadius: { xs: '0 0 24px 24px', md: '0 24px 24px 0' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)'
            }}>
              <Card sx={{
                width: '100%',
                maxWidth: 400,
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(37, 99, 235, 0.1)',
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box textAlign="center" mb={4}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      รีเซ็ตรหัสผ่าน
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '1rem' }}>
                      กรอกอีเมลที่ใช้สมัครสมาชิก
                    </Typography>
                  </Box>

                  {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                      {success}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      type="email"
                      label="อีเมล"
                      placeholder="กรอกอีเมลของคุณ"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                      sx={{ mb: 4 }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={sending}
                      startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
                      sx={{
                        py: 1.5,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
                        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                          boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)'
                        },
                        mb: 3
                      }}
                    >
                      {sending ? 'กำลังส่ง...' : 'ส่งรหัสยืนยัน'}
                    </Button>

                    <Box textAlign="center">
                      <Button
                        component={Link}
                        to="/login"
                        startIcon={<ArrowBackIcon />}
                        sx={{ color: 'text.secondary' }}
                      >
                        กลับไปหน้าเข้าสู่ระบบ
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </BackgroundLayout>
  );
}

export default ForgotPassword;
