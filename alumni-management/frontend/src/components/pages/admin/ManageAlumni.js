
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  Stack,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminLayout from '../../layout/AdminLayout';
import addressData from '../../../assets/thai-address-full.json';

const ManageAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [viewingAlumni, setViewingAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    student_id: '',
    email: '',
    phone: '',
    graduation_year: '',
    faculty: '',
    major: '',
    address_province: '',
    address_district: '',
    address_subdistrict: '',
    address_postcode: '',
    current_address: '',
    bio: '',
    password: '',
    confirmPassword: ''
  });
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
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [amphoeOptions, setAmphoeOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [postcode, setPostcode] = useState('');

  // Dropdown logic เหมือนหน้า register
  useEffect(() => {
    setProvinceOptions(addressData.provinces.map(p => p.name));
  }, []);

  // เมื่อ province เปลี่ยน ให้ setAmphoeOptions และ setDistrictOptions (รองรับทั้งกรณีเลือกใหม่และกรณีแก้ไข)
  useEffect(() => {
    if (formData.address_province) {
      const province = addressData.provinces.find(p => p.name === formData.address_province);
      setAmphoeOptions(province ? province.amphoes.map(a => a.name) : []);
      // ถ้ามี address_district เดิม ให้ setDistrictOptions ทันที
      if (formData.address_district) {
        const amphoe = province ? province.amphoes.find(a => a.name === formData.address_district) : null;
        setDistrictOptions(amphoe ? amphoe.districts.map(d => d.name) : []);
      } else {
        setDistrictOptions([]);
      }
    } else {
      setAmphoeOptions([]);
      setDistrictOptions([]);
    }
  }, [formData.address_province, formData.address_district]);

  // เมื่อ district เปลี่ยน ให้ setDistrictOptions และ postcode (รองรับทั้งกรณีเลือกใหม่และกรณีแก้ไข)
  useEffect(() => {
    if (formData.address_province && formData.address_district) {
      const province = addressData.provinces.find(p => p.name === formData.address_province);
      const amphoe = province ? province.amphoes.find(a => a.name === formData.address_district) : null;
      setDistrictOptions(amphoe ? amphoe.districts.map(d => d.name) : []);
      // ถ้ามี address_subdistrict เดิม ให้ setPostcode ทันที
      if (formData.address_subdistrict) {
        const district = amphoe ? amphoe.districts.find(d => d.name === formData.address_subdistrict) : null;
        setPostcode(district ? district.zipcode : '');
      } else {
        setPostcode('');
      }
    }
  }, [formData.address_province, formData.address_district, formData.address_subdistrict]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      // ดึงข้อมูล user ทั้งหมดที่ role = 'user'
      const response = await axios.get('http://localhost:5000/api/admin/alumni', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // รองรับทั้งกรณี backend ส่ง { status, alumni } หรือ array ตรงๆ
      let alumniList = [];
      if (Array.isArray(response.data)) {
        alumniList = response.data;
      } else if (response.data && response.data.alumni) {
        alumniList = response.data.alumni;
      }
      // ใช้ข้อมูลโดยตรงจาก API
      setAlumni(alumniList);
    } catch (err) {
      setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลศิษย์เก่าได้');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (alumniData = null) => {
    setSelectedAlumni(alumniData);
    if (alumniData) {
      // แยกชื่อ-นามสกุล
      let firstName = '', lastName = '';
      if (alumniData.name) {
        const parts = alumniData.name.split(' ');
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ');
      }
      // เตรียม dropdown อำเภอ/ตำบล ให้แสดงค่าตามจังหวัด/อำเภอที่มีอยู่
      let amphoes = [], districts = [];
      if (alumniData.province) {
        const provinceObj = addressData.provinces.find(p => p.name === alumniData.province);
        amphoes = provinceObj ? provinceObj.amphoes.map(a => a.name) : [];
        if (alumniData.district) {
          const amphoeObj = provinceObj ? provinceObj.amphoes.find(a => a.name === alumniData.district) : null;
          districts = amphoeObj ? amphoeObj.districts.map(d => d.name) : [];
        }
      }
      setAmphoeOptions(amphoes);
      setDistrictOptions(districts);
      setFormData({
        title: alumniData.title || '',
        firstName,
        lastName,
        student_id: alumniData.student_id || '',
        email: alumniData.email || '',
        phone: alumniData.phone || '',
        graduation_year: alumniData.graduation_year || '',
        faculty: alumniData.faculty || '',
        major: alumniData.major || '',
        address_province: alumniData.province || '',
        address_district: alumniData.district || '',
        address_subdistrict: alumniData.subdistrict || '',
        address_postcode: alumniData.zipcode || '',
        current_address: alumniData.current_address || '',
        bio: alumniData.bio || '',
        password: '',
        confirmPassword: ''
      });
      setPostcode(alumniData.zipcode || '');
    } else {
      setFormData({
        title: '', firstName: '', lastName: '', student_id: '', email: '', phone: '', graduation_year: '', faculty: '', major: '', address_province: '', address_district: '', address_subdistrict: '', address_postcode: '', current_address: '', bio: '', password: '', confirmPassword: ''
      });
      setAmphoeOptions([]);
      setDistrictOptions([]);
      setPostcode('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAlumni(null);
    setFormData({
      student_id: '',
      name: '',
      faculty: '',
      major: '',
      graduation_year: '',
      email: ''
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields (เหมือน register)
    if (!formData.title || !formData.firstName || !formData.lastName || !formData.student_id || !formData.email || !formData.phone || !formData.graduation_year || !formData.faculty || !formData.major) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    if (!/^[0-9]{12}$/.test(formData.student_id)) {
      setError('รหัสนักศึกษาต้องเป็นตัวเลข 12 หลัก');
      return;
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก');
      return;
    }
    if (!selectedAlumni && (!formData.password || formData.password.length < 6)) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (!selectedAlumni && formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const dataToSend = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        province: formData.address_province,
        district: formData.address_district,
        subdistrict: formData.address_subdistrict,
        zipcode: formData.address_postcode
      };
      if (selectedAlumni) {
        delete dataToSend.password;
        delete dataToSend.confirmPassword;
        await axios.put(
          `http://localhost:5000/api/admin/alumni/${selectedAlumni.id}`,
          dataToSend,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        Swal.fire('สำเร็จ', 'อัพเดทข้อมูลศิษย์เก่าเรียบร้อย', 'success');
      } else {
        await axios.post(
          'http://localhost:5000/api/admin/alumni',
          dataToSend,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        Swal.fire('สำเร็จ', 'เพิ่มข้อมูลศิษย์เก่าเรียบร้อย', 'success');
      }
      handleCloseModal();
      await fetchAlumni();
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const result = await Swal.fire({
        title: 'ยืนยันการลบ',
        text: 'คุณต้องการลบข้อมูลศิษย์เก่านี้ใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่, ลบข้อมูล',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/api/admin/alumni/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        Swal.fire('สำเร็จ', 'ลบข้อมูลศิษย์เก่าเรียบร้อย', 'success');
        fetchAlumni();
      }
    } catch (err) {
      Swal.fire('Error', 'ไม่สามารถลบข้อมูลศิษย์เก่าได้', 'error');
    }
  };

  const handleViewAlumni = async (alumni) => {
    try {
      const token = localStorage.getItem('token');
      
      // ดึงข้อมูลประวัติการทำงาน
      const workHistoryResponse = await axios.get(`http://localhost:5000/api/work-history/user/${alumni.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setViewingAlumni({
        ...alumni,
        workHistory: workHistoryResponse.data || []
      });
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching work history:', err);
      // แสดงข้อมูลโดยไม่มีประวัติการทำงาน
      setViewingAlumni({
        ...alumni,
        workHistory: []
      });
      setShowViewModal(true);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingAlumni(null);
  };

  // ฟิลเตอร์ข้อมูลตามช่องค้นหา
  const filteredAlumni = alumni.filter(person => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (person.student_id || '').toLowerCase().includes(q) ||
      (person.name || '').toLowerCase().includes(q) ||
      (person.faculty || '').toLowerCase().includes(q) ||
      (person.major || '').toLowerCase().includes(q) ||
      (person.graduation_year ? String(person.graduation_year) : '').includes(q) ||
      (person.email || '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={50} />
            <Typography variant="h6" color="text.secondary">
              กำลังโหลดข้อมูล...
            </Typography>
          </Stack>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 4,
            mb: 4
          }}
        >
          <Container maxWidth="xl" sx={{ pl: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700} mb={1}>
                  <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  จัดการข้อมูลศิษย์เก่า
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  จัดการข้อมูลศิษย์เก่า มหาวิทยาลัยราชภัฏมหาสารคาม
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleShowModal()}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                เพิ่มข้อมูลศิษย์เก่า
              </Button>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ pb: 4, pl: 4 }}>
          {error && (
            <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Search */}
          <Box sx={{ mb: 3, maxWidth: 500 }}>
            <TextField
              fullWidth
              placeholder="ค้นหา รหัสนักศึกษา, ชื่อ, คณะ, สาขาวิชา, ปีที่จบ, อีเมล, อาชีพ"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: 'white',
                  '&:hover': {
                    '& > fieldset': { borderColor: '#667eea' }
                  }
                }
              }}
            />
          </Box>
          {/* Alumni Table */}
          <Card 
            elevation={0}
            sx={{
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              '&:hover': {
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>รหัสนักศึกษา</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>ชื่อ-นามสกุล</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>คณะ</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>สาขาวิชา</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>ปีที่จบ</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>อีเมล</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>จัดการ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAlumni.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          ไม่พบข้อมูลศิษย์เก่า
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAlumni.map((person, idx) => (
                        <TableRow 
                          key={person.id}
                          sx={{ 
                            '&:nth-of-type(odd)': { bgcolor: '#f8fafc' },
                            '&:hover': { bgcolor: '#e2e8f0' }
                          }}
                        >
                          <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {idx + 1}
                          </TableCell>
                          <TableCell>{person.student_id}</TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                                <PersonIcon sx={{ fontSize: 16 }} />
                              </Avatar>
                              <Typography fontWeight={600}>{person.name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{person.faculty}</TableCell>
                          <TableCell>{person.major}</TableCell>
                          <TableCell>
                            <Chip 
                              label={person.graduation_year} 
                              size="small" 
                              sx={{
                                bgcolor: '#667eea',
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell>{person.email}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                size="small"
                                onClick={() => handleViewAlumni(person)}
                                sx={{
                                  color: '#3b82f6',
                                  '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' }
                                }}
                                title="ดูข้อมูล"
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleShowModal(person)}
                                sx={{
                                  color: '#f59e0b',
                                  '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)' }
                                }}
                                title="แก้ไข"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(person.id)}
                                sx={{
                                  color: '#ef4444',
                                  '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' }
                                }}
                                title="ลบ"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Dialog 
        open={showModal} 
        onClose={handleCloseModal} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            maxHeight: '90vh',
            overflow: 'auto'
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <PersonIcon />
            {selectedAlumni ? 'แก้ไขข้อมูลศิษย์เก่า' : 'เพิ่มข้อมูลศิษย์เก่า'}
          </DialogTitle>
          <DialogContent sx={{ bgcolor: '#f8fafc', p: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            {/* ข้อมูลพื้นฐาน */}
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
              ข้อมูลพื้นฐาน
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth required size="small">
                  <InputLabel>คำนำหน้า</InputLabel>
                  <Select
                    value={formData.title}
                    label="คำนำหน้า"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  >
                    <MenuItem value="">เลือก</MenuItem>
                    <MenuItem value="นาย">นาย</MenuItem>
                    <MenuItem value="นาง">นาง</MenuItem>
                    <MenuItem value="นางสาว">นางสาว</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="ชื่อ"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="นามสกุล"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="รหัสนักศึกษา"
                  inputProps={{ pattern: "\\d{12}" }}
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="tel"
                  label="เบอร์โทรศัพท์"
                  inputProps={{ pattern: "\\d{10}" }}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="number"
                  label="ปีที่จบ"
                  inputProps={{ min: 2500, max: new Date().getFullYear() + 543 }}
                  value={formData.graduation_year}
                  onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="email"
                  label="อีเมล"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
            </Grid>

            {/* ข้อมูลการศึกษา */}
            <Typography variant="h6" sx={{ mt: 3, mb: 2, color: 'primary.main', fontWeight: 600 }}>
              ข้อมูลการศึกษา
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required size="small">
                  <InputLabel>คณะ</InputLabel>
                  <Select
                    value={formData.faculty}
                    label="คณะ"
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value, major: '' })}
                  >
                    <MenuItem value="">เลือกคณะ</MenuItem>
                    {Object.keys(majorOptionsByFaculty).map(fac => (
                      <MenuItem key={fac} value={fac}>{fac}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required disabled={!formData.faculty} size="small">
                  <InputLabel>สาขาวิชา</InputLabel>
                  <Select
                    value={formData.major}
                    label="สาขาวิชา"
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  >
                    <MenuItem value="">เลือกสาขาวิชา</MenuItem>
                    {formData.faculty && majorOptionsByFaculty[formData.faculty]?.map(major => (
                      <MenuItem key={major} value={major}>{major}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {/* รหัสผ่าน (สำหรับเพิ่มข้อมูลใหม่เท่านั้น) */}
            {!selectedAlumni && (
              <>
                <Typography variant="h6" sx={{ mt: 3, mb: 2, color: 'primary.main', fontWeight: 600 }}>
                  รหัสผ่าน
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      type="password"
                      label="รหัสผ่าน"
                      inputProps={{ minLength: 6 }}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      type="password"
                      label="ยืนยันรหัสผ่าน"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                      helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'รหัสผ่านไม่ตรงกัน' : ''}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* ที่อยู่ */}
            <Typography variant="h6" sx={{ mt: 3, mb: 2, color: 'primary.main', fontWeight: 600 }}>
              ที่อยู่
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>จังหวัด</InputLabel>
                  <Select
                    value={formData.address_province}
                    label="จังหวัด"
                    onChange={(e) => {
                      const province = e.target.value;
                      setFormData(f => ({ ...f, address_province: province, address_district: '', address_subdistrict: '', address_postcode: '' }));
                      const provinceObj = addressData.provinces.find(p => p.name === province);
                      setAmphoeOptions(provinceObj ? provinceObj.amphoes.map(a => a.name) : []);
                      setDistrictOptions([]);
                      setPostcode('');
                    }}
                  >
                    <MenuItem value="">เลือกจังหวัด</MenuItem>
                    {provinceOptions.map(province => (
                      <MenuItem key={province} value={province}>{province}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth disabled={!formData.address_province} size="small">
                  <InputLabel>อำเภอ</InputLabel>
                  <Select
                    value={formData.address_district}
                    label="อำเภอ"
                    onChange={(e) => {
                      const amphoe = e.target.value;
                      setFormData(f => ({ ...f, address_district: amphoe, address_subdistrict: '', address_postcode: '' }));
                      const provinceObj = addressData.provinces.find(p => p.name === formData.address_province);
                      const amphoeObj = provinceObj ? provinceObj.amphoes.find(a => a.name === amphoe) : null;
                      setDistrictOptions(amphoeObj ? amphoeObj.districts.map(d => d.name) : []);
                      setPostcode('');
                    }}
                  >
                    <MenuItem value="">เลือกอำเภอ</MenuItem>
                    {amphoeOptions.map(amphoe => (
                      <MenuItem key={amphoe} value={amphoe}>{amphoe}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth disabled={!formData.address_district} size="small">
                  <InputLabel>ตำบล</InputLabel>
                  <Select
                    value={formData.address_subdistrict}
                    label="ตำบล"
                    onChange={(e) => {
                      const subdistrict = e.target.value;
                      setFormData(f => ({ ...f, address_subdistrict: subdistrict }));
                      const provinceObj = addressData.provinces.find(p => p.name === formData.address_province);
                      const amphoeObj = provinceObj ? provinceObj.amphoes.find(a => a.name === formData.address_district) : null;
                      const districtObj = amphoeObj ? amphoeObj.districts.find(d => d.name === subdistrict) : null;
                      setPostcode(districtObj ? districtObj.zipcode : '');
                      setFormData(f => ({ ...f, address_postcode: districtObj ? districtObj.zipcode : '' }));
                    }}
                  >
                    <MenuItem value="">เลือกตำบล</MenuItem>
                    {districtOptions.map(district => (
                      <MenuItem key={district} value={district}>{district}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="รหัสไปรษณีย์"
                  value={postcode}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  label="ที่อยู่ปัจจุบัน"
                  value={formData.current_address}
                  onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                />
              </Grid>
            </Grid>

            {/* ข้อมูลเพิ่มเติม */}
            <Typography variant="h6" sx={{ mt: 3, mb: 2, color: 'primary.main', fontWeight: 600 }}>
              ข้อมูลเพิ่มเติม
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  label="ข้อมูลเพิ่มเติม (Bio)"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="เล่าเพิ่มเติมเกี่ยวกับตัวเอง..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions 
            sx={{ 
              bgcolor: '#f8fafc', 
              borderTop: '1px solid #e2e8f0',
              p: 2,
              gap: 2,
              justifyContent: 'flex-end'
            }}
          >
            <Button 
              onClick={handleCloseModal}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2, px: 3 }}
            >
              ยกเลิก
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              size="small"
              sx={{ 
                borderRadius: 2, 
                px: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {selectedAlumni ? 'บันทึกการแก้ไข' : 'เพิ่มข้อมูล'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal สำหรับดูข้อมูลศิษย์เก่า */}
      <Dialog 
        open={showViewModal} 
        onClose={handleCloseViewModal} 
        maxWidth="lg" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            maxHeight: '90vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 2,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background decorations */}
          <Box sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            opacity: 0.7
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            opacity: 0.8
          }} />
          
          {/* Header content */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
              <Avatar sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                width: 40, 
                height: 40,
                border: '2px solid rgba(255,255,255,0.3)'
              }}>
                <PersonIcon sx={{ fontSize: 24, color: 'white' }} />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  ข้อมูลศิษย์เก่า
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  รายละเอียดข้อมูลครบถ้วน
                </Typography>
              </Box>
            </Stack>
            {viewingAlumni && (
              <Box sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)', 
                borderRadius: 2, 
                p: 1.5,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {viewingAlumni.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {viewingAlumni.student_id} • {viewingAlumni.faculty} • {viewingAlumni.major}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <DialogContent sx={{ 
          bgcolor: 'transparent', 
          p: 2,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
          {viewingAlumni && (
            <Grid container spacing={2}>
              {/* ข้อมูลส่วนตัว */}
              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Background pattern */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 80% 20%, rgba(102, 126, 234, 0.05) 0%, transparent 50%)',
                    pointerEvents: 'none'
                  }} />
                  
                  <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      pb: 1.5,
                      borderBottom: '2px solid #e2e8f0'
                    }}>
                      <Avatar sx={{ 
                        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        width: 32, 
                        height: 32,
                        mr: 1.5,
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                      }}>
                        <PersonIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        ข้อมูลส่วนตัว
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ 
                          p: 1.5, 
                          bgcolor: 'rgba(102, 126, 234, 0.05)', 
                          borderRadius: 2,
                          border: '1px solid rgba(102, 126, 234, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.15)'
                          }
                        }}>
                          <Typography variant="caption" sx={{ 
                            color: '#667eea', 
                            fontWeight: 600, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontSize: '0.7rem'
                          }}>
                            คำนำหน้า
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a365d', mt: 0.5 }}>
                            {viewingAlumni.title || '-'}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={8}>
                        <Box sx={{ 
                          p: 1.5, 
                          bgcolor: 'rgba(102, 126, 234, 0.05)', 
                          borderRadius: 2,
                          border: '1px solid rgba(102, 126, 234, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.15)'
                          }
                        }}>
                          <Typography variant="caption" sx={{ 
                            color: '#667eea', 
                            fontWeight: 600, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontSize: '0.7rem'
                          }}>
                            ชื่อ-นามสกุล
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a365d', mt: 0.5 }}>
                            {viewingAlumni.name || '-'}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          p: 1.5, 
                          bgcolor: 'rgba(102, 126, 234, 0.05)', 
                          borderRadius: 2,
                          border: '1px solid rgba(102, 126, 234, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.15)'
                          }
                        }}>
                          <Typography variant="caption" sx={{ 
                            color: '#667eea', 
                            fontWeight: 600, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontSize: '0.7rem'
                          }}>
                            รหัสนักศึกษา
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a365d', mt: 0.5 }}>
                            {viewingAlumni.student_id || '-'}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          p: 1.5, 
                          bgcolor: 'rgba(102, 126, 234, 0.05)', 
                          borderRadius: 2,
                          border: '1px solid rgba(102, 126, 234, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.15)'
                          }
                        }}>
                          <Typography variant="caption" sx={{ 
                            color: '#667eea', 
                            fontWeight: 600, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontSize: '0.7rem'
                          }}>
                            ปีที่จบการศึกษา
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a365d', mt: 0.5 }}>
                            {viewingAlumni.graduation_year || '-'}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          p: 1.5, 
                          bgcolor: 'rgba(102, 126, 234, 0.05)', 
                          borderRadius: 2,
                          border: '1px solid rgba(102, 126, 234, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.15)'
                          }
                        }}>
                          <Typography variant="caption" sx={{ 
                            color: '#667eea', 
                            fontWeight: 600, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontSize: '0.7rem'
                          }}>
                            คณะ
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a365d', mt: 0.5 }}>
                            {viewingAlumni.faculty || '-'}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          p: 1.5, 
                          bgcolor: 'rgba(102, 126, 234, 0.05)', 
                          borderRadius: 2,
                          border: '1px solid rgba(102, 126, 234, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.15)'
                          }
                        }}>
                          <Typography variant="caption" sx={{ 
                            color: '#667eea', 
                            fontWeight: 600, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontSize: '0.7rem'
                          }}>
                            สาขาวิชา
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a365d', mt: 0.5 }}>
                            {viewingAlumni.major || '-'}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {viewingAlumni.bio && (
                        <Grid item xs={12}>
                          <Box sx={{ 
                            p: 2, 
                            bgcolor: 'rgba(102, 126, 234, 0.05)', 
                            borderRadius: 2,
                            border: '1px solid rgba(102, 126, 234, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'rgba(102, 126, 234, 0.1)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.15)'
                            }
                          }}>
                            <Typography variant="caption" sx={{ 
                              color: '#667eea', 
                              fontWeight: 600, 
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              fontSize: '0.7rem'
                            }}>
                              แนะนำตัว
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: '#4a5568', 
                              lineHeight: 1.6, 
                              mt: 1
                            }}>
                              {viewingAlumni.bio}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* ข้อมูลการติดต่อ */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Background gradient */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.05) 0%, transparent 50%)',
                    pointerEvents: 'none'
                  }} />
                  
                  <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      pb: 1.5,
                      borderBottom: '2px solid #e8f5e8'
                    }}>
                      <Avatar sx={{ 
                        bgcolor: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', 
                        width: 32, 
                        height: 32,
                        mr: 1.5,
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                      }}>
                        📞
                      </Avatar>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: '#2e7d32'
                      }}>
                        ข้อมูลการติดต่อ
                      </Typography>
                    </Box>
                    
                    <Stack spacing={2}>
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(76, 175, 80, 0.05)', 
                        borderRadius: 2,
                        border: '1px solid rgba(76, 175, 80, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 15px rgba(76, 175, 80, 0.15)'
                        }
                      }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar sx={{ 
                            bgcolor: '#4caf50', 
                            width: 24, 
                            height: 24 
                          }}>
                            📧
                          </Avatar>
                          <Box>
                            <Typography variant="caption" sx={{ 
                              color: '#4caf50', 
                              fontWeight: 600, 
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              fontSize: '0.7rem'
                            }}>
                              อีเมล
                            </Typography>
                            <Typography variant="subtitle1" sx={{ 
                              fontWeight: 600, 
                              color: '#1a365d',
                              wordBreak: 'break-word'
                            }}>
                              {viewingAlumni.email || '-'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                      
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(76, 175, 80, 0.05)', 
                        borderRadius: 2,
                        border: '1px solid rgba(76, 175, 80, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 15px rgba(76, 175, 80, 0.15)'
                        }
                      }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar sx={{ 
                            bgcolor: '#4caf50', 
                            width: 24, 
                            height: 24 
                          }}>
                            📱
                          </Avatar>
                          <Box>
                            <Typography variant="caption" sx={{ 
                              color: '#4caf50', 
                              fontWeight: 600, 
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              fontSize: '0.7rem'
                            }}>
                              เบอร์โทรศัพท์
                            </Typography>
                            <Typography variant="subtitle1" sx={{ 
                              fontWeight: 600, 
                              color: '#1a365d'
                            }}>
                              {viewingAlumni.phone || '-'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* ข้อมูลที่อยู่ */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Background gradient */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 80% 20%, rgba(255, 152, 0, 0.05) 0%, transparent 50%)',
                    pointerEvents: 'none'
                  }} />
                  
                  <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      pb: 1.5,
                      borderBottom: '2px solid #fff3e0'
                    }}>
                      <Avatar sx={{ 
                        bgcolor: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', 
                        width: 32, 
                        height: 32,
                        mr: 1.5,
                        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
                      }}>
                        🏠
                      </Avatar>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: '#e65100'
                      }}>
                        ที่อยู่
                      </Typography>
                    </Box>
                    
                    <Stack spacing={2}>
                      {viewingAlumni.address && (
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: 'rgba(255, 152, 0, 0.05)', 
                          borderRadius: 2,
                          border: '1px solid rgba(255, 152, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(255, 152, 0, 0.1)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 15px rgba(255, 152, 0, 0.15)'
                          }
                        }}>
                          <Typography variant="caption" sx={{ 
                            color: '#ff9800', 
                            fontWeight: 600, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontSize: '0.7rem'
                          }}>
                            ที่อยู่
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: '#4a5568', 
                            mt: 1,
                            lineHeight: 1.5
                          }}>
                            {viewingAlumni.address}
                          </Typography>
                        </Box>
                      )}
                      
                      <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                          <Box sx={{ 
                            p: 1.5, 
                            bgcolor: 'rgba(255, 152, 0, 0.05)', 
                            borderRadius: 2,
                            border: '1px solid rgba(255, 152, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'rgba(255, 152, 0, 0.1)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 15px rgba(255, 152, 0, 0.15)'
                            }
                          }}>
                            <Typography variant="caption" sx={{ 
                              color: '#ff9800', 
                              fontWeight: 600, 
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              fontSize: '0.7rem'
                            }}>
                              จังหวัด
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              fontWeight: 600, 
                              color: '#1a365d', 
                              mt: 0.5 
                            }}>
                              {viewingAlumni.province || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Box sx={{ 
                            p: 1.5, 
                            bgcolor: 'rgba(255, 152, 0, 0.05)', 
                            borderRadius: 2,
                            border: '1px solid rgba(255, 152, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'rgba(255, 152, 0, 0.1)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 15px rgba(255, 152, 0, 0.15)'
                            }
                          }}>
                            <Typography variant="caption" sx={{ 
                              color: '#ff9800', 
                              fontWeight: 600, 
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              fontSize: '0.7rem'
                            }}>
                              อำเภอ
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              fontWeight: 600, 
                              color: '#1a365d', 
                              mt: 0.5 
                            }}>
                              {viewingAlumni.district || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Box sx={{ 
                            p: 1.5, 
                            bgcolor: 'rgba(255, 152, 0, 0.05)', 
                            borderRadius: 2,
                            border: '1px solid rgba(255, 152, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'rgba(255, 152, 0, 0.1)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 15px rgba(255, 152, 0, 0.15)'
                            }
                          }}>
                            <Typography variant="caption" sx={{ 
                              color: '#ff9800', 
                              fontWeight: 600, 
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              fontSize: '0.7rem'
                            }}>
                              ตำบล
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              fontWeight: 600, 
                              color: '#1a365d', 
                              mt: 0.5 
                            }}>
                              {viewingAlumni.subdistrict || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Box sx={{ 
                            p: 1.5, 
                            bgcolor: 'rgba(255, 152, 0, 0.05)', 
                            borderRadius: 2,
                            border: '1px solid rgba(255, 152, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'rgba(255, 152, 0, 0.1)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 15px rgba(255, 152, 0, 0.15)'
                            }
                          }}>
                            <Typography variant="caption" sx={{ 
                              color: '#ff9800', 
                              fontWeight: 600, 
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              fontSize: '0.7rem'
                            }}>
                              รหัสไปรษณีย์
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              fontWeight: 600, 
                              color: '#1a365d', 
                              mt: 0.5 
                            }}>
                              {viewingAlumni.zipcode || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* ประวัติการทำงาน */}
              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: 4, 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Background pattern */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 50% 50%, rgba(156, 39, 176, 0.05) 0%, transparent 50%)',
                    pointerEvents: 'none'
                  }} />
                  
                  <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      pb: 1.5,
                      borderBottom: '2px solid #f3e5f5'
                    }}>
                      <Avatar sx={{ 
                        bgcolor: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', 
                        width: 32, 
                        height: 32,
                        mr: 1.5,
                        boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)'
                      }}>
                        💼
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: '#6a1b9a',
                          mb: 0.5
                        }}>
                          ประวัติการทำงาน
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {viewingAlumni.workHistory && viewingAlumni.workHistory.length > 0 
                            ? `${viewingAlumni.workHistory.length} ประวัติการทำงาน`
                            : 'ยังไม่มีประวัติการทำงาน'
                          }
                        </Typography>
                      </Box>
                    </Box>
                    
                    {viewingAlumni.workHistory && viewingAlumni.workHistory.length > 0 ? (
                      <Stack spacing={2}>
                        {viewingAlumni.workHistory.map((work, index) => (
                          <Card 
                            key={index} 
                            variant="outlined" 
                            sx={{ 
                              borderRadius: 3, 
                              border: '2px solid #f3e5f5',
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(243, 229, 245, 0.3) 100%)',
                              transition: 'all 0.3s ease',
                              overflow: 'hidden',
                              position: 'relative',
                              '&:hover': {
                                border: '2px solid #ce93d8',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(156, 39, 176, 0.15)'
                              }
                            }}
                          >
                            {/* Timeline indicator */}
                            <Box sx={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: 3,
                              background: work.is_current 
                                ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                                : 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)'
                            }} />
                            
                            <CardContent sx={{ p: 2.5, pl: 3 }}>
                              {/* Header with Company and Position */}
                              <Box sx={{ mb: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                                  <Box>
                                    <Typography variant="h6" sx={{ 
                                      color: '#1a365d', 
                                      fontWeight: 700, 
                                      mb: 0.5,
                                      lineHeight: 1.2
                                    }}>
                                      {work.position || '-'}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ 
                                      color: '#4299e1', 
                                      fontWeight: 600, 
                                      mb: 1 
                                    }}>
                                      {work.company_name || '-'}
                                    </Typography>
                                  </Box>
                                  {work.is_current && (
                                    <Chip 
                                      label="ปัจจุบัน" 
                                      size="small" 
                                      sx={{ 
                                        bgcolor: '#4caf50',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.75rem'
                                      }}
                                    />
                                  )}
                                </Stack>
                                
                                <Box sx={{ 
                                  display: 'flex', 
                                  flexWrap: 'wrap', 
                                  gap: 2, 
                                  alignItems: 'center',
                                  p: 1.5,
                                  bgcolor: 'rgba(156, 39, 176, 0.05)',
                                  borderRadius: 2,
                                  border: '1px solid rgba(156, 39, 176, 0.1)'
                                }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ width: 20, height: 20, bgcolor: '#9c27b0' }}>
                                      📅
                                    </Avatar>
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                      {work.start_date ? new Date(work.start_date).toLocaleDateString('th-TH') : '-'} - {
                                        work.is_current ? 'ปัจจุบัน' : 
                                        (work.end_date ? new Date(work.end_date).toLocaleDateString('th-TH') : '-')
                                      }
                                    </Typography>
                                  </Box>
                                  
                                  {work.location && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Avatar sx={{ width: 20, height: 20, bgcolor: '#ff9800' }}>
                                        📍
                                      </Avatar>
                                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                        {work.location}
                                        {work.work_province && `, ${work.work_province}`}
                                        {work.work_district && `, ${work.work_district}`}
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                              </Box>

                              {/* Company Details Grid */}
                              <Grid container spacing={1.5} sx={{ mb: 2 }}>
                                {work.company_type && (
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Box sx={{ 
                                      p: 1.5, 
                                      bgcolor: 'rgba(156, 39, 176, 0.05)', 
                                      borderRadius: 2,
                                      border: '1px solid rgba(156, 39, 176, 0.1)',
                                      height: '100%'
                                    }}>
                                      <Typography variant="caption" sx={{ 
                                        color: '#9c27b0', 
                                        fontWeight: 600, 
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        fontSize: '0.7rem'
                                      }}>
                                        ประเภทองค์กร
                                      </Typography>
                                      <Typography variant="body2" sx={{ 
                                        fontWeight: 600, 
                                        color: '#1a365d', 
                                        mt: 0.5 
                                      }}>
                                        {work.company_type === 'private' ? 'เอกชน' :
                                         work.company_type === 'government' ? 'รัฐบาล' :
                                         work.company_type === 'state_enterprise' ? 'รัฐวิสาหกิจ' :
                                         work.company_type === 'ngo' ? 'องค์กรไม่แสวงหาผลกำไร' :
                                         work.company_type === 'startup' ? 'สตาร์ทอัพ' :
                                         work.company_type === 'freelance' ? 'ฟรีแลนซ์' : work.company_type}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                )}

                                {work.industry && (
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Box sx={{ 
                                      p: 1.5, 
                                      bgcolor: 'rgba(156, 39, 176, 0.05)', 
                                      borderRadius: 2,
                                      border: '1px solid rgba(156, 39, 176, 0.1)',
                                      height: '100%'
                                    }}>
                                      <Typography variant="caption" sx={{ 
                                        color: '#9c27b0', 
                                        fontWeight: 600, 
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        fontSize: '0.7rem'
                                      }}>
                                        อุตสาหกรรม
                                      </Typography>
                                      <Typography variant="body2" sx={{ 
                                        fontWeight: 600, 
                                        color: '#1a365d', 
                                        mt: 0.5 
                                      }}>
                                        {work.industry}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                )}

                                {work.company_size && (
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Box sx={{ 
                                      p: 1.5, 
                                      bgcolor: 'rgba(156, 39, 176, 0.05)', 
                                      borderRadius: 2,
                                      border: '1px solid rgba(156, 39, 176, 0.1)',
                                      height: '100%'
                                    }}>
                                      <Typography variant="caption" sx={{ 
                                        color: '#9c27b0', 
                                        fontWeight: 600, 
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        fontSize: '0.7rem'
                                      }}>
                                        ขนาดบริษัท
                                      </Typography>
                                      <Typography variant="body2" sx={{ 
                                        fontWeight: 600, 
                                        color: '#1a365d', 
                                        mt: 0.5 
                                      }}>
                                        {work.company_size === 'startup' ? 'สตาร์ทอัพ (1-10 คน)' :
                                         work.company_size === 'small' ? 'เล็ก (11-50 คน)' :
                                         work.company_size === 'medium' ? 'กลาง (51-200 คน)' :
                                         work.company_size === 'large' ? 'ใหญ่ (201-1000 คน)' :
                                         work.company_size === 'enterprise' ? 'องค์กรขนาดใหญ่ (1000+ คน)' : work.company_size}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                )}

                                {work.department && (
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Box sx={{ 
                                      p: 1.5, 
                                      bgcolor: 'rgba(156, 39, 176, 0.05)', 
                                      borderRadius: 2,
                                      border: '1px solid rgba(156, 39, 176, 0.1)',
                                      height: '100%'
                                    }}>
                                      <Typography variant="caption" sx={{ 
                                        color: '#9c27b0', 
                                        fontWeight: 600, 
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        fontSize: '0.7rem'
                                      }}>
                                        แผนก
                                      </Typography>
                                      <Typography variant="body2" sx={{ 
                                        fontWeight: 600, 
                                        color: '#1a365d', 
                                        mt: 0.5 
                                      }}>
                                        {work.department}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                )}

                                {work.job_level && (
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Box sx={{ 
                                      p: 1.5, 
                                      bgcolor: 'rgba(156, 39, 176, 0.05)', 
                                      borderRadius: 2,
                                      border: '1px solid rgba(156, 39, 176, 0.1)',
                                      height: '100%'
                                    }}>
                                      <Typography variant="caption" sx={{ 
                                        color: '#9c27b0', 
                                        fontWeight: 600, 
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        fontSize: '0.7rem'
                                      }}>
                                        ระดับงาน
                                      </Typography>
                                      <Typography variant="body2" sx={{ 
                                        fontWeight: 600, 
                                        color: '#1a365d', 
                                        mt: 0.5 
                                      }}>
                                        {work.job_level === 'entry' ? 'Entry Level' :
                                         work.job_level === 'junior' ? 'Junior' :
                                         work.job_level === 'senior' ? 'Senior' :
                                         work.job_level === 'lead' ? 'Team Lead' :
                                         work.job_level === 'manager' ? 'Manager' :
                                         work.job_level === 'director' ? 'Director' :
                                         work.job_level === 'executive' ? 'Executive' : work.job_level}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                )}

                                {work.employment_type && (
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Box sx={{ 
                                      p: 1.5, 
                                      bgcolor: 'rgba(156, 39, 176, 0.05)', 
                                      borderRadius: 2,
                                      border: '1px solid rgba(156, 39, 176, 0.1)',
                                      height: '100%'
                                    }}>
                                      <Typography variant="caption" sx={{ 
                                        color: '#9c27b0', 
                                        fontWeight: 600, 
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        fontSize: '0.7rem'
                                      }}>
                                        ประเภทการจ้าง
                                      </Typography>
                                      <Typography variant="body2" sx={{ 
                                        fontWeight: 600, 
                                        color: '#1a365d', 
                                        mt: 0.5 
                                      }}>
                                        {work.employment_type === 'full_time' ? 'งานประจำ' :
                                         work.employment_type === 'part_time' ? 'งานบางเวลา' :
                                         work.employment_type === 'contract' ? 'สัญญาจ้าง' :
                                         work.employment_type === 'internship' ? 'ฝึกงาน' :
                                         work.employment_type === 'freelance' ? 'ฟรีแลนซ์' :
                                         work.employment_type === 'volunteer' ? 'อาสาสมัคร' : work.employment_type}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                )}

                                {work.salary_range && (
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Box sx={{ 
                                      p: 1.5, 
                                      bgcolor: 'rgba(156, 39, 176, 0.05)', 
                                      borderRadius: 2,
                                      border: '1px solid rgba(156, 39, 176, 0.1)',
                                      height: '100%'
                                    }}>
                                      <Typography variant="caption" sx={{ 
                                        color: '#9c27b0', 
                                        fontWeight: 600, 
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        fontSize: '0.7rem'
                                      }}>
                                        ช่วงเงินเดือน
                                      </Typography>
                                      <Typography variant="body2" sx={{ 
                                        fontWeight: 600, 
                                        color: '#1a365d', 
                                        mt: 0.5 
                                      }}>
                                        {work.salary_range}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                )}

                                {work.team_size && (
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Box sx={{ 
                                      p: 1.5, 
                                      bgcolor: 'rgba(156, 39, 176, 0.05)', 
                                      borderRadius: 2,
                                      border: '1px solid rgba(156, 39, 176, 0.1)',
                                      height: '100%'
                                    }}>
                                      <Typography variant="caption" sx={{ 
                                        color: '#9c27b0', 
                                        fontWeight: 600, 
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        fontSize: '0.7rem'
                                      }}>
                                        ขนาดทีม
                                      </Typography>
                                      <Typography variant="body2" sx={{ 
                                        fontWeight: 600, 
                                        color: '#1a365d', 
                                        mt: 0.5 
                                      }}>
                                        {work.team_size} คน
                                      </Typography>
                                    </Box>
                                  </Grid>
                                )}
                              </Grid>

                              {/* Job Description */}
                              {work.job_description && (
                                <Box sx={{ mb: 2 }}>
                                  <Box sx={{ 
                                    p: 2, 
                                    bgcolor: 'rgba(156, 39, 176, 0.05)', 
                                    borderRadius: 2,
                                    border: '1px solid rgba(156, 39, 176, 0.1)'
                                  }}>
                                    <Typography variant="caption" sx={{ 
                                      fontWeight: 700, 
                                      mb: 1, 
                                      color: '#6a1b9a',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      fontSize: '0.7rem',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px'
                                    }}>
                                      📝 รายละเอียดงาน
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                      color: '#4a5568', 
                                      lineHeight: 1.6,
                                      mt: 1
                                    }}>
                                      {work.job_description}
                                    </Typography>
                                  </Box>
                                </Box>
                              )}

                              {/* Skills and Technologies */}
                              {(work.skills_used || work.technologies_used) && (
                                <Box sx={{ mb: 2 }}>
                                  <Grid container spacing={1.5}>
                                    {work.skills_used && (
                                      <Grid item xs={12} md={6}>
                                        <Box sx={{ 
                                          p: 2, 
                                          bgcolor: 'rgba(33, 150, 243, 0.05)', 
                                          borderRadius: 2,
                                          border: '1px solid rgba(33, 150, 243, 0.1)',
                                          height: '100%'
                                        }}>
                                          <Typography variant="caption" sx={{ 
                                            fontWeight: 700, 
                                            mb: 1, 
                                            color: '#1976d2',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            fontSize: '0.7rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                          }}>
                                            🛠️ ทักษะที่ใช้
                                          </Typography>
                                          <Typography variant="body2" sx={{ 
                                            color: '#4a5568', 
                                            lineHeight: 1.5,
                                            mt: 1
                                          }}>
                                            {work.skills_used}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                    )}
                                    {work.technologies_used && (
                                      <Grid item xs={12} md={6}>
                                        <Box sx={{ 
                                          p: 2, 
                                          bgcolor: 'rgba(76, 175, 80, 0.05)', 
                                          borderRadius: 2,
                                          border: '1px solid rgba(76, 175, 80, 0.1)',
                                          height: '100%'
                                        }}>
                                          <Typography variant="caption" sx={{ 
                                            fontWeight: 700, 
                                            mb: 1, 
                                            color: '#388e3c',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            fontSize: '0.7rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                          }}>
                                            💻 เทคโนโลยีที่ใช้
                                          </Typography>
                                          <Typography variant="body2" sx={{ 
                                            color: '#4a5568', 
                                            lineHeight: 1.5,
                                            mt: 1
                                          }}>
                                            {work.technologies_used}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                    )}
                                  </Grid>
                                </Box>
                              )}

                              {/* Key Achievements */}
                              {work.key_achievements && (
                                <Box>
                                  <Box sx={{ 
                                    p: 2, 
                                    bgcolor: 'rgba(255, 193, 7, 0.05)', 
                                    borderRadius: 2,
                                    border: '1px solid rgba(255, 193, 7, 0.1)'
                                  }}>
                                    <Typography variant="caption" sx={{ 
                                      fontWeight: 700, 
                                      mb: 1, 
                                      color: '#f57c00',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      fontSize: '0.7rem',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px'
                                    }}>
                                      🏆 ผลงานสำคัญ
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                      color: '#4a5568', 
                                      lineHeight: 1.6,
                                      mt: 1
                                    }}>
                                      {work.key_achievements}
                                    </Typography>
                                  </Box>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    ) : (
                      <Box sx={{ 
                        textAlign: 'center', 
                        py: 4,
                        px: 2
                      }}>
                        <Avatar sx={{ 
                          width: 48, 
                          height: 48, 
                          mx: 'auto', 
                          mb: 2,
                          bgcolor: 'rgba(156, 39, 176, 0.1)',
                          color: '#9c27b0'
                        }}>
                          💼
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ 
                          color: '#6a1b9a', 
                          mb: 0.5,
                          fontWeight: 600
                        }}>
                          ยังไม่มีประวัติการทำงาน
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ศิษย์เก่าท่านนี้ยังไม่ได้เพิ่มประวัติการทำงาน
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <Box sx={{ 
          p: 2,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderTop: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Stack direction="row" justifyContent="center">
            <Button 
              onClick={handleCloseViewModal} 
              variant="contained"
              size="medium"
              sx={{ 
                borderRadius: 3, 
                px: 4,
                py: 1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              ปิดหน้าต่าง
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </AdminLayout>
  );
};

export default ManageAlumni;
