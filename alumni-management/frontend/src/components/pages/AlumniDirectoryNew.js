import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Avatar,
  Chip,
  InputAdornment,
  Alert,
  Stack,
  Paper,
  Divider,
  Fade,
  Skeleton,
  Button,
  IconButton,
  Tooltip,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Clear as ClearIcon,
  Group as GroupIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

// Styled Components
const ModernContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  animation: `${fadeInUp} 0.8s ease-out`
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: 'float 6s ease-in-out infinite'
  }
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: theme.spacing(3),
  marginTop: theme.spacing(-4),
  marginBottom: theme.spacing(4),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  zIndex: 10
}));

const AlumniCard = styled(Card)(({ viewmode }) => ({
  height: '100%',
  borderRadius: '20px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 25px 80px rgba(102, 126, 234, 0.25)',
    borderColor: '#667eea',
    '&::before': {
      opacity: 1
    }
  },
  ...(viewmode === 'list' && {
    borderRadius: '16px',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 15px 40px rgba(102, 126, 234, 0.15)'
    }
  })
}));

const FilterButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 600,
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(102, 126, 234, 0.2)',
  '&:hover': {
    background: 'rgba(102, 126, 234, 0.1)',
    borderColor: '#667eea'
  }
}));

function AlumniDirectoryNew() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Data states
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [search, setSearch] = useState('');
  const [faculty, setFaculty] = useState('');
  const [year, setYear] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // UI states
  const [viewMode, setViewMode] = useState('grid');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/alumni');
      setAlumni(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching alumni:', err);
      setError('ไม่สามารถโหลดข้อมูลศิษย์เก่าได้');
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const faculties = Array.from(new Set(alumni.map(a => a.faculty).filter(Boolean)));
  const years = Array.from(new Set(alumni.map(a => a.graduation_year).filter(Boolean))).sort((a, b) => b - a);

  // Filter and sort alumni
  const getFilteredAndSortedAlumni = () => {
    let filtered = alumni.filter(person => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        (person.name || '').toLowerCase().includes(q) ||
        (person.faculty || '').toLowerCase().includes(q) ||
        (person.major || '').toLowerCase().includes(q) ||
        (person.occupation || '').toLowerCase().includes(q) ||
        (person.position || '').toLowerCase().includes(q) ||
        (person.workplace || '').toLowerCase().includes(q) ||
        (person.graduation_year ? String(person.graduation_year) : '').includes(q);
      const matchFaculty = !faculty || person.faculty === faculty;
      const matchYear = !year || String(person.graduation_year) === year;
      return matchSearch && matchFaculty && matchYear;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy] || '';
      let bVal = b[sortBy] || '';
      
      if (sortBy === 'graduation_year') {
        aVal = parseInt(aVal) || 0;
        bVal = parseInt(bVal) || 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredAlumni = getFilteredAndSortedAlumni();
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const currentPageData = filteredAlumni.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Statistics
  const stats = {
    total: alumni.length,
    faculties: faculties.length,
    recentGrads: alumni.filter(a => a.graduation_year >= 2020).length,
    withJobs: alumni.filter(a => a.occupation).length
  };

  const clearFilters = () => {
    setSearch('');
    setFaculty('');
    setYear('');
    setPage(1);
  };

  const handleAlumniClick = (person) => {
    setSelectedAlumni(person);
    setProfileDialogOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', position: 'relative', isolation: 'isolate' }}>
      {/* Hero Section */}
      <HeroSection>
        <ModernContainer maxWidth="lg">
          <Fade in timeout={600}>
            <Box>
              <Typography variant="h2" fontWeight={800} mb={2} sx={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}>
                ทำเนียบศิษย์เก่า
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.95, mb: 4, maxWidth: 600, mx: 'auto' }}>
                รวมรายชื่อและข้อมูลศิษย์เก่าทั้งหมดของมหาวิทยาลัยราชภัฏมหาสารคาม
                ค้นหาและติดต่อเพื่อนร่วมรุ่นได้อย่างสะดวก
              </Typography>
              
              {/* Quick Stats */}
              <Stack direction="row" spacing={4} justifyContent="center" flexWrap="wrap" useFlexGap>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700}>{stats.total}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>ศิษย์เก่าทั้งหมด</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700}>{stats.faculties}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>คณะ</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700}>{stats.recentGrads}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>จบใหม่ (2020+)</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700}>{Math.round((stats.withJobs/stats.total)*100) || 0}%</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>มีงานทำ</Typography>
                </Box>
              </Stack>
            </Box>
          </Fade>
        </ModernContainer>
      </HeroSection>

      <ModernContainer maxWidth="xl">
        {/* Search and Filter Section */}
        <SearchContainer elevation={0}>
          <Grid container spacing={3} alignItems="center">
            {/* Main Search */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="ค้นหา ชื่อ, คณะ, สาขา, อาชีพ, ปีที่จบ..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#667eea' }} />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearch('')}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: '16px',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: '2px solid rgba(102, 126, 234, 0.2)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea'
                    }
                  }
                }}
              />
            </Grid>

            {/* Quick Filters */}
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap justifyContent="flex-end">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>คณะ</InputLabel>
                  <Select
                    value={faculty}
                    label="คณะ"
                    onChange={(e) => {
                      setFaculty(e.target.value);
                      setPage(1);
                    }}
                    sx={{ borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    <MenuItem value="">ทั้งหมด</MenuItem>
                    {faculties.map(f => (
                      <MenuItem key={f} value={f}>{f}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>ปีที่จบ</InputLabel>
                  <Select
                    value={year}
                    label="ปีที่จบ"
                    onChange={(e) => {
                      setYear(e.target.value);
                      setPage(1);
                    }}
                    sx={{ borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    <MenuItem value="">ทั้งหมด</MenuItem>
                    {years.map(y => (
                      <MenuItem key={y} value={y}>{y}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
          </Grid>

          {/* Active Filters Display */}
          {(search || faculty || year) && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                ตัวกรองที่ใช้:
              </Typography>
              {search && (
                <Chip
                  label={`ค้นหา: "${search}"`}
                  onDelete={() => setSearch('')}
                  size="small"
                  sx={{ bgcolor: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }}
                />
              )}
              {faculty && (
                <Chip
                  label={`คณะ: ${faculty}`}
                  onDelete={() => setFaculty('')}
                  size="small"
                  sx={{ bgcolor: 'rgba(118, 75, 162, 0.1)', color: '#764ba2' }}
                />
              )}
              {year && (
                <Chip
                  label={`ปี: ${year}`}
                  onDelete={() => setYear('')}
                  size="small"
                  sx={{ bgcolor: 'rgba(240, 147, 251, 0.1)', color: '#f093fb' }}
                />
              )}
              <Button size="small" onClick={clearFilters} sx={{ ml: 1 }}>
                ล้างทั้งหมด
              </Button>
            </Box>
          )}
        </SearchContainer>

        {/* Results Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            {!loading && filteredAlumni.length > 0 && (
              <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                ผลการค้นหา ({filteredAlumni.length} คน)
              </Typography>
            )}
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Sort Options */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="name-asc">ชื่อ (ก-ฮ)</MenuItem>
                <MenuItem value="name-desc">ชื่อ (ฮ-ก)</MenuItem>
                <MenuItem value="graduation_year-desc">ปีที่จบ (ใหม่-เก่า)</MenuItem>
                <MenuItem value="graduation_year-asc">ปีที่จบ (เก่า-ใหม่)</MenuItem>
                <MenuItem value="faculty-asc">คณะ (ก-ฮ)</MenuItem>
              </Select>
            </FormControl>

            {/* View Mode Toggle */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="grid" aria-label="grid view">
                <Tooltip title="มุมมองแสดงการ์ด">
                  <ViewModuleIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <Tooltip title="มุมมองรายการ">
                  <ViewListIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: '16px',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              bgcolor: 'rgba(244, 67, 54, 0.05)'
            }}
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(12)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ 
                  borderRadius: '20px', 
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                  background: `linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.05), transparent)`,
                  backgroundSize: '200px 100%',
                  animation: `${shimmer} 1.5s infinite linear`
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Skeleton variant="circular" width={64} height={64} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="80%" height={28} />
                        <Skeleton variant="text" width="60%" height={20} />
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Skeleton variant="rounded" width={60} height={24} />
                          <Skeleton variant="rounded" width={80} height={24} />
                        </Stack>
                      </Box>
                    </Stack>
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="90%" />
                    <Skeleton variant="text" width="70%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {/* Alumni Grid/List */}
            {viewMode === 'grid' ? (
              <Grid container spacing={3}>
                {currentPageData.map((person, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={person.id}>
                    <Fade in timeout={300 + (index * 50)}>
                      <AlumniCard 
                        viewmode={viewMode}
                        elevation={0}
                        onClick={() => handleAlumniClick(person)}
                      >
                        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          {/* Profile Header */}
                          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <Avatar
                              src={person.profile_image ? `http://localhost:5000/uploads/profiles/${person.profile_image}` : undefined}
                              sx={{
                                width: 64,
                                height: 64,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
                              }}
                            >
                              {!person.profile_image && person.name?.charAt(0)}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography 
                                variant="h6" 
                                fontWeight={700} 
                                sx={{ 
                                  mb: 0.5,
                                  lineHeight: 1.2,
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  backgroundClip: 'text',
                                  color: 'transparent',
                                  cursor: 'pointer'
                                }}
                              >
                                {person.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                                {person.faculty}
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <Chip 
                                  label={person.graduation_year} 
                                  size="small" 
                                  sx={{
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    color: 'white',
                                    fontWeight: 600,
                                    '&:hover': { transform: 'scale(1.05)' }
                                  }}
                                />
                                {person.major && (
                                  <Chip 
                                    label={person.major} 
                                    size="small" 
                                    sx={{
                                      background: 'linear-gradient(45deg, #764ba2, #f093fb)',
                                      color: 'white',
                                      fontWeight: 600,
                                      '&:hover': { transform: 'scale(1.05)' }
                                    }}
                                  />
                                )}
                              </Stack>
                            </Box>
                          </Stack>

                          <Divider sx={{ my: 2, bgcolor: 'rgba(102, 126, 234, 0.1)' }} />

                          {/* Details Section */}
                          <Box sx={{ flex: 1 }}>
                            {person.occupation && (
                              <Stack direction="row" spacing={1.5} sx={{ mb: 2, alignItems: 'flex-start' }}>
                                <WorkIcon sx={{ 
                                  fontSize: 20, 
                                  color: '#667eea', 
                                  mt: 0.2, 
                                  flexShrink: 0,
                                  background: 'rgba(102, 126, 234, 0.1)',
                                  borderRadius: '6px',
                                  p: 0.5
                                }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>
                                    อาชีพ
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600} color="text.primary">
                                    {person.occupation}
                                  </Typography>
                                </Box>
                              </Stack>
                            )}

                            {person.position && (
                              <Stack direction="row" spacing={1.5} sx={{ mb: 2, alignItems: 'flex-start' }}>
                                <PersonIcon sx={{ 
                                  fontSize: 20, 
                                  color: '#764ba2', 
                                  mt: 0.2, 
                                  flexShrink: 0,
                                  background: 'rgba(118, 75, 162, 0.1)',
                                  borderRadius: '6px',
                                  p: 0.5
                                }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>
                                    ตำแหน่ง
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600} color="text.primary">
                                    {person.position}
                                  </Typography>
                                </Box>
                              </Stack>
                            )}

                            {person.workplace && (
                              <Stack direction="row" spacing={1.5} sx={{ mb: 2, alignItems: 'flex-start' }}>
                                <BusinessIcon sx={{ 
                                  fontSize: 20, 
                                  color: '#f093fb', 
                                  mt: 0.2, 
                                  flexShrink: 0,
                                  background: 'rgba(240, 147, 251, 0.1)',
                                  borderRadius: '6px',
                                  p: 0.5
                                }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>
                                    สถานที่ทำงาน
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600} color="text.primary">
                                    {person.workplace}
                                  </Typography>
                                </Box>
                              </Stack>
                            )}
                          </Box>
                        </CardContent>
                      </AlumniCard>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            ) : (
              // List View
              <Stack spacing={2}>
                {currentPageData.map((person, index) => (
                  <Fade in timeout={300 + (index * 50)} key={person.id}>
                    <AlumniCard 
                      viewmode={viewMode}
                      elevation={0}
                      onClick={() => handleAlumniClick(person)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Avatar
                            src={person.profile_image ? `http://localhost:5000/uploads/profiles/${person.profile_image}` : undefined}
                            sx={{
                              width: 60,
                              height: 60,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontSize: '1.4rem',
                              fontWeight: 700,
                              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
                            }}
                          >
                            {!person.profile_image && person.name?.charAt(0)}
                          </Avatar>

                          <Box sx={{ flex: 1 }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={3}>
                                <Typography variant="h6" fontWeight={700} sx={{ 
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  backgroundClip: 'text',
                                  color: 'transparent'
                                }}>
                                  {person.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                  {person.faculty}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={2}>
                                <Chip 
                                  label={person.graduation_year} 
                                  size="small" 
                                  sx={{
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    color: 'white',
                                    fontWeight: 600
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={3}>
                                {person.occupation && (
                                  <Typography variant="body2" fontWeight={600}>
                                    {person.occupation}
                                  </Typography>
                                )}
                                {person.position && (
                                  <Typography variant="caption" color="text.secondary">
                                    {person.position}
                                  </Typography>
                                )}
                              </Grid>

                              <Grid item xs={12} sm={4}>
                                {person.workplace && (
                                  <Typography variant="body2" color="text.secondary">
                                    <BusinessIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                    {person.workplace}
                                  </Typography>
                                )}
                              </Grid>
                            </Grid>
                          </Box>
                        </Stack>
                      </CardContent>
                    </AlumniCard>
                  </Fade>
                ))}
              </Stack>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages}
                  page={page}
                  onChange={(e, newPage) => setPage(newPage)}
                  size={isMobile ? "small" : "large"}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: '12px',
                      fontWeight: 600,
                      '&.Mui-selected': {
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
                        }
                      }
                    }
                  }}
                />
              </Box>
            )}

            {/* No Results State */}
            {filteredAlumni.length === 0 && !loading && !error && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <GroupIcon sx={{ fontSize: 120, color: 'rgba(102, 126, 234, 0.3)', mb: 3 }} />
                <Typography variant="h4" fontWeight="bold" color="text.secondary" sx={{ mb: 2 }}>
                  ไม่พบข้อมูลศิษย์เก่า
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                  กรุณาลองค้นหาด้วยคำอื่น หรือเปลี่ยนตัวกรองเพื่อค้นหาศิษย์เก่าที่คุณต้องการ
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={clearFilters}
                  sx={{ 
                    borderRadius: '16px',
                    borderColor: '#667eea',
                    color: '#667eea',
                    '&:hover': {
                      borderColor: '#667eea',
                      bgcolor: 'rgba(102, 126, 234, 0.05)'
                    }
                  }}
                >
                  ล้างตัวกรองทั้งหมด
                </Button>
              </Box>
            )}
          </>
        )}

        {/* Profile Detail Dialog */}
        <Dialog
          open={profileDialogOpen}
          onClose={() => setProfileDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden'
            }
          }}
        >
          {selectedAlumni && (
            <>
              <DialogTitle sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 3
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={selectedAlumni.profile_image ? `http://localhost:5000/uploads/profiles/${selectedAlumni.profile_image}` : undefined}
                    sx={{
                      width: 60,
                      height: 60,
                      border: '3px solid white',
                      fontSize: '1.5rem',
                      fontWeight: 700
                    }}
                  >
                    {!selectedAlumni.profile_image && selectedAlumni.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      {selectedAlumni.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                      {selectedAlumni.faculty} • {selectedAlumni.major}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 'auto' }}>
                    <IconButton 
                      onClick={() => setProfileDialogOpen(false)}
                      sx={{ color: 'white' }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Stack>
              </DialogTitle>

              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <SchoolIcon sx={{ color: '#667eea' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="ปีที่จบการศึกษา"
                          secondary={selectedAlumni.graduation_year || 'ไม่ระบุ'}
                        />
                      </ListItem>
                      
                      {selectedAlumni.occupation && (
                        <ListItem>
                          <ListItemIcon>
                            <WorkIcon sx={{ color: '#764ba2' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="อาชีพ"
                            secondary={selectedAlumni.occupation}
                          />
                        </ListItem>
                      )}

                      {selectedAlumni.position && (
                        <ListItem>
                          <ListItemIcon>
                            <PersonIcon sx={{ color: '#f093fb' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="ตำแหน่ง"
                            secondary={selectedAlumni.position}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <List>
                      {selectedAlumni.workplace && (
                        <ListItem>
                          <ListItemIcon>
                            <BusinessIcon sx={{ color: '#667eea' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="สถานที่ทำงาน"
                            secondary={selectedAlumni.workplace}
                          />
                        </ListItem>
                      )}

                      {selectedAlumni.email && (
                        <ListItem>
                          <ListItemIcon>
                            <EmailIcon sx={{ color: '#764ba2' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="อีเมล"
                            secondary={selectedAlumni.email}
                          />
                        </ListItem>
                      )}

                      {selectedAlumni.phone && (
                        <ListItem>
                          <ListItemIcon>
                            <PhoneIcon sx={{ color: '#f093fb' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="เบอร์โทรศัพท์"
                            secondary={selectedAlumni.phone}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                  onClick={() => setProfileDialogOpen(false)}
                  sx={{ 
                    borderRadius: '12px',
                    color: '#667eea',
                    '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.05)' }
                  }}
                >
                  ปิด
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: '12px',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
                    }
                  }}
                >
                  ติดต่อ
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </ModernContainer>
    </Box>
  );
}

export default AlumniDirectoryNew;