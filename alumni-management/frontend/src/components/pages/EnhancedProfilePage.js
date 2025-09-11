import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  IconButton,
  Fab,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Divider,
  Alert,
  Snackbar,
  Paper,
  Fade,
  Skeleton
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
  }
}));

const GradientBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 16,
  padding: theme.spacing(4),
  color: 'white',
  marginBottom: theme.spacing(3)
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    '&.Mui-selected': {
      color: '#667eea'
    }
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#667eea',
    height: 3,
    borderRadius: 3
  }
}));

const WorkTimelineItem = styled(TimelineItem)(({ theme }) => ({
  '&::before': {
    flex: 0,
    padding: 0
  }
}));

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const EnhancedProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState(null);
  const [workHistory, setWorkHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openWorkDialog, setOpenWorkDialog] = useState(false);
  const [editingWork, setEditingWork] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Form state สำหรับประวัติการทำงาน
  const [workForm, setWorkForm] = useState({
    company_name: '',
    position: '',
    job_description: '',
    start_date: '',
    end_date: '',
    is_current: false,
    salary_range: '',
    location: ''
  });

  const salaryRanges = [
    'ต่ำกว่า 20,000',
    '20,000 - 30,000',
    '30,000 - 40,000',
    '40,000 - 50,000',
    '50,000 - 70,000',
    '70,000 - 100,000',
    'มากกว่า 100,000'
  ];

  useEffect(() => {
    fetchUserData();
    fetchWorkHistory();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      showSnackbar('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้', 'error');
    }
  };

  const fetchWorkHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/work-history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setWorkHistory(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching work history:', error);
      showSnackbar('เกิดข้อผิดพลาดในการโหลดประวัติการทำงาน', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleWorkFormChange = (event) => {
    const { name, value, checked, type } = event.target;
    setWorkForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openAddWorkDialog = () => {
    setEditingWork(null);
    setWorkForm({
      company_name: '',
      position: '',
      job_description: '',
      start_date: '',
      end_date: '',
      is_current: false,
      salary_range: '',
      location: ''
    });
    setOpenWorkDialog(true);
  };

  const openEditWorkDialog = (work) => {
    setEditingWork(work);
    setWorkForm({
      company_name: work.company_name || '',
      position: work.position || '',
      job_description: work.job_description || '',
      start_date: work.start_date ? work.start_date.split('T')[0] : '',
      end_date: work.end_date ? work.end_date.split('T')[0] : '',
      is_current: work.is_current || false,
      salary_range: work.salary_range || '',
      location: work.location || ''
    });
    setOpenWorkDialog(true);
  };

  const handleWorkSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingWork 
        ? `http://localhost:5000/api/work-history/${editingWork.id}`
        : 'http://localhost:5000/api/work-history';
      
      const method = editingWork ? 'put' : 'post';
      
      const response = await axios[method](url, workForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        showSnackbar(
          editingWork ? 'แก้ไขประวัติการทำงานสำเร็จ' : 'เพิ่มประวัติการทำงานสำเร็จ',
          'success'
        );
        fetchWorkHistory();
        setOpenWorkDialog(false);
      }
    } catch (error) {
      console.error('Error saving work history:', error);
      showSnackbar('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    }
  };

  const handleDeleteWork = async (workId) => {
    if (!window.confirm('คุณต้องการลบประวัติการทำงานนี้หรือไม่?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/work-history/${workId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        showSnackbar('ลบประวัติการทำงานสำเร็จ', 'success');
        fetchWorkHistory();
      }
    } catch (error) {
      console.error('Error deleting work history:', error);
      showSnackbar('เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate, endDate, isCurrent) => {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    let duration = '';
    if (years > 0) duration += `${years} ปี `;
    if (months > 0) duration += `${months} เดือน`;
    if (!duration) duration = 'น้อยกว่า 1 เดือน';
    
    return duration;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Fade in timeout={800}>
        <GradientBox>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={userData?.profile_image}
                sx={{ 
                  width: 120, 
                  height: 120,
                  border: '4px solid rgba(255,255,255,0.3)'
                }}
              >
                {userData?.name?.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {userData?.name || 'ไม่ระบุชื่อ'}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                {userData?.occupation || 'ไม่ระบุอาชีพ'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {userData?.faculty && (
                  <Chip 
                    icon={<SchoolIcon />}
                    label={userData.faculty}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                )}
                {userData?.graduation_year && (
                  <Chip 
                    label={`รุ่น ${userData.graduation_year}`}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </GradientBox>
      </Fade>

      {/* Navigation Tabs */}
      <StyledCard sx={{ mb: 3 }}>
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab icon={<PersonIcon />} label="ข้อมูลส่วนตัว" />
          <Tab icon={<SchoolIcon />} label="การศึกษา" />
          <Tab icon={<WorkIcon />} label="ประวัติการทำงาน" />
        </StyledTabs>
      </StyledCard>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  ข้อมูลส่วนตัว
                </Typography>
                <Box sx={{ '& > *': { mb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography>
                      <strong>อีเมล:</strong> {userData?.email || 'ไม่ระบุ'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography>
                      <strong>เบอร์โทร:</strong> {userData?.phone || 'ไม่ระบุ'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CakeIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography>
                      <strong>วันเกิด:</strong> {userData?.birth_date ? formatDate(userData.birth_date) : 'ไม่ระบุ'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography>
                      <strong>ที่อยู่:</strong> {userData?.address || 'ไม่ระบุ'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={6}>
            {userData?.bio && (
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
                    แนะนำตัว
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {userData.bio}
                  </Typography>
                </CardContent>
              </StyledCard>
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
                  <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  ข้อมูลการศึกษา
                </Typography>
                <Box sx={{ '& > *': { mb: 2 } }}>
                  <Typography>
                    <strong>คณะ:</strong> {userData?.faculty || 'ไม่ระบุ'}
                  </Typography>
                  <Typography>
                    <strong>สาขาวิชา:</strong> {userData?.major || 'ไม่ระบุ'}
                  </Typography>
                  <Typography>
                    <strong>ปีที่จบการศึกษา:</strong> {userData?.graduation_year || 'ไม่ระบุ'}
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">
                ประวัติการทำงาน
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/work-history"
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#764ba2',
                      bgcolor: 'rgba(102, 126, 234, 0.05)'
                    }
                  }}
                >
                  จัดการทั้งหมด
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openAddWorkDialog}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  เพิ่มประวัติการทำงาน
                </Button>
              </Box>
            </Box>

            {workHistory.length === 0 ? (
              <StyledCard>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    ยังไม่มีประวัติการทำงาน
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    เพิ่มประวัติการทำงานของคุณเพื่อให้ศิษย์เก่าคนอื่นๆ ได้เรียนรู้จากประสบการณ์ของคุณ
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={openAddWorkDialog}
                    sx={{ textTransform: 'none' }}
                  >
                    เพิ่มประวัติการทำงานแรก
                  </Button>
                </CardContent>
              </StyledCard>
            ) : (
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Timeline>
                    {workHistory.map((work, index) => (
                      <WorkTimelineItem key={work.id}>
                        <TimelineSeparator>
                          <TimelineDot 
                            color={work.is_current ? "primary" : "grey"}
                            sx={{ 
                              p: 1,
                              border: work.is_current ? '3px solid #667eea' : '2px solid #ccc'
                            }}
                          >
                            <BusinessIcon fontSize="small" />
                          </TimelineDot>
                          {index < workHistory.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent sx={{ pb: 3 }}>
                          <Paper 
                            elevation={2} 
                            sx={{ 
                              p: 3, 
                              borderRadius: 2,
                              border: work.is_current ? '2px solid #667eea' : 'none',
                              position: 'relative'
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box>
                                <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                                  {work.position}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                  {work.company_name}
                                </Typography>
                                {work.is_current && (
                                  <Chip 
                                    label="ปัจจุบัน" 
                                    color="primary" 
                                    size="small"
                                    sx={{ mb: 1 }}
                                  />
                                )}
                              </Box>
                              <Box>
                                <IconButton 
                                  size="small" 
                                  onClick={() => openEditWorkDialog(work)}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteWork(work.id)}
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {formatDate(work.start_date)} - {work.is_current ? 'ปัจจุบัน' : formatDate(work.end_date)}
                              {' • '}
                              {calculateDuration(work.start_date, work.end_date, work.is_current)}
                            </Typography>
                            
                            {work.location && (
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                <LocationIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                {work.location}
                              </Typography>
                            )}
                            
                            {work.salary_range && (
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                <MoneyIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                {work.salary_range} บาท
                              </Typography>
                            )}
                            
                            {work.job_description && (
                              <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.6 }}>
                                {work.job_description}
                              </Typography>
                            )}
                          </Paper>
                        </TimelineContent>
                      </WorkTimelineItem>
                    ))}
                  </Timeline>
                </CardContent>
              </StyledCard>
            )}
          </Grid>
        </Grid>
      </TabPanel>

      {/* Work History Dialog */}
      <Dialog 
        open={openWorkDialog} 
        onClose={() => setOpenWorkDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {editingWork ? 'แก้ไขประวัติการทำงาน' : 'เพิ่มประวัติการทำงาน'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ชื่อบริษัท/หน่วยงาน"
                name="company_name"
                value={workForm.company_name}
                onChange={handleWorkFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ตำแหน่งงาน"
                name="position"
                value={workForm.position}
                onChange={handleWorkFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="วันที่เริ่มงาน"
                name="start_date"
                type="date"
                value={workForm.start_date}
                onChange={handleWorkFormChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="วันที่สิ้นสุด"
                name="end_date"
                type="date"
                value={workForm.end_date}
                onChange={handleWorkFormChange}
                InputLabelProps={{ shrink: true }}
                disabled={workForm.is_current}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={workForm.is_current}
                    onChange={handleWorkFormChange}
                    name="is_current"
                  />
                }
                label="เป็นงานปัจจุบัน"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="สถานที่ทำงาน"
                name="location"
                value={workForm.location}
                onChange={handleWorkFormChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="ช่วงเงินเดือน"
                name="salary_range"
                value={workForm.salary_range}
                onChange={handleWorkFormChange}
              >
                <MenuItem value="">ไม่ระบุ</MenuItem>
                {salaryRanges.map((range) => (
                  <MenuItem key={range} value={range}>
                    {range}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="รายละเอียดงาน"
                name="job_description"
                value={workForm.job_description}
                onChange={handleWorkFormChange}
                placeholder="อธิบายลักษณะงาน หน้าที่ความรับผิดชอบ หรือผลงานที่น่าภาคภูมิใจ"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenWorkDialog(false)}>
            ยกเลิก
          </Button>
          <Button 
            variant="contained" 
            onClick={handleWorkSubmit}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none'
            }}
          >
            {editingWork ? 'บันทึกการแก้ไข' : 'เพิ่มประวัติการทำงาน'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EnhancedProfilePage;
