import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  Stack,
  Avatar,
  Chip,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Place as PlaceIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/th';
import AdminLayout from '../../layout/AdminLayout';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [selectedEventForReg, setSelectedEventForReg] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null); // สำหรับขยายแถวดูผู้ลงทะเบียน
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  // ดึงข้อมูลกิจกรรมพร้อมผู้ลงทะเบียน
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/events-with-registrations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching events:', err, err?.response?.data);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'ไม่สามารถโหลดข้อมูลกิจกรรมได้'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (event = null) => {
    setSelectedEvent(event);
    setFormData({
      title: event?.title || '',
      description: event?.description || '',
      event_date: event ? moment(event.event_date).format('YYYY-MM-DDTHH:mm') : '',
      location: event?.location || '',
      image: null
    });
    setImagePreview(event?.image_url ? `http://localhost:5000${event.image_url}` : null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      event_date: '',
      location: '',
      image: null
    });
    setImagePreview(null);
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.title.trim() || !formData.description.trim() || !formData.event_date || !formData.location.trim()) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      let payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('description', formData.description.trim());
      payload.append('event_date', formData.event_date);
      payload.append('location', formData.location.trim());
      if (formData.image) payload.append('image', formData.image);

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (selectedEvent) {
        await axios.put(
          `http://localhost:5000/api/admin/events/${selectedEvent.id}`,
          payload,
          config
        );
        Swal.fire('สำเร็จ', 'อัพเดทกิจกรรมเรียบร้อย', 'success');
      } else {
        await axios.post(
          'http://localhost:5000/api/admin/events',
          payload,
          config
        );
        Swal.fire('สำเร็จ', 'เพิ่มกิจกรรมเรียบร้อย', 'success');
      }
      handleCloseModal();
      fetchEvents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'ไม่สามารถบันทึกข้อมูลได้'
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const result = await Swal.fire({
        title: 'ยืนยันการลบ',
        text: 'คุณต้องการลบกิจกรรมนี้ใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก'
      });
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/api/admin/events/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        Swal.fire('สำเร็จ', 'ลบกิจกรรมเรียบร้อย', 'success');
        fetchEvents();
      }
    } catch (err) {
      Swal.fire('ผิดพลาด', 'ไม่สามารถลบกิจกรรมได้', 'error');
    }
  };

  const handleShowRegistrations = async (event) => {
    setSelectedEventForReg(event);
    setShowRegistrations(true);
    setRegistrationLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/events/${event.id}/registrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(response.data);
    } catch (err) {
      setRegistrations([]);
      Swal.fire('ผิดพลาด', 'ไม่สามารถโหลดข้อมูลผู้ลงทะเบียน', 'error');
    } finally {
      setRegistrationLoading(false);
    }
  };

  // ฟิลเตอร์กิจกรรมตาม search
  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={50} />
            <Typography variant="h6" color="text.secondary">
              กำลังโหลดข้อมูล...
            </Typography>
          </Stack>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f0ede8' }}>
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #2f4b3f 0%, #243d33 100%)',
            color: 'white',
            py: 4,
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 20% 30%, rgba(249, 199, 79, 0.1) 0%, transparent 40%),
                          radial-gradient(circle at 80% 70%, rgba(251, 211, 107, 0.08) 0%, transparent 40%),
                          radial-gradient(circle at 60% 20%, rgba(47, 75, 63, 0.1) 0%, transparent 30%)`,
              pointerEvents: 'none'
            }
          }}
        >
          <Container maxWidth="xl" sx={{ pl: 4, position: 'relative', zIndex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700} mb={1} sx={{ color: '#f9c74f' }}>
                  <EventIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#fbd36b' }} />
                  จัดการกิจกรรม
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, color: '#f0ede8' }}>
                  จัดการกิจกรรมและการลงทะเบียน มหาวิทยาลัยราชภัฏมหาสารคาม
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#f9c74f' }}>
                  {filteredEvents.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, color: '#f0ede8' }}>
                  กิจกรรมทั้งหมด
                </Typography>
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* Controls */}
        <Container maxWidth="xl" sx={{ mb: 4, pl: 4 }}>
          <Card 
            sx={{ 
              p: 3, 
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(47, 75, 63, 0.1)',
              boxShadow: '0 8px 32px rgba(47, 75, 63, 0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(47, 75, 63, 0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleShowModal()}
                sx={{
                  background: 'linear-gradient(135deg, #f9c74f 0%, #fbd36b 100%)',
                  color: '#2f4b3f',
                  fontWeight: 600,
                  borderRadius: '15px',
                  px: 4,
                  py: 1.5,
                  border: '1px solid rgba(47, 75, 63, 0.1)',
                  boxShadow: '0 4px 15px rgba(249, 199, 79, 0.3)',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #fbd36b 0%, #f9c74f 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(249, 199, 79, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                เพิ่มกิจกรรมใหม่
              </Button>
              
              <TextField
                placeholder="ค้นหาชื่อกิจกรรม..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ 
                  maxWidth: 400,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    '& fieldset': {
                      borderColor: 'rgba(47, 75, 63, 0.2)'
                    },
                    '&:hover fieldset': {
                      borderColor: '#2f4b3f'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2f4b3f',
                      borderWidth: 2
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: '#2f4b3f'
                  }
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: '#2f4b3f' }} />
                }}
              />
            </Stack>
          </Card>
        </Container>

        <Container maxWidth="xl" sx={{ pb: 4, pl: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              {error}
            </Alert>
          )}

          {/* Events Table */}
          <Card 
            sx={{ 
              borderRadius: '20px', 
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(47, 75, 63, 0.1)',
              boxShadow: '0 8px 32px rgba(47, 75, 63, 0.1)'
            }}
          >
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead 
                  sx={{ 
                    background: 'linear-gradient(135deg, #2f4b3f 0%, #243d33 100%)'
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#f9c74f', minWidth: 60 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#f9c74f', minWidth: 200 }}>ชื่อกิจกรรม</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#f9c74f', minWidth: 180 }}>วันที่จัด</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#f9c74f', minWidth: 150 }}>สถานที่</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#f9c74f', minWidth: 100, textAlign: 'center' }}>รูปภาพ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#f9c74f', minWidth: 120, textAlign: 'center' }}>สถานะ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#f9c74f', minWidth: 120, textAlign: 'center' }}>การจัดการ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#f9c74f', minWidth: 140, textAlign: 'center' }}>ผู้ลงทะเบียน</TableCell>
                  </TableRow>
                </TableHead>
                  <TableBody>
                    {filteredEvents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          ไม่พบข้อมูลกิจกรรม
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEvents.map((event, idx) => (
                        <React.Fragment key={event.id}>
                          <TableRow 
                            sx={{ 
                              '&:nth-of-type(odd)': { bgcolor: '#f0ede8' },
                              '&:nth-of-type(even)': { bgcolor: 'rgba(255, 255, 255, 0.5)' },
                              '&:hover': { 
                                bgcolor: 'rgba(47, 75, 63, 0.05)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(47, 75, 63, 0.1)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <TableCell sx={{ fontWeight: 600, color: '#2f4b3f' }}>
                              {idx + 1}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: 200 }}>
                                <EventIcon sx={{ color: '#2f4b3f', flexShrink: 0 }} />
                                <Typography 
                                  fontWeight={600} 
                                  sx={{ 
                                    color: '#2f4b3f',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                  title={event.title}
                                >
                                  {event.title}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 160 }}>
                                <ScheduleIcon sx={{ color: '#6b7280', flexShrink: 0 }} />
                                <Box>
                                  <Typography variant="body2" sx={{ color: '#374151', fontWeight: 600 }}>
                                    {moment(event.event_date).format('DD/MM/YYYY')}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                    {moment(event.event_date).format('HH:mm น.')}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: 140 }}>
                                <PlaceIcon sx={{ color: '#6b7280', flexShrink: 0 }} />
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: '#374151',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                  title={event.location}
                                >
                                  {event.location}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              {event.image_url ? (
                                <Box
                                  component="img"
                                  src={`http://localhost:5000${event.image_url}`}
                                  alt={event.title}
                                  sx={{
                                    width: 60,
                                    height: 40,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => window.open(`http://localhost:5000${event.image_url}`, '_blank')}
                                />
                              ) : (
                                <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                                  ไม่มีรูป
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={moment(event.event_date).isAfter() ? 'กำลังมาถึง' : 'ผ่านไปแล้ว'}
                                color={moment(event.event_date).isAfter() ? 'success' : 'default'}
                                size="small"
                                sx={{ 
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                  minWidth: 90,
                                  '&.MuiChip-colorSuccess': {
                                    backgroundColor: 'rgba(47, 75, 63, 0.1)',
                                    color: '#2f4b3f',
                                    border: '1px solid rgba(47, 75, 63, 0.3)'
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleShowModal(event)}
                                  sx={{
                                    bgcolor: 'rgba(249, 199, 79, 0.1)',
                                    color: '#2f4b3f',
                                    border: '1px solid rgba(249, 199, 79, 0.3)',
                                    width: 32,
                                    height: 32,
                                    '&:hover': { 
                                      bgcolor: 'rgba(249, 199, 79, 0.2)',
                                      transform: 'translateY(-1px)',
                                      boxShadow: '0 2px 8px rgba(249, 199, 79, 0.3)'
                                    },
                                    transition: 'all 0.2s ease'
                                  }}
                                  title="แก้ไข"
                                >
                                  <EditIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(event.id)}
                                  sx={{
                                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                                    color: '#dc2626',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    width: 32,
                                    height: 32,
                                    '&:hover': { 
                                      bgcolor: 'rgba(239, 68, 68, 0.2)',
                                      transform: 'translateY(-1px)',
                                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                                    },
                                    transition: 'all 0.2s ease'
                                  }}
                                  title="ลบ"
                                >
                                  <DeleteIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                startIcon={expandedRow === event.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                onClick={() => setExpandedRow(expandedRow === event.id ? null : event.id)}
                                sx={{ 
                                  textTransform: 'none',
                                  bgcolor: 'rgba(47, 75, 63, 0.1)',
                                  color: '#2f4b3f',
                                  border: '1px solid rgba(47, 75, 63, 0.2)',
                                  borderRadius: '8px',
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                  minWidth: 100,
                                  py: 0.5,
                                  px: 1,
                                  '&:hover': {
                                    bgcolor: 'rgba(47, 75, 63, 0.15)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 2px 8px rgba(47, 75, 63, 0.2)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {expandedRow === event.id ? 'ซ่อน' : `ดู (${event.registrations?.length || 0})`}
                              </Button>
                            </TableCell>
                          </TableRow>


                          {/* Expanded row for registrations */}
                          {expandedRow === event.id && (
                            <TableRow>
                              <TableCell colSpan={8} sx={{ bgcolor: '#f8fafc', py: 2, px: 3 }}>
                                <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                                  <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: '#2f4b3f' }}>
                                    รายชื่อผู้ลงทะเบียน ({event.registrations?.length || 0} คน)
                                  </Typography>
                                  {event.registrations && event.registrations.length > 0 ? (
                                    <Box sx={{ 
                                      maxHeight: 300, 
                                      overflowY: 'auto',
                                      overflowX: 'hidden',
                                      '&::-webkit-scrollbar': {
                                        width: '6px'
                                      },
                                      '&::-webkit-scrollbar-track': {
                                        background: 'rgba(47, 75, 63, 0.1)'
                                      },
                                      '&::-webkit-scrollbar-thumb': {
                                        background: 'rgba(47, 75, 63, 0.3)',
                                        borderRadius: '3px'
                                      }
                                    }}>
                                      <Grid container spacing={1}>
                                        {event.registrations.map((reg, regIdx) => (
                                          <Grid item xs={12} sm={6} md={4} key={regIdx}>
                                            <Card sx={{ 
                                              p: 2, 
                                              borderRadius: '12px',
                                              border: '1px solid rgba(47, 75, 63, 0.1)',
                                              bgcolor: 'rgba(255, 255, 255, 0.8)',
                                              '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(47, 75, 63, 0.1)'
                                              },
                                              transition: 'all 0.2s ease'
                                            }}>
                                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ 
                                                  bgcolor: '#2f4b3f', 
                                                  width: 32, 
                                                  height: 32,
                                                  fontSize: '0.8rem'
                                                }}>
                                                  {regIdx + 1}
                                                </Avatar>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                  <Typography 
                                                    variant="subtitle2" 
                                                    fontWeight={600}
                                                    sx={{ 
                                                      color: '#2f4b3f',
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                      whiteSpace: 'nowrap'
                                                    }}
                                                    title={reg.name || reg.user_name}
                                                  >
                                                    {reg.name || reg.user_name}
                                                  </Typography>
                                                  <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                      color: '#6b7280',
                                                      display: 'block',
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                      whiteSpace: 'nowrap'
                                                    }}
                                                    title={`${reg.email} • ${reg.faculty} • ${reg.graduation_year}`}
                                                  >
                                                    {reg.faculty} • {reg.graduation_year}
                                                  </Typography>
                                                </Box>
                                              </Box>
                                            </Card>
                                          </Grid>
                                        ))}
                                      </Grid>
                                    </Box>
                                  ) : (
                                    <Box sx={{ 
                                      textAlign: 'center', 
                                      py: 3,
                                      bgcolor: 'rgba(255, 255, 255, 0.5)',
                                      borderRadius: '12px',
                                      border: '2px dashed rgba(47, 75, 63, 0.2)'
                                    }}>
                                      <PersonIcon sx={{ fontSize: 40, color: '#9ca3af', mb: 1 }} />
                                      <Typography color="text.secondary" variant="body2">
                                        ยังไม่มีผู้ลงทะเบียน
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Container>
        </Box>

      <Dialog 
        open={showModal} 
        onClose={handleCloseModal} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #2f4b3f 0%, #243d33 100%)',
              color: 'white',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at 20% 30%, rgba(249, 199, 79, 0.1) 0%, transparent 40%),
                            radial-gradient(circle at 80% 70%, rgba(251, 211, 107, 0.08) 0%, transparent 40%)`,
                pointerEvents: 'none'
              }
            }}
          >
            <EventIcon sx={{ fontSize: 28, color: '#f9c74f', zIndex: 1 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: '#f9c74f', zIndex: 1 }}>
              {selectedEvent ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรมใหม่'}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ bgcolor: '#f0ede8', p: 4 }}>
            {/* Basic Information Card */}
            <Card 
              sx={{ 
                mb: 3, 
                borderRadius: '20px', 
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(47, 75, 63, 0.1)',
                boxShadow: '0 8px 32px rgba(47, 75, 63, 0.1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(47, 75, 63, 0.15)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#2f4b3f', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon sx={{ color: '#f9c74f' }} />
                  ข้อมูลพื้นฐาน
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="ชื่อกิจกรรม"
                      placeholder="ระบุชื่อกิจกรรมที่ต้องการจัด"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '15px',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)',
                          '& fieldset': {
                            borderColor: 'rgba(47, 75, 63, 0.2)'
                          },
                          '&:hover fieldset': {
                            borderColor: '#2f4b3f'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2f4b3f',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#2f4b3f'
                        },
                        '& .MuiInputBase-input': {
                          color: '#2f4b3f'
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="วันที่และเวลา"
                      type="datetime-local"
                      value={formData.event_date}
                      onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '15px',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)',
                          '& fieldset': {
                            borderColor: 'rgba(47, 75, 63, 0.2)'
                          },
                          '&:hover fieldset': {
                            borderColor: '#2f4b3f'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2f4b3f',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#2f4b3f'
                        },
                        '& .MuiInputBase-input': {
                          color: '#2f4b3f'
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="สถานที่"
                      placeholder="ระบุสถานที่จัดกิจกรรม"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '15px',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)',
                          '& fieldset': {
                            borderColor: 'rgba(47, 75, 63, 0.2)'
                          },
                          '&:hover fieldset': {
                            borderColor: '#2f4b3f'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2f4b3f',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#2f4b3f'
                        },
                        '& .MuiInputBase-input': {
                          color: '#2f4b3f'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Image Upload Card */}
            <Card 
              sx={{ 
                mb: 3, 
                borderRadius: '20px', 
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(47, 75, 63, 0.1)',
                boxShadow: '0 8px 32px rgba(47, 75, 63, 0.1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(47, 75, 63, 0.15)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#2f4b3f', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="span" sx={{ fontSize: 24 }}>🖼️</Box>
                  รูปภาพกิจกรรม
                </Typography>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ 
                      py: 3,
                      borderRadius: '15px',
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      borderColor: 'rgba(47, 75, 63, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      color: '#2f4b3f',
                      '&:hover': {
                        backgroundColor: 'rgba(47, 75, 63, 0.05)',
                        borderColor: '#2f4b3f',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(47, 75, 63, 0.15)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Stack direction="column" alignItems="center" spacing={1}>
                      <Box component="span" sx={{ fontSize: 48 }}>📸</Box>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#2f4b3f' }}>
                        เลือกรูปภาพ หรือ ลากไฟล์มาวางที่นี่
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        รองรับไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 5MB
                      </Typography>
                    </Stack>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </Button>
                  
                  {imagePreview && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2 }}>ตัวอย่างรูปภาพ:</Typography>
                      <Box
                        component="img"
                        src={imagePreview}
                        alt="Preview"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 200,
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          border: '4px solid white'
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Description Card */}
            <Card 
              sx={{ 
                borderRadius: '20px', 
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(47, 75, 63, 0.1)',
                boxShadow: '0 8px 32px rgba(47, 75, 63, 0.1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(47, 75, 63, 0.15)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#2f4b3f', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="span" sx={{ fontSize: 24 }}>📝</Box>
                  รายละเอียดกิจกรรม
                </Typography>
                
                <TextField
                  fullWidth
                  required
                  label="รายละเอียดกิจกรรม"
                  placeholder="อธิบายรายละเอียดของกิจกรรม วัตถุประสงค์ กิจกรรมที่จะทำ และข้อมูลที่ผู้เข้าร่วมควรทราบ"
                  multiline
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '15px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      '& fieldset': {
                        borderColor: 'rgba(47, 75, 63, 0.2)'
                      },
                      '&:hover fieldset': {
                        borderColor: '#2f4b3f'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2f4b3f',
                        borderWidth: 2
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#2f4b3f'
                    },
                    '& .MuiInputBase-input': {
                      color: '#2f4b3f'
                    }
                  }}
                />
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions 
            sx={{ 
              bgcolor: '#f0ede8', 
              borderTop: '2px solid rgba(47, 75, 63, 0.1)',
              p: 3, 
              gap: 2,
              justifyContent: 'flex-end'
            }}
          >
            <Button 
              onClick={handleCloseModal} 
              variant="outlined" 
              size="large"
              sx={{ 
                borderRadius: '15px',
                px: 4,
                py: 1.5,
                borderColor: '#2f4b3f',
                color: '#2f4b3f',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#2f4b3f',
                  backgroundColor: 'rgba(47, 75, 63, 0.05)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              ยกเลิก
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{ 
                borderRadius: '15px',
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #f9c74f 0%, #fbd36b 100%)',
                color: '#2f4b3f',
                fontWeight: 600,
                border: '1px solid rgba(47, 75, 63, 0.1)',
                boxShadow: '0 4px 15px rgba(249, 199, 79, 0.3)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #fbd36b 0%, #f9c74f 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(249, 199, 79, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {selectedEvent ? '💾 บันทึกการแก้ไข' : '✨ เพิ่มกิจกรรม'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog แสดงรายชื่อผู้ลงทะเบียน */}
      <Dialog 
        open={showRegistrations} 
        onClose={() => setShowRegistrations(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <PersonIcon />
          <Typography variant="h6" component="div">
            รายชื่อผู้ลงทะเบียนกิจกรรม: {selectedEventForReg?.title}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          {registrationLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>ลำดับ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>ชื่อ-นามสกุล</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>อีเมล</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>คณะ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>ปีที่จบ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>วันที่ลงทะเบียน</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registrations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        <Stack direction="column" alignItems="center" spacing={2}>
                          <PersonIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                          <Typography variant="body1">ยังไม่มีผู้ลงทะเบียน</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : (
                    registrations.map((reg, idx) => (
                      <TableRow 
                        key={reg.id}
                        sx={{ 
                          backgroundColor: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                          '&:hover': { backgroundColor: '#e2e8f0' },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>{idx + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{reg.name}</TableCell>
                        <TableCell>{reg.email}</TableCell>
                        <TableCell>{reg.faculty}</TableCell>
                        <TableCell>{reg.graduation_year}</TableCell>
                        <TableCell>{new Date(reg.registered_at).toLocaleString('th-TH')}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowRegistrations(false)}
            variant="outlined"
            sx={{ borderRadius: '12px', px: 3 }}
          >
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
      <style>{`
        .MuiTableContainer-root {
          border-radius: 20px;
          overflow: auto;
        }
        
        .MuiTable-root {
          table-layout: auto;
          width: 100%;
        }
        
        .MuiTableCell-root {
          white-space: nowrap;
          padding: 12px 8px;
          vertical-align: middle;
        }
        
        .MuiTableHead-root .MuiTableCell-root {
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .MuiTableBody-root .MuiTableCell-root {
          font-size: 0.875rem;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .MuiTableCell-root {
            padding: 10px 6px;
            font-size: 0.8rem;
          }
          
          .MuiTableHead-root .MuiTableCell-root {
            font-size: 0.8rem;
          }
          
          .MuiButton-root {
            font-size: 0.7rem;
            padding: 4px 8px;
          }
          
          .MuiIconButton-root {
            width: 28px;
            height: 28px;
          }
          
          .MuiChip-root {
            font-size: 0.7rem;
            height: 24px;
          }
        }
        
        @media (max-width: 900px) {
          .MuiTableCell-root {
            padding: 8px 4px;
            font-size: 0.75rem;
          }
          
          .MuiTableHead-root .MuiTableCell-root {
            font-size: 0.75rem;
          }
          
          .MuiButton-root {
            font-size: 0.65rem;
            padding: 3px 6px;
            min-width: 80px;
          }
          
          .MuiIconButton-root {
            width: 24px;
            height: 24px;
          }
          
          .MuiChip-root {
            font-size: 0.65rem;
            height: 20px;
          }
        }
        
        @media (max-width: 600px) {
          .MuiTableContainer-root {
            margin: 0 -8px;
          }
          
          .MuiTableCell-root {
            padding: 6px 2px;
            font-size: 0.7rem;
          }
          
          .MuiTableHead-root .MuiTableCell-root {
            font-size: 0.7rem;
          }
          
          .MuiButton-root {
            font-size: 0.6rem;
            padding: 2px 4px;
            min-width: 70px;
          }
          
          .MuiIconButton-root {
            width: 20px;
            height: 20px;
          }
          
          .MuiChip-root {
            font-size: 0.6rem;
            height: 18px;
          }
        }
        
        /* Custom scrollbar for table */
        .MuiTableContainer-root::-webkit-scrollbar {
          height: 8px;
        }
        
        .MuiTableContainer-root::-webkit-scrollbar-track {
          background: rgba(47, 75, 63, 0.1);
          border-radius: 4px;
        }
        
        .MuiTableContainer-root::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #f9c74f, #fbd36b);
          border-radius: 4px;
        }
        
        .MuiTableContainer-root::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #fbd36b, #f9c74f);
        }
      `}</style>
    </AdminLayout>
  );
}

export default ManageEvents;

