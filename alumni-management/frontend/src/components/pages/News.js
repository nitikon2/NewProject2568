import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  TrendingUp as TrendingIcon,
  NewReleases as NewIcon
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/th';

function News() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalNews, setModalNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(9);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5000/api/news');
        const newsData = Array.isArray(response.data) ? response.data : [];
        setNews(newsData);
        setFilteredNews(newsData);
        console.log('Fetched news:', response.data);
      } catch (err) {
        setError('ไม่สามารถโหลดข่าวสารได้');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const filtered = news.filter(item =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNews(filtered);
    setCurrentPage(1);
  }, [searchTerm, news]);

  // Pagination
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);
  const totalPages = Math.ceil(filteredNews.length / newsPerPage);

  const handleShowDetail = (item) => {
    setModalNews(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalNews(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  const featuredNews = news.slice(0, 3);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ borderRadius: 3 }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" width="80%" height={32} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Hero Section */}
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
            ข่าวสารและประกาศ
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            ติดตามข่าวสาร กิจกรรม และประกาศสำคัญจากมหาวิทยาลัยราชภัฏมหาสารคาม
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <TextField
            placeholder="ค้นหาข่าวสาร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ maxWidth: 500, width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 3 }
            }}
          />
        </Box>

        {/* Featured News */}
        {!searchTerm && featuredNews.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h4" 
              fontWeight={700} 
              mb={3} 
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <TrendingIcon sx={{ mr: 1, color: '#ffd700' }} />
              ข่าวเด่น
            </Typography>
            <Grid container spacing={3}>
              {featuredNews.map((item, index) => (
                <Grid item xs={12} md={index === 0 ? 12 : 6} key={item.id}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: '1px solid #e2e8f0',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        borderColor: '#667eea'
                      }
                    }}
                    onClick={() => handleShowDetail(item)}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={
                          item.image_url
                            ? item.image_url.startsWith('http')
                              ? item.image_url
                              : `http://localhost:5000${item.image_url}`
                            : '/images/news-default.jpg'
                        }
                        alt={item.title}
                        sx={{ height: index === 0 ? 300 : 200, objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/news-default.jpg';
                        }}
                      />
                      <Chip
                        icon={<NewIcon />}
                        label="ข่าวเด่น"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          bgcolor: '#ff6b6b',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" fontWeight={600} mb={2} color="primary">
                        {item.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" mb={2}>
                        {item.content?.substring(0, index === 0 ? 200 : 120)}...
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PersonIcon fontSize="small" />
                          <Typography variant="body2">
                            {item.author_name || 'Admin'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimeIcon fontSize="small" />
                          <Typography variant="body2">
                            {moment(item.created_at).locale('th').format('LL')}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* All News */}
        <Box>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            mb={3}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <NewIcon sx={{ mr: 1, color: '#667eea' }} />
            {searchTerm ? `ผลการค้นหา "${searchTerm}"` : 'ข่าวสารทั้งหมด'}
          </Typography>

          {error && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="error" variant="h6">
                {error}
              </Typography>
            </Box>
          )}

          {!loading && currentNews.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" mb={2}>
                {searchTerm ? 'ไม่พบข่าวสารที่ค้นหา' : 'ยังไม่มีข่าวสาร'}
              </Typography>
              <Typography color="text.secondary">
                {searchTerm ? 'ลองค้นหาด้วยคำอื่น' : 'กรุณารอการอัปเดตข่าวสารใหม่'}
              </Typography>
            </Box>
          )}

          <Grid container spacing={3}>
            {currentNews.map((item) => (
              <Grid item xs={12} sm={6} lg={4} key={item.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e2e8f0',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      borderColor: '#667eea'
                    }
                  }}
                  onClick={() => handleShowDetail(item)}
                >
                  <CardMedia
                    component="img"
                    image={
                      item.image_url
                        ? item.image_url.startsWith('http')
                          ? item.image_url
                          : `http://localhost:5000${item.image_url}`
                        : '/images/news-default.jpg'
                    }
                    alt={item.title}
                    sx={{ height: 200, objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/news-default.jpg';
                    }}
                  />
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" fontWeight={600} mb={1} color="primary">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2} sx={{ flexGrow: 1 }}>
                      {item.content?.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        <TimeIcon fontSize="small" />
                        <Typography variant="caption">
                          {moment(item.created_at).locale('th').format('DD MMM YYYY')}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowDetail(item);
                        }}
                      >
                        อ่านต่อ
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          )}
        </Box>
      </Container>

      {/* News Detail Modal */}
      <Dialog
        open={showModal && modalNews}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {modalNews?.title}
          </Typography>
          <IconButton
            onClick={handleCloseModal}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {modalNews?.image_url && (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <CardMedia
                component="img"
                image={
                  modalNews.image_url.startsWith('http')
                    ? modalNews.image_url
                    : `http://localhost:5000${modalNews.image_url}`
                }
                alt={modalNews.title}
                sx={{
                  maxHeight: 350,
                  borderRadius: 2,
                  objectFit: 'cover',
                  width: '100%'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/news-default.jpg';
                }}
              />
            </Box>
          )}
          <Box sx={{ p: 3 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, mb: 3 }}>
              {modalNews?.content}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PersonIcon fontSize="small" />
                <Typography variant="body2">
                  {modalNews?.author_name || 'Admin'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TimeIcon fontSize="small" />
                <Typography variant="body2">
                  {modalNews && moment(modalNews.created_at).locale('th').format('LLL')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal} variant="outlined">
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </Box>

  );
}

export default News;
