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
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Clear as ClearIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import BackgroundLayout from '../layout/BackgroundLayout';
import axios from 'axios';

function AlumniDirectory() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [faculty, setFaculty] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    setError('');
    try {
      // ใช้ endpoint /api/alumni ที่ backend มีจริง
      const response = await axios.get('http://localhost:5000/api/alumni');
      // ป้องกันกรณี response ไม่ใช่ array
      setAlumni(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      // เพิ่ม log error เพื่อ debug
      console.error('Error fetching alumni:', err, err?.response?.data);
      setError('ไม่สามารถโหลดข้อมูลศิษย์เก่าได้');
    } finally {
      setLoading(false);
    }
  };

  const faculties = Array.from(new Set(alumni.map(a => a.faculty).filter(Boolean)));
  const years = Array.from(new Set(alumni.map(a => a.graduation_year).filter(Boolean))).sort((a, b) => b - a);

  const filteredAlumni = alumni.filter(person => {
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
            ทำเนียบศิษย์เก่า
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            รวมรายชื่อศิษย์เก่าทั้งหมดของมหาวิทยาลัยราชภัฏมหาสารคาม
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>

        {/* Search Bar - เหมือนหน้าข่าวสาร */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <TextField
            placeholder="ค้นหา ชื่อ, คณะ, สาขา, อาชีพ, ปีที่จบ"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ maxWidth: 600, width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <ClearIcon 
                    sx={{ cursor: 'pointer', color: 'grey.500' }}
                    onClick={() => setSearch('')}
                  />
                </InputAdornment>
              ),
              sx: { borderRadius: 3 }
            }}
          />
        </Box>

        {/* Filter Section */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 600 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>คณะ</InputLabel>
              <Select
                value={faculty}
                label="คณะ"
                onChange={(e) => setFaculty(e.target.value)}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="">ทุกคณะ</MenuItem>
                {faculties.map(f => (
                  <MenuItem key={f} value={f}>{f}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>ปีที่จบ</InputLabel>
              <Select
                value={year}
                label="ปีที่จบ"
                onChange={(e) => setYear(e.target.value)}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="">ทุกปีที่จบ</MenuItem>
                {years.map(y => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State - เหมือนหน้าข่าวสาร */}
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(8)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Skeleton variant="circular" width={64} height={64} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="80%" height={24} />
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
            {/* Results Count */}
            {!loading && filteredAlumni.length > 0 && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                พบ {filteredAlumni.length} คน
              </Typography>
            )}

            {/* Alumni Cards Grid - เหมือนหน้าข่าวสาร */}
            <Grid container spacing={3}>
              {filteredAlumni.map((person, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={person.id}>
                  <Fade in timeout={300 + (index * 100)}>
                    <Card 
                      elevation={0}
                      sx={{
                        height: '100%',
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
                    >
                      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Profile Section */}
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 64,
                              height: 64,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontSize: '1.5rem'
                            }}
                          >
                            <PersonIcon />
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                              variant="h6" 
                              fontWeight={600} 
                              color="primary"
                              sx={{ 
                                mb: 0.5,
                                lineHeight: 1.2,
                                wordBreak: 'break-word'
                              }}
                            >
                              {person.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {person.faculty}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              <Chip 
                                label={person.graduation_year} 
                                size="small" 
                                sx={{
                                  bgcolor: '#667eea',
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                              {person.major && (
                                <Chip 
                                  label={person.major} 
                                  size="small" 
                                  sx={{
                                    bgcolor: '#764ba2',
                                    color: 'white',
                                    fontWeight: 600
                                  }}
                                />
                              )}
                            </Stack>
                          </Box>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        {/* Details Section */}
                        <Box sx={{ flex: 1 }}>
                          {person.occupation && (
                            <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'flex-start' }}>
                              <WorkIcon sx={{ fontSize: 18, color: '#667eea', mt: 0.2, flexShrink: 0 }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  อาชีพ
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                  {person.occupation}
                                </Typography>
                              </Box>
                            </Stack>
                          )}

                          {person.position && (
                            <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'flex-start' }}>
                              <PersonIcon sx={{ fontSize: 18, color: '#667eea', mt: 0.2, flexShrink: 0 }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  ตำแหน่ง
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                  {person.position}
                                </Typography>
                              </Box>
                            </Stack>
                          )}

                          {person.workplace && (
                            <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'flex-start' }}>
                              <BusinessIcon sx={{ fontSize: 18, color: '#667eea', mt: 0.2, flexShrink: 0 }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  สถานที่ทำงาน
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                  {person.workplace}
                                </Typography>
                              </Box>
                            </Stack>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>

            {/* No Results State */}
            {filteredAlumni.length === 0 && !loading && !error && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <GroupIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" color="text.secondary" sx={{ mb: 1 }}>
                  ไม่พบข้อมูลศิษย์เก่า
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  กรุณาลองค้นหาด้วยคำอื่น หรือเปลี่ยนตัวกรอง
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default AlumniDirectory;


