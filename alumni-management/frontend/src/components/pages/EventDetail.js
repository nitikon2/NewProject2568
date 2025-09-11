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
  Link
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
  NavigateNext as NavigateNextIcon
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
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvent();
    if (user) checkRegistered();
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
      <Container maxWidth="md" sx={{ py: 4 }}>
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
          <Typography color="text.primary">{event.title}</Typography>
        </Breadcrumbs>

        {/* Main Event Card */}
        <Card sx={{
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(37, 99, 235, 0.1)',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}>
          {/* Event Image */}
          {event.image_url && (
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
          )}

          <CardContent sx={{ p: 4 }}>
            {/* Event Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
              <Box flex={1}>
                <Typography variant="h3" component="h1" gutterBottom sx={{
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  fontWeight: 'bold',
                  color: 'primary.main',
                  lineHeight: 1.2
                }}>
                  {event.title}
                </Typography>
                
                {/* Event Status */}
                <Chip
                  icon={isUpcoming ? <EventAvailableIcon /> : <EventBusyIcon />}
                  label={isUpcoming ? 'กำลังจะมาถึง' : 'ผ่านไปแล้ว'}
                  color={isUpcoming ? 'success' : 'default'}
                  sx={{ mb: 2 }}
                />
              </Box>
              
              {/* Share Button */}
              <IconButton
                onClick={handleShare}
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': { boxShadow: 2 }
                }}
              >
                <ShareIcon />
              </IconButton>
            </Stack>

            {/* Event Info Grid */}
            <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, mb: 3 }}>
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
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      สถานที่
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
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
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      ผู้จัดงาน
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
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
              <Paper sx={{ p: 3, borderLeft: 4, borderColor: 'primary.main' }}>
                <Typography variant="body1" sx={{ 
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line'
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
