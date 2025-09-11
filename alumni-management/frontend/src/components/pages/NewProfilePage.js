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
  useMediaQuery,
  useTheme
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
  Visibility as ViewIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import ModernLayout from '../layout/ModernLayout';
import './NewProfilePage.css';
import addressData from '../../assets/thai-address-full.json';

// Styled Components
const ProfileContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4),
  maxWidth: '1200px',
  position: 'relative'
}));

const ProfileHeroCard = styled(Card)(({ theme }) => ({
  borderRadius: '24px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: theme.spacing(3)
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  fontSize: '3rem',
  fontWeight: 'bold',
  border: '4px solid white',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
  }
}));

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid #f0f0f0',
  marginBottom: theme.spacing(3),
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea, #764ba2)'
  }
}));

const SectionTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  fontWeight: 600,
  fontSize: '1.1rem',
  color: '#2d3748'
}));





const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '8px 24px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
  }
}));







function NewProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Core state
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // UI state
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [validationErrors, setValidationErrors] = useState({});
  const [profileViews, setProfileViews] = useState(0);
  const [error, setError] = useState(null);
  
  // Address state
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [amphoeOptions, setAmphoeOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log('🔍 Checking user login status:', user);
    
    if (!user?.id) {
      console.log('❌ User not logged in or missing ID');
      setSnackbar({ open: true, message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน', severity: 'error' });
      setLoading(false);
      return;
    }
    
    console.log('✅ User logged in with ID:', user.id);
    fetchUserData();
    
    // Initialize provinces
    setProvinceOptions(addressData.provinces.map(p => p.name));
  }, [user]);

  // Address effects
  useEffect(() => {
    if (formData.province) {
      // Get amphoes for selected province
      const province = addressData.provinces.find(p => p.name === formData.province);
      setAmphoeOptions(province ? province.amphoes.map(a => a.name) : []);
      
      // Reset dependent fields if province changes
      if (formData.province !== userData?.province) {
        setFormData(prev => ({ 
          ...prev, 
          district: '', 
          subdistrict: '', 
          zipcode: '' 
        }));
      }
      setDistrictOptions([]);
    }
  }, [formData.province, userData?.province]);

  useEffect(() => {
    if (formData.province && formData.district) {
      // Get districts for selected amphoe
      const province = addressData.provinces.find(p => p.name === formData.province);
      const amphoe = province ? province.amphoes.find(a => a.name === formData.district) : null;
      setDistrictOptions(amphoe ? amphoe.districts.map(d => d.name) : []);
      
      // Reset dependent fields if district changes
      if (formData.district !== userData?.district) {
        setFormData(prev => ({ 
          ...prev, 
          subdistrict: '', 
          zipcode: '' 
        }));
      }
    }
  }, [formData.district, userData?.district]);

  useEffect(() => {
    if (formData.province && formData.district && formData.subdistrict) {
      // Get zipcode for selected district
      const province = addressData.provinces.find(p => p.name === formData.province);
      const amphoe = province ? province.amphoes.find(a => a.name === formData.district) : null;
      const district = amphoe ? amphoe.districts.find(d => d.name === formData.subdistrict) : null;
      
      if (district) {
        setFormData(prev => ({ ...prev, zipcode: district.zipcode }));
      }
    }
  }, [formData.subdistrict]);

  // Initialize address options when userData is loaded
  useEffect(() => {
    if (userData) {
      console.log('🏠 Initializing address options with userData:', {
        province: userData.province,
        district: userData.district,
        subdistrict: userData.subdistrict
      });
      
      // Initialize formData with userData (เพิ่มบรรทัดนี้)
      setFormData(prev => ({
        ...prev,
        ...userData
      }));
      
      // Initialize province options
      setProvinceOptions(addressData.provinces.map(p => p.name));
      
      // If user has province, set amphoe options
      if (userData.province) {
        const province = addressData.provinces.find(p => p.name === userData.province);
        if (province) {
          setAmphoeOptions(province.amphoes.map(a => a.name));
          console.log('✅ Set amphoe options for province:', userData.province);
          
          // If user has district, set district options
          if (userData.district) {
            const amphoe = province.amphoes.find(a => a.name === userData.district);
            if (amphoe) {
              setDistrictOptions(amphoe.districts.map(d => d.name));
              console.log('✅ Set district options for amphoe:', userData.district);
              
              // If user has subdistrict, set zipcode
              if (userData.subdistrict) {
                const district = amphoe.districts.find(d => d.name === userData.subdistrict);
                if (district && !userData.zipcode) {
                  setFormData(prev => ({ ...prev, zipcode: district.zipcode }));
                  console.log('✅ Set zipcode for district:', userData.subdistrict, '→', district.zipcode);
                }
              }
            }
          }
        }
      }
    }
  }, [userData]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 กำลังโหลดข้อมูลผู้ใช้ ID:', user.id);
      
      const response = await axios.get(`http://localhost:5000/api/users/${user.id}`);
      console.log('✅ โหลดข้อมูลสำเร็จ:', response.data);
      
      const data = response.data;
      
      console.log('📋 Address data received:', {
        address: data.address,
        province: data.province,
        district: data.district,
        subdistrict: data.subdistrict,
        zipcode: data.zipcode
      });
      
      setUserData(data);
      setFormData(data);
      
      // Set additional data
      setProfileViews(data.profile_views || 0);
      
      if (data.profile_image) {
        setImagePreview(`http://localhost:5000/uploads/profiles/${data.profile_image}`);
      }
      
      setLoading(false);
      console.log('✅ Profile loading completed');
      
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      let errorMessage = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
      
      if (error.response?.status === 404) {
        errorMessage = 'ไม่พบข้อมูลผู้ใช้';
      } else if (error.response?.status === 500) {
        errorMessage = 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
      }
      
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      setError(errorMessage);
      setLoading(false);
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
      
      // Validate required fields
      const errors = {};
      if (!formData.name?.trim()) errors.name = 'กรุณากรอกชื่อ-นามสกุล';
      if (!formData.email?.trim()) errors.email = 'กรุณากรอกอีเมล';
      if (!formData.phone?.trim()) errors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setSaving(false);
        return;
      }

      // Upload image if changed
      if (profileImage) {
        const imageFormData = new FormData();
        imageFormData.append('profile_image', profileImage);
        
        await axios.post(`http://localhost:5000/api/users/${user.id}/upload-image`, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // Update user data
      const updateData = {
        ...formData
      };

      await axios.put(`http://localhost:5000/api/users/${user.id}`, updateData);
      
      setSnackbar({ open: true, message: 'บันทึกข้อมูลสำเร็จ', severity: 'success' });
      setEditMode(false);
      fetchUserData();
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setSnackbar({ open: true, message: 'เกิดข้อผิดพลาดในการบันทึก', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };





  const renderAddressField = (name, label, value, fieldType) => {
    if (!editMode) {
      // สำหรับฟิลด์ address หลัก ให้รวมข้อมูลที่อยู่ทั้งหมด
      let displayValue = value;
      
      if (name === 'address' && (!value || value.trim() === '')) {
        // ถ้า address ว่าง ให้สร้างที่อยู่จากจังหวัด อำเภอ ตำบล
        const addressParts = [];
        if (userData?.subdistrict) addressParts.push(`ตำบล${userData.subdistrict}`);
        if (userData?.district) addressParts.push(`อำเภอ${userData.district}`);
        if (userData?.province) addressParts.push(`จังหวัด${userData.province}`);
        if (userData?.zipcode) addressParts.push(userData.zipcode);
        
        displayValue = addressParts.length > 0 ? addressParts.join(' ') : 'ยังไม่มีข้อมูล';
      }
      
      return (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5, color: '#2d3748' }}>
            {displayValue || (name === 'address' ? 'ยังไม่มีข้อมูล' : 'ไม่ระบุ')}
          </Typography>
        </Box>
      );
    }

    let options = [];
    let disabled = false;
    let currentValue = formData[name] || '';

    // สำหรับฟิลด์ address ให้ใช้ textarea แทน dropdown
    if (fieldType === 'address') {
      return (
        <TextField
          fullWidth
          label={label}
          multiline
          rows={3}
          value={currentValue}
          onChange={(e) => handleInputChange(name, e.target.value)}
          error={!!validationErrors[name]}
          helperText={validationErrors[name]}
          margin="normal"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px'
            }
          }}
        />
      );
    }

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

    // Debug logging
    console.log(`🏠 ${label} field:`, {
      name,
      currentValue,
      optionsLength: options.length,
      disabled,
      formDataValue: formData[name],
      originalValue: value
    });

    return (
      <FormControl fullWidth margin="normal" error={!!validationErrors[name]} disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={currentValue}
          onChange={(e) => {
            console.log(`🔄 ${label} changed to:`, e.target.value);
            handleInputChange(name, e.target.value);
          }}
          label={label}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px'
            }
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

  const renderField = (name, label, value, type = 'text', options = null, readonly = false) => {
    if (!editMode) {
      return (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5, color: '#2d3748' }}>
            {value || 'ไม่ระบุ'}
          </Typography>
        </Box>
      );
    }

    if (type === 'select' && options) {
      return (
        <FormControl fullWidth margin="normal" error={!!validationErrors[name]}>
          <InputLabel>{label}</InputLabel>
          <Select
            value={formData[name] || ''}
            onChange={(e) => handleInputChange(name, e.target.value)}
            label={label}
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
      <TextField
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
        InputProps={{
          readOnly: readonly
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px'
          }
        }}
      />
    );
  };

  if (!user?.id) {
    return (
      <ModernLayout>
        <ProfileContainer maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <PersonIcon sx={{ fontSize: 100, color: 'grey.400', mb: 2 }} />
            <Typography variant="h4" gutterBottom color="text.secondary">
              กรุณาเข้าสู่ระบบ
            </Typography>
            <Typography variant="body1" color="text.secondary">
              คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถดูโปรไฟล์ได้
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 3 }}
              onClick={() => window.location.href = '/login'}
            >
              เข้าสู่ระบบ
            </Button>
          </Box>
        </ProfileContainer>
      </ModernLayout>
    );
  }

  if (loading) {
    return (
      <ModernLayout>
        <ProfileContainer maxWidth="lg">
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3, mb: 4 }} />
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        </ProfileContainer>
      </ModernLayout>
    );
  }

  if (error && !userData) {
    return (
      <ModernLayout>
        <ProfileContainer maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Alert severity="error" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                เกิดข้อผิดพลาดในการโหลดข้อมูล
              </Typography>
              <Typography variant="body2">
                {error}
              </Typography>
            </Alert>
            <Button 
              variant="contained" 
              onClick={fetchUserData}
              sx={{ mr: 2 }}
            >
              ลองใหม่
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => window.location.href = '/dashboard'}
            >
              กลับหน้าหลัก
            </Button>
          </Box>
        </ProfileContainer>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout>
      <ProfileContainer>
        {/* Profile Hero Section */}
        <Fade in timeout={600}>
          <ProfileHeroCard>
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <StyledAvatar
                      src={imagePreview}
                      alt={userData?.name}
                      onClick={() => editMode && fileInputRef.current?.click()}
                    >
                      {!imagePreview && userData?.name?.charAt(0)}
                    </StyledAvatar>
                    
                    {editMode && (
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <IconButton
                            size="small"
                            sx={{
                              bgcolor: 'white',
                              color: '#667eea',
                              '&:hover': { bgcolor: '#f8f9fa' },
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }}
                          >
                            <PhotoCameraIcon fontSize="small" />
                          </IconButton>
                        }
                      />
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
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                    {userData?.name || 'ไม่ระบุชื่อ'}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 2, fontWeight: 400 }}>
                    {userData?.faculty || 'ไม่ระบุคณะ'} • {userData?.major || 'ไม่ระบุสาขา'}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8, mb: 3, lineHeight: 1.6 }}>
                    {userData?.bio || 'ยังไม่มีการแนะนำตัว'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {!editMode ? (
                      <>
                        <ActionButton
                          variant="contained"
                          startIcon={<EditIcon />}
                          onClick={() => {
                            console.log('🎯 Entering edit mode with userData:', userData);
                            setEditMode(true);
                            setFormData({ ...userData });
                            console.log('📝 FormData set to:', { ...userData });
                          }}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.3)'
                            }
                          }}
                        >
                          แก้ไขโปรไฟล์
                        </ActionButton>
                      </>
                    ) : (
                      <>
                        <ActionButton
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={saving}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.3)'
                            }
                          }}
                        >
                          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                        </ActionButton>
                        
                        <ActionButton
                          variant="outlined"
                          startIcon={<CloseIcon />}
                          onClick={() => {
                            setEditMode(false);
                            setFormData(userData);
                            setValidationErrors({});
                          }}
                          sx={{
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.3)',
                            '&:hover': {
                              borderColor: 'rgba(255,255,255,0.5)',
                              bgcolor: 'rgba(255,255,255,0.1)'
                            }
                          }}
                        >
                          ยกเลิก
                        </ActionButton>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
              

            </CardContent>
          </ProfileHeroCard>
        </Fade>

        {/* Main Content - Single Layout */}
        <Grid container spacing={3}>
          {/* Left Column - Main Information */}
          <Grid item xs={12} lg={8}>
            {/* Personal & Contact Information */}
            <Fade in timeout={800}>
              <InfoCard>
                <CardContent sx={{ p: 4 }}>
                  <SectionTitle>
                    <PersonIcon sx={{ color: '#667eea' }} />
                    ข้อมูลส่วนตัวและการติดต่อ
                  </SectionTitle>
                  
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
            </Fade>

            {/* Education & Career */}
            <Fade in timeout={1000}>
              <InfoCard>
                <CardContent sx={{ p: 4 }}>
                  <SectionTitle>
                    <SchoolIcon sx={{ color: '#f59e0b' }} />
                    การศึกษาและประสบการณ์การทำงาน
                  </SectionTitle>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      {renderField('faculty', 'คณะ', userData?.faculty)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderField('major', 'สาขาวิชา', userData?.major)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderField('gpa', 'เกรดเฉลี่ย', userData?.gpa)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderField('occupation', 'อาชีพปัจจุบัน', userData?.occupation)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderField('position', 'ตำแหน่งงาน', userData?.position)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderField('workplace', 'สถานที่ทำงาน', userData?.workplace)}
                    </Grid>
                  </Grid>
                </CardContent>
              </InfoCard>
            </Fade>

          </Grid>

          {/* Right Column - Secondary Information */}
          <Grid item xs={12} lg={4}>
            {/* Address Information */}
            <Fade in timeout={900}>
              <InfoCard>
                <CardContent sx={{ p: 3 }}>
                  <SectionTitle>
                    <LocationIcon sx={{ color: '#10b981' }} />
                    ที่อยู่
                  </SectionTitle>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {renderAddressField('address', 'ที่อยู่', userData?.address, 'address')}
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
            </Fade>




          </Grid>
        </Grid>



        {/* Progress Bar */}
        {(saving || uploadingImage) && (
          <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000 }}>
            <LinearProgress />
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
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </ProfileContainer>
    </ModernLayout>
  );
}

export default NewProfilePage;
