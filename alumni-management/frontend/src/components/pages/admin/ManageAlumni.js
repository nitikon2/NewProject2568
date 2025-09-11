
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
  const [selectedAlumni, setSelectedAlumni] = useState(null);
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
    occupation: '',
    position: '',
    workplace: '',
    salary: '',
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
      // กำหนดค่า default ให้ field ใหม่
      const alumniWithDefaults = alumniList.map(item => ({
        ...item,
        occupation: item.occupation || '',
        position: item.position || '',
        workplace: item.workplace || '',
        salary: item.salary || ''
      }));
      setAlumni(alumniWithDefaults);
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
        occupation: alumniData.occupation || '',
        position: alumniData.position || '',
        workplace: alumniData.workplace || '',
        salary: alumniData.salary || '',
        current_address: alumniData.current_address || '',
        bio: alumniData.bio || '',
        password: '',
        confirmPassword: ''
      });
      setPostcode(alumniData.zipcode || '');
    } else {
      setFormData({
        title: '', firstName: '', lastName: '', student_id: '', email: '', phone: '', graduation_year: '', faculty: '', major: '', address_province: '', address_district: '', address_subdistrict: '', address_postcode: '', occupation: '', position: '', workplace: '', salary: '', current_address: '', bio: '', password: '', confirmPassword: ''
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
      email: '',
      occupation: '',
      position: '',
      workplace: '',
      salary: ''
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
      (person.email || '').toLowerCase().includes(q) ||
      (person.occupation || '').toLowerCase().includes(q)
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
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>อาชีพ</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>จัดการ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAlumni.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
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
                          <TableCell>{person.occupation || '-'}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                size="small"
                                onClick={() => handleShowModal(person)}
                                sx={{
                                  color: '#f59e0b',
                                  '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)' }
                                }}
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

            {/* ข้อมูลการทำงาน */}
            <Typography variant="h6" sx={{ mt: 3, mb: 2, color: 'primary.main', fontWeight: 600 }}>
              ข้อมูลการทำงาน
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="อาชีพ"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="ตำแหน่งงาน"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="สถานที่ทำงาน"
                  value={formData.workplace}
                  onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="เงินเดือน"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </Grid>
            </Grid>

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
    </AdminLayout>
  );
};

export default ManageAlumni;
