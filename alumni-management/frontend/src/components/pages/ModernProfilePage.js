import React, { useState, useEffect } from 'react';
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
  Chip,
  Divider,
  Skeleton,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Fade
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
  BusinessCenter as BusinessCenterIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import ModernLayout from '../layout/ModernLayout';
import './ModernProfilePage.css';

// Styled Components
const ProfileContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4),
  maxWidth: '1000px',
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e5e7eb',
  marginBottom: theme.spacing(3),
  overflow: 'visible',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  fontSize: '2rem',
  fontWeight: 'bold',
  backgroundColor: '#f3f4f6',
  color: '#6b7280',
  cursor: 'pointer',
}));

const InfoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e5e7eb',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
    backgroundColor: '#f9fafb',
    '&:hover': {
      backgroundColor: '#f3f4f6',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.125rem',
  fontWeight: 600,
  color: '#1f2937',
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const provinces = [
  'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 'ขอนแก่น',
  'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 
  'เชียงใหม่', 'ตรัง', 'ตราด', 'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม', 'นครราชสีมา',
  'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส', 'น่าน', 'บึงกาฬ', 'บุรีรัมย์',
  'ปทุมธานี', 'ประจวบคีรีขันธ์', 'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พังงา',
  'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 'แพร่', 'ภูเก็ต', 'มหาสารคาม',
  'มุกดาหาร', 'แม่ฮ่องสอน', 'ยโสธร', 'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง', 'ราชบุรี',
  'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย', 'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ',
  'สมุทรสาคร', 'สมุทรสงคราม', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย', 'สุพรรณบุรี',
  'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู', 'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี',
  'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี'
];

function ModernProfilePage() {
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!user?.id) {
      setSnackbar({ open: true, message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน', severity: 'error' });
      setLoading(false);
      return;
    }
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/users/${user.id}`);
      setUserData(response.data);
      setFormData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setSnackbar({ open: true, message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล', severity: 'error' });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSnackbar({ open: true, message: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น', severity: 'error' });
        return;
      }
      
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

  const uploadProfileImage = async () => {
    if (!profileImage) return userData.profile_image;

    const imageFormData = new FormData();
    imageFormData.append('profileImage', profileImage);

    setUploadingImage(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/${user.id}/upload-profile-image`,
        imageFormData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.imageUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error('การอัปโหลดรูปภาพล้มเหลว');
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'กรุณากรอกชื่อ-นามสกุล';
    }
    
    if (!formData.email?.trim()) {
      errors.email = 'กรุณากรอกอีเมล';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    
    if (!formData.faculty?.trim()) {
      errors.faculty = 'กรุณากรอกชื่อคณะ';
    }
    
    if (!formData.major?.trim()) {
      errors.major = 'กรุณากรอกชื่อสาขาวิชา';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน', severity: 'error' });
      return;
    }

    setSaving(true);
    try {
      let imageUrl = userData.profile_image;
      if (profileImage) {
        imageUrl = await uploadProfileImage();
      }

      const updateData = { ...formData, profile_image: imageUrl };
      const response = await axios.put(`http://localhost:5000/api/users/${user.id}`, updateData);

      if (response.data.status === 'success') {
        setUserData(response.data.user);
        setFormData(response.data.user);
        setEditMode(false);
        setProfileImage(null);
        setImagePreview(null);
        setSnackbar({ open: true, message: 'บันทึกข้อมูลสำเร็จ!', severity: 'success' });
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setSnackbar({ open: true, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setEditMode(false);
    setProfileImage(null);
    setImagePreview(null);
    setValidationErrors({});
  };

  const renderField = (name, label, value, type = 'text', options = null) => {
    if (!editMode) {
      return (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ color: '#374151', mt: 0.5 }}>
            {value || 'ไม่ระบุ'}
          </Typography>
        </Box>
      );
    }

    if (options) {
      return (
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel sx={{ fontSize: '0.875rem' }}>{label}</InputLabel>
          <Select
            name={name}
            value={formData[name] || ''}
            onChange={handleInputChange}
            label={label}
            error={!!validationErrors[name]}
            sx={{ 
              borderRadius: 1,
              backgroundColor: '#f9fafb',
              '&:hover': { backgroundColor: '#f3f4f6' }
            }}
          >
            <MenuItem value="">เลือก{label}</MenuItem>
            {options.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    return (
      <StyledTextField
        fullWidth
        name={name}
        label={label}
        value={formData[name] || ''}
        onChange={handleInputChange}
        type={type}
        size="small"
        error={!!validationErrors[name]}
        helperText={validationErrors[name]}
        multiline={type === 'textarea'}
        rows={type === 'textarea' ? 3 : 1}
      />
    );
  };

  if (loading) {
    return (
      <ModernLayout>
        <ProfileContainer maxWidth="lg">
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 4 }} />
          <Grid container spacing={3}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </ProfileContainer>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout>
      <ProfileContainer>
        {/* Profile Header Card */}
        <Fade in timeout={600}>
          <ProfileCard>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm="auto">
                  <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, position: 'relative' }}>
                    <input
                      accept="image/*"
                      id="profile-image-upload"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                      disabled={!editMode}
                    />
                    <label htmlFor="profile-image-upload">
                      <StyledAvatar
                        src={imagePreview || (userData?.profile_image ? `http://localhost:5000${userData.profile_image}` : '')}
                        sx={{ cursor: editMode ? 'pointer' : 'default' }}
                      >
                        {!imagePreview && !userData?.profile_image && (userData?.name?.charAt(0) || '👤')}
                      </StyledAvatar>
                    </label>
                    {editMode && (
                      <Tooltip title="เปลี่ยนรูปโปรไฟล์">
                        <IconButton
                          sx={{
                            position: 'absolute',
                            bottom: -5,
                            right: -5,
                            bgcolor: '#3b82f6',
                            color: 'white',
                            '&:hover': { bgcolor: '#2563eb' },
                            width: 32,
                            height: 32
                          }}
                          size="small"
                          component="label"
                          htmlFor="profile-image-upload"
                        >
                          <PhotoCameraIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1f2937', mb: 1 }}>
                      {userData?.name || 'ไม่ระบุชื่อ'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280', mb: 2 }}>
                      {userData?.faculty || 'ไม่ระบุคณะ'} • {userData?.major || 'ไม่ระบุสาขา'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {userData?.graduation_year && (
                        <Chip
                          icon={<CelebrationIcon />}
                          label={`รุ่น ${userData.graduation_year}`}
                          size="small"
                          sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 500 }}
                        />
                      )}
                      {userData?.occupation && (
                        <Chip
                          icon={<BusinessCenterIcon />}
                          label={userData.occupation}
                          size="small"
                          sx={{ bgcolor: '#f0fdf4', color: '#15803d', fontWeight: 500 }}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm="auto">
                  <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                    {!editMode ? (
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => setEditMode(true)}
                        sx={{
                          bgcolor: '#3b82f6',
                          '&:hover': { bgcolor: '#2563eb' },
                          borderRadius: 2,
                          px: 3,
                          py: 1
                        }}
                      >
                        แก้ไขข้อมูล
                      </Button>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                        <Button
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={saving || uploadingImage}
                          sx={{
                            bgcolor: '#10b981',
                            '&:hover': { bgcolor: '#059669' },
                            borderRadius: 2
                          }}
                        >
                          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CloseIcon />}
                          onClick={handleCancel}
                          sx={{
                            borderColor: '#d1d5db',
                            color: '#6b7280',
                            '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' },
                            borderRadius: 2
                          }}
                        >
                          ยกเลิก
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </ProfileCard>
        </Fade>

        {/* Information Cards */}
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={600} style={{ transitionDelay: '100ms' }}>
              <InfoCard>
                <CardContent sx={{ p: 3 }}>
                  <SectionTitle>
                    <PersonIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                    ข้อมูลส่วนตัว
                  </SectionTitle>
                  <Divider sx={{ mb: 3, borderColor: '#e5e7eb' }} />

                  {renderField('name', 'ชื่อ-นามสกุล', userData?.name)}
                  {renderField('email', 'อีเมล', userData?.email, 'email')}
                  {renderField('phone', 'เบอร์โทร', userData?.phone, 'tel')}
                  {renderField('graduation_year', 'ปีที่จบการศึกษา', userData?.graduation_year, 'select', 
                    Array.from({ length: 30 }, (_, i) => 2024 - i))}
                </CardContent>
              </InfoCard>
            </Fade>
          </Grid>

          {/* Education Information */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={600} style={{ transitionDelay: '200ms' }}>
              <InfoCard>
                <CardContent sx={{ p: 3 }}>
                  <SectionTitle>
                    <SchoolIcon sx={{ color: '#10b981', fontSize: 20 }} />
                    ข้อมูลการศึกษา
                  </SectionTitle>
                  <Divider sx={{ mb: 3, borderColor: '#e5e7eb' }} />

                  {renderField('faculty', 'คณะ', userData?.faculty)}
                  {renderField('major', 'สาขาวิชา', userData?.major)}
                </CardContent>
              </InfoCard>
            </Fade>
          </Grid>

          {/* Work Information */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={600} style={{ transitionDelay: '300ms' }}>
              <InfoCard>
                <CardContent sx={{ p: 3 }}>
                  <SectionTitle>
                    <WorkIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                    ข้อมูลการทำงาน
                  </SectionTitle>
                  <Divider sx={{ mb: 3, borderColor: '#e5e7eb' }} />

                  {renderField('occupation', 'อาชีพ', userData?.occupation)}
                  {renderField('position', 'ตำแหน่ง', userData?.position)}
                  {renderField('workplace', 'สถานที่ทำงาน', userData?.workplace)}
                  {renderField('salary', 'เงินเดือน (บาท)', userData?.salary ? `${userData.salary} บาท` : '', 'number')}
                </CardContent>
              </InfoCard>
            </Fade>
          </Grid>

          {/* Address Information */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={600} style={{ transitionDelay: '400ms' }}>
              <InfoCard>
                <CardContent sx={{ p: 3 }}>
                  <SectionTitle>
                    <HomeIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
                    ที่อยู่
                  </SectionTitle>
                  <Divider sx={{ mb: 3, borderColor: '#e5e7eb' }} />

                  {renderField('address', 'ที่อยู่', userData?.address, 'textarea')}
                  {renderField('province', 'จังหวัด', userData?.province, 'select', provinces)}
                  {renderField('district', 'อำเภอ', userData?.district)}
                  {renderField('subdistrict', 'ตำบล', userData?.subdistrict)}
                  {renderField('zipcode', 'รหัสไปรษณีย์', userData?.zipcode)}
                </CardContent>
              </InfoCard>
            </Fade>
          </Grid>

          {/* Bio Section */}
          <Grid item xs={12}>
            <Fade in timeout={600} style={{ transitionDelay: '500ms' }}>
              <InfoCard>
                <CardContent sx={{ p: 3 }}>
                  <SectionTitle>
                    <PersonIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                    แนะนำตัว
                  </SectionTitle>
                  <Divider sx={{ mb: 3, borderColor: '#e5e7eb' }} />

                  {renderField('bio', 'เกี่ยวกับฉัน', userData?.bio || 'ยังไม่มีข้อมูลแนะนำตัว', 'textarea')}
                </CardContent>
              </InfoCard>
            </Fade>
          </Grid>
        </Grid>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </ProfileContainer>
    </ModernLayout>
  );
}

export default ModernProfilePage;
