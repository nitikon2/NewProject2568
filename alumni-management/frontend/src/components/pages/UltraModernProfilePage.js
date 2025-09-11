import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  IconButton,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Fade,
  Badge,
  LinearProgress,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Chip,
  Stack,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccountBalance as AccountBalanceIcon,
  Celebration as CelebrationIcon,
  BusinessCenter as BusinessCenterIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  DateRange as DateRangeIcon,
  AttachMoney as MoneyIcon,
  Language as LanguageIcon,
  Public as PublicIcon,
  NotificationsActive as NotificationsIcon,
  BookmarkBorder as BookmarkIcon,
  Favorite as FavoriteIcon,
  LinkedIn,
  GitHub,
  Twitter,
  Facebook,
  Instagram,
  Add as AddIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import ModernLayout from '../layout/ModernLayout';
import addressData from '../../assets/thai-address-full.json';
import { Link } from 'react-router-dom';
import './UltraModernProfile.css';

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

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 5px rgba(102, 126, 234, 0.3),
                0 0 10px rgba(102, 126, 234, 0.2),
                0 0 15px rgba(102, 126, 234, 0.1);
  }
  50% { 
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.4),
                0 0 20px rgba(102, 126, 234, 0.3),
                0 0 30px rgba(102, 126, 234, 0.2);
  }
`;

// Styled Components
const ProfileContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
  maxWidth: '1400px !important',
  position: 'relative',
  animation: `${fadeInUp} 0.8s ease-out`
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)'
  }
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  borderRadius: '32px',
  padding: theme.spacing(5),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: theme.spacing(4),
  animation: `${glow} 3s ease-in-out infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: `${float} 6s ease-in-out infinite`
  }
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 140,
  height: 140,
  fontSize: '3.5rem',
  fontWeight: 'bold',
  border: '5px solid white',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  position: 'relative',
  zIndex: 10,
  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
  '&:hover': {
    transform: 'scale(1.08) rotate(2deg)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
  }
}));



const InfoCard = styled(GlassCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '& .MuiCardContent-root': {
    flexGrow: 1,
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column'
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(1),
  borderRadius: '16px',
  background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
  border: '1px solid rgba(102, 126, 234, 0.2)'
}));



