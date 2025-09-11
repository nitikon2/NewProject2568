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
  Badge
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
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import BackgroundLayout from '../layout/BackgroundLayout';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/th';

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
    return commentsArr.map(comment => {
      const isReply = level > 0;
      return (
        <Box key={comment.id} sx={{ 
          display: 'flex', 
          mb: 1,
          ml: isReply ? 3 : 0
        }}>
          {isReply && (
            <Box sx={{ 
              width: 2, 
              bgcolor: 'divider', 
              mr: 2, 
              borderRadius: 1 
            }} />
          )}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{
              p: 2,
              backgroundColor: isReply ? 'grey.50' : 'background.paper',
              borderRadius: 2,
              border: isReply ? 1 : 0,
              borderColor: 'divider'
            }}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary">
                {comment.author_name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {comment.content}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {moment(comment.created_at).locale('th').fromNow()}
                </Typography>
                {user && (
                  <Button
                    size="small"
                    startIcon={<ReplyIcon />}
                    onClick={() => setReplyingTo({ ...replyingTo, [postId]: comment.id })}
                    sx={{ fontSize: '0.75rem' }}
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
            กระดานสนทนา
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            พื้นที่แบ่งปันความคิดเห็นและประสบการณ์ระหว่างศิษย์เก่า
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State - เหมือนหน้าข่าวสาร */}
        {loading ? (
          <Stack spacing={3}>
            {[...Array(3)].map((_, index) => (
              <Card key={index} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'grey.200' }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ width: '60%', height: 20, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
                      <Box sx={{ width: '40%', height: 16, bgcolor: 'grey.200', borderRadius: 1 }} />
                    </Box>
                  </Stack>
                  <Box sx={{ width: '90%', height: 16, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
                  <Box sx={{ width: '80%', height: 16, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
                  <Box sx={{ width: '70%', height: 16, bgcolor: 'grey.200', borderRadius: 1 }} />
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : posts.length === 0 ? (
          /* Empty State */
          <Box textAlign="center" py={8}>
            <ForumIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" color="text.secondary" sx={{ mb: 1 }}>
              ยังไม่มีโพสต์ในขณะนี้
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              มาเริ่มพูดคุยกันเป็นคนแรก!
            </Typography>
            {user && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowModal(true)}
                sx={{ 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                  }
                }}
              >
                สร้างโพสต์แรก
              </Button>
            )}
          </Box>
        ) : (
          /* Posts List - ธีมเหมือนหน้าข่าวสาร */
          <Stack spacing={3}>
            {posts.map(post => (
              <Card key={post.id} elevation={0} sx={{
                borderRadius: 4,
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  borderColor: '#667eea'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Post Header - ธีมเหมือนหน้าข่าวสาร */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{
                        width: 48,
                        height: 48,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                      }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600} color="primary">
                          {post.author_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {moment(post.created_at).locale('th').fromNow()}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    {/* Post Menu */}
                    {user && user.id === post.user_id && (
                      <>
                        <IconButton
                          onClick={(e) => {
                            setShowMoreMenu(showMoreMenu === post.id ? null : post.id);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={showMoreMenu === post.id ? document.querySelector(`[data-post-id="${post.id}"]`) : null}
                          open={showMoreMenu === post.id}
                          onClose={() => setShowMoreMenu(null)}
                        >
                          <MenuItem onClick={() => handleOpenEditModal(post)}>
                            <EditIcon sx={{ mr: 1 }} />
                            แก้ไขโพสต์
                          </MenuItem>
                          <MenuItem 
                            onClick={() => setShowDeleteModal(post.id)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon sx={{ mr: 1 }} />
                            ลบโพสต์
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </Stack>

                  {/* Post Content */}
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {post.content}
                  </Typography>

                  {/* Post Image */}
                  {post.image_url && (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <Box
                        component="img"
                        src={`http://localhost:5000${post.image_url}`}
                        alt="Post"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 400,
                          objectFit: 'cover',
                          borderRadius: 2,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                        }}
                      />
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ px: 3, pb: 3 }}>
                  <Button
                    startIcon={<CommentIcon />}
                    onClick={() => toggleComments(post.id)}
                    sx={{ borderRadius: 3 }}
                  >
                    <Badge badgeContent={post.comment_count} color="primary">
                      ความคิดเห็น
                    </Badge>
                  </Button>
                </CardActions>

                {/* Comments Section */}
                <Collapse in={showComments[post.id]}>
                  <Box sx={{ px: 3, pb: 3 }}>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
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

        {/* Create Post Dialog */}
        <Dialog 
          open={showModal} 
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4 } }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <AddIcon />
            สร้างโพสต์ใหม่
          </DialogTitle>
          
          <Box component="form" onSubmit={handleSubmit}>
            <DialogContent sx={{ bgcolor: '#f8fafc', p: 3 }}>
              <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField
                  label="หัวข้อ"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  error={!!validationError.title}
                  helperText={validationError.title}
                  fullWidth
                  required
                />
                
                <TextField
                  label="เนื้อหา"
                  multiline
                  rows={5}
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  error={!!validationError.content}
                  helperText={validationError.content}
                  fullWidth
                  required
                />

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
                      sx={{ py: 2, borderRadius: 2 }}
                    >
                      เพิ่มรูปภาพ (ไม่จำเป็น)
                    </Button>
                  </label>
                  
                  {validationError.image && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {validationError.image}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB
                  </Typography>
                </Box>

                {imagePreview && (
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      ตัวอย่างรูปภาพ:
                    </Typography>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{
                        maxHeight: 200,
                        maxWidth: '100%',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Button
                      startIcon={<CloseIcon />}
                      onClick={() => {
                        setImagePreview(null);
                        setNewPost({...newPost, image: null});
                      }}
                      sx={{ mt: 1 }}
                    >
                      ลบรูปภาพ
                    </Button>
                  </Paper>
                )}
              </Stack>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, bgcolor: 'white', borderTop: '1px solid #e2e8f0' }}>
              <Button onClick={handleCloseModal} sx={{ borderRadius: 3 }}>
                ยกเลิก
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                sx={{ 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                  }
                }}
              >
                โพสต์
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

        {/* Edit Post Dialog */}
        <Dialog 
          open={!!showEditModal} 
          onClose={() => setShowEditModal(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4 } }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #e0e7ff 60%, #fff 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <EditIcon color="primary" />
            แก้ไขโพสต์
          </DialogTitle>
          
          <Box component="form" onSubmit={handleEditPost}>
            <DialogContent sx={{ background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)' }}>
              <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField
                  label="หัวข้อ"
                  value={editPost.title}
                  onChange={e => setEditPost({ ...editPost, title: e.target.value })}
                  fullWidth
                  required
                />
                
                <TextField
                  label="เนื้อหา"
                  multiline
                  rows={5}
                  value={editPost.content}
                  onChange={e => setEditPost({ ...editPost, content: e.target.value })}
                  fullWidth
                  required
                />

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
                      sx={{ py: 2, borderRadius: 2 }}
                    >
                      เปลี่ยนรูปภาพ
                    </Button>
                  </label>
                </Box>

                {editImagePreview && (
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      ตัวอย่างรูปภาพ:
                    </Typography>
                    <Box
                      component="img"
                      src={editImagePreview}
                      alt="Preview"
                      sx={{
                        maxHeight: 200,
                        maxWidth: '100%',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Button
                      startIcon={<CloseIcon />}
                      onClick={() => {
                        setEditImagePreview(null);
                        setEditPost({ ...editPost, image: null });
                        setRemoveImage(true);
                      }}
                      sx={{ mt: 1 }}
                    >
                      ลบรูปภาพ
                    </Button>
                  </Paper>
                )}
              </Stack>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, background: 'linear-gradient(135deg, #e0e7ff 60%, #fff 100%)' }}>
              <Button onClick={() => setShowEditModal(null)} sx={{ borderRadius: 3 }}>
                ยกเลิก
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <EditIcon />}
                sx={{ borderRadius: 3 }}
              >
                บันทึก
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* Floating Action Button - ธีมเหมือนหน้าข่าวสาร */}
        {user && (
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                transform: 'scale(1.1)'
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
