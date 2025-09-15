import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Grid, 
  MenuItem,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Home as HomeIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as RegisterIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import logo from '../../assets/images/logo.png';
import addressData from '../../assets/thai-address-full.json';

function Register() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Common TextField styling
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#2f4b3f'
        }
      },
      '&.Mui-focused': {
        backgroundColor: 'white',
        boxShadow: '0 0 0 3px rgba(47, 75, 63, 0.1)'
      }
    }
  };
  
  // สาขาวิชาแต่ละคณะ
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
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    student_id: '',
    email: '',
    phone: '',
    graduation_year: '',
    faculty: '',
    major: '',
    address: '',
    address_subdistrict: '',
    address_district: '',
    address_province: '',
    address_postcode: ''
  });
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [amphoeOptions, setAmphoeOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [postcode, setPostcode] = useState('');

  useEffect(() => {
    // ดึงรายชื่อจังหวัดจาก json ที่ export มาใหม่
    setProvinceOptions(addressData.provinces.map(p => p.name));
  }, []);

  useEffect(() => {
    if (formData.address_province) {
      // ดึงรายชื่ออำเภอจากจังหวัดที่เลือก
      const province = addressData.provinces.find(p => p.name === formData.address_province);
      setAmphoeOptions(province ? province.amphoes.map(a => a.name) : []);
      setFormData(f => ({ ...f, address_district: '', address_subdistrict: '', address_postcode: '' }));
      setDistrictOptions([]);
      setPostcode('');
    }
  }, [formData.address_province]);

  useEffect(() => {
    if (formData.address_province && formData.address_district) {
      // ดึงรายชื่อตำบลจากอำเภอที่เลือก
      const province = addressData.provinces.find(p => p.name === formData.address_province);
      const amphoe = province ? province.amphoes.find(a => a.name === formData.address_district) : null;
      setDistrictOptions(amphoe ? amphoe.districts.map(d => d.name) : []);
      setFormData(f => ({ ...f, address_subdistrict: '', address_postcode: '' }));
      setPostcode('');
    }
  }, [formData.address_district]);

  useEffect(() => {
    if (formData.address_province && formData.address_district && formData.address_subdistrict) {
      // ดึงรหัสไปรษณีย์จากตำบลที่เลือก
      const province = addressData.provinces.find(p => p.name === formData.address_province);
      const amphoe = province ? province.amphoes.find(a => a.name === formData.address_district) : null;
      const district = amphoe ? amphoe.districts.find(d => d.name === formData.address_subdistrict) : null;
      setPostcode(district ? district.zipcode : '');
      setFormData(f => ({ ...f, address_postcode: district ? district.zipcode : '' }));
    }
  }, [formData.address_subdistrict]);

  const validateForm = () => {
    setError('');
    const requiredFields = [
      'title', 'firstName', 'lastName', 'password', 'student_id', 'email', 'phone',
      'graduation_year', 'faculty', 'major'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        setError('กรุณากรอกข้อมูลให้ครบทุกช่องที่มีเครื่องหมาย *');
        return false;
      }
    }
    
    if (!/^\d{12}$/.test(formData.student_id)) {
      setError('รหัสนักศึกษาต้องเป็นตัวเลข 12 หลัก');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return false;
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    try {
      const { confirmPassword, firstName, lastName, address_province, address_district, address_subdistrict, address_postcode, ...rest } = formData;
      const dataToSubmit = {
        ...rest,
        name: `${firstName} ${lastName}`.trim(),
        province: address_province,
        district: address_district,
        subdistrict: address_subdistrict,
        zipcode: address_postcode
      };
      const response = await axios.post('http://localhost:5000/api/users/register', dataToSubmit);
      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: 'ลงทะเบียนสำเร็จ!',
          text: 'ยินดีต้อนรับสู่ชุมชนศิษย์เก่า RMU',
          confirmButtonText: 'เข้าสู่ระบบ',
          confirmButtonColor: theme.palette.primary.main
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
    } finally {
      setLoading(false);
    }
  };



  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2f4b3f 0%, #3a5c4b 100%)',
        py: 4,
        position: 'relative'
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 15px 30px -8px rgba(47, 75, 63, 0.12), 0 0 0 1px rgba(47, 75, 63, 0.1)',
            border: '1px solid rgba(47, 75, 63, 0.3)',
            maxWidth: 900
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2f4b3f 0%, #1f3329 100%)',
              color: 'white',
              p: 3,
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1.5,
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: 40, height: 40, borderRadius: '50%' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-logo.png';
                  }}
                />
              </Box>
              <Typography 
                variant="h4" 
                fontWeight={700} 
                mb={0.5} 
                sx={{ 
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  background: 'linear-gradient(45deg, #fff 30%, #f1f5f9 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                ลงทะเบียนศิษย์เก่า
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.9, 
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 400,
                  maxWidth: 350,
                  mx: 'auto'
                }}
              >
                เข้าร่วมชุมชนศิษย์เก่า มหาวิทยาลัยราชภัฏมหาสารคาม
              </Typography>
            </Box>
          </Box>

          {/* Form Content */}
          <Box sx={{ p: { xs: 2.5, md: 3 } }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                  border: '1px solid #fca5a5',
                  '& .MuiAlert-icon': {
                    color: '#dc2626'
                  }
                }}
              >
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* ข้อมูลส่วนตัว */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
                      borderRadius: 2,
                      p: 2.5,
                      border: '1px solid #bfdbfe',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #2f4b3f 0%, #3a5c4b 100%)',
                        borderRadius: '8px 8px 0 0'
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      sx={{ 
                        mb: 1.5, 
                        display: 'flex', 
                        alignItems: 'center',
                        color: '#2f4b3f',
                        fontSize: { xs: '1.1rem', md: '1.25rem' }
                      }}
                    >
                      <Box
                        sx={{
                          background: 'linear-gradient(135deg, #2f4b3f 0%, #3a5c4b 100%)',
                          borderRadius: '50%',
                          p: 1,
                          mr: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                        }}
                      >
                        <PersonIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
                      </Box>
                      ข้อมูลส่วนตัว
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth sx={textFieldStyles}>
                    <InputLabel>คำนำหน้า *</InputLabel>
                    <Select
                      value={formData.title}
                      label="คำนำหน้า *"
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    >
                      <MenuItem value="นาย">นาย</MenuItem>
                      <MenuItem value="นาง">นาง</MenuItem>
                      <MenuItem value="นางสาว">นางสาว</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={4.5}>
                  <TextField
                    fullWidth
                    label="ชื่อ *"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    helperText="กรุณาระบุชื่อจริงตามเอกสารทางราชการ"
                    sx={textFieldStyles}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4.5}>
                  <TextField
                    fullWidth
                    label="นามสกุล *"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    helperText="กรุณาระบุนามสกุลตามเอกสารทางราชการ"
                    sx={textFieldStyles}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="email"
                    label="อีเมล *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    helperText="ใช้สำหรับเข้าสู่ระบบและรับข่าวสาร (เช่น example@email.com)"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#6b7280' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="เบอร์โทรศัพท์ *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    helperText="หมายเลขโทรศัพท์มือถือ 10 หลัก (เช่น 0812345678)"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: '#6b7280' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="รหัสผ่าน *"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    helperText="ความยาวอย่างน้อย 6 ตัวอักษร ควรผสมตัวเลขและตัวอักษร"
                    sx={textFieldStyles}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#6b7280' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="ยืนยันรหัสผ่าน *"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                    helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'รหัสผ่านไม่ตรงกัน' : 'กรุณาใส่รหัสผ่านเดียวกันเพื่อยืนยัน'}
                    sx={textFieldStyles}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            sx={{ color: '#6b7280' }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* ข้อมูลการศึกษา */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                      borderRadius: 2,
                      p: 2.5,
                      mt: 1,
                      border: '1px solid #bbf7d0',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #2f4b3f 0%, #3a5c4b 100%)',
                        borderRadius: '8px 8px 0 0'
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      sx={{ 
                        mb: 1.5, 
                        display: 'flex', 
                        alignItems: 'center',
                        color: '#065f46',
                        fontSize: { xs: '1.1rem', md: '1.25rem' }
                      }}
                    >
                      <Box
                        sx={{
                          background: 'linear-gradient(135deg, #2f4b3f 0%, #3a5c4b 100%)',
                          borderRadius: '50%',
                          p: 1,
                          mr: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                        }}
                      >
                        <SchoolIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
                      </Box>
                      ข้อมูลการศึกษา
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="รหัสนักศึกษา *"
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    helperText="รหัสนักศึกษาเดิมของคุณ 12 หลัก (เช่น 123456789012)"
                    sx={textFieldStyles}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="ปีที่จบ *"
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                    helperText="ปีที่จบการศึกษาตามปฏิทิน พ.ศ. (เช่น 2567)"
                    inputProps={{ min: 2500, max: new Date().getFullYear() + 543 }}
                    sx={textFieldStyles}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={textFieldStyles}>
                    <InputLabel>คณะ *</InputLabel>
                    <Select
                      value={formData.faculty}
                      label="คณะ *"
                      onChange={(e) => setFormData({ ...formData, faculty: e.target.value, major: '' })}
                    >
                      {Object.keys(majorOptionsByFaculty).map((faculty) => (
                        <MenuItem key={faculty} value={faculty}>{faculty}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!formData.faculty} sx={textFieldStyles}>
                    <InputLabel>สาขาวิชา *</InputLabel>
                    <Select
                      value={formData.major}
                      label="สาขาวิชา *"
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    >
                      {formData.faculty && majorOptionsByFaculty[formData.faculty]?.map((major) => (
                        <MenuItem key={major} value={major}>{major}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* ข้อมูลที่อยู่และงาน */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%)',
                      borderRadius: 2,
                      p: 2.5,
                      mt: 1,
                      border: '1px solid #fcd34d',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #f9c74f 0%, #f7b32b 100%)',
                        borderRadius: '8px 8px 0 0'
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      sx={{ 
                        mb: 1.5, 
                        display: 'flex', 
                        alignItems: 'center',
                        color: '#92400e',
                        fontSize: { xs: '1.1rem', md: '1.25rem' }
                      }}
                    >
                      <Box
                        sx={{
                          background: 'linear-gradient(135deg, #f9c74f 0%, #f7b32b 100%)',
                          borderRadius: '50%',
                          p: 1,
                          mr: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                        }}
                      >
                        <HomeIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
                      </Box>
                      ข้อมูลเพิ่มเติม
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="ที่อยู่"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="บ้านเลขที่ หมู่บ้าน ซอย ถนน"
                    helperText="ที่อยู่ปัจจุบันของคุณ"
                    sx={textFieldStyles}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth sx={textFieldStyles}>
                    <InputLabel>จังหวัด</InputLabel>
                    <Select
                      value={formData.address_province}
                      label="จังหวัด"
                      onChange={(e) => setFormData({ ...formData, address_province: e.target.value })}
                    >
                      {provinceOptions.map((province) => (
                        <MenuItem key={province} value={province}>{province}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth disabled={!formData.address_province} sx={textFieldStyles}>
                    <InputLabel>อำเภอ</InputLabel>
                    <Select
                      value={formData.address_district}
                      label="อำเภอ"
                      onChange={(e) => setFormData({ ...formData, address_district: e.target.value })}
                    >
                      {amphoeOptions.map((amphoe) => (
                        <MenuItem key={amphoe} value={amphoe}>{amphoe}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth disabled={!formData.address_district} sx={textFieldStyles}>
                    <InputLabel>ตำบล</InputLabel>
                    <Select
                      value={formData.address_subdistrict}
                      label="ตำบล"
                      onChange={(e) => setFormData({ ...formData, address_subdistrict: e.target.value })}
                    >
                      {districtOptions.map((district) => (
                        <MenuItem key={district} value={district}>{district}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="รหัสไปรษณีย์"
                    value={postcode}
                    InputProps={{ readOnly: true }}
                    helperText="ระบบจะกรอกให้อัตโนมัติเมื่อเลือกตำบล"
                    sx={textFieldStyles}
                  />
                </Grid>
              </Grid>
              
              {/* Submit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <RegisterIcon />}
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    background: '#2f4b3f',
                    minWidth: 220,
                    minHeight: 48,
                    boxShadow: '0 8px 20px rgba(47, 75, 63, 0.3)',
                    border: '1px solid rgba(47, 75, 63, 0.2)',
                    '&:hover': {
                      background: '#1f3329',
                      boxShadow: '0 10px 25px rgba(47, 75, 63, 0.4)',
                    }
                  }}
                >
                  {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนเข้าร่วม'}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Footer */}
          <Box 
            sx={{ 
              p: 3, 
              textAlign: 'center', 
              borderTop: '1px solid rgba(203, 213, 225, 0.3)', 
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              position: 'relative'
            }}
          >
            <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1rem' }}>
              มีบัญชีอยู่แล้ว?{' '}
              <Button
                component={Link}
                to="/login"
                variant="text"
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#2f4b3f',
                  textDecoration: 'none',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '0',
                    height: '2px',
                    bottom: 0,
                    left: '50%',
                    backgroundColor: '#2f4b3f',
                    transition: 'all 0.3s ease'
                  },
                  '&:hover': { 
                    backgroundColor: 'transparent',
                    color: '#1f3329',
                    '&::after': {
                      width: '100%',
                      left: '0'
                    }
                  }
                }}
              >
                เข้าสู่ระบบที่นี่
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;

