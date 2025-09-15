import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
  Box,
  Fab,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Stack,
  Chip,
  CircularProgress,
  Paper,
  Collapse,
  Badge,
  Fade
} from '@mui/material';
import {
  Forum as ForumIcon,
  Add as AddIcon,
  Comment as CommentIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Reply as ReplyIcon,
  Person as PersonIcon,
  Image as ImageIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  ChatBubble as ChatBubbleIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import BackgroundLayout from '../layout/BackgroundLayout';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/th';

// Furni Modern Theme CSS Animations
const furniForumAnimations = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: 200px 0; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

// Insert animations into head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = furniForumAnimations;
  if (!document.head.querySelector('style[data-furni-forum-animations]')) {
    style.setAttribute('data-furni-forum-animations', 'true');
    document.head.appendChild(style);
  }
}

function Forum() {
  // Main state declarations
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [validationError, setValidationError] = useState({
    title: '',
    content: '',
    image: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

  // สำหรับเมนู 3 จุด (more menu) และ modal แก้ไขโพสต์
  const [showMoreMenu, setShowMoreMenu] = useState(null); // postId ที่เปิดเมนูอยู่
  const [showEditModal, setShowEditModal] = useState(null); // postId ที่จะแก้ไข
  const [editPost, setEditPost] = useState({ title: '', content: '', image: null });
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null); // postId ที่จะลบ
  // ฟังก์ชันลบโพสต์
  const handleDeletePost = async () => {
    if (!showDeleteModal) return;
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/posts/${showDeleteModal}`);
      setPosts(posts.filter(p => p.id !== showDeleteModal));
      setShowMoreMenu(null);
      setShowDeleteModal(null);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบโพสต์');
    } finally {
      setDeleting(false);
    }
  };

  // ฟังก์ชันเปิด modal แก้ไขโพสต์
  const handleOpenEditModal = (post) => {
  setEditPost({ title: post.title, content: post.content, image: null });
  setEditImagePreview(post.image_url ? `http://localhost:5000${post.image_url}` : null);
  setRemoveImage(false);
  setShowEditModal(post.id);
  setShowMoreMenu(null);
  };

  // ฟังก์ชันแก้ไขโพสต์
  const handleEditPost = async (e) => {
    e.preventDefault();
    if (!editPost.title.trim() || !editPost.content.trim()) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', editPost.title);
      formData.append('content', editPost.content);
      if (editPost.image) formData.append('image', editPost.image);
      formData.append('removeImage', removeImage);
      await axios.put(`http://localhost:5000/api/posts/${showEditModal}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchPosts();
      setShowEditModal(null);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการแก้ไขโพสต์');
    } finally {
      setSubmitting(false);
    }
  };
  // สำหรับ reply
  const [replyingTo, setReplyingTo] = useState({}); // postId: commentId
  const [replyText, setReplyText] = useState({}); // commentId: text

  // ส่ง reply
  const handleReply = async (postId, parentCommentId) => {
    if (!replyText[parentCommentId]?.trim() || !user) return;
    setCommentLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, {
        content: replyText[parentCommentId],
        user_id: user.id,
        parent_comment_id: parentCommentId
      });
      // รีเฟรชคอมเมนต์
      const res = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`);
      setComments({ ...comments, [postId]: res.data });
      setReplyText({ ...replyText, [parentCommentId]: '' });
      setReplyingTo({ ...replyingTo, [postId]: null });
    } catch (err) {
      setError('ไม่สามารถตอบกลับความคิดเห็นได้');
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
    } catch (err) {
      setError('ไม่สามารถโหลดโพสต์ได้');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newPost.title.trim()) {
      errors.title = 'กรุณาระบุหัวข้อ';
    }
    if (!newPost.content.trim()) {
      errors.content = 'กรุณาระบุเนื้อหา';
    }
    if (newPost.image && newPost.image.size > 5 * 1024 * 1024) {
      errors.image = 'ขนาดไฟล์ต้องไม่เกิน 5MB';
    }
    setValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationError({
          ...validationError,
          image: 'ขนาดไฟล์ต้องไม่เกิน 5MB'
        });
        return;
      }
      setNewPost({ ...newPost, image: file });
      setImagePreview(URL.createObjectURL(file));
      setValidationError({ ...validationError, image: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('content', newPost.content);
      formData.append('user_id', user.id);
      if (newPost.image) {
        formData.append('image', newPost.image);
      }

      const response = await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status === 'success') {
        await fetchPosts();
        handleCloseModal();
        setNewPost({ title: '', content: '', image: null });
      } else {
        throw new Error(response.data.message || 'ไม่สามารถสร้างโพสต์ได้');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'ไม่สามารถสร้างโพสต์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewPost({ title: '', content: '', image: null });
    setImagePreview(null);
    setValidationError({});
  };

  const toggleComments = async (postId) => {
    if (!showComments[postId]) {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`);
        setComments({ ...comments, [postId]: response.data });
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    }
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim() || !user) return;
    
    setCommentLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, {
        content: newComment,
        user_id: user.id
      });

      // อัพเดทความคิดเห็นในโพสต์
      const updatedComments = comments[postId] ? [...comments[postId], response.data] : [response.data];
      setComments({
        ...comments,
        [postId]: updatedComments
      });

      // อัพเดทจำนวนความคิดเห็นในโพสต์
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comment_count: post.comment_count + 1
          };
        }
        return post;
      }));

      setNewComment('');
      setError('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('ไม่สามารถเพิ่มความคิดเห็นได้');
    } finally {
      setCommentLoading(false);
    }
  };

  const renderComments = (commentsArr, postId, level = 0) => {
    return commentsArr.map((comment, index) => {
      const isReply = level > 0;
      return (
        <Box 
          key={comment.id} 
          sx={{ 
            display: 'flex', 
            mb: 2,
            ml: isReply ? 4 : 0,
            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
          }}
        >
          {isReply && (
            <Box sx={{ 
              width: 3, 
              background: 'linear-gradient(180deg, #f9c74f, #fbd36b)',
              mr: 3, 
              borderRadius: '0.2rem',
              minHeight: '100%'
            }} />
          )}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{
              p: 3,
              background: isReply 
                ? 'linear-gradient(135deg, rgba(247, 245, 243, 0.6), rgba(255, 255, 255, 0.8))'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(247, 245, 243, 0.7))',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              border: `1px solid ${isReply ? 'rgba(249, 199, 79, 0.2)' : 'rgba(47, 75, 63, 0.08)'}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 0.75rem 1.5rem rgba(47, 75, 63, 0.08)',
                borderColor: isReply ? '#f9c74f' : 'rgba(47, 75, 63, 0.15)'
              }
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Avatar sx={{
                  width: isReply ? 32 : 40,
                  height: isReply ? 32 : 40,
                  background: isReply 
                    ? 'linear-gradient(135deg, #fbd36b, #f9c74f)'
                    : 'linear-gradient(135deg, #2f4b3f, #3d5f51)',
                  color: 'white',
                  fontSize: isReply ? '0.9rem' : '1rem',
                  fontWeight: 600
                }}>
                  {comment.author_name ? comment.author_name.charAt(0).toUpperCase() : '?'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant={isReply ? "body2" : "subtitle1"} 
                    sx={{ 
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600, 
                      color: '#2f4b3f',
                      mb: 0.5
                    }}
                  >
                    {comment.author_name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#6c757d',
                      fontWeight: 400
                    }}
                  >
                    {moment(comment.created_at).locale('th').fromNow()}
                  </Typography>
                </Box>
              </Stack>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2,
                  lineHeight: 1.6,
                  color: '#5a6c57',
                  fontSize: isReply ? '0.9rem' : '1rem'
                }}
              >
                {comment.content}
              </Typography>
              
              <Stack direction="row" spacing={2} alignItems="center">
                {user && (
                  <Button
                    size="small"
                    startIcon={<ReplyIcon />}
                    onClick={() => setReplyingTo({ ...replyingTo, [postId]: comment.id })}
                    sx={{ 
                      fontSize: '0.8rem',
                      borderRadius: '0.5rem',
                      background: 'rgba(247, 245, 243, 0.8)',
                      color: '#5a6c57',
                      border: '1px solid rgba(47, 75, 63, 0.1)',
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                        color: 'white',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 0.25rem 0.75rem rgba(249, 199, 79, 0.3)'
                      }
                    }}
                  >
                    ตอบกลับ
                  </Button>
                )}
              </Stack>
              
              {/* Reply Form */}
              {replyingTo[postId] === comment.id && (
                <Box component="form" sx={{ mt: 2 }} onSubmit={e => { e.preventDefault(); handleReply(postId, comment.id); }}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      placeholder="เขียนตอบกลับ..."
                      value={replyText[comment.id] || ''}
                      onChange={e => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                      disabled={commentLoading}
                      fullWidth
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      disabled={commentLoading || !(replyText[comment.id]?.trim())}
                      sx={{ minWidth: 40 }}
                    >
                      {commentLoading ? <CircularProgress size={16} /> : <SendIcon fontSize="small" />}
                    </Button>
                  </Stack>
                </Box>
              )}
            </Paper>
            
            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {renderComments(comment.replies, postId, level + 1)}
              </Box>
            )}
          </Box>
        </Box>
      );
    });
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
            กระดานสนทนา
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
            พื้นที่แบ่งปันความคิดเห็นและประสบการณ์ระหว่างศิษย์เก่า เชื่อมต่อและสร้างชุมชนแห่งการเรียนรู้
          </Typography>
          
          {/* Hero Icon */}
          <Box sx={{ 
            fontSize: { xs: '8rem', md: '12rem' }, 
            color: 'rgba(249, 199, 79, 0.3)',
            mb: 2
          }}>
            <ChatBubbleIcon sx={{ fontSize: 'inherit' }} />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Error Alert - Furni Style */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: '0.75rem',
              boxShadow: '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)',
              borderLeft: '4px solid #f9c74f',
              fontWeight: 500,
              backgroundColor: 'rgba(249, 199, 79, 0.1)',
              color: '#2a3b3d'
            }}
          >
            {error}
          </Alert>
        )}

        {/* Loading State - Furni Style */}
        {loading ? (
          <Stack spacing={4}>
            {[...Array(3)].map((_, index) => (
              <Card 
                key={index}
                elevation={0}
                sx={{
                  background: 'white',
                  border: '1px solid #e9ecef',
                  borderRadius: '1.5rem',
                  boxShadow: '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)',
                  overflow: 'hidden'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200px 100%',
                        animation: 'shimmer 1.5s infinite'
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          height: 20,
                          width: '40%',
                          borderRadius: '0.5rem',
                          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                          backgroundSize: '200px 100%',
                          animation: 'shimmer 1.5s infinite',
                          mb: 1
                        }}
                      />
                      <Box
                        sx={{
                          height: 16,
                          width: '25%',
                          borderRadius: '0.5rem',
                          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                          backgroundSize: '200px 100%',
                          animation: 'shimmer 1.5s infinite'
                        }}
                      />
                    </Box>
                  </Stack>
                  <Box
                    sx={{
                      height: 24,
                      width: '80%',
                      borderRadius: '0.5rem',
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200px 100%',
                      animation: 'shimmer 1.5s infinite',
                      mb: 2
                    }}
                  />
                  <Box
                    sx={{
                      height: 60,
                      width: '100%',
                      borderRadius: '0.5rem',
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200px 100%',
                      animation: 'shimmer 1.5s infinite'
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : posts.length === 0 ? (
          /* Empty State - Furni Style */
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
              <ChatBubbleIcon sx={{ fontSize: 60, color: '#f9c74f' }} />
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
              ยังไม่มีโพสต์
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#6c757d',
                fontWeight: 400,
                maxWidth: '400px',
                mx: 'auto',
                mb: 4
              }}
            >
              มาเริ่มพูดคุยกันเป็นคนแรก! แบ่งปันความคิดเห็นและประสบการณ์ของคุณ
            </Typography>
          </Box>
        ) : (
          /* Posts List - ธีมเหมือนหน้าข่าวสาร */
          <Stack spacing={3} sx={{ animation: 'fadeIn 0.6s ease-out' }}>
            {posts.map((post, index) => (
              <Card 
                key={post.id} 
                elevation={0} 
                sx={{
                  borderRadius: '1.25rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(47, 75, 63, 0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 1.5rem 3rem rgba(47, 75, 63, 0.12)',
                    borderColor: '#f9c74f',
                    '& .post-content': {
                      color: '#2f4b3f'
                    },
                    '& .author-avatar': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 0.5rem 1rem rgba(249, 199, 79, 0.3)'
                    }
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Post Header - Furni Modern Design */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={3}>
                      <Avatar 
                        className="author-avatar"
                        sx={{
                          width: 56,
                          height: 56,
                          background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '1.25rem',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 0.25rem 0.75rem rgba(249, 199, 79, 0.2)'
                        }}
                      >
                        {post.author_name ? post.author_name.charAt(0).toUpperCase() : <PersonIcon />}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 600, 
                            color: '#2f4b3f',
                            mb: 0.5
                          }}
                        >
                          {post.author_name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#6c757d',
                            fontWeight: 400,
                            letterSpacing: '0.025em'
                          }}
                        >
                          {moment(post.created_at).locale('th').fromNow()}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    {/* Post Menu - Furni Modern Style */}
                    {user && user.id === post.user_id && (
                      <>
                        <IconButton
                          data-post-id={post.id}
                          onClick={(e) => {
                            setShowMoreMenu(showMoreMenu === post.id ? null : post.id);
                          }}
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '0.75rem',
                            background: 'rgba(247, 245, 243, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(47, 75, 63, 0.1)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            color: '#6c757d',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                              color: 'white',
                              transform: 'translateY(-2px) scale(1.05)',
                              boxShadow: '0 0.75rem 1.5rem rgba(249, 199, 79, 0.3)',
                              borderColor: '#f9c74f'
                            },
                            '&:active': {
                              transform: 'translateY(0) scale(0.98)'
                            }
                          }}
                        >
                          <MoreVertIcon sx={{ 
                            fontSize: 20,
                            transition: 'all 0.3s ease'
                          }} />
                        </IconButton>
                        <Menu
                          anchorEl={showMoreMenu === post.id ? document.querySelector(`[data-post-id="${post.id}"]`) : null}
                          open={showMoreMenu === post.id}
                          onClose={() => setShowMoreMenu(null)}
                          PaperProps={{
                            sx: {
                              borderRadius: 3,
                              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                              border: '1px solid #e2e8f0',
                              minWidth: 180,
                              overflow: 'hidden',
                              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                            }
                          }}
                          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                          <MenuItem 
                            onClick={() => handleOpenEditModal(post)}
                            sx={{
                              py: 1.5,
                              px: 2,
                              borderRadius: 0,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                '& .MuiSvgIcon-root': {
                                  color: 'white'
                                }
                              }
                            }}
                          >
                            <EditIcon sx={{ 
                              mr: 2, 
                              fontSize: 20,
                              color: '#667eea',
                              transition: 'color 0.3s ease'
                            }} />
                            <Typography variant="body2" fontWeight={500}>
                              แก้ไขโพสต์
                            </Typography>
                          </MenuItem>
                          <Divider sx={{ mx: 1, bgcolor: '#e2e8f0' }} />
                          <MenuItem 
                            onClick={() => setShowDeleteModal(post.id)}
                            sx={{
                              py: 1.5,
                              px: 2,
                              borderRadius: 0,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                color: 'white',
                                '& .MuiSvgIcon-root': {
                                  color: 'white'
                                }
                              }
                            }}
                          >
                            <DeleteIcon sx={{ 
                              mr: 2, 
                              fontSize: 20,
                              color: '#ef4444',
                              transition: 'color 0.3s ease'
                            }} />
                            <Typography variant="body2" fontWeight={500}>
                              ลบโพสต์
                            </Typography>
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </Stack>

                  {/* Post Content - Furni Modern Design */}
                  <Typography 
                    variant="h5" 
                    className="post-content"
                    sx={{ 
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: '#2a3b3d',
                      mb: 2,
                      lineHeight: 1.4,
                      letterSpacing: '-0.025em',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 3, 
                      lineHeight: 1.7,
                      color: '#5a6c57',
                      fontSize: '1.1rem',
                      fontWeight: 400,
                      letterSpacing: '0.025em'
                    }}
                  >
                    {post.content}
                  </Typography>

                  {/* Post Image - Enhanced with Furni styling */}
                  {post.image_url && (
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                      <Box
                        component="img"
                        src={`http://localhost:5000${post.image_url}`}
                        alt="Post"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 400,
                          objectFit: 'cover',
                          borderRadius: '1rem',
                          boxShadow: '0 0.75rem 2rem rgba(47, 75, 63, 0.15)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: '0 1.5rem 3rem rgba(47, 75, 63, 0.2)'
                          }
                        }}
                      />
                    </Box>
                  )}
                </CardContent>

                {/* Card Actions - Furni Modern Style */}
                <CardActions sx={{ px: 4, pb: 4, pt: 0 }}>
                  <Button
                    startIcon={<CommentIcon />}
                    onClick={() => toggleComments(post.id)}
                    sx={{ 
                      borderRadius: '0.75rem',
                      background: 'rgba(247, 245, 243, 0.5)',
                      border: '1px solid rgba(47, 75, 63, 0.1)',
                      color: '#5a6c57',
                      fontWeight: 500,
                      px: 3,
                      py: 1.5,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                        color: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 0.5rem 1rem rgba(249, 199, 79, 0.3)',
                        borderColor: '#f9c74f'
                      }
                    }}
                  >
                    <Badge 
                      badgeContent={post.comment_count} 
                      sx={{
                        '& .MuiBadge-badge': {
                          background: 'linear-gradient(135deg, #2f4b3f, #3d5f51)',
                          color: 'white',
                          fontWeight: 600
                        }
                      }}
                    >
                      ความคิดเห็น
                    </Badge>
                  </Button>
                </CardActions>

                {/* Comments Section - Enhanced Design */}
                <Collapse in={showComments[post.id]}>
                  <Box sx={{ px: 4, pb: 4 }}>
                    <Paper sx={{ 
                      p: 3, 
                      background: 'linear-gradient(135deg, rgba(247, 245, 243, 0.8), rgba(255, 255, 255, 0.9))',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '1rem',
                      border: '1px solid rgba(47, 75, 63, 0.08)'
                    }}>
                      {/* Comments List */}
                      {comments[post.id]?.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          ยังไม่มีความคิดเห็น
                        </Typography>
                      ) : (
                        <Stack spacing={1} sx={{ mb: 2 }}>
                          {comments[post.id] && renderComments(comments[post.id], post.id)}
                        </Stack>
                      )}

                      {/* Add Comment Form */}
                      {user ? (
                        <Box component="form" onSubmit={(e) => {
                          e.preventDefault();
                          handleAddComment(post.id);
                        }}>
                          <Stack direction="row" spacing={1}>
                            <TextField
                              size="small"
                              placeholder="เพิ่มความคิดเห็น..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              disabled={commentLoading}
                              fullWidth
                            />
                            <Button
                              type="submit"
                              variant="contained"
                              disabled={commentLoading || !newComment.trim()}
                              sx={{ minWidth: 40 }}
                            >
                              {commentLoading ? <CircularProgress size={20} /> : <SendIcon />}
                            </Button>
                          </Stack>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          กรุณาเข้าสู่ระบบเพื่อแสดงความคิดเห็น
                        </Typography>
                      )}
                    </Paper>
                  </Box>
                </Collapse>
              </Card>
            ))}
          </Stack>
        )}

        {/* Create Post Dialog - Furni Modern Theme */}
        <Dialog 
          open={showModal} 
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
          PaperProps={{ 
            sx: { 
              borderRadius: '1.5rem',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(247, 245, 243, 0.9))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(47, 75, 63, 0.08)',
              boxShadow: '0 1.5rem 3rem rgba(47, 75, 63, 0.15)',
              overflow: 'hidden'
            } 
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #2f4b3f, #243d33)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 3,
            px: 4,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: '60%',
              background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1.5" fill="%23f9c74f" opacity="0.3"/><circle cx="80" cy="30" r="1" fill="%23f9c74f" opacity="0.2"/><circle cx="40" cy="70" r="1.2" fill="%23f9c74f" opacity="0.4"/></svg>') repeat`,
            }
          }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}>
              <AddIcon sx={{ fontSize: '1.5rem', color: 'white' }} />
            </Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                zIndex: 2
              }}
            >
              สร้างโพสต์ใหม่
            </Typography>
          </DialogTitle>
          
          <Box component="form" onSubmit={handleSubmit}>
            <DialogContent sx={{ 
              background: 'linear-gradient(135deg, #f7f5f3, #f0ede8)',
              p: 4 
            }}>
              <Stack spacing={4} sx={{ mt: 2 }}>
                {/* Author Info Card */}
                <Paper sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(247, 245, 243, 0.7))',
                  borderRadius: '1rem',
                  border: '1px solid rgba(47, 75, 63, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3
                }}>
                  <Avatar sx={{
                    width: 56,
                    height: 56,
                    background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1.25rem'
                  }}>
                    {user?.first_name ? user.first_name.charAt(0).toUpperCase() : '?'}
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600, 
                        color: '#2f4b3f',
                        mb: 0.5
                      }}
                    >
                      {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'ผู้ใช้งาน'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      กำลังสร้างโพสต์ใหม่
                    </Typography>
                  </Box>
                </Paper>

                <TextField
                  label="หัวข้อโพสต์"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  error={!!validationError.title}
                  helperText={validationError.title}
                  fullWidth
                  required
                  placeholder="ระบุหัวข้อโพสต์ที่น่าสนใจ..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      fontSize: '1.1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderColor: 'rgba(249, 199, 79, 0.5)'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        borderColor: '#f9c74f',
                        boxShadow: '0 0 0 3px rgba(249, 199, 79, 0.1)'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: '#f9c74f'
                      }
                    }
                  }}
                />
                
                <TextField
                  label="เนื้อหาโพสต์"
                  multiline
                  rows={6}
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  error={!!validationError.content}
                  helperText={validationError.content}
                  fullWidth
                  required
                  placeholder="แบ่งปันความคิดเห็น ประสบการณ์ หรือเรื่องราวของคุณ..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      lineHeight: 1.7,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderColor: 'rgba(249, 199, 79, 0.5)'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        borderColor: '#f9c74f',
                        boxShadow: '0 0 0 3px rgba(249, 199, 79, 0.1)'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: '#f9c74f'
                      }
                    }
                  }}
                />

                {/* Image Upload Section */}
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCameraIcon />}
                      fullWidth
                      sx={{ 
                        py: 2.5,
                        borderRadius: '0.75rem',
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        borderColor: 'rgba(249, 199, 79, 0.4)',
                        color: '#5a6c57',
                        fontWeight: 500,
                        backgroundColor: 'rgba(249, 199, 79, 0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#f9c74f',
                          backgroundColor: 'rgba(249, 199, 79, 0.1)',
                          color: '#f9c74f',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 0.5rem 1rem rgba(249, 199, 79, 0.2)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight={600}>
                          เพิ่มรูปภาพ (ไม่จำเป็น)
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB
                        </Typography>
                      </Box>
                    </Button>
                  </label>
                  
                  {validationError.image && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {validationError.image}
                    </Typography>
                  )}
                </Box>

                {/* Image Preview */}
                {imagePreview && (
                  <Paper 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      borderRadius: '1rem',
                      background: 'linear-gradient(135deg, rgba(249, 199, 79, 0.1), rgba(255, 255, 255, 0.9))',
                      border: '1px solid rgba(249, 199, 79, 0.2)',
                      boxShadow: '0 0.25rem 0.75rem rgba(249, 199, 79, 0.1)'
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        color: '#2f4b3f',
                        mb: 2
                      }}
                    >
                      ตัวอย่างรูปภาพ:
                    </Typography>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{
                        maxHeight: 250,
                        maxWidth: '100%',
                        borderRadius: '0.75rem',
                        boxShadow: '0 0.5rem 1rem rgba(47, 75, 63, 0.15)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}
                    />
                    <Button
                      startIcon={<CloseIcon />}
                      onClick={() => {
                        setImagePreview(null);
                        setNewPost({...newPost, image: null});
                      }}
                      sx={{ 
                        mt: 2,
                        borderRadius: '0.5rem',
                        color: '#6c757d',
                        fontWeight: 500,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#f44336',
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      ลบรูปภาพ
                    </Button>
                  </Paper>
                )}
              </Stack>
            </DialogContent>
            
            <Divider sx={{ borderColor: 'rgba(47, 75, 63, 0.08)' }} />
            
            <DialogActions sx={{ 
              p: 4, 
              background: 'linear-gradient(135deg, rgba(247, 245, 243, 0.8), rgba(255, 255, 255, 0.9))',
              gap: 2
            }}>
              <Button 
                onClick={handleCloseModal} 
                sx={{ 
                  borderRadius: '0.75rem',
                  px: 4,
                  py: 1.5,
                  fontWeight: 500,
                  color: '#5a6c57',
                  border: '1px solid rgba(47, 75, 63, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#5a6c57',
                    backgroundColor: 'rgba(90, 108, 87, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                sx={{ 
                  borderRadius: '0.75rem',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                  color: 'white',
                  boxShadow: '0 0.25rem 0.75rem rgba(249, 199, 79, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f8b42e, #f9c74f)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 0.5rem 1.5rem rgba(249, 199, 79, 0.4)'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #e0e0e0, #f0f0f0)',
                    color: '#9e9e9e',
                    boxShadow: 'none'
                  }
                }}
              >
                {submitting ? 'กำลังสร้างโพสต์...' : 'สร้างโพสต์'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!showDeleteModal} onClose={() => setShowDeleteModal(null)}>
          <DialogTitle sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} />
            ยืนยันการลบโพสต์
          </DialogTitle>
          <DialogContent>
            <Typography>
              คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้? หากลบแล้วจะไม่สามารถกู้คืนได้
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteModal(null)}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleDeletePost}
              color="error"
              variant="contained"
              disabled={deleting}
              startIcon={deleting ? <CircularProgress size={20} /> : <DeleteIcon />}
            >
              ลบโพสต์
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Post Dialog - Furni Modern Theme */}
        <Dialog 
          open={!!showEditModal} 
          onClose={() => setShowEditModal(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{ 
            sx: { 
              borderRadius: '1.5rem',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(247, 245, 243, 0.9))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(47, 75, 63, 0.08)',
              boxShadow: '0 1.5rem 3rem rgba(47, 75, 63, 0.15)',
              overflow: 'hidden'
            } 
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #2f4b3f, #243d33)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 3,
            px: 4,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: '60%',
              background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1.5" fill="%23f9c74f" opacity="0.3"/><circle cx="80" cy="30" r="1" fill="%23f9c74f" opacity="0.2"/><circle cx="40" cy="70" r="1.2" fill="%23f9c74f" opacity="0.4"/></svg>') repeat`,
            }
          }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}>
              <EditIcon sx={{ fontSize: '1.5rem', color: 'white' }} />
            </Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                zIndex: 2
              }}
            >
              แก้ไขโพสต์
            </Typography>
          </DialogTitle>
          
          <Box component="form" onSubmit={handleEditPost}>
            <DialogContent sx={{ 
              background: 'linear-gradient(135deg, #f7f5f3, #f0ede8)',
              p: 4 
            }}>
              <Stack spacing={4} sx={{ mt: 2 }}>
                <TextField
                  label="หัวข้อโพสต์"
                  value={editPost.title}
                  onChange={e => setEditPost({ ...editPost, title: e.target.value })}
                  fullWidth
                  required
                  placeholder="แก้ไขหัวข้อโพสต์..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      fontSize: '1.1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderColor: 'rgba(249, 199, 79, 0.5)'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        borderColor: '#f9c74f',
                        boxShadow: '0 0 0 3px rgba(249, 199, 79, 0.1)'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: '#f9c74f'
                      }
                    }
                  }}
                />
                
                <TextField
                  label="เนื้อหาโพสต์"
                  multiline
                  rows={6}
                  value={editPost.content}
                  onChange={e => setEditPost({ ...editPost, content: e.target.value })}
                  fullWidth
                  required
                  placeholder="แก้ไขเนื้อหาโพสต์..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      lineHeight: 1.7,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderColor: 'rgba(249, 199, 79, 0.5)'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        borderColor: '#f9c74f',
                        boxShadow: '0 0 0 3px rgba(249, 199, 79, 0.1)'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: '#f9c74f'
                      }
                    }
                  }}
                />

                {/* Image Upload Section */}
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="edit-image-upload"
                    type="file"
                    onChange={e => {
                      const file = e.target.files[0];
                      setEditPost({ ...editPost, image: file });
                      setEditImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                  <label htmlFor="edit-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCameraIcon />}
                      fullWidth
                      sx={{ 
                        py: 2.5,
                        borderRadius: '0.75rem',
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        borderColor: 'rgba(249, 199, 79, 0.4)',
                        color: '#5a6c57',
                        fontWeight: 500,
                        backgroundColor: 'rgba(249, 199, 79, 0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#f9c74f',
                          backgroundColor: 'rgba(249, 199, 79, 0.1)',
                          color: '#f9c74f',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 0.5rem 1rem rgba(249, 199, 79, 0.2)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight={600}>
                          เปลี่ยนรูปภาพ
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB
                        </Typography>
                      </Box>
                    </Button>
                  </label>
                </Box>

                {editImagePreview && (
                  <Paper sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #f7f5f3 60%, #f0ede8 100%)',
                    borderRadius: '1.5rem',
                    border: '1px solid rgba(47, 75, 63, 0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(8px)'
                  }}>
                    <Typography 
                      variant="subtitle2" 
                      gutterBottom
                      sx={{
                        color: '#2f4b3f',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        marginBottom: 2
                      }}
                    >
                      ตัวอย่างรูปภาพ:
                    </Typography>
                    <Box
                      component="img"
                      src={editImagePreview}
                      alt="Preview"
                      sx={{
                        maxHeight: 200,
                        maxWidth: '100%',
                        borderRadius: '1.5rem',
                        boxShadow: '0 8px 24px rgba(47, 75, 63, 0.2)',
                        border: '2px solid rgba(249, 199, 79, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 12px 32px rgba(47, 75, 63, 0.3)'
                        }
                      }}
                    />
                    <Button
                      startIcon={<CloseIcon />}
                      onClick={() => {
                        setEditImagePreview(null);
                        setEditPost({ ...editPost, image: null });
                        setRemoveImage(true);
                      }}
                      sx={{ 
                        mt: 2,
                        borderRadius: '1.5rem',
                        background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                        color: 'white',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        border: '2px solid transparent',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #ee5a52, #d63031)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(238, 90, 82, 0.4)'
                        }
                      }}
                    >
                      ลบรูปภาพ
                    </Button>
                  </Paper>
                )}
              </Stack>
            </DialogContent>
            
            <DialogActions sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #f7f5f3 60%, #f0ede8 100%)',
              backdropFilter: 'blur(8px)',
              borderTop: '1px solid rgba(47, 75, 63, 0.1)',
              borderBottomLeftRadius: '1.5rem',
              borderBottomRightRadius: '1.5rem',
              gap: 2
            }}>
              <Button 
                onClick={() => setShowEditModal(null)} 
                sx={{ 
                  borderRadius: '1.5rem',
                  color: '#2f4b3f',
                  border: '2px solid #2f4b3f',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(47, 75, 63, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(47, 75, 63, 0.2)'
                  }
                }}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} sx={{color: 'white'}} /> : <EditIcon />}
                sx={{ 
                  borderRadius: '1.5rem',
                  background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                  color: '#2f4b3f',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  border: '2px solid transparent',
                  boxShadow: '0 4px 12px rgba(249, 199, 79, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #fbd36b, #f9c74f)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(249, 199, 79, 0.4)'
                  },
                  '&:disabled': {
                    background: 'rgba(249, 199, 79, 0.5)',
                    color: 'rgba(47, 75, 63, 0.7)'
                  }
                }}
              >
                บันทึก
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* Floating Action Button - Furni Modern Style */}
        {user && (
          <Fab
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
              color: 'white',
              boxShadow: '0 1rem 2rem rgba(249, 199, 79, 0.4)',
              animation: 'float 3s ease-in-out infinite',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f8b42e, #f9c74f)',
                transform: 'scale(1.15) translateY(-5px)',
                boxShadow: '0 1.5rem 3rem rgba(249, 199, 79, 0.5)',
                animation: 'none'
              },
              '&:active': {
                transform: 'scale(1.05) translateY(-2px)'
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.75rem',
                fontWeight: 600
              }
            }}
            onClick={() => setShowModal(true)}
          >
            <AddIcon />
          </Fab>
        )}
      </Container>
    </Box>
  );
}

export default Forum;
