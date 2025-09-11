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
      if (newsItem.image) {
        setImagePreview(`http://localhost:5000/uploads/news/${newsItem.image}`);
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
          <Container maxWidth="xl">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700} mb={1}>
                  <NewsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  จัดการข่าวสาร
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  จัดการข้อมูลข่าวสารและประชาสัมพันธ์ มหาวิทยาลัยราชภัฏมหาสารคาม
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" fontWeight={700}>
                  {filteredNews.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  ข่าวสารทั้งหมด
                </Typography>
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* Controls */}
        <Container maxWidth="xl" sx={{ mb: 4 }}>
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
                เพิ่มข่าวใหม่
              </Button>
              
              <TextField
                placeholder="ค้นหาข่าวสาร..."
                value={search}
                onChange={e => setSearch(e.target.value)}
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

        {/* Content */}
        <Container maxWidth="xl">
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          <Card sx={{ borderRadius: '16px', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', width: 50 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>หัวข้อข่าว</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>วันที่เผยแพร่</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>ผู้เขียน</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', textAlign: 'center' }}>การจัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredNews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        <Stack direction="column" alignItems="center" spacing={2}>
                          <NewsIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                          <Typography variant="body1">ไม่พบข้อมูลข่าวสาร</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNews.map((item, idx) => (
                      <TableRow 
                        key={item.id} 
                        sx={{ 
                          backgroundColor: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                          '&:hover': { backgroundColor: '#e2e8f0' },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>
                          {idx + 1}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <NewsIcon sx={{ color: '#667eea', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.title}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {moment(item.created_at).locale('th').format('LLL')}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
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
                              onClick={() => handleDelete(item.id)}
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
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <NewsIcon />
            <Typography variant="h6" component="div">
              {selectedNews ? 'แก้ไขข่าว' : 'เพิ่มข่าวใหม่'}
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                label="หัวข้อข่าว"
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={!!validationError.title}
                helperText={validationError.title}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
              
              <TextField
                label="เนื้อหา"
                fullWidth
                multiline
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                error={!!validationError.content}
                helperText={validationError.content}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
              
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  เลือกรูปภาพ (ไม่จำเป็น)
                </Typography>
                <TextField
                  type="file"
                  fullWidth
                  inputProps={{ accept: "image/*" }}
                  onChange={handleImageChange}
                  error={!!validationError.image}
                  helperText={validationError.image || "รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }}
                />
              </Box>
              
              {imagePreview && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ mb: 2 }}>ตัวอย่างรูปภาพ:</Typography>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ 
                        maxHeight: '200px', 
                        borderRadius: '12px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, image: null });
                      }}
                      sx={{ mt: 1, display: 'block', mx: 'auto' }}
                    >
                      ลบรูปภาพ
                    </Button>
                  </Box>
                </Box>
              )}
            </Stack>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button 
              onClick={handleCloseModal}
              variant="outlined"
              sx={{ borderRadius: '12px', px: 3 }}
            >
              ยกเลิก
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' 
                },
                borderRadius: '12px',
                px: 3
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
