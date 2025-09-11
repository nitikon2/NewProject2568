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
  Visibility as VisibilityIcon,
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailEvent, setDetailEvent] = useState(null);
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

  // แก้ไขฟังก์ชันสำหรับดูรายละเอียดกิจกรรม
  const handleViewDetail = (event) => {
    setDetailEvent(event);
    setShowDetailModal(true);
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
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 4,
            mb: 4
          }}
        >
          <Container maxWidth="xl" sx={{ pl: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700} mb={1}>
                  <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  จัดการกิจกรรม
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  จัดการกิจกรรมและการลงทะเบียน มหาวิทยาลัยราชภัฏมหาสารคาม
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" fontWeight={700}>
                  {filteredEvents.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  กิจกรรมทั้งหมด
                </Typography>
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* Controls */}
        <Container maxWidth="xl" sx={{ mb: 4, pl: 4 }}>
          <Card sx={{ p: 3, borderRadius: '16px' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleShowModal()}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' 
                  },
                  borderRadius: '12px',
                  px: 3
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
                sx={{ maxWidth: 400 }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} />,
                  sx: { borderRadius: '12px' }
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
          <Card sx={{ borderRadius: '16px', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', width: 50 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>ชื่อกิจกรรม</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>วันที่จัด</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>สถานที่</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>รูปภาพ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>สถานะ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', textAlign: 'center' }}>การจัดการ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', textAlign: 'center' }}>ผู้ลงทะเบียน</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', textAlign: 'center' }}>รายละเอียด</TableCell>
                  </TableRow>
                </TableHead>
                  <TableBody>
                    {filteredEvents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          ไม่พบข้อมูลกิจกรรม
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEvents.map((event, idx) => (
                        <React.Fragment key={event.id}>
                          <TableRow 
                            sx={{ 
                              '&:nth-of-type(odd)': { bgcolor: '#f8fafc' },
                              '&:hover': { bgcolor: '#e2e8f0' }
                            }}
                          >
                            <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {idx + 1}
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <EventIcon sx={{ color: 'primary.main' }} />
                                <Typography fontWeight={600}>{event.title}</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <ScheduleIcon sx={{ color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  {moment(event.event_date).locale('th').format('LLL')}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <PlaceIcon sx={{ color: 'text.secondary' }} />
                                <Typography variant="body2">{event.location}</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              {event.image_url && (
                                <Box
                                  component="img"
                                  src={`http://localhost:5000${event.image_url}`}
                                  alt={event.title}
                                  sx={{
                                    width: 80,
                                    height: 50,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={moment(event.event_date).isAfter() ? 'กำลังจะมาถึง' : 'ผ่านไปแล้ว'}
                                color={moment(event.event_date).isAfter() ? 'success' : 'default'}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Stack direction="row" spacing={1} justifyContent="center">
                                <IconButton
                                  size="small"
                                  onClick={() => handleShowModal(event)}
                                  sx={{
                                    bgcolor: '#e3f2fd',
                                    color: '#1976d2',
                                    '&:hover': { 
                                      bgcolor: '#bbdefb',
                                      transform: 'translateY(-1px)' 
                                    },
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(event.id)}
                                  sx={{
                                    bgcolor: '#ffebee',
                                    color: '#d32f2f',
                                    '&:hover': { 
                                      bgcolor: '#ffcdd2',
                                      transform: 'translateY(-1px)' 
                                    },
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                startIcon={expandedRow === event.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                onClick={() => setExpandedRow(expandedRow === event.id ? null : event.id)}
                                sx={{ 
                                  textTransform: 'none',
                                  bgcolor: '#f3e8ff',
                                  color: '#7c3aed',
                                  '&:hover': { 
                                    bgcolor: '#e9d5ff',
                                    transform: 'translateY(-1px)' 
                                  },
                                  transition: 'all 0.2s',
                                  borderRadius: '8px'
                                }}
                              >
                                {expandedRow === event.id ? 'ซ่อน' : 'ดูผู้ลงทะเบียน'}
                              </Button>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetail(event)}
                                sx={{
                                  bgcolor: '#f0f9ff',
                                  color: '#0284c7',
                                  '&:hover': { 
                                    bgcolor: '#bae6fd',
                                    transform: 'translateY(-1px)' 
                                  },
                                  transition: 'all 0.2s'
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>


                          {/* Expanded row for registrations */}
                          {expandedRow === event.id && (
                            <TableRow>
                              <TableCell colSpan={9} sx={{ bgcolor: '#f8fafc', py: 2 }}>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                  รายชื่อผู้ลงทะเบียน ({event.registrations?.length || 0} คน)
                                </Typography>
                                {event.registrations && event.registrations.length > 0 ? (
                                  <List dense>
                                    {event.registrations.map((reg, regIdx) => (
                                      <ListItem key={regIdx} divider>
                                        <ListItemAvatar>
                                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            <PersonIcon />
                                          </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                          primary={reg.name || reg.user_name}
                                          secondary={`${reg.email} • ${reg.faculty} • ${reg.graduation_year}`}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                ) : (
                                  <Typography color="text.secondary">
                                    ยังไม่มีผู้ลงทะเบียน
                                  </Typography>
                                )}
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
          sx: { borderRadius: 3 }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 3
            }}
          >
            <EventIcon sx={{ fontSize: 28 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
              {selectedEvent ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรมใหม่'}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ bgcolor: '#f8fafc', p: 4 }}>
            {/* Basic Information Card */}
            <Card sx={{ mb: 3, borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#1e293b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon sx={{ color: '#667eea' }} />
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
                          borderRadius: '12px',
                          backgroundColor: 'white'
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
                          borderRadius: '12px',
                          backgroundColor: 'white'
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
                          borderRadius: '12px',
                          backgroundColor: 'white'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Image Upload Card */}
            <Card sx={{ mb: 3, borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#1e293b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
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
                      borderRadius: '12px',
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      backgroundColor: 'white',
                      '&:hover': {
                        backgroundColor: '#f1f5f9',
                        borderColor: '#667eea'
                      }
                    }}
                  >
                    <Stack direction="column" alignItems="center" spacing={1}>
                      <Box component="span" sx={{ fontSize: 48 }}>📸</Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        เลือกรูปภาพ หรือ ลากไฟล์มาวางที่นี่
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
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
            <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#1e293b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
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
                      borderRadius: '12px',
                      backgroundColor: 'white'
                    }
                  }}
                />
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#f8fafc', p: 3, gap: 2 }}>
            <Button 
              onClick={handleCloseModal} 
              variant="outlined" 
              size="large"
              sx={{ 
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                borderColor: '#e2e8f0',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  backgroundColor: '#f8fafc'
                }
              }}
            >
              ยกเลิก
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{ 
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)'
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

      {/* Dialog แสดงรายละเอียดกิจกรรม */}
      <Dialog 
        open={showDetailModal} 
        onClose={() => setShowDetailModal(false)} 
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
          <EventIcon />
          <Typography variant="h6" component="div">
            รายละเอียดกิจกรรม
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          {detailEvent && (
            <Stack spacing={3}>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon />
                {detailEvent.title}
              </Typography>
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon />
                  วันที่จัด:
                </Typography>
                <Typography variant="body1" sx={{ pl: 4 }}>
                  {moment(detailEvent.event_date).locale('th').format('LLL')}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PlaceIcon />
                  สถานที่:
                </Typography>
                <Typography variant="body1" sx={{ pl: 4 }}>
                  {detailEvent.location}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  รายละเอียด:
                </Typography>
                <Paper sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '12px', minHeight: 80 }}>
                  <Typography variant="body1">
                    {detailEvent.description}
                  </Typography>
                </Paper>
              </Box>
              
              {detailEvent.image_url && (
                <Box sx={{ textAlign: 'center' }}>
                  <img
                    src={`http://localhost:5000${detailEvent.image_url}`}
                    alt={detailEvent.title}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px', 
                      objectFit: 'contain', 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }}
                  />
                </Box>
              )}
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'inline', mr: 2 }}>
                  สถานะ:
                </Typography>
                <Chip 
                  label={moment(detailEvent.event_date).isAfter() ? 'กำลังจะมาถึง' : 'ผ่านไปแล้ว'}
                  color={moment(detailEvent.event_date).isAfter() ? 'success' : 'default'}
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </Stack>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowDetailModal(false)}
            variant="outlined"
            sx={{ borderRadius: '12px', px: 3 }}
          >
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
      <style>{`
        table {
          font-size: 1.08rem;
        }
        th, td {
          white-space: nowrap;
          padding-top: 16px !important;
          padding-bottom: 16px !important;
        }
        .card {
          padding: 12px 0;
        }
        @media (max-width: 991px) {
          table {
            font-size: 0.98rem;
          }
        }
        @media (max-width: 767px) {
          table {
            font-size: 0.93rem;
          }
        }
        @media (max-width: 480px) {
          table {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </AdminLayout>
  );
}

export default ManageEvents;

