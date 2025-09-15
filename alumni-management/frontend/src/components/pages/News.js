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
  useMediaQuery,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  TrendingUp as TrendingIcon,
  NewReleases as NewIcon,
  Article as ArticleIcon,
  Share as ShareIcon
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
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f7f5f3, #f0ede8)',
        py: 4 
      }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Paper sx={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
                  <Skeleton variant="rectangular" height={200} />
                  <Box sx={{ p: 2 }}>
                    <Skeleton variant="text" width="80%" height={32} />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f7f5f3, #f0ede8)',
      fontFamily: 'Source Sans Pro, sans-serif'
    }}>
      {/* Hero Section - Furni Style */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2f4b3f 0%, #243d33 100%)',
          color: '#ffffff',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Furni-style decorative elements */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          bottom: 0, 
          left: '50%',
          background: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><circle cx=\'20\' cy=\'20\' r=\'1.5\' fill=\'%23f9c74f\' opacity=\'0.3\'/><circle cx=\'80\' cy=\'30\' r=\'1\' fill=\'%23f9c74f\' opacity=\'0.2\'/><circle cx=\'40\' cy=\'70\' r=\'1.2\' fill=\'%23f9c74f\' opacity=\'0.4\'/><circle cx=\'90\' cy=\'80\' r=\'0.8\' fill=\'%23f9c74f\' opacity=\'0.3\'/></svg>") repeat',
          backgroundSize: '100px 100px',
          animation: 'float 20s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' }
          }
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                lineHeight: 1.2,
                mb: 2,
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              ข่าวสารและประกาศ
              <Box component="span" sx={{ 
                color: '#f9c74f', 
                display: 'block',
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}>
                มหาวิทยาลัยราชภัฏมหาสารคาม
              </Box>
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4, 
                opacity: 0.9,
                fontSize: { xs: '1.1rem', md: '1.2rem' },
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              ติดตามข่าวสาร กิจกรรม และประกาศสำคัญจากมหาวิทยาลัย
            </Typography>
            
            {/* News Icon */}
            <Box sx={{ 
              fontSize: { xs: '6rem', md: '8rem' }, 
              color: 'rgba(249, 199, 79, 0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 2
            }}>
              <ArticleIcon sx={{ fontSize: 'inherit' }} />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Search Bar - Furni Style */}
        <Paper
          elevation={0}
          sx={{
            mb: 6,
            p: 2,
            borderRadius: '1.5rem',
            background: '#ffffff',
            border: '1px solid #e9ecef',
            boxShadow: '0 0.5rem 1rem rgba(47, 75, 63, 0.15)',
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          <TextField
            placeholder="ค้นหาข่าวสาร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#f9c74f' }} />
                </InputAdornment>
              ),
              sx: { 
                borderRadius: '1rem',
                border: 'none',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                fontSize: '1rem'
              }
            }}
          />
        </Paper>

        {/* Featured News - Furni Style */}
        {!searchTerm && featuredNews.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Typography 
              variant="h4" 
              sx={{
                fontWeight: 700,
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                color: '#2f4b3f',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              <Box sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <TrendingIcon sx={{ color: '#ffffff', fontSize: '1.5rem' }} />
              </Box>
              ข่าวเด่น
            </Typography>
            <Grid container spacing={4}>
              {featuredNews.map((item, index) => (
                <Grid item xs={12} md={index === 0 ? 12 : 6} key={item.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: '1.5rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: '1px solid #e9ecef',
                      background: '#ffffff',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 1rem 2rem rgba(47, 75, 63, 0.25)',
                        borderColor: '#f9c74f'
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
                        sx={{ height: index === 0 ? 350 : 250, objectFit: 'cover' }}
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
                          background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                          color: '#ffffff',
                          fontWeight: 600,
                          borderRadius: '0.75rem'
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        variant="h5" 
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: '#2f4b3f',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{
                          color: '#6c757d',
                          mb: 3,
                          lineHeight: 1.6
                        }}
                      >
                        {item.content?.substring(0, index === 0 ? 200 : 120)}...
                      </Typography>
                      <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#adb5bd' }}>
                          <PersonIcon fontSize="small" />
                          <Typography variant="body2" fontWeight={500}>
                            {item.author_name || 'Admin'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#adb5bd' }}>
                          <TimeIcon fontSize="small" />
                          <Typography variant="body2" fontWeight={500}>
                            {moment(item.created_at).locale('th').format('LL')}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* All News - Furni Style */}
        <Box>
          <Typography 
            variant="h4" 
            sx={{
              fontWeight: 700,
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              color: '#2f4b3f',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}>
              <NewIcon sx={{ color: '#ffffff', fontSize: '1.5rem' }} />
            </Box>
            {searchTerm ? `ผลการค้นหา "${searchTerm}"` : 'ข่าวสารทั้งหมด'}
          </Typography>

          {error && (
            <Paper sx={{ 
              textAlign: 'center', 
              py: 6,
              borderRadius: '1.5rem',
              border: '1px solid #e9ecef',
              background: '#ffffff'
            }}>
              <Typography color="error" variant="h6">
                {error}
              </Typography>
            </Paper>
          )}

          {!loading && currentNews.length === 0 && (
            <Paper sx={{ 
              textAlign: 'center', 
              py: 8,
              borderRadius: '1.5rem',
              border: '1px solid #e9ecef',
              background: '#ffffff'
            }}>
              <Typography variant="h5" sx={{ color: '#6c757d', mb: 2 }}>
                {searchTerm ? 'ไม่พบข่าวสารที่ค้นหา' : 'ยังไม่มีข่าวสาร'}
              </Typography>
              <Typography sx={{ color: '#adb5bd' }}>
                {searchTerm ? 'ลองค้นหาด้วยคำอื่น' : 'กรุณารอการอัปเดตข่าวสารใหม่'}
              </Typography>
            </Paper>
          )}

          <Grid container spacing={4}>
            {currentNews.map((item) => (
              <Grid item xs={12} sm={6} lg={4} key={item.id}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e9ecef',
                    background: '#ffffff',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 1rem 2rem rgba(47, 75, 63, 0.25)',
                      borderColor: '#f9c74f'
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
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: '#2f4b3f',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: '#6c757d',
                        mb: 3,
                        flexGrow: 1,
                        lineHeight: 1.6
                      }}
                    >
                      {item.content?.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#adb5bd' }}>
                        <TimeIcon fontSize="small" />
                        <Typography variant="caption" fontWeight={500}>
                          {moment(item.created_at).locale('th').format('DD MMM YYYY')}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        sx={{
                          background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                          color: '#ffffff',
                          borderRadius: '0.75rem',
                          fontWeight: 600,
                          '&:hover': {
                            background: '#f8b42e',
                            transform: 'translateY(-2px)'
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowDetail(item);
                        }}
                      >
                        อ่านต่อ
                      </Button>
                    </Box>
                  </CardContent>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Pagination - Furni Style */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '1.5rem',
                  border: '1px solid #e9ecef',
                  background: '#ffffff'
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#2f4b3f',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'rgba(249, 199, 79, 0.1)',
                      },
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                        color: '#ffffff',
                        '&:hover': {
                          background: '#f8b42e',
                        }
                      }
                    }
                  }}
                />
              </Paper>
            </Box>
          )}
        </Box>
      </Container>

      {/* News Detail Modal - Furni Style */}
      <Dialog
        open={showModal && modalNews}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: '1.5rem',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #2f4b3f 0%, #243d33 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3
          }}
        >
          <Typography 
            variant="h6" 
            sx={{
              fontWeight: 600,
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            {modalNews?.title}
          </Typography>
          <IconButton
            onClick={handleCloseModal}
            sx={{ 
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)'
              }
            }}
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
                  maxHeight: 400,
                  borderRadius: '1rem',
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
            <Typography 
              variant="body1" 
              sx={{ 
                whiteSpace: 'pre-line', 
                lineHeight: 1.7, 
                mb: 3,
                color: '#2a3b3d'
              }}
            >
              {modalNews?.content}
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#6c757d' }}>
                <PersonIcon fontSize="small" />
                <Typography variant="body2" fontWeight={500}>
                  {modalNews?.author_name || 'Admin'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#6c757d' }}>
                <TimeIcon fontSize="small" />
                <Typography variant="body2" fontWeight={500}>
                  {modalNews && moment(modalNews.created_at).locale('th').format('LLL')}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={handleCloseModal} 
            variant="outlined"
            sx={{
              borderColor: '#2f4b3f',
              color: '#2f4b3f',
              borderRadius: '0.75rem',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#2f4b3f',
                background: 'rgba(47, 75, 63, 0.05)'
              }
            }}
          >
            ปิด
          </Button>
          <Button 
            startIcon={<ShareIcon />}
            sx={{
              background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
              color: '#ffffff',
              borderRadius: '0.75rem',
              fontWeight: 600,
              '&:hover': {
                background: '#f8b42e',
                transform: 'translateY(-2px)'
              }
            }}
          >
            แชร์
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default News;