const ActionBtn = styled(Button)(({ theme, variant: btnVariant }) => ({
  borderRadius: '16px',
  padding: '12px 32px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  minHeight: '48px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  ...(btnVariant === 'primary' && {
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.6)',
      background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
    }
  }),
  ...(btnVariant === 'secondary' && {
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#667eea',
    border: '2px solid rgba(102, 126, 234, 0.3)',
    backdropFilter: 'blur(10px)',
    '&:hover': {
      transform: 'translateY(-3px)',
      background: 'rgba(255, 255, 255, 1)',
      borderColor: '#667eea',
      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)',
    }
  })
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
  }
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(45deg, #667eea, #764ba2)',
  color: 'white',
  fontWeight: 600,
  borderRadius: '20px',
  padding: '8px 4px',
  margin: '4px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  }
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function UltraModernProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Faculty and Major options
  const majorOptionsByFaculty = {
    'คณะครุศาสตร์': ['ภาษาไทย', 'คณิตศาสตร์', 'วิทยาศาสตร์', 'สังคมศึกษา', 'พลศึกษา', 'คอมพิวเตอร์ศึกษา', 'ปฐมวัย', 'ประถมศึกษา'],
    'คณะวิทยาศาสตร์และเทคโนโลยี': ['วิทยาการคอมพิวเตอร์', 'เทคโนโลยีอาหาร', 'ชีววิทยา', 'เคมี', 'ฟิสิกส์', 'คณิตศาสตร์'],
    'คณะมนุษยศาสตร์และสังคมศาสตร์': ['ภาษาอังกฤษ', 'ภาษาไทย', 'รัฐศาสตร์', 'ประวัติศาสตร์', 'สังคมวิทยา'],
    'คณะวิทยาการจัดการ': ['การบัญชี', 'การตลาด', 'การจัดการทั่วไป', 'เศรษฐศาสตร์', 'การเงิน'],
    'คณะเทคโนโลยีการเกษตร': ['สัตวศาสตร์', 'พืชศาสตร์', 'เทคโนโลยีการเกษตร'],
    'คณะเทคโนโลยีสารสนเทศ': ['เทคโนโลยีสารสนเทศ', 'วิทยาการข้อมูล', 'นวัตกรรมดิจิทัล'],
    'คณะวิศวกรรมศาสตร์': ['วิศวกรรมโยธา', 'วิศวกรรมไฟฟ้า', 'วิศวกรรมเครื่องกล'],
    'คณะพยาบาลศาสตร์': ['พยาบาลศาสตร์'],
    'คณะสาธารณสุขศาสตร์': ['สาธารณสุขศาสตร์', 'อนามัยสิ่งแวดล้อม'],
    'คณะนิติศาสตร์': ['นิติศาสตร์'],
  };
  
  // Core state
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // UI state
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [validationErrors, setValidationErrors] = useState({});
  const [settingsDialog, setSettingsDialog] = useState(false);

  
  // Address state
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [amphoeOptions, setAmphoeOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  
  // Work History states
  const [workHistory, setWorkHistory] = useState([]);
  const [workHistoryLoading, setWorkHistoryLoading] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user?.id) {
      setSnackbar({ open: true, message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน', severity: 'error' });
      setLoading(false);
      return;
    }
    fetchUserData();
    fetchWorkHistory();
    setProvinceOptions(addressData.provinces.map(p => p.name));
  }, [user]);

  // Address effects (same as before)
  useEffect(() => {
    if (formData.province) {
      const province = addressData.provinces.find(p => p.name === formData.province);
      setAmphoeOptions(province ? province.amphoes.map(a => a.name) : []);
      if (formData.province !== userData?.province) {
        setFormData(prev => ({ ...prev, district: '', subdistrict: '', zipcode: '' }));
      }
      setDistrictOptions([]);
    }
  }, [formData.province, userData?.province]);

  useEffect(() => {
    if (formData.province && formData.district) {
      const province = addressData.provinces.find(p => p.name === formData.province);
      const amphoe = province ? province.amphoes.find(a => a.name === formData.district) : null;
      setDistrictOptions(amphoe ? amphoe.districts.map(d => d.name) : []);
      if (formData.district !== userData?.district) {
        setFormData(prev => ({ ...prev, subdistrict: '', zipcode: '' }));
      }
    }
  }, [formData.district, userData?.district]);

  useEffect(() => {
    if (formData.province && formData.district && formData.subdistrict) {
      const province = addressData.provinces.find(p => p.name === formData.province);
      const amphoe = province ? province.amphoes.find(a => a.name === formData.district) : null;
      const district = amphoe ? amphoe.districts.find(d => d.name === formData.subdistrict) : null;
      if (district) {
        setFormData(prev => ({ ...prev, zipcode: district.zipcode }));
      }
    }
  }, [formData.subdistrict]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/users/${user.id}`);
      const data = response.data;
      
      setUserData(data);
      setFormData(data);
      
      if (data.profile_image) {
        setImagePreview(`http://localhost:5000/uploads/profiles/${data.profile_image}`);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setSnackbar({ open: true, message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล', severity: 'error' });
      setLoading(false);
    }
  };

  const fetchWorkHistory = async () => {
    try {
      setWorkHistoryLoading(true);
      const response = await axios.get(`http://localhost:5000/api/work-history/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Work history response:', response.data);
      setWorkHistory(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching work history:', error);
      setWorkHistory([]);
    } finally {
      setWorkHistoryLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({ open: true, message: 'ขนาดไฟล์ต้องไม่เกิน 5MB', severity: 'error' });
        return;
      }
      
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const errors = {};
      if (!formData.name?.trim()) errors.name = 'กรุณากรอกชื่อ-นามสกุล';
      if (!formData.email?.trim()) errors.email = 'กรุณากรอกอีเมล';
      if (!formData.phone?.trim()) errors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setSaving(false);
        return;
      }

      if (profileImage) {
        const imageFormData = new FormData();
        imageFormData.append('profile_image', profileImage);
        await axios.post(`http://localhost:5000/api/users/${user.id}/upload-image`, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      await axios.put(`http://localhost:5000/api/users/${user.id}`, formData);
      
      setSnackbar({ open: true, message: 'บันทึกข้อมูลสำเร็จ! 🎉', severity: 'success' });
      setEditMode(false);
      fetchUserData();
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setSnackbar({ open: true, message: 'เกิดข้อผิดพลาดในการบันทึก', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const renderField = (name, label, value, type = 'text', options = null, readonly = false) => {
    if (!editMode) {
      return (
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {label}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: '#2d3748', fontWeight: 500, fontSize: '1.1rem' }}>
            {value || (type === 'textarea' ? 'ยังไม่มีข้อมูล' : 'ไม่ระบุ')}
          </Typography>
        </Box>
      );
    }

    if (type === 'select' && options) {
      return (
        <FormControl fullWidth margin="normal" error={!!validationErrors[name]}>
          <InputLabel sx={{ fontWeight: 500 }}>{label}</InputLabel>
          <Select
            value={formData[name] || ''}
            onChange={(e) => handleInputChange(name, e.target.value)}
            label={label}
            sx={{
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    return (
      <CustomTextField
        fullWidth
        label={label}
        value={formData[name] || ''}
        onChange={(e) => handleInputChange(name, e.target.value)}
        margin="normal"
        multiline={type === 'textarea'}
        rows={type === 'textarea' ? 4 : 1}
        type={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'text'}
        error={!!validationErrors[name]}
        helperText={validationErrors[name]}
        InputProps={{ readOnly: readonly }}
      />
    );
  };

  const renderEducationField = (name, label, value, fieldType) => {
    if (!editMode) {
      return (
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {label}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: '#2d3748', fontWeight: 500, fontSize: '1.1rem' }}>
            {value || 'ไม่ระบุ'}
          </Typography>
        </Box>
      );
    }

    let options = [];
    let disabled = false;

    if (fieldType === 'faculty') {
      options = Object.keys(majorOptionsByFaculty);
    } else if (fieldType === 'major') {
      options = formData.faculty ? majorOptionsByFaculty[formData.faculty] || [] : [];
      disabled = !formData.faculty;
    }

    return (
      <FormControl fullWidth margin="normal" error={!!validationErrors[name]} disabled={disabled}>
        <InputLabel sx={{ fontWeight: 500 }}>{label}</InputLabel>
        <Select
          value={formData[name] || ''}
          onChange={(e) => {
            if (fieldType === 'faculty') {
              // เมื่อเปลี่ยนคณะ ให้รีเซ็ตสาขาวิชา
              handleInputChange('faculty', e.target.value);
              handleInputChange('major', '');
            } else {
              handleInputChange(name, e.target.value);
            }
          }}
          label={label}
          sx={{
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {fieldType === 'major' && !formData.faculty ? (
            <MenuItem disabled>กรุณาเลือกคณะก่อน</MenuItem>
          ) : (
            options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    );
  };

  const renderAddressField = (name, label, value, fieldType) => {
    if (!editMode) {
      return (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {label}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: '#2d3748', fontWeight: 500 }}>
            {value || 'ไม่ระบุ'}
          </Typography>
        </Box>
      );
    }

    let options = [];
    let disabled = false;

    switch (fieldType) {
      case 'province':
        options = provinceOptions;
        break;
      case 'district':
        options = amphoeOptions;
        disabled = !formData.province;
        break;
      case 'subdistrict':
        options = districtOptions;
        disabled = !formData.district;
        break;
    }

    return (
      <FormControl fullWidth margin="normal" error={!!validationErrors[name]} disabled={disabled}>
        <InputLabel sx={{ fontWeight: 500 }}>{label}</InputLabel>
        <Select
          value={formData[name] || ''}
          onChange={(e) => handleInputChange(name, e.target.value)}
          label={label}
          sx={{
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  if (loading) {
    return (
      <ModernLayout>
        <ProfileContainer maxWidth="xl">
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4, mb: 4 }} />
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        </ProfileContainer>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout>
      <ProfileContainer maxWidth="xl">
        {/* Hero Section */}
        <Fade in timeout={600}>
          <HeroSection>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <ProfileAvatar
                    src={imagePreview}
                    alt={userData?.name}
                    onClick={() => editMode && fileInputRef.current?.click()}
                  >
                    {!imagePreview && userData?.name?.charAt(0)}
                  </ProfileAvatar>
                  
                  {editMode && (
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 5,
                        right: 5,
                        bgcolor: 'white',
                        color: '#667eea',
                        width: 40,
                        height: 40,
                        '&:hover': { bgcolor: '#f8f9fa', transform: 'scale(1.1)' },
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                      }}
                      size="small"
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                    {userData?.name || 'ไม่ระบุชื่อ'}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 2, fontWeight: 400 }}>
                    {userData?.faculty || 'ไม่ระบุคณะ'} • {userData?.major || 'ไม่ระบุสาขา'}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6, fontSize: '1.1rem' }}>
                    {userData?.bio || 'ยังไม่มีการแนะนำตัว'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {!editMode ? (
                    <>
                      <ActionBtn
                        variant="primary"
                        startIcon={<EditIcon />}
                        onClick={() => setEditMode(true)}
                        fullWidth
                      >
                        แก้ไขโปรไฟล์
                      </ActionBtn>
                    </>
                  ) : (
                    <>
                      <ActionBtn
                        variant="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={saving}
                        fullWidth
                      >
                        {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                      </ActionBtn>
                      <ActionBtn
                        variant="secondary"
                        startIcon={<CloseIcon />}
                        onClick={() => {
                          setEditMode(false);
                          setFormData(userData);
                          setValidationErrors({});
                        }}
                        fullWidth
                      >
                        ยกเลิก
                      </ActionBtn>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </HeroSection>
        </Fade>

        {/* Navigation Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: '16px 16px 0 0',
                minHeight: 48,
                '&.Mui-selected': {
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: 'white',
                }
              }
            }}
          >
            <Tab icon={<PersonIcon />} label="ข้อมูลส่วนตัว" />
            <Tab icon={<SchoolIcon />} label="การศึกษาและงาน" />
            <Tab icon={<LocationIcon />} label="ที่อยู่และการติดต่อ" />
            <Tab icon={<WorkIcon />} label="ประวัติการทำงาน" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <InfoCard>
                <CardContent>
                  <SectionHeader>
                    <PersonIcon sx={{ color: '#667eea', fontSize: '2rem' }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                        ข้อมูลส่วนตัว
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ข้อมูลพื้นฐานและการติดต่อ
                      </Typography>
                    </Box>
                  </SectionHeader>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      {renderField('name', 'ชื่อ-นามสกุล', userData?.name)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderField('email', 'อีเมล', userData?.email, 'email')}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderField('phone', 'เบอร์โทรศัพท์', userData?.phone, 'tel')}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderField('graduation_year', 'ปีที่จบการศึกษา', userData?.graduation_year)}
                    </Grid>
                    <Grid item xs={12}>
                      {renderField('bio', 'แนะนำตัว', userData?.bio, 'textarea')}
                    </Grid>
                  </Grid>
                </CardContent>
              </InfoCard>
            </Grid>

            <Grid item xs={12} lg={4}>
              <InfoCard>
                <CardContent>
                  <SectionHeader>
                    <TrendingUpIcon sx={{ color: '#10b981', fontSize: '2rem' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        สถิติโปรไฟล์
                      </Typography>
                    </Box>
                  </SectionHeader>
                  
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>ความสมบูรณ์โปรไฟล์</Typography>
                      <Typography sx={{ fontWeight: 700, color: '#667eea' }}>85%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={85} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          borderRadius: 4,
                        }
                      }} 
                    />
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <DateRangeIcon sx={{ color: '#10b981' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">สมาชิกตั้งแต่</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>2024</Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <SchoolIcon sx={{ color: '#f59e0b' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">สถานะการศึกษา</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>จบการศึกษา</Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </InfoCard>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <InfoCard>
                <CardContent>
                  <SectionHeader>
                    <SchoolIcon sx={{ color: '#f59e0b', fontSize: '2rem' }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                        ข้อมูลการศึกษา
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ประวัติการศึกษาและผลการเรียน
                      </Typography>
                    </Box>
                  </SectionHeader>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      {renderEducationField('faculty', 'คณะ', userData?.faculty, 'faculty')}
                    </Grid>
                    <Grid item xs={12}>
                      {renderEducationField('major', 'สาขาวิชา', userData?.major, 'major')}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderField('gpa', 'เกรดเฉลี่ย', userData?.gpa)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderField('graduation_year', 'ปีที่จบ', userData?.graduation_year)}
                    </Grid>
                  </Grid>
                </CardContent>
              </InfoCard>
            </Grid>

            <Grid item xs={12} lg={6}>
              <InfoCard>
                <CardContent>
                  <SectionHeader>
                    <BusinessCenterIcon sx={{ color: '#8b5cf6', fontSize: '2rem' }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                        ข้อมูลการทำงาน
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ประสบการณ์และตำแหน่งปัจจุบัน
                      </Typography>
                    </Box>
                  </SectionHeader>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      {renderField('occupation', 'อาชีพปัจจุบัน', userData?.occupation)}
                    </Grid>
                    <Grid item xs={12}>
                      {renderField('position', 'ตำแหน่งงาน', userData?.position)}
                    </Grid>
                    <Grid item xs={12}>
                      {renderField('workplace', 'สถานที่ทำงาน', userData?.workplace)}
                    </Grid>
                    <Grid item xs={12}>
                      {renderField('salary', 'เงินเดือน', userData?.salary ? `${userData.salary} บาท` : '')}
                    </Grid>
                  </Grid>
                </CardContent>
              </InfoCard>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <InfoCard>
                <CardContent>
                  <SectionHeader>
                    <LocationIcon sx={{ color: '#10b981', fontSize: '2rem' }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                        ที่อยู่
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ข้อมูลที่อยู่และการติดต่อ
                      </Typography>
                    </Box>
                  </SectionHeader>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      {renderField('address', 'ที่อยู่', userData?.address, 'textarea')}
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      {renderAddressField('province', 'จังหวัด', userData?.province, 'province')}
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      {renderAddressField('district', 'อำเภอ', userData?.district, 'district')}
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      {renderAddressField('subdistrict', 'ตำบล', userData?.subdistrict, 'subdistrict')}
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      {renderField('zipcode', 'รหัสไปรษณีย์', userData?.zipcode, 'text', null, true)}
                    </Grid>
                  </Grid>
                </CardContent>
              </InfoCard>
            </Grid>

            <Grid item xs={12} lg={4}>
              <InfoCard>
                <CardContent>
                  <SectionHeader>
                    <PublicIcon sx={{ color: '#3b82f6', fontSize: '2rem' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        ช่องทางติดต่อ
                      </Typography>
                    </Box>
                  </SectionHeader>
                  
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <EmailIcon sx={{ color: '#667eea' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">อีเมล</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {userData?.email || 'ไม่ระบุ'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PhoneIcon sx={{ color: '#10b981' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">เบอร์โทร</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {userData?.phone || 'ไม่ระบุ'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        โซเชียลมีเดีย
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip icon={<Facebook />} label="Facebook" variant="outlined" />
                        <Chip icon={<Instagram />} label="Instagram" variant="outlined" />
                        <Chip icon={<LinkedIn />} label="LinkedIn" variant="outlined" />
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </InfoCard>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <InfoCard>
                <CardContent>
                  <SectionHeader>
                    <WorkIcon sx={{ color: '#8b5cf6', fontSize: '2rem' }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                        ประวัติการทำงาน
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        จัดการและดูประวัติการทำงานของคุณ
                      </Typography>
                    </Box>
                  </SectionHeader>
                  
                  {workHistoryLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : workHistory.length > 0 ? (
                    <Box sx={{ mt: 3 }}>
                      {workHistory.map((work, index) => (
                        <Paper
                          key={work.id}
                          sx={{
                            p: 3,
                            mb: 2,
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <WorkIcon sx={{ color: '#667eea', fontSize: '2rem', mt: 0.5 }} />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                                  {work.position}
                                </Typography>
                                {work.is_current && (
                                  <Chip 
                                    label="ปัจจุบัน" 
                                    size="small" 
                                    color="success" 
                                    sx={{ fontSize: '0.75rem' }} 
                                  />
                                )}
                              </Box>
                              <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                                {work.company}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {new Date(work.start_date).toLocaleDateString('th-TH', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })} - {work.end_date ? new Date(work.end_date).toLocaleDateString('th-TH', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                }) : 'ปัจจุบัน'}
                                {work.location && ` • ${work.location}`}
                              </Typography>
                              {work.description && (
                                <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.6, mb: 2 }}>
                                  <strong>รายละเอียดงาน:</strong> {work.description}
                                </Typography>
                              )}
                              {(work.min_salary || work.max_salary) && (
                                <Typography variant="body2" sx={{ color: '#38a169', fontWeight: 600 }}>
                                  ช่วงเงินเดือน: {work.min_salary?.toLocaleString()} - {work.max_salary?.toLocaleString()} บาท
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                      
                      <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <ActionBtn 
                          variant="outlined" 
                          startIcon={<WorkIcon />}
                          component={Link}
                          to="/work-history"
                        >
                          จัดการประวัติการทำงาน
                        </ActionBtn>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <WorkIcon sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        ยังไม่มีประวัติการทำงาน
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        เพิ่มประวัติการทำงานเพื่อแสดงประสบการณ์ของคุณ
                      </Typography>
                      <ActionBtn 
                        variant="primary" 
                        startIcon={<AddIcon />}
                        component={Link}
                        to="/work-history"
                      >
                        เพิ่มประวัติการทำงาน
                      </ActionBtn>
                    </Box>
                  )}
                </CardContent>
              </InfoCard>
            </Grid>
          </Grid>
        </TabPanel>



        {/* Progress Bar */}
        {saving && (
          <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000 }}>
            <LinearProgress 
              sx={{
                height: 4,
                background: 'rgba(102, 126, 234, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                }
              }}
            />
          </Box>
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ 
              width: '100%',
              borderRadius: '16px',
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </ProfileContainer>
    </ModernLayout>
  );
}

export default UltraModernProfilePage;
