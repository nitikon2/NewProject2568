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
  CircularProgress,
  Alert,
  Stack,
  Paper,
  Divider,
  Fade,
  Skeleton,
  Button,
  IconButton,
  Tooltip,
  Badge,
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
  Sort as SortIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Download as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';

// Furni Modern Theme CSS Animations
const furniAlumniAnimations = `
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
  
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
`;

// Insert animations into head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = furniAlumniAnimations;
  if (!document.head.querySelector('style[data-furni-alumni-animations]')) {
    style.setAttribute('data-furni-alumni-animations', 'true');
    document.head.appendChild(style);
  }
}

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

const StatsCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: theme.spacing(2.5),
  border: '1px solid rgba(102, 126, 234, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.15)'
  }
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

function AlumniDirectory() {
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
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
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
      let alumniData = Array.isArray(response.data) ? response.data : [];
      
      // ดึงข้อมูลประวัติการทำงานสำหรับแต่ละคน
      const alumniWithWorkHistory = await Promise.all(
        alumniData.map(async (person) => {
          try {
            const workResponse = await axios.get(`http://localhost:5000/api/work-history/user/${person.id}`);
            const workHistory = Array.isArray(workResponse.data) ? workResponse.data : [];
            
            // หาประวัติการทำงานปัจจุบัน
            const currentWork = workHistory.find(work => work.is_current) || workHistory[0];
            
            if (currentWork) {
              return {
                ...person,
                occupation: currentWork.job_title || currentWork.occupation,
                position: currentWork.position,
                workplace: currentWork.company_name || currentWork.workplace,
                salary: currentWork.salary,
                workHistory: workHistory
              };
            } else {
              // ถ้าไม่มีข้อมูลประวัติการทำงาน แสดงค่าว่าง
              return {
                ...person,
                occupation: null,
                position: null,
                workplace: null,
                salary: null,
                workHistory: []
              };
            }
          } catch (workError) {
            console.error(`Error fetching work history for user ${person.id}:`, workError);
            // ถ้าเกิดข้อผิดพลาด ไม่แสดงข้อมูลการทำงาน
            return {
              ...person,
              occupation: null,
              position: null,
              workplace: null,
              salary: null,
              workHistory: []
            };
          }
        })
      );
      
      setAlumni(alumniWithWorkHistory);
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
  const occupations = Array.from(new Set(alumni.map(a => a.occupation).filter(Boolean)));

  // Debug: แสดงข้อมูล years ใน console
  console.log('Available years:', years);
  console.log('Total alumni:', alumni.length);
  console.log('Alumni with graduation_year:', alumni.filter(a => a.graduation_year).length);

  // Filter and sort alumni
  const getFilteredAndSortedAlumni = () => {
    console.log('Current filter values:', { search, faculty, year });
    
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
      const matchYear = !year || String(person.graduation_year) === String(year);
      
      // Debug: แสดงการเช็คเงื่อนไข
      if (year && person.id === 14) { // ทดสอบกับ record แรก
        console.log('Debug year filter for person 14:', {
          year,
          graduation_year: person.graduation_year,
          yearString: String(year),
          graduationYearString: String(person.graduation_year),
          matchYear
        });
      }
      
      return matchSearch && matchFaculty && matchYear;
    });

    console.log('Filtered results:', filtered.length, 'from', alumni.length);

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
    // ปิดการใช้งานการดูรายละเอียด
    // setSelectedAlumni(person);
    // setProfileDialogOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', position: 'relative', isolation: 'isolate' }}>
      {/* Hero Section - Furni Modern Style */}
      <Box sx={{
        background: 'linear-gradient(135deg, #2f4b3f 0%, #243d33 100%)',
        color: 'white',
        py: 8,
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
          animation: 'float 20s ease-in-out infinite',
          zIndex: 1
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700, 
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  animation: 'fadeInUp 0.8s ease-out'
                }}
              >
                ทำเนียบศิษย์เก่า
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.95, 
                  mb: 5, 
                  maxWidth: 700, 
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: '1.2rem',
                  animation: 'fadeInUp 0.8s ease-out 0.2s both'
                }}
              >
                รวมรายชื่อและข้อมูลศิษย์เก่าทั้งหมดของมหาวิทยาลัยราชภัฏมหาสารคาม
                ค้นหาและติดต่อเพื่อนร่วมรุ่นได้อย่างสะดวก
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Search and Filter Section - Furni Modern Style */}
        <Paper 
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: '1.25rem',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(247, 245, 243, 0.8))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(47, 75, 63, 0.08)',
            boxShadow: '0 0.5rem 1rem rgba(47, 75, 63, 0.08)'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            {/* Main Search - Enhanced */}
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
                      <SearchIcon sx={{ color: '#f9c74f' }} />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton 
                        size="small" 
                        onClick={() => setSearch('')}
                        sx={{
                          color: '#6c757d',
                          '&:hover': {
                            color: '#f9c74f',
                            background: 'rgba(249, 199, 79, 0.1)'
                          }
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: '0.75rem',
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.3s ease',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: '2px solid rgba(47, 75, 63, 0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f9c74f'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2f4b3f'
                    }
                  }
                }}
              />
            </Grid>

            {/* Quick Filters - Enhanced */}
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap justifyContent="flex-end">
                <FormControl 
                  size="small" 
                  sx={{ 
                    minWidth: 120,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      '& fieldset': {
                        borderColor: 'rgba(47, 75, 63, 0.2)'
                      },
                      '&:hover fieldset': {
                        borderColor: '#f9c74f'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2f4b3f'
                      }
                    }
                  }}
                >
                  <InputLabel sx={{ color: '#6c757d' }}>คณะ</InputLabel>
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
                      <MenuItem key={y} value={String(y)}>{y}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Tooltip title="เพิ่มเติม">
                  <FilterButton
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={() => setFilterDialogOpen(true)}
                  >
                    ตัวกรอง
                  </FilterButton>
                </Tooltip>
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
        </Paper>

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
                    <Fade in timeout={400 + (index * 100)}>
                      <Card
                        elevation={0}
                        sx={{
                          height: '100%',
                          borderRadius: '1.25rem',
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(47, 75, 63, 0.08)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          animation: `scaleIn 0.6s ease-out ${index * 0.1}s both`,
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 0.75rem 1.5rem rgba(47, 75, 63, 0.1)',
                            '& .alumni-avatar': {
                              transform: 'scale(1.1)',
                              boxShadow: '0 0.75rem 1.5rem rgba(249, 199, 79, 0.4)'
                            },
                            '& .alumni-name': {
                              color: '#2f4b3f'
                            }
                          }
                        }}
                      >
                        <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          {/* Profile Header - Furni Modern Style */}
                          <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                            <Avatar
                              className="alumni-avatar"
                              src={person.profile_image ? `http://localhost:5000/uploads/profiles/${person.profile_image}` : undefined}
                              sx={{
                                width: 72,
                                height: 72,
                                background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                color: 'white',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 0.5rem 1.25rem rgba(249, 199, 79, 0.25)'
                              }}
                            >
                              {!person.profile_image && person.name?.charAt(0)}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography 
                                className="alumni-name"
                                variant="h6" 
                                sx={{ 
                                  fontFamily: "'Poppins', sans-serif",
                                  fontWeight: 600, 
                                  mb: 1,
                                  lineHeight: 1.2,
                                  color: '#2a3b3d',
                                  transition: 'color 0.3s ease',
                                  fontSize: '1.1rem'
                                }}
                              >
                                {person.name}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#6c757d', 
                                  mb: 1.5, 
                                  fontWeight: 500,
                                  lineHeight: 1.4
                                }}
                              >
                                {person.faculty}
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <Chip 
                                  label={person.graduation_year} 
                                  size="small" 
                                  sx={{
                                    background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
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
                                      background: 'rgba(249, 199, 79, 0.2)',
                                      color: '#2f4b3f',
                                      fontWeight: 600,
                                      border: '1px solid rgba(249, 199, 79, 0.3)',
                                      '&:hover': { 
                                        transform: 'scale(1.05)',
                                        background: 'rgba(249, 199, 79, 0.3)'
                                      }
                                    }}
                                  />
                                )}
                              </Stack>
                            </Box>
                          </Stack>

                          <Divider sx={{ my: 3, bgcolor: 'rgba(47, 75, 63, 0.1)' }} />

                          {/* Work Information Section - ข้อมูลจริงจากฐานข้อมูล */}
                          <Box sx={{ flex: 1 }}>
                            <Paper sx={{
                              p: 3,
                              borderRadius: '1rem',
                              background: (person.occupation || person.position || person.workplace) 
                                ? 'linear-gradient(135deg, rgba(249, 199, 79, 0.05), rgba(47, 75, 63, 0.02))'
                                : 'linear-gradient(135deg, rgba(108, 117, 125, 0.05), rgba(108, 117, 125, 0.02))',
                              border: (person.occupation || person.position || person.workplace)
                                ? '1px solid rgba(249, 199, 79, 0.15)'
                                : '1px solid rgba(108, 117, 125, 0.1)',
                              backdropFilter: 'blur(5px)',
                              mb: 2
                            }}>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: '#2f4b3f', 
                                  fontWeight: 700,
                                  letterSpacing: '0.1em',
                                  textTransform: 'uppercase',
                                  fontSize: '0.7rem',
                                  mb: 2,
                                  display: 'block'
                                }}
                              >
                                ข้อมูลการทำงาน
                              </Typography>
                              
                              {(person.occupation || person.position || person.workplace) ? (
                                <>
                                  {person.occupation && (
                                  <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
                                    <Box sx={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: '0.75rem',
                                      background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0
                                    }}>
                                      <WorkIcon sx={{ fontSize: 16, color: 'white' }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography 
                                        variant="caption" 
                                        sx={{ 
                                          color: '#6c757d', 
                                          display: 'block', 
                                          fontWeight: 600,
                                          fontSize: '0.7rem'
                                        }}
                                      >
                                        อาชีพ
                                      </Typography>
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          fontWeight: 600, 
                                          color: '#2f4b3f',
                                          fontSize: '0.9rem'
                                        }}
                                      >
                                        {person.occupation}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                )}

                                {person.position && (
                                  <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
                                    <Box sx={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: '0.75rem',
                                      background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0
                                    }}>
                                      <PersonIcon sx={{ fontSize: 16, color: 'white' }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography 
                                        variant="caption" 
                                        sx={{ 
                                          color: '#6c757d', 
                                          display: 'block', 
                                          fontWeight: 600,
                                          fontSize: '0.7rem'
                                        }}
                                      >
                                        ตำแหน่ง
                                      </Typography>
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          fontWeight: 600, 
                                          color: '#2f4b3f',
                                          fontSize: '0.9rem'
                                        }}
                                      >
                                        {person.position}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                )}

                                {person.workplace && (
                                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                                    <Box sx={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: '0.75rem',
                                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0
                                    }}>
                                      <BusinessIcon sx={{ fontSize: 16, color: 'white' }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography 
                                        variant="caption" 
                                        sx={{ 
                                          color: '#6c757d', 
                                          display: 'block', 
                                          fontWeight: 600,
                                          fontSize: '0.7rem'
                                        }}
                                      >
                                        สถานที่ทำงาน
                                      </Typography>
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          fontWeight: 600, 
                                          color: '#2f4b3f',
                                          fontSize: '0.9rem'
                                        }}
                                      >
                                        {person.workplace}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                )}
                              </>
                              ) : (
                                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                                  <Box sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '0.75rem',
                                    background: 'linear-gradient(135deg, #6c757d, #8a9099)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}>
                                    <WorkIcon sx={{ fontSize: 16, color: 'white' }} />
                                  </Box>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: '#6c757d',
                                        fontStyle: 'italic',
                                        fontSize: '0.85rem'
                                      }}
                                    >
                                      ยังไม่ได้ระบุข้อมูลการทำงาน
                                    </Typography>
                                  </Box>
                                </Stack>
                              )}
                            </Paper>
                          </Box>
                        </CardContent>
                      </Card>
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
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                  {person.occupation && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Chip 
                                        icon={<WorkIcon sx={{ fontSize: 14 }} />}
                                        label={person.occupation}
                                        size="small"
                                        sx={{
                                          background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                                          color: 'white',
                                          fontWeight: 600,
                                          fontSize: '0.75rem',
                                          '& .MuiChip-icon': { color: 'white' }
                                        }}
                                      />
                                    </Box>
                                  )}
                                  {person.position && (
                                    <Typography variant="caption" sx={{ 
                                      color: '#2f4b3f', 
                                      fontWeight: 600,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5
                                    }}>
                                      <PersonIcon sx={{ fontSize: 12 }} />
                                      {person.position}
                                    </Typography>
                                  )}
                                  
                                  {/* แสดงข้อความเมื่อไม่มีข้อมูลการทำงาน */}
                                  {!person.occupation && !person.position && !person.workplace && (
                                    <Typography variant="caption" sx={{ 
                                      color: '#6c757d',
                                      fontStyle: 'italic',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5
                                    }}>
                                      <WorkIcon sx={{ fontSize: 12 }} />
                                      ยังไม่ได้ระบุข้อมูลการทำงาน
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={4}>
                                {person.workplace ? (
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    p: 1.5,
                                    borderRadius: '0.75rem',
                                    background: 'rgba(102, 126, 234, 0.05)',
                                    border: '1px solid rgba(102, 126, 234, 0.1)'
                                  }}>
                                    <BusinessIcon sx={{ fontSize: 16, color: '#667eea' }} />
                                    <Typography variant="body2" sx={{ 
                                      fontWeight: 600,
                                      color: '#2f4b3f'
                                    }}>
                                      {person.workplace}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    p: 1.5,
                                    borderRadius: '0.75rem',
                                    background: 'rgba(108, 117, 125, 0.05)',
                                    border: '1px solid rgba(108, 117, 125, 0.1)'
                                  }}>
                                    <BusinessIcon sx={{ fontSize: 16, color: '#6c757d' }} />
                                    <Typography variant="body2" sx={{ 
                                      fontStyle: 'italic',
                                      color: '#6c757d'
                                    }}>
                                      ยังไม่ได้ระบุสถานที่ทำงาน
                                    </Typography>
                                  </Box>
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

        {/* Profile Detail Dialog - ปิดการใช้งาน */}
        {false && (
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

              <DialogContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h6" sx={{ 
                    color: '#2f4b3f',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    mb: 1
                  }}>
                    ข้อมูลการทำงาน
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6c757d' }}>
                    รายละเอียดอาชีพและสถานที่ทำงาน
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  {selectedAlumni.workHistory && selectedAlumni.workHistory.length > 0 ? (
                    // แสดงประวัติการทำงานจริงจากฐานข้อมูล
                    selectedAlumni.workHistory.map((work, index) => (
                      <Paper key={work.id || index} sx={{ 
                        p: 3, 
                        borderRadius: '1rem',
                        background: work.is_current 
                          ? 'linear-gradient(135deg, rgba(249, 199, 79, 0.15), rgba(249, 199, 79, 0.08))'
                          : 'linear-gradient(135deg, rgba(108, 117, 125, 0.05), rgba(108, 117, 125, 0.02))',
                        border: work.is_current 
                          ? '2px solid rgba(249, 199, 79, 0.3)'
                          : '1px solid rgba(108, 117, 125, 0.15)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: work.is_current 
                            ? '0 8px 25px rgba(249, 199, 79, 0.2)'
                            : '0 8px 25px rgba(108, 117, 125, 0.1)'
                        }
                      }}>
                        {work.is_current && (
                          <Chip 
                            label="งานปัจจุบัน" 
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                        
                        <Stack direction="row" spacing={3} alignItems="flex-start">
                          <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '1rem',
                            background: work.is_current 
                              ? 'linear-gradient(135deg, #f9c74f, #fbd36b)'
                              : 'linear-gradient(135deg, #6c757d, #8a9099)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <WorkIcon sx={{ fontSize: 24, color: 'white' }} />
                          </Box>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ 
                              color: '#2f4b3f',
                              fontWeight: 700,
                              fontFamily: "'Poppins', sans-serif",
                              mb: 1,
                              pr: work.is_current ? 10 : 0
                            }}>
                              {work.job_title || work.occupation || 'ไม่ระบุตำแหน่ง'}
                            </Typography>
                            
                            {(work.position || work.department) && (
                              <Typography variant="body2" sx={{ 
                                color: '#667eea',
                                fontWeight: 600,
                                mb: 1
                              }}>
                                {work.position || work.department}
                              </Typography>
                            )}
                            
                            <Typography variant="body1" sx={{ 
                              color: '#2f4b3f',
                              fontWeight: 600,
                              mb: 2
                            }}>
                              <BusinessIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle', color: '#667eea' }} />
                              {work.company_name || work.workplace || 'ไม่ระบุสถานที่ทำงาน'}
                            </Typography>
                            
                            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                              {work.start_date && (
                                <Chip 
                                  icon={<CalendarIcon sx={{ fontSize: 14 }} />}
                                  label={`เริ่ม: ${new Date(work.start_date).toLocaleDateString('th-TH')}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              )}
                              {work.end_date && !work.is_current && (
                                <Chip 
                                  icon={<CalendarIcon sx={{ fontSize: 14 }} />}
                                  label={`สิ้นสุด: ${new Date(work.end_date).toLocaleDateString('th-TH')}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              )}
                              {work.salary && (
                                <Chip 
                                  label={`เงินเดือน: ${parseInt(work.salary).toLocaleString()} บาท`}
                                  size="small"
                                  sx={{
                                    background: 'rgba(76, 175, 80, 0.1)',
                                    color: '#4caf50',
                                    fontWeight: 600,
                                    fontSize: '0.75rem'
                                  }}
                                />
                              )}
                            </Stack>

                            {work.description && (
                              <Typography variant="body2" sx={{ 
                                color: '#6c757d',
                                mt: 2,
                                lineHeight: 1.6,
                                fontStyle: 'italic'
                              }}>
                                "{work.description}"
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </Paper>
                    ))
                  ) : (
                    // แสดงข้อมูลจำลองถ้าไม่มีประวัติการทำงาน
                    <>
                      {selectedAlumni.occupation && (
                        <Paper sx={{ 
                          p: 3, 
                          borderRadius: '1rem',
                          background: 'linear-gradient(135deg, rgba(249, 199, 79, 0.1), rgba(249, 199, 79, 0.05))',
                          border: '1px solid rgba(249, 199, 79, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(249, 199, 79, 0.15)'
                          }
                        }}>
                          <Stack direction="row" spacing={3} alignItems="center">
                            <Box sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '1rem',
                              background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <WorkIcon sx={{ fontSize: 24, color: 'white' }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" sx={{ 
                                color: '#6c757d',
                                fontWeight: 600,
                                display: 'block',
                                mb: 0.5
                              }}>
                                อาชีพ
                              </Typography>
                              <Typography variant="h6" sx={{ 
                                color: '#2f4b3f',
                                fontWeight: 600,
                                fontFamily: "'Poppins', sans-serif"
                              }}>
                                {selectedAlumni.occupation}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      )}

                      {selectedAlumni.position && (
                        <Paper sx={{ 
                          p: 3, 
                          borderRadius: '1rem',
                          background: 'linear-gradient(135deg, rgba(47, 75, 63, 0.05), rgba(47, 75, 63, 0.02))',
                          border: '1px solid rgba(47, 75, 63, 0.15)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(47, 75, 63, 0.1)'
                          }
                        }}>
                          <Stack direction="row" spacing={3} alignItems="center">
                            <Box sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '1rem',
                              background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <PersonIcon sx={{ fontSize: 24, color: 'white' }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" sx={{ 
                                color: '#6c757d',
                                fontWeight: 600,
                                display: 'block',
                                mb: 0.5
                              }}>
                                ตำแหน่ง
                              </Typography>
                              <Typography variant="h6" sx={{ 
                                color: '#2f4b3f',
                                fontWeight: 600,
                                fontFamily: "'Poppins', sans-serif"
                              }}>
                                {selectedAlumni.position}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      )}

                      {selectedAlumni.workplace && (
                        <Paper sx={{ 
                          p: 3, 
                          borderRadius: '1rem',
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.02))',
                          border: '1px solid rgba(102, 126, 234, 0.15)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.1)'
                          }
                        }}>
                          <Stack direction="row" spacing={3} alignItems="center">
                            <Box sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '1rem',
                              background: 'linear-gradient(135deg, #667eea, #764ba2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <BusinessIcon sx={{ fontSize: 24, color: 'white' }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" sx={{ 
                                color: '#6c757d',
                                fontWeight: 600,
                                display: 'block',
                                mb: 0.5
                              }}>
                                สถานที่ทำงาน
                              </Typography>
                              <Typography variant="h6" sx={{ 
                                color: '#2f4b3f',
                                fontWeight: 600,
                                fontFamily: "'Poppins', sans-serif"
                              }}>
                                {selectedAlumni.workplace}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      )}
                    </>
                  )}

                  {!selectedAlumni.workHistory?.length && !selectedAlumni.occupation && !selectedAlumni.position && !selectedAlumni.workplace && (
                    <Paper sx={{ 
                      p: 4, 
                      borderRadius: '1rem',
                      background: 'rgba(108, 117, 125, 0.05)',
                      border: '1px solid rgba(108, 117, 125, 0.1)',
                      textAlign: 'center'
                    }}>
                      <WorkIcon sx={{ fontSize: 48, color: '#6c757d', mb: 2, opacity: 0.5 }} />
                      <Typography variant="body1" sx={{ 
                        color: '#6c757d',
                        fontWeight: 500
                      }}>
                        ยังไม่มีข้อมูลการทำงาน
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#6c757d',
                        mt: 1,
                        opacity: 0.8
                      }}>
                        ข้อมูลอาชีพ ตำแหน่ง และสถานที่ทำงานยังไม่ได้ระบุ
                      </Typography>
                    </Paper>
                  )}
                </Stack>
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
        )}
      </Container>
    </Box>
  );
}

export default AlumniDirectory;


