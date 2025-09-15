

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Typography,
  Chip,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Skeleton,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Avatar,
  Divider,
  CircularProgress,
  Fab,
  Paper,
  Fade
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
  Groups as GroupsIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Add CSS animations for Furni theme
const furniAnimations = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

// Insert animations into head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = furniAnimations;
  if (!document.head.querySelector('style[data-furni-animations]')) {
    style.setAttribute('data-furni-animations', 'true');
    document.head.appendChild(style);
  }
}

function Events() {
  // ปรับ marginTop เฉพาะ filter
  const getHeaderMarginTop = () => {
    if (filter === 'all') return 20;
    return 0; // ขยับขึ้นสำหรับ upcoming/past
  };
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState({});
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | upcoming | past
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    if (user) fetchRegisteredEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลกิจกรรม กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
    }
  };

  const fetchRegisteredEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/' + user.id + '/event-registrations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegisteredEvents(response.data.map(r => r.event_id));
    } catch (err) {
      setRegisteredEvents([]);
    }
  };

  const handleRegister = async (eventId) => {
    setRegistering(prev => ({ ...prev, [eventId]: true }));
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/events/${eventId}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire('สำเร็จ', 'ลงทะเบียนกิจกรรมเรียบร้อย', 'success');
      setRegisteredEvents(prev => [...prev, eventId]);
    } catch (err) {
      Swal.fire('ผิดพลาด', err.response?.data?.message || 'ไม่สามารถลงทะเบียนได้', 'error');
    } finally {
      setRegistering(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleUnregister = async (eventId) => {
    setRegistering(prev => ({ ...prev, [eventId]: true }));
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/events/${eventId}/register`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire('สำเร็จ', 'ยกเลิกการลงทะเบียนเรียบร้อย', 'success');
      setRegisteredEvents(prev => prev.filter(id => id !== eventId));
    } catch (err) {
      Swal.fire('ผิดพลาด', err.response?.data?.message || 'ไม่สามารถยกเลิกลงทะเบียนได้', 'error');
    } finally {
      setRegistering(prev => ({ ...prev, [eventId]: false }));
    }
  };

  // แยกวันที่และเวลาออกจาก event_date (datetime-local)
  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd MMMM yyyy', { locale: th });
  };
  const formatTime = (date) => {
    if (!date) return '';
    return format(new Date(date), 'HH:mm น.');
  };

  const isUpcoming = (date) => {
    return new Date(date) > new Date();
  };

  // Skeleton loading
  const renderSkeleton = () => (
    <Grid container spacing={4}>
      {[...Array(6)].map((_, idx) => (
        <Grid item xs={12} md={6} lg={4} key={idx}>
          <Card sx={{ borderRadius: 4, height: 400 }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
              <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Share event
  const handleShare = (event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.origin + `/events/${event.id}`
      });
    } else {
      Swal.fire('แชร์กิจกรรม', 'คัดลอกลิงก์กิจกรรมแล้ว', 'info');
      navigator.clipboard.writeText(window.location.origin + `/events/${event.id}`);
    }
  };

  // Modal for event detail
  const openModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f7f5f3, #f0ede8)',
      fontFamily: "'Source Sans Pro', 'Segoe UI', system-ui, sans-serif"
    }}>
      {/* Hero Section - Furni Modern Style */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2f4b3f, #243d33)',
          color: 'white',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: '50%',
            background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1.5" fill="%23f9c74f" opacity="0.3"/><circle cx="80" cy="30" r="1" fill="%23f9c74f" opacity="0.2"/><circle cx="40" cy="70" r="1.2" fill="%23f9c74f" opacity="0.4"/><circle cx="90" cy="80" r="0.8" fill="%23f9c74f" opacity="0.3"/></svg>') repeat`,
            animation: 'float 20s ease-in-out infinite'
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h1" 
            sx={{
              fontFamily: "'Poppins', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
              mb: 3
            }}
          >
            กิจกรรมศิษย์เก่า
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              opacity: 0.9,
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.2rem' },
              fontWeight: 400,
              mb: 4,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            เข้าร่วมกิจกรรมและงานสังสรรค์ที่จัดขึ้นเพื่อเสริมสร้างเครือข่ายและความสัมพันธ์ในหมู่ศิษย์เก่า
          </Typography>
          
          {/* Hero Icon */}
          <Box sx={{ 
            fontSize: { xs: '8rem', md: '12rem' }, 
            color: 'rgba(249, 199, 79, 0.3)',
            mb: 2
          }}>
            <CalendarIcon sx={{ fontSize: 'inherit' }} />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Search Bar - Furni Style */}
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
          <TextField
            placeholder="ค้นหากิจกรรม..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ 
              maxWidth: 600, 
              width: '100%',
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                border: '2px solid #dee2e6',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#f9c74f'
                },
                '&.Mui-focused': {
                  borderColor: '#f9c74f',
                  boxShadow: '0 0 0 0.2rem rgba(249, 199, 79, 0.25)'
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#f9c74f' }} />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <ClearIcon 
                    sx={{ cursor: 'pointer', color: '#6c757d' }}
                    onClick={() => setSearch('')}
                  />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Filter Buttons - Furni Style */}
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(e, newFilter) => newFilter && setFilter(newFilter)}
            aria-label="filter events"
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '0.75rem',
                px: 4,
                py: 2,
                fontWeight: 600,
                borderWidth: '2px',
                fontSize: '0.95rem',
                letterSpacing: '0.025em',
                transition: 'all 0.3s ease',
                border: '2px solid #2f4b3f !important',
                color: '#2f4b3f',
                '&:hover': {
                  backgroundColor: 'rgba(47, 75, 63, 0.08)',
                  transform: 'translateY(-2px)'
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                  borderColor: '#f9c74f !important',
                  color: 'white',
                  boxShadow: '0 0.25rem 0.75rem rgba(249, 199, 79, 0.3)',
                  '&:hover': {
                    background: '#f8b42e',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 1rem 2rem rgba(47, 75, 63, 0.25)'
                  }
                }
              }
            }}
          >
            <ToggleButton value="all" aria-label="all events">
              <CalendarIcon sx={{ mr: 1 }} />
              ทั้งหมด
            </ToggleButton>
            <ToggleButton value="upcoming" aria-label="upcoming events">
              <ScheduleIcon sx={{ mr: 1 }} />
              กำลังจะมาถึง
            </ToggleButton>
            <ToggleButton value="past" aria-label="past events">
              <EventBusyIcon sx={{ mr: 1 }} />
              ที่ผ่านมา
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Error Alert - Furni Style */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 6, 
              borderRadius: '0.75rem',
              boxShadow: '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)',
              borderLeft: '4px solid #f9c74f',
              fontWeight: 500,
              backgroundColor: 'rgba(249, 199, 79, 0.1)',
              color: '#2a3b3d'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              เกิดข้อผิดพลาด
            </Typography>
            <Typography>{error}</Typography>
            <Button
              variant="outlined"
              color="error"
              sx={{ 
                mt: 2,
                borderRadius: '0.75rem',
                fontWeight: 600,
                borderWidth: '2px',
                '&:hover': {
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => {
                setError('');
                setLoading(true);
                fetchEvents();
              }}
            >
              ลองใหม่อีกครั้ง
            </Button>
          </Alert>
        )}

        {/* Events Grid - Furni Modern Theme */}
        {loading ? (
          <Grid container spacing={4}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ 
                  borderRadius: '1.5rem', 
                  border: '1px solid #e9ecef',
                  boxShadow: '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)',
                  height: 450,
                  overflow: 'hidden'
                }}>
                  <Skeleton variant="rectangular" height={220} />
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="text" width="80%" height={32} />
                    <Skeleton variant="text" width="60%" height={24} />
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Skeleton variant="rounded" width={80} height={28} />
                      <Skeleton variant="rounded" width={100} height={28} />
                    </Stack>
                    <Box sx={{ mt: 2 }}>
                      <Skeleton variant="text" width="100%" />
                      <Skeleton variant="text" width="90%" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <Grid container spacing={4}>
              {events
                .filter(event => {
                  const searchText = search.toLowerCase();
                  const match =
                    event.title?.toLowerCase().includes(searchText) ||
                    event.location?.toLowerCase().includes(searchText);
                  if (filter === 'upcoming' && !isUpcoming(event.event_date)) return false;
                  if (filter === 'past' && isUpcoming(event.event_date)) return false;
                  return match;
                })
                .map((event, index) => (
                  <Grid item xs={12} md={6} lg={4} key={event.id}>
                    <Fade in timeout={400 + (index * 100)}>
                      <Card 
                        elevation={0} 
                        sx={{
                          height: '100%',
                          background: 'white',
                          border: '1px solid #e9ecef',
                          borderRadius: '1.5rem',
                          boxShadow: '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 1rem 2rem rgba(47, 75, 63, 0.25)',
                            borderColor: '#fbd36b'
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                            opacity: 0,
                            transition: 'opacity 0.3s'
                          },
                          '&:hover::before': {
                            opacity: 1
                          }
                        }}
                        onClick={() => openModal(event)}
                      >
                        {/* Event Image */}
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="220"
                            image={event.image_url ? `http://localhost:5000${event.image_url}` : '/event-default.jpg'}
                            alt={event.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/event-default.jpg';
                            }}
                            sx={{
                              borderRadius: '1.5rem 1.5rem 0 0'
                            }}
                          />
                          
                          {/* Status and Category Chips - Furni Style */}
                          <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, left: 16 }}>
                            <Chip
                              label={isUpcoming(event.event_date) ? 'กำลังจะมาถึง' : 'กิจกรรมที่ผ่านมา'}
                              size="small"
                              icon={isUpcoming(event.event_date) ? <EventAvailableIcon /> : <EventBusyIcon />}
                              sx={{
                                background: isUpcoming(event.event_date) 
                                  ? 'linear-gradient(135deg, #f9c74f, #fbd36b)' 
                                  : 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
                                color: 'white',
                                fontWeight: 600,
                                borderRadius: '0.75rem',
                                '& .MuiChip-icon': { color: 'white' }
                              }}
                            />
                            {event.category && (
                              <Chip
                                label={event.category}
                                size="small"
                                sx={{
                                  background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
                                  color: 'white',
                                  fontWeight: 600,
                                  borderRadius: '0.75rem'
                                }}
                              />
                            )}
                          </Stack>

                          {/* Share Button - Furni Style */}
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              width: 50,
                              height: 50,
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              backdropFilter: 'blur(10px)',
                              border: '2px solid #dee2e6',
                              color: '#6c757d',
                              transition: 'all 0.3s ease',
                              '&:hover': { 
                                backgroundColor: 'white',
                                background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                                borderColor: '#f9c74f',
                                color: 'white',
                                transform: 'scale(1.1)'
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(event);
                            }}
                          >
                            <ShareIcon />
                          </IconButton>

                          {/* Shine Effect */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'linear-gradient(45deg, transparent 30%, rgba(249, 199, 79, 0.1) 50%, transparent 70%)',
                              transform: 'translateX(-100%)',
                              transition: 'transform 0.6s',
                              '.MuiCard-root:hover &': {
                                transform: 'translateX(100%)'
                              }
                            }}
                          />
                        </Box>

                      <CardContent sx={{ 
                        flexGrow: 1, 
                        display: 'flex', 
                        flexDirection: 'column',
                        p: { xs: 2.5, sm: 3.5 },
                        overflow: 'hidden'
                      }}>
                        {/* Event Title - Furni Typography */}
                        <Typography 
                          variant="h5" 
                          sx={{
                            fontFamily: "'Poppins', 'Inter', sans-serif",
                            fontWeight: 600,
                            color: '#2a3b3d',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            mb: 2.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            wordBreak: 'break-word',
                            lineHeight: 1.3,
                            minHeight: '2.6em',
                            fontSize: { xs: '1.15rem', sm: '1.3rem' }
                          }}
                        >
                          <CalendarIcon sx={{ 
                            color: '#f9c74f', 
                            flexShrink: 0,
                            fontSize: { xs: '1.4rem', sm: '1.6rem' }
                          }} />
                          <Box sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            wordBreak: 'break-word'
                          }}>
                            {event.title}
                          </Box>
                        </Typography>

                        {/* Event Date & Time - Furni Style */}
                        <Stack direction="row" spacing={2.5} sx={{ mb: 2.5 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <EventIcon sx={{ color: '#6c757d', fontSize: '1.1rem' }} />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#6c757d',
                                fontWeight: 500,
                                fontSize: '0.9rem'
                              }}
                            >
                              {formatDate(event.event_date)}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <TimeIcon sx={{ color: '#6c757d', fontSize: '1.1rem' }} />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#6c757d',
                                fontWeight: 500,
                                fontSize: '0.9rem'
                              }}
                            >
                              {formatTime(event.event_date) || '--'}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Location - Furni Style */}
                        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2.5 }}>
                          <LocationIcon sx={{ color: '#6c757d', fontSize: '1.1rem' }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6c757d',
                              fontWeight: 500,
                              fontSize: '0.9rem'
                            }}
                          >
                            {event.location}
                          </Typography>
                        </Box>

                        {/* Description - Furni Card Style */}
                        <Box sx={{
                          p: 2.5,
                          borderLeft: '3px solid #f9c74f',
                          backgroundColor: 'rgba(249, 199, 79, 0.1)',
                          borderRadius: '0.5rem',
                          mb: 2.5,
                          flexGrow: 1,
                          minHeight: '85px',
                          display: 'flex',
                          alignItems: 'flex-start'
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{
                              color: '#2a3b3d',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: 1.5,
                              textAlign: 'justify',
                              fontWeight: 400
                            }}
                          >
                            {event.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                          </Typography>
                        </Box>

                        {/* Participants and View Button - Furni Style */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box 
                            display="flex" 
                            alignItems="center" 
                            gap={1}
                            sx={{
                              background: 'rgba(249, 199, 79, 0.1)',
                              borderRadius: '0.5rem',
                              px: 1.5,
                              py: 0.75
                            }}
                          >
                            <GroupsIcon sx={{ color: '#f9c74f', fontSize: '1.1rem' }} />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#2a3b3d',
                                fontWeight: 600,
                                fontSize: '0.85rem'
                              }}
                            >
                              {event.participants_count || 0} คน
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            startIcon={<VisibilityIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(event);
                            }}
                            sx={{ 
                              borderRadius: '0.75rem',
                              background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                              color: 'white',
                              fontWeight: 600,
                              borderWidth: '2px',
                              fontSize: '0.9rem',
                              letterSpacing: '0.025em',
                              px: 3,
                              py: 1,
                              boxShadow: '0 0.25rem 0.75rem rgba(249, 199, 79, 0.3)',
                              '&:hover': {
                                background: '#f8b42e',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 1rem 2rem rgba(47, 75, 63, 0.25)'
                              }
                            }}
                          >
                            ดูรายละเอียด
                          </Button>
                        </Stack>
                      </CardContent>

                      {/* Organizer Footer - ซ่อนส่วนนี้ */}
                      {/* <Box sx={{
                        p: 2,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        borderTop: 1,
                        borderColor: 'divider'
                      }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PersonIcon color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {event.organizer || 'ฝ่ายกิจการศิษย์เก่า'}
                          </Typography>
                        </Box>
                      </Box> */}
                    </Card>
                    </Fade>
                  </Grid>
                ))}
            </Grid>

            {/* Empty State - Furni Style */}
            {events.filter(event => {
              const searchText = search.toLowerCase();
              const match =
                event.title?.toLowerCase().includes(searchText) ||
                event.location?.toLowerCase().includes(searchText);
              if (filter === 'upcoming' && !isUpcoming(event.event_date)) return false;
              if (filter === 'past' && isUpcoming(event.event_date)) return false;
              return match;
            }).length === 0 && !loading && !error && (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Box 
                  sx={{ 
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'rgba(249, 199, 79, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <EventIcon sx={{ fontSize: 60, color: '#f9c74f' }} />
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: "'Poppins', 'Inter', sans-serif",
                    fontWeight: 600, 
                    color: '#2a3b3d', 
                    mb: 2 
                  }}
                >
                  ไม่พบกิจกรรม
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#6c757d',
                    fontWeight: 400,
                    maxWidth: '400px',
                    mx: 'auto'
                  }}
                >
                  ไม่พบกิจกรรมที่ตรงกับเงื่อนไขที่คุณระบุ กรุณาลองเปลี่ยนคำค้นหาหรือเงื่อนไขใหม่
                </Typography>
              </Box>
            )}

            {/* Event Detail Dialog - Furni Style */}
            <Dialog
              open={showModal}
              onClose={closeModal}
              maxWidth="lg"
              fullWidth
              PaperProps={{
                sx: { 
                  borderRadius: '1.5rem',
                  maxHeight: '90vh',
                  overflow: 'hidden',
                  boxShadow: '0 1rem 3rem rgba(47, 75, 63, 0.2)'
                }
              }}
            >
              {selectedEvent && (
                <>
                  <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: 'linear-gradient(135deg, #f7f5f3, #f0ede8)',
                    borderBottom: '1px solid #e9ecef',
                    py: 3,
                    px: 4
                  }}>
                    <CalendarIcon sx={{ color: '#f9c74f', fontSize: 32 }} />
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontFamily: "'Poppins', 'Inter', sans-serif",
                        fontWeight: 600, 
                        flex: 1,
                        color: '#2a3b3d'
                      }}
                    >
                      {selectedEvent.title}
                    </Typography>
                    <IconButton
                      onClick={closeModal}
                      sx={{ 
                        width: 50,
                        height: 50,
                        backgroundColor: 'white',
                        border: '2px solid #dee2e6',
                        color: '#6c757d',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          backgroundColor: 'white',
                          background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                          borderColor: '#f9c74f',
                          color: 'white',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>
                  
                  <DialogContent sx={{ 
                    background: 'linear-gradient(135deg, #f7f5f3, #f0ede8)',
                    p: 0,
                    overflow: 'hidden'
                  }}>
                    <Box sx={{ height: '60vh', overflow: 'auto', p: 4 }}>
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                          <Box
                            component="img"
                            src={selectedEvent.image_url ? `http://localhost:5000${selectedEvent.image_url}` : '/event-default.jpg'}
                            alt={selectedEvent.title}
                            sx={{
                              width: '100%',
                              borderRadius: '1.5rem',
                              objectFit: 'cover',
                              height: { xs: 240, md: 320 },
                              boxShadow: '0 0.5rem 1rem rgba(47, 75, 63, 0.15)'
                            }}
                            onError={e => {
                              e.target.onerror = null;
                              e.target.src = '/event-default.jpg';
                            }}
                          />
                          <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: 'wrap', gap: 1 }}>
                            <Chip
                              label={isUpcoming(selectedEvent.event_date) ? 'กำลังจะมาถึง' : 'กิจกรรมที่ผ่านมา'}
                              icon={isUpcoming(selectedEvent.event_date) ? <EventAvailableIcon /> : <EventBusyIcon />}
                              sx={{
                                background: isUpcoming(selectedEvent.event_date) 
                                  ? 'linear-gradient(135deg, #f9c74f, #fbd36b)' 
                                  : 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
                                color: 'white',
                                fontWeight: 600,
                                borderRadius: '0.75rem',
                                '& .MuiChip-icon': { color: 'white' }
                              }}
                            />
                            {selectedEvent.category && (
                              <Chip 
                                label={selectedEvent.category} 
                                sx={{ 
                                  background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
                                  color: 'white',
                                  fontWeight: 600,
                                  borderRadius: '0.75rem'
                                }} 
                              />
                            )}
                          </Stack>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Stack spacing={3}>
                            {/* Event Info Cards - Furni Style */}
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 3, 
                                borderRadius: '1rem', 
                                backgroundColor: 'white',
                                border: '1px solid #e9ecef',
                                boxShadow: '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)'
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                                <EventIcon sx={{ color: '#f9c74f', fontSize: '1.5rem' }} />
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    fontFamily: "'Poppins', 'Inter', sans-serif",
                                    fontWeight: 600, 
                                    color: '#2a3b3d' 
                                  }}
                                >
                                  วันที่และเวลา
                                </Typography>
                              </Box>
                              <Typography variant="body1" sx={{ ml: 4, color: '#6c757d', mb: 1 }}>
                                {formatDate(selectedEvent.event_date)}
                              </Typography>
                              <Typography variant="body1" sx={{ ml: 4, color: '#6c757d' }}>
                                เวลา: {formatTime(selectedEvent.event_date) || 'ไม่ระบุ'}
                              </Typography>
                            </Paper>
                            
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 3, 
                                borderRadius: '1rem', 
                                backgroundColor: 'white',
                                border: '1px solid #e9ecef',
                                boxShadow: '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)'
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                                <LocationIcon sx={{ color: '#f9c74f', fontSize: '1.5rem' }} />
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    fontFamily: "'Poppins', 'Inter', sans-serif",
                                    fontWeight: 600, 
                                    color: '#2a3b3d' 
                                  }}
                                >
                                  สถานที่
                                </Typography>
                              </Box>
                              <Typography variant="body1" sx={{ ml: 4, color: '#6c757d' }}>
                                {selectedEvent.location || 'ไม่ระบุ'}
                              </Typography>
                            </Paper>
                            
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 3, 
                                borderRadius: '1rem', 
                                backgroundColor: 'white',
                                border: '1px solid #e9ecef',
                                boxShadow: '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)'
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                                <GroupsIcon sx={{ color: '#f9c74f', fontSize: '1.5rem' }} />
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    fontFamily: "'Poppins', 'Inter', sans-serif",
                                    fontWeight: 600, 
                                    color: '#2a3b3d' 
                                  }}
                                >
                                  ผู้เข้าร่วม
                                </Typography>
                              </Box>
                              <Typography variant="body1" sx={{ ml: 4, color: '#6c757d' }}>
                                {selectedEvent.participants_count || 0} คน
                              </Typography>
                            </Paper>
                          </Stack>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Divider sx={{ my: 3, borderColor: '#dee2e6' }} />
                          
                          <Box>
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                fontFamily: "'Poppins', 'Inter', sans-serif",
                                color: '#2a3b3d', 
                                mb: 3, 
                                fontWeight: 600, 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1.5 
                              }}
                            >
                              📝 รายละเอียดกิจกรรม
                            </Typography>
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 4, 
                                borderRadius: '1rem', 
                                backgroundColor: 'white',
                                border: '1px solid #e9ecef',
                                boxShadow: '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)'
                              }}
                            >
                              <Typography 
                                variant="body1" 
                                sx={{
                                  color: '#2a3b3d',
                                  lineHeight: 1.8,
                                  textAlign: 'justify',
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                  fontSize: '1rem',
                                  fontWeight: 400
                                }}
                              >
                                {selectedEvent.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                              </Typography>
                            </Paper>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </DialogContent>
                  
                  <DialogActions sx={{ 
                    p: 4, 
                    background: 'linear-gradient(135deg, #f7f5f3, #f0ede8)',
                    borderTop: '1px solid #e9ecef',
                    gap: 3,
                    justifyContent: 'center'
                  }}>
                    {user && (
                      registeredEvents.includes(selectedEvent.id) ? (
                        <Button
                          variant="outlined"
                          color="error"
                          size="large"
                          startIcon={registering[selectedEvent.id] ? <CircularProgress size={20} /> : <CancelIcon />}
                          disabled={registering[selectedEvent.id]}
                          onClick={() => handleUnregister(selectedEvent.id)}
                          sx={{ 
                            borderRadius: '0.75rem',
                            px: 4,
                            py: 2,
                            fontWeight: 600,
                            minWidth: 220,
                            borderWidth: '2px',
                            fontSize: '0.95rem',
                            letterSpacing: '0.025em',
                            '&:hover': {
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          ยกเลิกลงทะเบียน
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={registering[selectedEvent.id] ? <CircularProgress size={20} /> : <CheckIcon />}
                          disabled={registering[selectedEvent.id]}
                          onClick={() => handleRegister(selectedEvent.id)}
                          sx={{ 
                            borderRadius: '0.75rem',
                            px: 4,
                            py: 2,
                            fontWeight: 600,
                            minWidth: 220,
                            background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                            color: 'white',
                            borderWidth: '2px',
                            fontSize: '0.95rem',
                            letterSpacing: '0.025em',
                            boxShadow: '0 0.25rem 0.75rem rgba(249, 199, 79, 0.3)',
                            '&:hover': {
                              background: '#f8b42e',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 1rem 2rem rgba(47, 75, 63, 0.25)'
                            }
                          }}
                        >
                          ลงทะเบียนเข้าร่วมกิจกรรม
                        </Button>
                      )
                    )}
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<ShareIcon />}
                      onClick={() => handleShare(selectedEvent)}
                      sx={{ 
                        borderRadius: '0.75rem',
                        px: 4,
                        py: 2,
                        fontWeight: 600,
                        minWidth: 170,
                        color: '#2f4b3f',
                        borderColor: '#2f4b3f',
                        borderWidth: '2px',
                        fontSize: '0.95rem',
                        letterSpacing: '0.025em',
                        '&:hover': {
                          backgroundColor: '#2f4b3f',
                          borderColor: '#2f4b3f',
                          color: 'white',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      แชร์กิจกรรม
                    </Button>
                  </DialogActions>
                </>
              )}
            </Dialog>
          </>
        )}
      </Container>
    </Box>
  );
}

export default Events;
