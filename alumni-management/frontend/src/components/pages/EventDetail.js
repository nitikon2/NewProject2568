import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  Alert,
  CircularProgress,
  Stack,
  Paper,
  Divider,
  IconButton,
  Breadcrumbs,
  Link,
  TextField,
  Tooltip
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Groups as GroupsIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  NavigateNext as NavigateNextIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as SupervisorIcon,
  Send as SendIcon,
  Pending as PendingIcon,
  DoneAll as ApprovedIcon,
  Close as RejectedIcon
} from '@mui/icons-material';
import BackgroundLayout from '../layout/BackgroundLayout';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/th';
import Swal from 'sweetalert2';

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');
  const [adminRequestStatus, setAdminRequestStatus] = useState(null);
  const [requestReason, setRequestReason] = useState('');
  const [requestingAdmin, setRequestingAdmin] = useState(false);
  const [showAdminRequestForm, setShowAdminRequestForm] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvent();
    if (user) {
      checkRegistered();
      checkAdminRequestStatus();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      setError('ไม่พบข้อมูลกิจกรรมนี้');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistered = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/users/${user.id}/event-registrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistered(res.data.some(r => r.event_id === Number(id)));
    } catch {
      setRegistered(false);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/events/${id}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire('สำเร็จ', 'ลงทะเบียนกิจกรรมเรียบร้อย', 'success');
      setRegistered(true);
    } catch (err) {
      Swal.fire('ผิดพลาด', err.response?.data?.message || 'ไม่สามารถลงทะเบียนได้', 'error');
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    setRegistering(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/events/${id}/register`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire('สำเร็จ', 'ยกเลิกการลงทะเบียนเรียบร้อย', 'success');
      setRegistered(false);
    } catch (err) {
      Swal.fire('ผิดพลาด', err.response?.data?.message || 'ไม่สามารถยกเลิกลงทะเบียนได้', 'error');
    } finally {
      setRegistering(false);
    }
  };

  const checkAdminRequestStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/admin-requests/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminRequestStatus(res.data?.status || null);
    } catch (err) {
      console.error('Error checking admin request status:', err);
      setAdminRequestStatus(null);
    }
  };

  const handleRequestAdmin = async () => {
    if (!requestReason.trim()) {
      Swal.fire('ผิดพลาด', 'กรุณาระบุเหตุผลในการขอสิทธิ์แอดมิน', 'error');
      return;
    }

    setRequestingAdmin(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/admin-requests`, {
        event_id: id,
        reason: requestReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire('สำเร็จ', 'ส่งคำขอสิทธิ์แอดมินเรียบร้อย', 'success');
      setAdminRequestStatus('pending');
      setShowAdminRequestForm(false);
      setRequestReason('');
    } catch (err) {
      Swal.fire('ผิดพลาด', err.response?.data?.message || 'ไม่สามารถส่งคำขอได้', 'error');
    } finally {
      setRequestingAdmin(false);
    }
  };

  const isUpcoming = event && moment(event.event_date).isAfter();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire('สำเร็จ', 'คัดลอกลิงก์แล้ว', 'success');
    }
  };

  if (loading) {
    return (
      <BackgroundLayout>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              กำลังโหลดข้อมูลกิจกรรม...
            </Typography>
          </Box>
        </Container>
      </BackgroundLayout>
    );
  }

  if (error || !event) {
    return (
      <BackgroundLayout>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box textAlign="center">
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error || 'ไม่พบข้อมูลกิจกรรม'}
            </Alert>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/events')}
              sx={{ borderRadius: 3 }}
            >
              กลับหน้ากิจกรรม
            </Button>
          </Box>
        </Container>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout>
      <Container maxWidth="md" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link
            underline="hover"
            color="inherit"
            href="/events"
            onClick={(e) => {
              e.preventDefault();
              navigate('/events');
            }}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <EventIcon fontSize="small" />
            กิจกรรม
          </Link>
          <Tooltip title={event.title} arrow>
            <Typography 
              color="text.primary" 
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: { xs: '150px', sm: '200px', md: '300px' },
                cursor: 'default',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {event.title}
            </Typography>
          </Tooltip>
        </Breadcrumbs>

        {/* Main Event Card */}
        <Card sx={{
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(37, 99, 235, 0.1)',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          mx: { xs: 0, sm: 'auto' },
          width: '100%'
        }}>
          {/* Event Image */}
          {event.image_url ? (
            <CardMedia
              component="img"
              height="400"
              image={`http://localhost:5000${event.image_url}`}
              alt={event.title}
              onError={e => {
                e.target.onerror = null;
                e.target.src = '/event-default.jpg';
              }}
              sx={{ objectFit: 'cover' }}
            />
          ) : (
            <Box
              sx={{
                height: 200,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  color: 'white',
                  px: 2,
                  maxWidth: '90%'
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    wordBreak: 'break-word'
                  }}
                >
                  {event.title}
                </Typography>
              </Box>
            </Box>
          )}

          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Event Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ mb: 3 }}>
              <Box 
                flex={1} 
                sx={{ 
                  minWidth: 0,
                  maxWidth: 'calc(100% - 60px)',
                  overflow: 'hidden'
                }}
              >
                <Tooltip title={event.title} arrow>
                  <Typography variant="h3" component="h1" gutterBottom sx={{
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                    fontWeight: 'bold',
                    color: 'primary.main',
                    lineHeight: 1.1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: { xs: 1, sm: 2 },
                    WebkitBoxOrient: 'vertical',
                    wordWrap: 'break-word',
                    wordBreak: 'break-all',
                    cursor: 'default',
                    maxHeight: { xs: '1.5rem', sm: '3rem', md: '3.5rem' },
                    width: '100%'
                  }}>
                    {event.title}
                  </Typography>
                </Tooltip>
                
                {/* Event Status */}
                <Chip
                  icon={isUpcoming ? <EventAvailableIcon /> : <EventBusyIcon />}
                  label={isUpcoming ? 'กำลังจะมาถึง' : 'ผ่านไปแล้ว'}
                  color={isUpcoming ? 'success' : 'default'}
                  sx={{ mb: 2 }}
                />
              </Box>
              
              {/* Share Button */}
              <Box sx={{ flexShrink: 0 }}>
                <IconButton
                  onClick={handleShare}
                  size="small"
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': { boxShadow: 2 },
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 }
                  }}
                >
                  <ShareIcon fontSize="small" />
                </IconButton>
              </Box>
            </Stack>

            {/* Event Info Grid */}
            <Paper sx={{ 
              p: 3, 
              bgcolor: 'grey.50', 
              borderRadius: 2, 
              mb: 3,
              overflow: 'hidden',
              wordWrap: 'break-word'
            }}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <EventIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      วันที่และเวลา
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {moment(event.event_date).locale('th').format('LLL')}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider />
                
                <Box display="flex" alignItems="center" gap={2}>
                  <LocationIcon color="primary" />
                  <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <Typography variant="body2" color="text.secondary">
                      สถานที่
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" sx={{
                      wordWrap: 'break-word',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}>
                      {event.location}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider />
                
                <Box display="flex" alignItems="center" gap={2}>
                  <GroupsIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      ผู้เข้าร่วม
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {event.participants_count || 0} คน
                    </Typography>
                  </Box>
                </Box>
                
                <Divider />
                
                <Box display="flex" alignItems="center" gap={2}>
                  <PersonIcon color="primary" />
                  <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <Typography variant="body2" color="text.secondary">
                      ผู้จัดงาน
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" sx={{
                      wordWrap: 'break-word',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}>
                      {event.organizer || 'ฝ่ายกิจการศิษย์เก่า'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>

            {/* Event Description */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 2
              }}>
                รายละเอียดกิจกรรม
              </Typography>
              <Paper sx={{ 
                p: 3, 
                borderLeft: 4, 
                borderColor: 'primary.main',
                overflow: 'hidden',
                wordWrap: 'break-word'
              }}>
                <Typography variant="body1" sx={{ 
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}>
                  {event.description}
                </Typography>
              </Paper>
            </Box>

            {/* Registration Section */}
            {user && (
              <Box sx={{ mt: 4 }}>
                {registered ? (
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    fullWidth
                    disabled={registering}
                    onClick={handleUnregister}
                    startIcon={registering ? <CircularProgress size={20} /> : <CancelIcon />}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {registering ? 'กำลังยกเลิก...' : 'ยกเลิกลงทะเบียน'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={registering}
                    onClick={handleRegister}
                    startIcon={registering ? <CircularProgress size={20} /> : <CheckIcon />}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
                      boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                        boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)'
                      }
                    }}
                  >
                    {registering ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนเข้าร่วมกิจกรรม'}
                  </Button>
                )}
              </Box>
            )}

            {/* Login Prompt for Non-users */}
            {!user && (
              <Paper sx={{ 
                p: 3, 
                mt: 4, 
                textAlign: 'center',
                bgcolor: 'warning.light',
                color: 'warning.contrastText'
              }}>
                <Typography variant="body1" gutterBottom>
                  กรุณาเข้าสู่ระบบเพื่อลงทะเบียนเข้าร่วมกิจกรรม
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{ mt: 2, borderRadius: 3 }}
                >
                  เข้าสู่ระบบ
                </Button>
              </Paper>
            )}

            {/* Admin Request Section - ส่วนใหม่ที่เพิ่มเข้ามา */}
            {user && user.role !== 'admin' && (
              <Card sx={{
                mt: 4,
                borderRadius: 3,
                border: '2px solid',
                borderColor: 'secondary.main',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <AdminIcon color="secondary" sx={{ fontSize: 32 }} />
                    <Typography variant="h5" fontWeight="bold" color="secondary.main">
                      ขอสิทธิ์แอดมินสำหรับกิจกรรมนี้
                    </Typography>
                  </Box>

                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    หากคุณต้องการสิทธิ์ในการจัดการกิจกรรมนี้ (เช่น อัปเดตข้อมูล ดูรายชื่อผู้เข้าร่วม) 
                    สามารถส่งคำขอขอสิทธิ์แอดมินได้ที่นี่
                  </Typography>

                  {/* แสดงสถานะคำขอปัจจุบัน */}
                  {adminRequestStatus && (
                    <Paper sx={{ 
                      p: 3, 
                      mb: 3, 
                      bgcolor: adminRequestStatus === 'pending' ? 'warning.light' : 
                               adminRequestStatus === 'approved' ? 'success.light' : 'error.light',
                      borderLeft: 4,
                      borderColor: adminRequestStatus === 'pending' ? 'warning.main' : 
                                 adminRequestStatus === 'approved' ? 'success.main' : 'error.main'
                    }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        {adminRequestStatus === 'pending' && <PendingIcon color="warning" />}
                        {adminRequestStatus === 'approved' && <ApprovedIcon color="success" />}
                        {adminRequestStatus === 'rejected' && <RejectedIcon color="error" />}
                        <Typography variant="body1" fontWeight="medium">
                          {adminRequestStatus === 'pending' && 'คำขอของคุณอยู่ระหว่างการพิจารณา'}
                          {adminRequestStatus === 'approved' && 'คำขอของคุณได้รับการอนุมัติแล้ว'}
                          {adminRequestStatus === 'rejected' && 'คำขอของคุณถูกปฏิเสธ'}
                        </Typography>
                      </Box>
                    </Paper>
                  )}

                  {/* ฟอร์มส่งคำขอ - แสดงเฉพาะเมื่อยังไม่มีคำขอหรือถูกปฏิเสธ */}
                  {(!adminRequestStatus || adminRequestStatus === 'rejected') && !showAdminRequestForm && (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      startIcon={<SupervisorIcon />}
                      onClick={() => setShowAdminRequestForm(true)}
                      sx={{ 
                        borderRadius: 3,
                        fontWeight: 'bold',
                        py: 1.5,
                        px: 4
                      }}
                    >
                      {adminRequestStatus === 'rejected' ? 'ส่งคำขอใหม่' : 'ขอสิทธิ์แอดมิน'}
                    </Button>
                  )}

                  {/* ฟอร์มกรอกเหตุผล */}
                  {showAdminRequestForm && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        เหตุผลในการขอสิทธิ์แอดมิน
                      </Typography>
                      <Paper sx={{ 
                        p: 3, 
                        bgcolor: 'background.paper', 
                        mb: 3,
                        overflow: 'hidden',
                        wordWrap: 'break-word'
                      }}>
                        <textarea
                          value={requestReason}
                          onChange={(e) => setRequestReason(e.target.value)}
                          placeholder="กรุณาระบุเหตุผลที่ต้องการสิทธิ์แอดมินสำหรับกิจกรรมนี้ เช่น ต้องการช่วยจัดการผู้เข้าร่วม หรือมีส่วนร่วมในการจัดงาน..."
                          style={{
                            width: '100%',
                            minHeight: '120px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '12px',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            outline: 'none'
                          }}
                        />
                      </Paper>
                      
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="large"
                          disabled={requestingAdmin || !requestReason.trim()}
                          onClick={handleRequestAdmin}
                          startIcon={requestingAdmin ? <CircularProgress size={20} /> : <SendIcon />}
                          sx={{ 
                            borderRadius: 3,
                            fontWeight: 'bold',
                            px: 3
                          }}
                        >
                          {requestingAdmin ? 'กำลังส่งคำขอ...' : 'ส่งคำขอ'}
                        </Button>
                        
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => {
                            setShowAdminRequestForm(false);
                            setRequestReason('');
                          }}
                          sx={{ borderRadius: 3, px: 3 }}
                        >
                          ยกเลิก
                        </Button>
                      </Stack>
                    </Box>
                  )}

                  {/* หมายเหตุ */}
                  <Paper sx={{ 
                    p: 2, 
                    mt: 3, 
                    bgcolor: 'info.light', 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'info.main'
                  }}>
                    <Typography variant="body2" color="info.contrastText">
                      💡 <strong>หมายเหตุ:</strong> การขอสิทธิ์แอดมินจะต้องผ่านการอนุมัติจากผู้ดูแลระบบก่อน 
                      คุณจะได้รับการแจ้งเตือนผ่านอีเมลเมื่อคำขอของคุณได้รับการพิจารณา
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Back Button */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/events')}
            sx={{ borderRadius: 3 }}
          >
            กลับไปหน้ากิจกรรม
          </Button>
        </Box>
      </Container>
    </BackgroundLayout>
  );
}

export default EventDetail;
