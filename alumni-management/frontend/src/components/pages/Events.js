

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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Hero Section - เหมือนหน้าข่าวสาร */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight={700} mb={2}>
            กิจกรรมศิษย์เก่า
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            กิจกรรมและงานสังสรรค์อย่างเป็นทางการสำหรับศิษย์เก่า มหาวิทยาลัยราชภัฏมหาสารคาม
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search Bar - เหมือนหน้าข่าวสาร */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <TextField
            placeholder="ค้นหากิจกรรม..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ maxWidth: 500, width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <ClearIcon 
                    sx={{ cursor: 'pointer', color: 'grey.500' }}
                    onClick={() => setSearch('')}
                  />
                </InputAdornment>
              ),
              sx: { borderRadius: 3 }
            }}
          />
        </Box>

        {/* Filter Buttons */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(e, newFilter) => newFilter && setFilter(newFilter)}
            aria-label="filter events"
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: 3,
                px: 3,
                py: 1.5,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
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

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>เกิดข้อผิดพลาด</Typography>
            <Typography>{error}</Typography>
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 2 }}
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

        {/* Events Grid - ธีมเหมือนหน้าข่าวสาร */}
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="text" width="80%" height={28} />
                    <Skeleton variant="text" width="60%" height={20} />
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Skeleton variant="rounded" width={60} height={24} />
                      <Skeleton variant="rounded" width={80} height={24} />
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
            <Grid container spacing={3}>
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
                    <Fade in timeout={300 + (index * 100)}>
                      <Card elevation={0} sx={{
                        height: '100%',
                        borderRadius: 4,
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                          borderColor: '#667eea'
                        }
                      }}
                      onClick={() => openModal(event)}
                    >
                      {/* Event Image */}
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={event.image_url ? `http://localhost:5000${event.image_url}` : '/event-default.jpg'}
                          alt={event.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/event-default.jpg';
                          }}
                        />
                        
                        {/* Status and Category Chips - ธีมเหมือนหน้าข่าวสาร */}
                        <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, left: 16 }}>
                          <Chip
                            label={isUpcoming(event.event_date) ? 'กำลังจะมาถึง' : 'กิจกรรมที่ผ่านมา'}
                            size="small"
                            icon={isUpcoming(event.event_date) ? <EventAvailableIcon /> : <EventBusyIcon />}
                            sx={{
                              bgcolor: isUpcoming(event.event_date) ? '#667eea' : '#9ca3af',
                              color: 'white',
                              fontWeight: 600,
                              '& .MuiChip-icon': { color: 'white' }
                            }}
                          />
                          {event.category && (
                            <Chip
                              label={event.category}
                              size="small"
                              sx={{
                                bgcolor: '#764ba2',
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          )}
                        </Stack>

                        {/* Share Button */}
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(8px)',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(event);
                          }}
                        >
                          <ShareIcon />
                        </IconButton>
                      </Box>

                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Event Title */}
                        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 2
                        }}>
                          <CalendarIcon sx={{ color: '#facc15' }} />
                          {event.title}
                        </Typography>

                        {/* Event Date & Time */}
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <EventIcon color="action" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(event.event_date)}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <TimeIcon color="action" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {formatTime(event.event_date) || '--'}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Location */}
                        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                          <LocationIcon color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {event.location}
                          </Typography>
                        </Box>

                        {/* Description */}
                        <Box sx={{
                          p: 2,
                          borderLeft: 3,
                          borderColor: 'primary.main',
                          backgroundColor: 'rgba(37, 99, 235, 0.05)',
                          borderRadius: 2,
                          mb: 2,
                          flexGrow: 1
                        }}>
                          <Typography variant="body2" color="text.primary">
                            {event.description?.length > 120
                              ? event.description.substring(0, 120) + '...'
                              : event.description}
                          </Typography>
                        </Box>

                        {/* Participants and View Button */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center" gap={1}>
                            <GroupsIcon color="action" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {event.participants_count || 0} คนเข้าร่วม
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
                              borderRadius: 3,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                              }
                            }}
                          >
                            ดูรายละเอียด
                          </Button>
                        </Stack>
                      </CardContent>

                      {/* Organizer Footer */}
                      <Box sx={{
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
                      </Box>
                    </Card>
                    </Fade>
                  </Grid>
                ))}
            </Grid>

            {/* Empty State - ธีมเหมือนหน้าข่าวสาร */}
            {events.filter(event => {
              const searchText = search.toLowerCase();
              const match =
                event.title?.toLowerCase().includes(searchText) ||
                event.location?.toLowerCase().includes(searchText);
              if (filter === 'upcoming' && !isUpcoming(event.event_date)) return false;
              if (filter === 'past' && isUpcoming(event.event_date)) return false;
              return match;
            }).length === 0 && !loading && !error && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <EventIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" color="text.secondary" sx={{ mb: 1 }}>
                  ไม่พบกิจกรรมที่ตรงกับเงื่อนไข
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  กรุณาลองเปลี่ยนคำค้นหาหรือเงื่อนไขใหม่
                </Typography>
              </Box>
            )}

            {/* Event Detail Dialog */}
            <Dialog
              open={showModal}
              onClose={closeModal}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: { borderRadius: 4 }
              }}
            >
              {selectedEvent && (
                <>
                  <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)'
                  }}>
                    <CalendarIcon sx={{ color: '#facc15' }} />
                    {selectedEvent.title}
                    <IconButton
                      onClick={closeModal}
                      sx={{ ml: 'auto' }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>
                  
                  <DialogContent sx={{ background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)' }}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={5}>
                        <Box
                          component="img"
                          src={selectedEvent.image_url ? `http://localhost:5000${selectedEvent.image_url}` : '/event-default.jpg'}
                          alt={selectedEvent.title}
                          sx={{
                            width: '100%',
                            borderRadius: 3,
                            objectFit: 'cover',
                            maxHeight: 260
                          }}
                          onError={e => {
                            e.target.onerror = null;
                            e.target.src = '/event-default.jpg';
                          }}
                        />
                        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                          <Chip
                            label={isUpcoming(selectedEvent.event_date) ? 'กำลังจะมาถึง' : 'กิจกรรมที่ผ่านมา'}
                            color={isUpcoming(selectedEvent.event_date) ? 'primary' : 'default'}
                            icon={isUpcoming(selectedEvent.event_date) ? <EventAvailableIcon /> : <EventBusyIcon />}
                          />
                          {selectedEvent.category && (
                            <Chip label={selectedEvent.category} color="warning" />
                          )}
                        </Stack>
                      </Grid>
                      
                      <Grid item xs={12} md={7}>
                        <Stack spacing={2}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <EventIcon color="primary" />
                            <Typography>
                              {formatDate(selectedEvent.event_date)} | {formatTime(selectedEvent.event_date) || '--'}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center" gap={2}>
                            <LocationIcon color="primary" />
                            <Typography>{selectedEvent.location}</Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center" gap={2}>
                            <PersonIcon color="primary" />
                            <Typography>{selectedEvent.organizer || 'ฝ่ายกิจการศิษย์เก่า'}</Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center" gap={2}>
                            <GroupsIcon color="primary" />
                            <Typography>{selectedEvent.participants_count || 0} คนเข้าร่วม</Typography>
                          </Box>
                          
                          <Divider />
                          
                          <Typography variant="body1" color="text.primary">
                            {selectedEvent.description}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </DialogContent>
                  
                  <DialogActions sx={{ p: 3, background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)' }}>
                    {user && (
                      registeredEvents.includes(selectedEvent.id) ? (
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={registering[selectedEvent.id] ? <CircularProgress size={20} /> : <CancelIcon />}
                          disabled={registering[selectedEvent.id]}
                          onClick={() => handleUnregister(selectedEvent.id)}
                          sx={{ borderRadius: 3 }}
                        >
                          ยกเลิกลงทะเบียน
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={registering[selectedEvent.id] ? <CircularProgress size={20} /> : <CheckIcon />}
                          disabled={registering[selectedEvent.id]}
                          onClick={() => handleRegister(selectedEvent.id)}
                          sx={{ borderRadius: 3 }}
                        >
                          ลงทะเบียนเข้าร่วมกิจกรรม
                        </Button>
                      )
                    )}
                    <Button
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      onClick={() => handleShare(selectedEvent)}
                      sx={{ borderRadius: 3 }}
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
