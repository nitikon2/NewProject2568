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
  Divider
} from '@mui/material';
import {
  Article as NewsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/th';
import AdminLayout from '../../layout/AdminLayout';
import Swal from 'sweetalert2';

function ManageNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState({
    title: '',
    content: '',
    image: ''
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/news', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNews(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลข่าวสารได้');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title?.trim()) {
      errors.title = 'กรุณากรอกหัวข้อข่าว';
    }
    if (!formData.content?.trim()) {
      errors.content = 'กรุณากรอกเนื้อหา';
    }
    if (formData.image && formData.image.size > 5 * 1024 * 1024) {
      errors.image = 'ขนาดไฟล์ต้องไม่เกิน 5MB';
    }
    setValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationError({ ...validationError, image: 'ขนาดไฟล์ต้องไม่เกิน 5MB' });
        return;
      }
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setValidationError({ ...validationError, image: '' });
    }
  };

  const handleShowModal = (newsItem = null) => {
    if (newsItem) {
      setSelectedNews(newsItem);
      setFormData({
        title: newsItem.title,
        content: newsItem.content,
        image: null
      });
      // แสดงรูปภาพเดิมเมื่ออยู่ในโหมดแก้ไข
      if (newsItem.image_url) {
        setImagePreview(`http://localhost:5000${newsItem.image_url}`);
      } else {
        setImagePreview(null);
      }
    } else {
      setSelectedNews(null);
      setFormData({
        title: '',
        content: '',
        image: null
      });
      setImagePreview(null);
    }
    setValidationError({ title: '', content: '', image: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNews(null);
    setFormData({ title: '', content: '', image: null });
    setImagePreview(null);
    setValidationError({ title: '', content: '', image: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (selectedNews) {
        await axios.put(`http://localhost:5000/api/admin/news/${selectedNews.id}`, submitData, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        Swal.fire('สำเร็จ', 'แก้ไขข่าวสารเรียบร้อยแล้ว', 'success');
      } else {
        await axios.post('http://localhost:5000/api/admin/news', submitData, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        Swal.fire('สำเร็จ', 'เพิ่มข่าวสารเรียบร้อยแล้ว', 'success');
      }

      handleCloseModal();
      fetchNews();
    } catch (err) {
      Swal.fire('ผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบข่าวสารนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/news/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        Swal.fire('สำเร็จ', 'ลบข่าวสารเรียบร้อยแล้ว', 'success');
        fetchNews();
      } catch (err) {
        Swal.fire('ผิดพลาด', 'ไม่สามารถลบข่าวสารได้', 'error');
      }
    }
  };

  // ฟิลเตอร์ข่าวสารตาม search
  const filteredNews = news.filter(item =>
    item.title?.toLowerCase().includes(search.trim().toLowerCase()) ||
    item.content?.toLowerCase().includes(search.trim().toLowerCase()) ||
    item.author_name?.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ 
          minHeight: '100vh', 
          bgcolor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CircularProgress size={60} />
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
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(249, 199, 79, 0.3) 0%, transparent 70%)',
              top: '-100px',
              right: '-50px',
              animation: 'float 6s ease-in-out infinite'
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(251, 211, 107, 0.2) 0%, transparent 70%)',
              bottom: '-75px',
              left: '-25px',
              animation: 'float 8s ease-in-out infinite reverse'
            },
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' }
            }
          }}
        >
          <Container maxWidth="xl" sx={{ pl: 4, position: 'relative', zIndex: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700} mb={1} sx={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  <NewsIcon sx={{ 
                    mr: 1, 
                    verticalAlign: 'middle',
                    fontSize: '2rem',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }} />
                  จัดการข่าวสาร
                </Typography>
                <Typography variant="h6" sx={{ 
                  opacity: 0.9,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  fontWeight: 400
                }}>
                  จัดการข้อมูลข่าวสารและประชาสัมพันธ์ มหาวิทยาลัยราชภัฏมหาสารคาม
                </Typography>
              </Box>
              <Box sx={{ 
                textAlign: 'right',
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                p: 2,
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Typography variant="h5" fontWeight={700} sx={{
                  color: '#f9c74f',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {filteredNews.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  ข่าวสารทั้งหมด
                </Typography>
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* Controls */}
        <Container maxWidth="xl" sx={{ mb: 4, pl: 4 }}>
          <Card sx={{ 
            p: 3, 
            borderRadius: '16px',
            border: '2px solid rgba(47, 75, 63, 0.1)',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'rgba(249, 199, 79, 0.3)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(47, 75, 63, 0.1)'
            }
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleShowModal()}
                sx={{
                  background: 'linear-gradient(135deg, #f9c74f 0%, #fbd36b 100%)',
                  color: '#2f4b3f',
                  fontWeight: 600,
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  border: '1px solid rgba(47, 75, 63, 0.1)',
                  boxShadow: '0 4px 12px rgba(249, 199, 79, 0.3)',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #fbd36b 0%, #f9c74f 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(249, 199, 79, 0.4)'
                  }
                }}
              >
                เพิ่มข่าวใหม่
              </Button>
              
              <TextField
                placeholder="ค้นหาข่าวสาร..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ 
                  maxWidth: 400,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    border: '2px solid rgba(47, 75, 63, 0.1)',
                    bgcolor: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#f9c74f',
                      boxShadow: '0 4px 12px rgba(249, 199, 79, 0.15)'
                    },
                    '&.Mui-focused': {
                      borderColor: '#2f4b3f',
                      boxShadow: '0 4px 12px rgba(47, 75, 63, 0.15)'
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: '#2f4b3f',
                    '&::placeholder': {
                      color: 'rgba(47, 75, 63, 0.6)'
                    }
                  }
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: '#2f4b3f' }} />
                }}
              />
            </Stack>
          </Card>
        </Container>

        {/* Content */}
        <Container maxWidth="xl" sx={{ pl: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          <Card sx={{ 
            borderRadius: '16px', 
            overflow: 'hidden',
            border: '2px solid rgba(47, 75, 63, 0.1)',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'rgba(249, 199, 79, 0.3)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 25px rgba(47, 75, 63, 0.1)'
            }
          }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ 
                  bgcolor: 'linear-gradient(135deg, #f9c74f 0%, #fbd36b 100%)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, #f9c74f 0%, #fbd36b 100%)',
                    opacity: 0.1
                  }
                }}>
                  <TableRow>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      color: '#2f4b3f', 
                      width: 50,
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>#</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      color: '#2f4b3f',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>หัวข้อข่าว</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      color: '#2f4b3f',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>วันที่เผยแพร่</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      color: '#2f4b3f',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>ผู้เขียน</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      color: '#2f4b3f', 
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>การจัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredNews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ 
                        py: 6, 
                        color: '#2f4b3f',
                        fontSize: '1.1rem',
                        fontWeight: 500
                      }}>
                        <Stack direction="column" alignItems="center" spacing={2}>
                          <NewsIcon sx={{ fontSize: 48, color: 'rgba(47, 75, 63, 0.3)' }} />
                          <Typography variant="h6" color="#2f4b3f">
                            ไม่พบข้อมูลข่าวสาร
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNews.map((item, idx) => (
                      <TableRow 
                        key={item.id} 
                        sx={{ 
                          '&:nth-of-type(odd)': { 
                            bgcolor: 'rgba(249, 199, 79, 0.03)' 
                          },
                          '&:hover': { 
                            bgcolor: 'rgba(47, 75, 63, 0.05)',
                            transform: 'scale(1.002)',
                            transition: 'all 0.2s ease'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <TableCell sx={{ 
                          fontWeight: 700, 
                          color: '#2f4b3f',
                          fontSize: '1rem'
                        }}>
                          {idx + 1}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <NewsIcon sx={{ color: '#f9c74f', fontSize: '1.2rem' }} />
                            <Typography variant="body2" sx={{ 
                              fontWeight: 600,
                              color: '#2f4b3f'
                            }}>
                              {item.title}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <ScheduleIcon sx={{ fontSize: 16, color: '#f9c74f' }} />
                            <Typography variant="body2" sx={{ color: '#2f4b3f' }}>
                              {moment(item.created_at).locale('th').format('LLL')}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <PersonIcon sx={{ fontSize: 16, color: '#f9c74f' }} />
                            <Typography variant="body2" sx={{ 
                              color: '#2f4b3f',
                              fontWeight: 500
                            }}>
                              {item.author_name || 'Admin'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton
                              size="small"
                              onClick={() => handleShowModal(item)}
                              sx={{
                                color: '#2f4b3f',
                                bgcolor: 'rgba(47, 75, 63, 0.1)',
                                border: '1px solid rgba(47, 75, 63, 0.2)',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                  bgcolor: '#2f4b3f',
                                  color: 'white',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 12px rgba(47, 75, 63, 0.3)'
                                }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(item.id)}
                              sx={{
                                color: '#ef4444',
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                  bgcolor: '#ef4444',
                                  color: 'white',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Container>
      </Box>
      
      {/* News Management Dialog */}
      <Dialog 
        open={showModal} 
        onClose={handleCloseModal} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 4,
            maxHeight: '90vh',
            overflow: 'hidden',
            border: '2px solid rgba(47, 75, 63, 0.1)',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #2f4b3f 0%, #243d33 100%)', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 3,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(249, 199, 79, 0.3) 0%, transparent 70%)',
              transform: 'translate(30px, -30px)'
            }
          }}>
            <NewsIcon sx={{ 
              fontSize: '1.5rem',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} />
            <Typography variant="h6" component="div">
              {selectedNews ? 'แก้ไขข่าว' : 'เพิ่มข่าวใหม่'}
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ 
            bgcolor: '#f0ede8', 
            p: 0, 
            overflow: 'auto'
          }}>
            <Box sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* หัวข้อข่าว */}
                <Card elevation={0} sx={{ 
                  borderRadius: 3, 
                  border: '2px solid rgba(47, 75, 63, 0.1)',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'rgba(249, 199, 79, 0.3)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(47, 75, 63, 0.1)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: '#2f4b3f' }}>
                      หัวข้อข่าว *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="กรอกหัวข้อข่าวสาร..."
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      error={!!validationError.title}
                      helperText={validationError.title}
                      required
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: 'white',
                          border: '2px solid rgba(47, 75, 63, 0.1)',
                          '&:hover': {
                            borderColor: '#f9c74f'
                          },
                          '&.Mui-focused': {
                            borderColor: '#2f4b3f'
                          }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
                
                {/* เนื้อหาข่าว */}
                <Card elevation={0} sx={{ 
                  borderRadius: 3, 
                  border: '2px solid rgba(47, 75, 63, 0.1)',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'rgba(249, 199, 79, 0.3)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(47, 75, 63, 0.1)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: '#2f4b3f' }}>
                      เนื้อหาข่าว *
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="กรอกเนื้อหาข่าวสาร..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      error={!!validationError.content}
                      helperText={validationError.content}
                      required
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: 'white',
                          border: '2px solid rgba(47, 75, 63, 0.1)',
                          '&:hover': {
                            borderColor: '#f9c74f'
                          },
                          '&.Mui-focused': {
                            borderColor: '#2f4b3f'
                          }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
                
                {/* รูปภาพ */}
                <Card elevation={0} sx={{ 
                  borderRadius: 3, 
                  border: '2px solid rgba(47, 75, 63, 0.1)',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'rgba(249, 199, 79, 0.3)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(47, 75, 63, 0.1)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: '#2f4b3f' }}>
                      รูปภาพประกอบ
                    </Typography>
                    <Box 
                      sx={{ 
                        border: '2px dashed rgba(249, 199, 79, 0.5)',
                        borderRadius: 2,
                        p: 2,
                        textAlign: 'center',
                        bgcolor: 'rgba(249, 199, 79, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#f9c74f',
                          bgcolor: '#f8fafc'
                        }
                      }}
                      onClick={() => document.getElementById('news-image-input').click()}
                    >
                      <input
                        id="news-image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                      {!imagePreview ? (
                        <Stack alignItems="center" spacing={1}>
                          <ImageIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            คลิกเพื่อเลือกรูปภาพ
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB
                          </Typography>
                        </Stack>
                      ) : (
                        <Box>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ 
                              maxHeight: '150px',
                              maxWidth: '100%',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById('news-image-input').click();
                              }}
                              sx={{ 
                                borderRadius: 2,
                                borderColor: '#f9c74f',
                                color: '#2f4b3f',
                                '&:hover': {
                                  borderColor: '#2f4b3f',
                                  bgcolor: 'rgba(47, 75, 63, 0.05)'
                                }
                              }}
                            >
                              เปลี่ยนรูป
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImagePreview(null);
                                setFormData({ ...formData, image: null });
                              }}
                              sx={{ borderRadius: 2 }}
                            >
                              ลบรูป
                            </Button>
                          </Stack>
                        </Box>
                      )}
                    </Box>
                    {validationError.image && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                        {validationError.image}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Box>
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
              sx={{
                borderRadius: 3,
                borderColor: '#2f4b3f',
                color: '#2f4b3f',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                '&:hover': {
                  borderColor: '#2f4b3f',
                  bgcolor: 'rgba(47, 75, 63, 0.05)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              ยกเลิก
            </Button>
            <Button 
              type="submit"
              variant="contained"
              sx={{
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f9c74f 0%, #fbd36b 100%)',
                color: '#2f4b3f',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                border: '1px solid rgba(47, 75, 63, 0.1)',
                boxShadow: '0 4px 12px rgba(249, 199, 79, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #fbd36b 0%, #f9c74f 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(249, 199, 79, 0.4)'
                }
              }}
            >
              {selectedNews ? 'บันทึกการแก้ไข' : 'เพิ่มข่าว'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </AdminLayout>
  );
}

export default ManageNews;
