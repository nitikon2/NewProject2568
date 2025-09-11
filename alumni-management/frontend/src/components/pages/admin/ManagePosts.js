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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  Forum as ForumIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import AdminLayout from '../../layout/AdminLayout';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/th';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPost, setDetailPost] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      Swal.fire('Error', 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้', 'error');
      navigate('/login');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/forum/posts');
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลโพสต์ได้');
    } finally {
      setLoading(false);
    }
  };

  // flatten comments (root + reply)
  const flattenComments = (comments) => {
    const result = [];
    const traverse = (comment, parent = null) => {
      result.push({ ...comment, parentId: parent?.id || null });
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach(reply => traverse(reply, comment));
      }
    };
    comments.forEach(c => traverse(c));
    return result;
  };

  const fetchComments = async (postId) => {
    setCommentsLoading(true);
    setCommentError('');
    setSelectedPostId(postId);
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`);
      const nested = Array.isArray(response.data) ? response.data : [];
      setComments(flattenComments(nested));
      setShowCommentsModal(true);
    } catch (err) {
      setCommentError('ไม่สามารถโหลดคอมเมนต์ได้');
      setComments([]);
      setShowCommentsModal(true);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleStatusChange = async (postId, status) => {
    try {
      const result = await Swal.fire({
        title: 'ยืนยันการดำเนินการ',
        text: `คุณต้องการ${status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}โพสต์นี้ใช่หรือไม่?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      });
      if (result.isConfirmed) {
        await axios.put(`http://localhost:5000/api/admin/forum/posts/${postId}/${status}`);
        Swal.fire('สำเร็จ', `${status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}โพสต์เรียบร้อย`, 'success');
        fetchPosts();
      }
    } catch (err) {
      Swal.fire('ผิดพลาด', `ไม่สามารถ${status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}โพสต์ได้`, 'error');
    }
  };

  const handleDelete = async (postId) => {
    try {
      const result = await Swal.fire({
        title: 'ยืนยันการลบ',
        text: 'คุณต้องการลบโพสต์นี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#d33'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/api/admin/posts/${postId}`);
        Swal.fire('สำเร็จ', 'ลบโพสต์เรียบร้อย', 'success');
        fetchPosts();
      }
    } catch (err) {
      Swal.fire('ผิดพลาด', 'ไม่สามารถลบโพสต์ได้', 'error');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const result = await Swal.fire({
        title: 'ยืนยันการลบ',
        text: 'คุณต้องการลบคอมเมนต์นี้ใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#d33'
      });
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/api/admin/forum/comments/${commentId}`);
        Swal.fire('สำเร็จ', 'ลบคอมเมนต์เรียบร้อย', 'success');
        fetchComments(selectedPostId);
        fetchPosts(); // อัปเดทจำนวนคอมเมนต์ในตารางโพสต์
      }
    } catch (err) {
      Swal.fire('ผิดพลาด', 'ไม่สามารถลบคอมเมนต์ได้', 'error');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'อนุมัติแล้ว';
      case 'rejected': return 'ปฏิเสธแล้ว';
      case 'pending': return 'รอตรวจสอบ';
      default: return 'ไม่ระบุ';
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author_name?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && post.status === filterStatus;
  });

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

  if (error) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            {error}
            <Button 
              variant="outlined" 
              color="error"
              size="small" 
              sx={{ ml: 2 }}
              onClick={() => {
                setError('');
                setLoading(true);
                fetchPosts();
              }}
            >
              ลองใหม่
            </Button>
          </Alert>
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
                  <ForumIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  จัดการกระดานสนทนา
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  จัดการโพสต์และความคิดเห็น มหาวิทยาลัยราชภัฏมหาสารคาม
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" fontWeight={700}>
                  {filteredPosts.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  โพสต์ทั้งหมด
                </Typography>
              </Box>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ pb: 4, pl: 4 }}>
          {error && (
            <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Search */}
          <Box sx={{ mb: 3, maxWidth: 500 }}>
            <TextField
              fullWidth
              placeholder="ค้นหาตามชื่อหัวข้อหรือชื่อผู้โพสต์"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: 'white',
                  '&:hover': {
                    '& > fieldset': { borderColor: '#667eea' }
                  }
                }
              }}
            />
          </Box>
          {/* Posts Table */}
          <Card 
            elevation={0}
            sx={{
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              '&:hover': {
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>หัวข้อ</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>ผู้โพสต์</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>วันที่โพสต์</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>คอมเมนต์</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>รูปภาพ</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main', textAlign: 'center' }}>การจัดการ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPosts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          ไม่พบข้อมูลโพสต์
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPosts.map((post, idx) => (
                        <TableRow 
                          key={post.id}
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
                              <ForumIcon sx={{ color: 'primary.main' }} />
                              <Typography fontWeight={600}>{post.title}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                                <PersonIcon sx={{ fontSize: 16 }} />
                              </Avatar>
                              <Typography variant="body2">{post.author_name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <ScheduleIcon sx={{ color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {moment(post.created_at).locale('th').format('LLL')}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={post.comment_count}
                              size="small"
                              sx={{
                                bgcolor: '#667eea',
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {post.image_url ? (
                              <Box
                                component="img"
                                src={`http://localhost:5000${post.image_url}`}
                                alt={post.title}
                                sx={{
                                  width: 80,
                                  height: 50,
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                              />
                            ) : (
                              <ImageIcon sx={{ color: 'text.disabled' }} />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setDetailPost(post);
                                  setShowDetailModal(true);
                                }}
                                sx={{
                                  color: '#06b6d4',
                                  '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.1)' }
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => fetchComments(post.id)}
                                sx={{
                                  color: '#6b7280',
                                  '&:hover': { bgcolor: 'rgba(107, 114, 128, 0.1)' }
                                }}
                              >
                                <CommentIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(post.id)}
                                sx={{
                                  color: '#ef4444',
                                  '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' }
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
            </CardContent>
          </Card>
        </Container>
      </Box>
      {/* Dialog แสดงรายละเอียดโพสต์ */}
      <Dialog 
        open={showDetailModal} 
        onClose={() => setShowDetailModal(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 4,
            maxHeight: '85vh',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 2
          }}
        >
          <ForumIcon />
          รายละเอียดโพสต์
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#f8fafc', p: 0, overflow: 'auto' }}>
          {detailPost && (
            <Box sx={{ p: 3 }}>
              {/* Header Card */}
              <Card 
                elevation={0} 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h4" 
                    fontWeight={700} 
                    color="primary.main" 
                    mb={2}
                    sx={{ 
                      wordBreak: 'break-word',
                      lineHeight: 1.3
                    }}
                  >
                    {detailPost.title}
                  </Typography>
                  
                  <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        <PersonIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">ผู้โพสต์</Typography>
                        <Typography variant="body1" fontWeight={600}>{detailPost.author_name}</Typography>
                      </Box>
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.main' }}>
                        <ScheduleIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">วันที่โพสต์</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {moment(detailPost.created_at).locale('th').format('DD MMM YYYY - HH:mm')}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'warning.main' }}>
                        <CommentIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">ความคิดเห็น</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {detailPost.comment_count} ความคิดเห็น
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Content Card */}
              <Card 
                elevation={0} 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  border: '1px solid #e2e8f0'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={2} color="primary.main">
                    เนื้อหาโพสต์
                  </Typography>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      bgcolor: '#ffffff', 
                      borderRadius: 2, 
                      border: '1px solid #f1f5f9',
                      minHeight: 80
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        lineHeight: 1.7,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}
                    >
                      {detailPost.content}
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>

              {/* Image Card */}
              {detailPost.image_url && (
                <Card 
                  elevation={0} 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2} color="primary.main">
                      รูปภาพ
                    </Typography>
                    <Box 
                      sx={{ 
                        textAlign: 'center',
                        p: 2,
                        bgcolor: '#f8fafc',
                        borderRadius: 2,
                        border: '1px solid #f1f5f9'
                      }}
                    >
                      <Box
                        component="img"
                        src={`http://localhost:5000${detailPost.image_url}`}
                        alt={detailPost.title}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 400,
                          objectFit: 'contain',
                          borderRadius: 2,
                          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.02)'
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions 
          sx={{ 
            bgcolor: '#f8fafc', 
            borderTop: '1px solid #e2e8f0',
            p: 3,
            justifyContent: 'space-between'
          }}
        >
          <Button 
            onClick={() => fetchComments(detailPost?.id)}
            variant="contained"
            startIcon={<CommentIcon />}
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
              }
            }}
          >
            ดูความคิดเห็น
          </Button>
          <Button 
            onClick={() => setShowDetailModal(false)} 
            variant="outlined" 
            sx={{ borderRadius: 2 }}
          >
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog แสดงคอมเมนต์ของโพสต์ */}
      <Dialog 
        open={showCommentsModal} 
        onClose={() => setShowCommentsModal(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 4,
            maxHeight: '85vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 2
          }}
        >
          <CommentIcon />
          คอมเมนต์ของโพสต์
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#f8fafc', p: 0, overflow: 'auto' }}>
          {commentsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <Stack alignItems="center" spacing={2}>
                <CircularProgress size={50} />
                <Typography variant="body1" color="text.secondary">
                  กำลังโหลดคอมเมนต์...
                </Typography>
              </Stack>
            </Box>
          ) : commentError ? (
            <Box sx={{ p: 3 }}>
              <Alert severity="error" sx={{ textAlign: 'center', borderRadius: 2 }}>
                {commentError}
              </Alert>
            </Box>
          ) : comments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CommentIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" mb={1}>
                ไม่มีคอมเมนต์
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ยังไม่มีใครคอมเมนต์ในโพสต์นี้
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" color="primary.main" mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CommentIcon />
                ความคิดเห็นทั้งหมด ({comments.length} รายการ)
              </Typography>
              
              <Stack spacing={2}>
                {comments.map((comment) => (
                  <Card 
                    key={comment.id}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        borderColor: comment.parentId ? '#ec4899' : '#3b82f6'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={2}>
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            bgcolor: comment.parentId ? 'secondary.main' : 'primary.main'
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {comment.author_name}
                            </Typography>
                            <Chip 
                              label={comment.parentId ? 'ตอบกลับ' : 'คอมเมนต์หลัก'}
                              size="small"
                              color={comment.parentId ? 'secondary' : 'primary'}
                              sx={{ fontSize: '0.75rem' }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {moment(comment.created_at).locale('th').format('DD MMM YYYY - HH:mm')}
                            </Typography>
                          </Stack>
                          
                          <Paper 
                            elevation={0}
                            sx={{ 
                              p: 2, 
                              bgcolor: '#f8fafc', 
                              borderRadius: 2,
                              border: '1px solid #f1f5f9',
                              mb: 2
                            }}
                          >
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                lineHeight: 1.6,
                                wordBreak: 'break-word'
                              }}
                            >
                              {comment.content}
                            </Typography>
                          </Paper>
                          
                          <Stack direction="row" justifyContent="flex-end">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteComment(comment.id)}
                              sx={{
                                color: '#ef4444',
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                '&:hover': { 
                                  bgcolor: 'rgba(239, 68, 68, 0.2)',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions 
          sx={{ 
            bgcolor: '#f8fafc', 
            borderTop: '1px solid #e2e8f0',
            p: 3,
            justifyContent: 'flex-end'
          }}
        >
          <Button 
            onClick={() => setShowCommentsModal(false)} 
            variant="outlined" 
            sx={{ borderRadius: 2 }}
          >
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}

export default ManagePosts;

