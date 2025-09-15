import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Checkbox,
    Snackbar,
    Alert,
    Box,
    Avatar,
    Chip,
    IconButton,
    Fade,
    Slide,
    Zoom,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Collapse,
    Stepper,
    Step,
    StepLabel,
    Tabs,
    Tab,
    ToggleButton,
    ToggleButtonGroup,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Work as WorkIcon,
    Business as BusinessIcon,
    LocationOn as LocationIcon,
    AttachMoney as MoneyIcon,
    DateRange as DateIcon,
    Description as DescriptionIcon,
    Close as CloseIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Timeline as TimelineIcon,
    ViewList as ViewListIcon,
    ViewModule as ViewModuleIcon,
    FilterList as FilterIcon,
    Search as SearchIcon,
    TrendingUp as TrendingUpIcon,
    Star as StarIcon,
    AccessTime as AccessTimeIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Visibility as VisibilityIcon,
    Share as ShareIcon,
    Download as DownloadIcon,
    School as SchoolIcon,
    EmojiEvents as TrophyIcon,
    Psychology as SkillsIcon,
    Group as TeamIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import addressData from '../../assets/thai-address-full.json';

// Keyframes for animations
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components - Furni Modern Theme
const StatsCard = styled(Card)(({ theme }) => ({
    background: '#ffffff',
    borderRadius: '1.5rem',
    padding: theme.spacing(3),
    boxShadow: '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)',
    border: '1px solid #e9ecef',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 1rem 2rem rgba(47, 75, 63, 0.25)',
        borderColor: '#fbd36b'
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
        opacity: 0,
        transition: 'opacity 0.3s',
        borderRadius: '1.5rem 1.5rem 0 0'
    },
    '&:hover::before': {
        opacity: 1
    }
}));

const WorkCard = styled(Card)(({ theme }) => ({
    borderRadius: '1.5rem',
    transition: 'all 0.3s ease',
    border: '1px solid #e9ecef',
    background: '#ffffff',
    boxShadow: '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)',
    overflow: 'hidden',
    position: 'relative',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 1rem 2rem rgba(47, 75, 63, 0.25)',
        borderColor: '#fbd36b'
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
        opacity: 0,
        transition: 'opacity 0.3s'
    },
    '&:hover::before': {
        opacity: 1
    }
}));

const AnimatedDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '1.5rem',
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 1rem 3rem rgba(47, 75, 63, 0.2)',
        maxHeight: '90vh',
        border: '1px solid #e9ecef'
    }
}));

const FilterBar = styled(Card)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    borderRadius: '1.5rem',
    background: '#ffffff',
    border: '1px solid #e9ecef',
    boxShadow: '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)',
    marginBottom: theme.spacing(3)
}));

const TimelineDot = styled(Box)(({ theme }) => ({
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2f4b3f 0%, #3a5c4b 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 0.25rem 0.75rem rgba(47, 75, 63, 0.4)',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #2f4b3f 0%, #3a5c4b 100%)',
        opacity: 0.3,
        animation: `${pulse} 2s infinite`
    }
}));

const FloatingActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '0.75rem',
    padding: theme.spacing(1.5, 4),
    background: 'linear-gradient(135deg, #f9c74f 0%, #fbd36b 100%)',
    color: '#2f4b3f',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 0.25rem 0.75rem rgba(249, 199, 79, 0.3)',
    border: 'none',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        background: 'linear-gradient(135deg, #f8b42e 0%, #f9c74f 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 0.5rem 1rem rgba(249, 199, 79, 0.4)'
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        transition: 'left 0.6s ease'
    },
    '&:hover::before': {
        left: '100%'
    }
}));

const EmptyState = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(8, 4),
    background: '#ffffff',
    borderRadius: '1.5rem',
    border: '2px dashed #dee2e6',
    animation: `${fadeIn} 0.8s ease-out`
}));

const HeroSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #2f4b3f, #243d33)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: '50%',
        background: 'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1.5" fill="%23f9c74f" opacity="0.3"/><circle cx="80" cy="30" r="1" fill="%23f9c74f" opacity="0.2"/><circle cx="40" cy="70" r="1.2" fill="%23f9c74f" opacity="0.4"/><circle cx="90" cy="80" r="0.8" fill="%23f9c74f" opacity="0.3"/></svg>\') repeat',
        animation: `${float} 20s ease-in-out infinite`,
        zIndex: 1
    }
}));

const WorkHistory = () => {
    const [workHistory, setWorkHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [viewMode, setViewMode] = useState('timeline'); // 'timeline', 'cards', 'list'
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'current', 'past'
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date'); // 'date', 'company', 'position'
    const [expandedCards, setExpandedCards] = useState(new Set());
    const [formStep, setFormStep] = useState(0);
    const [showStats, setShowStats] = useState(true);
    const [formData, setFormData] = useState({
        company_name: '',
        position: '',
        job_description: '',
        start_date: '',
        end_date: '',
        is_current: false,
        salary_range: '',
        location: '',
        work_province: '',
        work_district: '',
        work_subdistrict: '',
        work_zipcode: '',
        skills: '',
        achievements: '',
        team_size: '',
        technologies: ''
    });

    // Address dropdown states
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [amphoeOptions, setAmphoeOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);

    // Dropdown options for salary range and team size
    const salaryRanges = [
        'ต่ำกว่า 20,000 บาท',
        '20,000 - 30,000 บาท',
        '30,000 - 40,000 บาท',
        '40,000 - 50,000 บาท',
        '50,000 - 70,000 บาท',
        '70,000 - 100,000 บาท',
        '100,000 - 150,000 บาท',
        'มากกว่า 150,000 บาท'
    ];

    const teamSizes = [
        '1 คน (งานคนเดียว)',
        '2-5 คน (ทีมเล็ก)',
        '6-10 คน (ทีมกลาง)',
        '11-20 คน (ทีมใหญ่)',
        '21-50 คน (แผนกขนาดกลาง)',
        '51-100 คน (แผนกใหญ่)',
        'มากกว่า 100 คน (องค์กรขนาดใหญ่)'
    ];

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    useEffect(() => {
        fetchWorkHistory();
    }, []);

    // Initialize address data
    useEffect(() => {
        // ดึงรายชื่อจังหวัดจาก json ที่ export มาใหม่
        setProvinceOptions(addressData.provinces.map(p => p.name));
    }, []);

    useEffect(() => {
        if (formData.work_province) {
            // ดึงรายชื่ออำเภอจากจังหวัดที่เลือก
            const province = addressData.provinces.find(p => p.name === formData.work_province);
            setAmphoeOptions(province ? province.amphoes.map(a => a.name) : []);
            
            // ล้างค่าเฉพาะเมื่อไม่อยู่ในโหมดแก้ไข หรือเมื่อเปลี่ยนจังหวัด
            if (!editingItem) {
                setFormData(f => ({ ...f, work_district: '', work_subdistrict: '', work_zipcode: '' }));
                setDistrictOptions([]);
            }
        }
    }, [formData.work_province, editingItem]);

    useEffect(() => {
        if (formData.work_province && formData.work_district) {
            // ดึงรายชื่อตำบลจากอำเภอที่เลือก
            const province = addressData.provinces.find(p => p.name === formData.work_province);
            const amphoe = province ? province.amphoes.find(a => a.name === formData.work_district) : null;
            setDistrictOptions(amphoe ? amphoe.districts.map(d => d.name) : []);
            
            // ล้างค่าเฉพาะเมื่อไม่อยู่ในโหมดแก้ไข หรือเมื่อเปลี่ยนอำเภอ
            if (!editingItem) {
                setFormData(f => ({ ...f, work_subdistrict: '', work_zipcode: '' }));
            }
        }
    }, [formData.work_district, editingItem]);

    useEffect(() => {
        if (formData.work_province && formData.work_district && formData.work_subdistrict) {
            // ดึงรหัสไปรษณีย์จากตำบลที่เลือก
            const province = addressData.provinces.find(p => p.name === formData.work_province);
            const amphoe = province ? province.amphoes.find(a => a.name === formData.work_district) : null;
            const district = amphoe ? amphoe.districts.find(d => d.name === formData.work_subdistrict) : null;
            setFormData(f => ({ ...f, work_zipcode: district ? district.zipcode : '' }));
        }
    }, [formData.work_subdistrict]);

    const fetchWorkHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/work-history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                console.log('📋 Fetched work history data:', response.data.data); // Debug log
                setWorkHistory(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching work history:', error);
            showSnackbar('เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการทำงาน', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort functions
    const filteredWorkHistory = workHistory.filter(item => {
        const matchesSearch = item.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.location?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterStatus === 'all' || 
                             (filterStatus === 'current' && item.is_current) ||
                             (filterStatus === 'past' && !item.is_current);
        
        return matchesSearch && matchesFilter;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'company':
                return a.company_name.localeCompare(b.company_name);
            case 'position':
                return a.position.localeCompare(b.position);
            case 'date':
            default:
                return new Date(b.start_date) - new Date(a.start_date);
        }
    });

    // Statistics calculations
    const stats = {
        total: workHistory.length,
        current: workHistory.filter(item => item.is_current).length,
        past: workHistory.filter(item => !item.is_current).length,
        totalExperience: workHistory.reduce((acc, item) => {
            const start = new Date(item.start_date);
            const end = item.is_current ? new Date() : new Date(item.end_date);
            return acc + Math.floor((end - start) / (1000 * 60 * 60 * 24 * 365));
        }, 0)
    };

    const toggleCardExpansion = (id) => {
        const newExpanded = new Set(expandedCards);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedCards(newExpanded);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const endpoint = editingItem 
                ? `http://localhost:5000/api/work-history/${editingItem.id}`
                : 'http://localhost:5000/api/work-history';
            
            const method = editingItem ? 'put' : 'post';
            
            // Map ชื่อฟิลด์ให้ตรงกับ Backend
            const mappedData = {
                ...formData,
                skills_used: formData.skills, // map skills -> skills_used
                technologies_used: formData.technologies, // map technologies -> technologies_used
                key_achievements: formData.achievements, // map achievements -> key_achievements
                // ลบฟิลด์เก่าออก
                skills: undefined,
                technologies: undefined,
                achievements: undefined
            };
            
            console.log('Sending data to server:', mappedData); // สำหรับ debug
            
            await axios[method](endpoint, mappedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            showSnackbar(
                editingItem ? 'แก้ไขประวัติการทำงานสำเร็จ' : 'เพิ่มประวัติการทำงานสำเร็จ', 
                'success'
            );
            
            resetForm();
            fetchWorkHistory();
        } catch (error) {
            console.error('Error saving work history:', error);
            showSnackbar('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        }
    };

    const handleEdit = (item) => {
        console.log('🔧 Edit item data:', item); // Debug log
        setEditingItem(item);
        setFormData({
            company_name: item.company_name || '',
            position: item.position || '',
            job_description: item.job_description || '',
            start_date: item.start_date || '',
            end_date: item.end_date || '',
            is_current: item.is_current || false,
            salary_range: item.salary_range || '',
            location: item.location || '',
            work_province: item.work_province || '',
            work_district: item.work_district || '',
            work_subdistrict: item.work_subdistrict || '',
            work_zipcode: item.work_zipcode || '',
            // Map ข้อมูลจากฐานข้อมูลมายังฟอร์ม
            skills: item.skills_used || '', // skills_used -> skills
            achievements: item.key_achievements || '', // key_achievements -> achievements
            team_size: item.team_size || '',
            technologies: item.technologies_used || '' // technologies_used -> technologies
        });
        
        console.log('🗺️ Address data for edit:', {
            work_province: item.work_province,
            work_district: item.work_district,
            work_subdistrict: item.work_subdistrict,
            work_zipcode: item.work_zipcode
        }); // Debug log
        
        // Load dropdown options for existing address data
        if (item.work_province) {
            const province = addressData.provinces.find(p => p.name === item.work_province);
            if (province) {
                setAmphoeOptions(province.amphoes.map(a => a.name));
                
                if (item.work_district) {
                    const amphoe = province.amphoes.find(a => a.name === item.work_district);
                    if (amphoe) {
                        setDistrictOptions(amphoe.districts.map(d => d.name));
                    }
                }
            }
        } else {
            // ถ้าไม่มีจังหวัด ให้ล้าง dropdown อื่นๆ
            setAmphoeOptions([]);
            setDistrictOptions([]);
        }
        
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบประวัติการทำงานนี้?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/work-history/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            showSnackbar('ลบประวัติการทำงานสำเร็จ', 'success');
            fetchWorkHistory();
        } catch (error) {
            console.error('Error deleting work history:', error);
            showSnackbar('เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            company_name: '',
            position: '',
            job_description: '',
            start_date: '',
            end_date: '',
            is_current: false,
            salary_range: '',
            location: '',
            work_province: '',
            work_district: '',
            work_subdistrict: '',
            work_zipcode: '',
            skills: '',
            achievements: '',
            team_size: '',
            technologies: ''
        });
        setEditingItem(null);
        setShowForm(false);
        setFormStep(0);
        // ล้าง dropdown options
        setAmphoeOptions([]);
        setDistrictOptions([]);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
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
        
        if (years > 0) {
            return months > 0 ? `${years} ปี ${months} เดือน` : `${years} ปี`;
        }
        return months > 0 ? `${months} เดือน` : `${diffDays} วัน`;
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ color: '#4299e1' }} />
                <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                    กำลังโหลดข้อมูล...
                </Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f7f5f3, #f0ede8)' }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Statistics Cards */}
                {showStats && (
                    <Fade in timeout={1000}>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2a3b3d', mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>
                                                {stats.total}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 500 }}>
                                                ประสบการณ์ทั้งหมด
                                            </Typography>
                                        </Box>
                                        <Box sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            background: 'rgba(249, 199, 79, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <WorkIcon sx={{ fontSize: 40, color: '#f9c74f' }} />
                                        </Box>
                                    </Box>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2a3b3d', mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>
                                                {stats.current}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 500 }}>
                                                ทำงานปัจจุบัน
                                            </Typography>
                                        </Box>
                                        <Box sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            background: 'rgba(249, 199, 79, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <TrendingUpIcon sx={{ fontSize: 40, color: '#f9c74f' }} />
                                        </Box>
                                    </Box>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2a3b3d', mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>
                                                {stats.past}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 500 }}>
                                                ประสบการณ์ที่ผ่านมา
                                            </Typography>
                                        </Box>
                                        <Box sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            background: 'rgba(47, 75, 63, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <AccessTimeIcon sx={{ fontSize: 40, color: '#2f4b3f' }} />
                                        </Box>
                                    </Box>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2a3b3d', mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>
                                                {stats.totalExperience}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 500 }}>
                                                ปีประสบการณ์
                                            </Typography>
                                        </Box>
                                        <Box sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            background: 'rgba(249, 199, 79, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <StarIcon sx={{ fontSize: 40, color: '#f9c74f' }} />
                                        </Box>
                                    </Box>
                                </StatsCard>
                            </Grid>
                        </Grid>
                    </Fade>
                )}

                {/* Filter and Controls */}
                <Fade in timeout={1200}>
                    <FilterBar>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    placeholder="ค้นหาบริษัท ตำแหน่ง หรือสถานที่..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ color: '#6c757d', mr: 1 }} />,
                                    }}
                                    sx={{ 
                                        minWidth: 300,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '0.75rem',
                                            background: '#f7f5f3',
                                            border: '2px solid #dee2e6',
                                            '&:hover': {
                                                borderColor: '#f9c74f'
                                            },
                                            '&.Mui-focused': {
                                                borderColor: '#f9c74f',
                                                boxShadow: '0 0 0 0.2rem rgba(249, 199, 79, 0.25)'
                                            }
                                        }
                                    }}
                                    size="small"
                                />
                                
                                <ToggleButtonGroup
                                    value={filterStatus}
                                    exclusive
                                    onChange={(e, newFilter) => newFilter && setFilterStatus(newFilter)}
                                    size="small"
                                    sx={{
                                        '& .MuiToggleButton-root': {
                                            borderRadius: '0.75rem',
                                            border: '2px solid #dee2e6',
                                            color: '#2a3b3d',
                                            fontWeight: 600,
                                            '&.Mui-selected': {
                                                background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                                                color: '#2f4b3f',
                                                borderColor: '#f9c74f'
                                            },
                                            '&:hover': {
                                                background: 'rgba(249, 199, 79, 0.1)',
                                                borderColor: '#f9c74f'
                                            }
                                        }
                                    }}
                                >
                                    <ToggleButton value="all">ทั้งหมด</ToggleButton>
                                    <ToggleButton value="current">ปัจจุบัน</ToggleButton>
                                    <ToggleButton value="past">อดีต</ToggleButton>
                                </ToggleButtonGroup>

                                <FormControl 
                                    size="small" 
                                    sx={{ 
                                        minWidth: 120,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '0.75rem',
                                            background: '#f7f5f3',
                                            border: '2px solid #dee2e6',
                                            '&:hover': {
                                                borderColor: '#f9c74f'
                                            },
                                            '&.Mui-focused': {
                                                borderColor: '#f9c74f'
                                            }
                                        }
                                    }}
                                >
                                    <InputLabel>เรียงตาม</InputLabel>
                                    <Select
                                        value={sortBy}
                                        label="เรียงตาม"
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <MenuItem value="date">วันที่</MenuItem>
                                        <MenuItem value="company">บริษัท</MenuItem>
                                        <MenuItem value="position">ตำแหน่ง</MenuItem>
                                    </Select>
                                </FormControl>

                                <ToggleButtonGroup
                                    value={viewMode}
                                    exclusive
                                    onChange={(e, newView) => newView && setViewMode(newView)}
                                    size="small"
                                    sx={{
                                        '& .MuiToggleButton-root': {
                                            borderRadius: '0.75rem',
                                            border: '2px solid #dee2e6',
                                            color: '#2a3b3d',
                                            '&.Mui-selected': {
                                                background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
                                                color: 'white',
                                                borderColor: '#2f4b3f'
                                            },
                                            '&:hover': {
                                                background: 'rgba(47, 75, 63, 0.1)',
                                                borderColor: '#2f4b3f'
                                            }
                                        }
                                    }}
                                >
                                    <ToggleButton value="timeline">
                                        <TimelineIcon />
                                    </ToggleButton>
                                    <ToggleButton value="cards">
                                        <ViewModuleIcon />
                                    </ToggleButton>
                                    <ToggleButton value="list">
                                        <ViewListIcon />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                            
                            <FloatingActionButton
                                onClick={() => setShowForm(true)}
                                sx={{ 
                                    fontSize: '1rem',
                                    fontWeight: 600
                                }}
                            >
                                <AddIcon sx={{ mr: 1 }} />
                                เพิ่มประวัติการทำงาน
                            </FloatingActionButton>
                        </Box>
                    </FilterBar>
                </Fade>

                {/* Content Area */}
                {filteredWorkHistory.length === 0 ? (
                    <Fade in timeout={1400}>
                        <EmptyState>
                            <WorkIcon sx={{ fontSize: 80, color: '#6c757d', mb: 2 }} />
                            <Typography variant="h5" sx={{ color: '#2a3b3d', mb: 1, fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                                {workHistory.length === 0 ? 'ยังไม่มีประวัติการทำงาน' : 'ไม่พบข้อมูลที่ค้นหา'}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#6c757d', mb: 3 }}>
                                {workHistory.length === 0 
                                    ? 'เริ่มต้นสร้างประวัติการทำงานของคุณวันนี้'
                                    : 'ลองเปลี่ยนคำค้นหาหรือตัวกรองดู'
                                }
                            </Typography>
                            {workHistory.length === 0 && (
                                <FloatingActionButton onClick={() => setShowForm(true)}>
                                    <AddIcon sx={{ mr: 1 }} />
                                    เพิ่มประวัติการทำงานแรก
                                </FloatingActionButton>
                            )}
                        </EmptyState>
                    </Fade>
                ) : (
                    <Fade in timeout={1400}>
                        <Box>
                            {viewMode === 'timeline' && (
                                <Box sx={{ position: 'relative', pl: 4 }}>
                                    {/* Timeline Line */}
                                    <Box sx={{
                                        position: 'absolute',
                                        left: 2,
                                        top: 0,
                                        bottom: 0,
                                        width: 4,
                                        background: 'linear-gradient(to bottom, #2f4b3f, #f9c74f)',
                                        borderRadius: 2,
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: -2,
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: '#2f4b3f',
                                            boxShadow: '0 0 0 4px rgba(47, 75, 63, 0.2)'
                                        }
                                    }} />
                                    
                                    {filteredWorkHistory.map((item, index) => (
                                        <Slide direction="left" in timeout={800 + index * 200} key={item.id}>
                                            <Box sx={{ mb: 4, position: 'relative' }}>
                                                <TimelineDot sx={{
                                                    position: 'absolute',
                                                    left: -6,
                                                    top: 24,
                                                    zIndex: 2
                                                }}>
                                                    {item.is_current ? <TrendingUpIcon sx={{ fontSize: 16 }} /> : <WorkIcon sx={{ fontSize: 16 }} />}
                                                </TimelineDot>
                                                
                                                <WorkCard elevation={2}>
                                                    <CardContent sx={{ p: 3 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2a3b3d', fontFamily: 'Poppins, sans-serif' }}>
                                                                        {item.position}
                                                                    </Typography>
                                                                    {item.is_current && (
                                                                        <Chip 
                                                                            label="ปัจจุบัน" 
                                                                            size="small" 
                                                                            sx={{
                                                                                background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
                                                                                color: '#2f4b3f',
                                                                                fontWeight: 600,
                                                                                animation: `${pulse} 2s infinite`
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                                <Typography variant="subtitle1" sx={{ color: '#2f4b3f', fontWeight: 600, mb: 1 }}>
                                                                    <BusinessIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
                                                                    {item.company_name}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                                        <DateIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                                        <Typography variant="body2">
                                                                            {formatDate(item.start_date)} - {item.is_current ? 'ปัจจุบัน' : formatDate(item.end_date)}
                                                                        </Typography>
                                                                    </Box>
                                                                    {(item.location || item.work_province || item.work_district || item.work_subdistrict || item.work_zipcode) && (
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                                            <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                                            <Typography variant="body2">
                                                                                {(() => {
                                                                                    const addressParts = [];
                                                                                    if (item.location) addressParts.push(item.location);
                                                                                    if (item.work_subdistrict) addressParts.push(`ตำบล${item.work_subdistrict}`);
                                                                                    if (item.work_district) addressParts.push(`อำเภอ${item.work_district}`);
                                                                                    if (item.work_province) addressParts.push(`จังหวัด${item.work_province}`);
                                                                                    if (item.work_zipcode) addressParts.push(item.work_zipcode);
                                                                                    return addressParts.length > 0 ? addressParts.join(' ') : 'ไม่ระบุที่อยู่';
                                                                                })()}
                                                                            </Typography>
                                                                        </Box>
                                                                    )}
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                                        <Typography variant="body2">
                                                                            {calculateDuration(item.start_date, item.end_date, item.is_current)}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <IconButton
                                                                    onClick={() => toggleCardExpansion(item.id)}
                                                                    size="small"
                                                                    sx={{ color: '#4299e1' }}
                                                                >
                                                                    {expandedCards.has(item.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={() => handleEdit(item)}
                                                                    size="small"
                                                                    sx={{ color: '#ed8936' }}
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={() => handleDelete(item.id)}
                                                                    size="small"
                                                                    sx={{ color: '#e53e3e' }}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                        
                                                        <Collapse in={expandedCards.has(item.id)}>
                                                            <Divider sx={{ my: 2 }} />
                                                            {item.job_description && (
                                                                <Box sx={{ mb: 2 }}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1a365d' }}>
                                                                        <DescriptionIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                                                        รายละเอียดงาน
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                                                        {item.job_description}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            {item.salary_range && (
                                                                <Box sx={{ mb: 2 }}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1a365d' }}>
                                                                        <MoneyIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                                                        ช่วงเงินเดือน
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                                        {item.salary_range}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Collapse>
                                                    </CardContent>
                                                </WorkCard>
                                            </Box>
                                        </Slide>
                                    ))}
                                </Box>
                            )}

                            {viewMode === 'cards' && (
                                <Grid container spacing={3}>
                                    {filteredWorkHistory.map((item, index) => (
                                        <Grid item xs={12} md={6} key={item.id}>
                                            <Slide direction="up" in timeout={800 + index * 100}>
                                                <WorkCard elevation={3}>
                                                    <CardContent sx={{ p: 3 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d' }}>
                                                                        {item.position}
                                                                    </Typography>
                                                                    {item.is_current && (
                                                                        <Chip 
                                                                            label="ปัจจุบัน" 
                                                                            size="small" 
                                                                            sx={{
                                                                                bgcolor: '#c6f6d5',
                                                                                color: '#2f855a',
                                                                                fontWeight: 600
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                                <Typography variant="subtitle1" sx={{ color: '#4299e1', fontWeight: 600, mb: 2 }}>
                                                                    <BusinessIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
                                                                    {item.company_name}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <IconButton
                                                                    onClick={() => handleEdit(item)}
                                                                    size="small"
                                                                    sx={{ color: '#ed8936' }}
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={() => handleDelete(item.id)}
                                                                    size="small"
                                                                    sx={{ color: '#e53e3e' }}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                        
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                                <DateIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                                <Typography variant="body2">
                                                                    {formatDate(item.start_date)} - {item.is_current ? 'ปัจจุบัน' : formatDate(item.end_date)}
                                                                </Typography>
                                                            </Box>
                                                            {(item.location || item.work_province || item.work_district || item.work_subdistrict || item.work_zipcode) && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                                    <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                                    <Typography variant="body2">
                                                                        {(() => {
                                                                            const addressParts = [];
                                                                            if (item.location) addressParts.push(item.location);
                                                                            if (item.work_subdistrict) addressParts.push(`ตำบล${item.work_subdistrict}`);
                                                                            if (item.work_district) addressParts.push(`อำเภอ${item.work_district}`);
                                                                            if (item.work_province) addressParts.push(`จังหวัด${item.work_province}`);
                                                                            if (item.work_zipcode) addressParts.push(item.work_zipcode);
                                                                            return addressParts.length > 0 ? addressParts.join(' ') : 'ไม่ระบุที่อยู่';
                                                                        })()}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                        
                                                        {item.job_description && (
                                                            <Typography 
                                                                variant="body2" 
                                                                sx={{ 
                                                                    color: 'text.secondary',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: expandedCards.has(item.id) ? 'none' : 3,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    overflow: 'hidden',
                                                                    mb: 2
                                                                }}
                                                            >
                                                                {item.job_description}
                                                            </Typography>
                                                        )}
                                                        
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="caption" color="text.disabled">
                                                                {calculateDuration(item.start_date, item.end_date, item.is_current)}
                                                            </Typography>
                                                            {item.job_description && item.job_description.length > 150 && (
                                                                <Button
                                                                    size="small"
                                                                    onClick={() => toggleCardExpansion(item.id)}
                                                                    endIcon={expandedCards.has(item.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                                >
                                                                    {expandedCards.has(item.id) ? 'ย่อ' : 'ดูเพิ่มเติม'}
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    </CardContent>
                                                </WorkCard>
                                            </Slide>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {viewMode === 'list' && (
                                <WorkCard>
                                    <List>
                                        {filteredWorkHistory.map((item, index) => (
                                            <React.Fragment key={item.id}>
                                                <Slide direction="right" in timeout={800 + index * 100}>
                                                    <ListItem sx={{ py: 2 }}>
                                                        <ListItemAvatar>
                                                            <Avatar sx={{ 
                                                                bgcolor: item.is_current ? '#48bb78' : '#4299e1',
                                                                width: 48,
                                                                height: 48
                                                            }}>
                                                                {item.is_current ? <TrendingUpIcon /> : <WorkIcon />}
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                                        {item.position}
                                                                    </Typography>
                                                                    {item.is_current && (
                                                                        <Chip 
                                                                            label="ปัจจุบัน" 
                                                                            size="small" 
                                                                            sx={{
                                                                                bgcolor: '#c6f6d5',
                                                                                color: '#2f855a',
                                                                                fontWeight: 600
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                            }
                                                            secondary={
                                                                <Box>
                                                                    <Typography variant="subtitle1" sx={{ color: '#4299e1', fontWeight: 600, mb: 0.5 }}>
                                                                        {item.company_name}
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            {formatDate(item.start_date)} - {item.is_current ? 'ปัจจุบัน' : formatDate(item.end_date)}
                                                                        </Typography>
                                                                        {(item.location || item.work_province || item.work_district || item.work_subdistrict || item.work_zipcode) && (
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                • {(() => {
                                                                                    const addressParts = [];
                                                                                    if (item.location) addressParts.push(item.location);
                                                                                    if (item.work_subdistrict) addressParts.push(`ตำบล${item.work_subdistrict}`);
                                                                                    if (item.work_district) addressParts.push(`อำเภอ${item.work_district}`);
                                                                                    if (item.work_province) addressParts.push(`จังหวัด${item.work_province}`);
                                                                                    if (item.work_zipcode) addressParts.push(item.work_zipcode);
                                                                                    return addressParts.length > 0 ? addressParts.join(' ') : 'ไม่ระบุที่อยู่';
                                                                                })()}
                                                                            </Typography>
                                                                        )}
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            • {calculateDuration(item.start_date, item.end_date, item.is_current)}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            }
                                                        />
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <IconButton
                                                                onClick={() => handleEdit(item)}
                                                                size="small"
                                                                sx={{ color: '#ed8936' }}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => handleDelete(item.id)}
                                                                size="small"
                                                                sx={{ color: '#e53e3e' }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </ListItem>
                                                </Slide>
                                                {index < filteredWorkHistory.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </WorkCard>
                            )}
                        </Box>
                    </Fade>
                )}

                {/* Add/Edit Dialog */}
                <AnimatedDialog
                    open={showForm}
                    onClose={() => {
                        setShowForm(false);
                        resetForm();
                    }}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ 
                        background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        fontFamily: 'Poppins, sans-serif'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {editingItem ? <EditIcon /> : <AddIcon />}
                            {editingItem ? 'แก้ไขประวัติการทำงาน' : 'เพิ่มประวัติการทำงานใหม่'}
                        </Box>
                    </DialogTitle>
                    
                    <DialogContent sx={{ p: 0 }}>
                        {/* Stepper */}
                        <Box sx={{ px: 3, pt: 3 }}>
                            <Stepper 
                                activeStep={formStep} 
                                alternativeLabel
                                sx={{
                                    '& .MuiStepLabel-label': {
                                        fontWeight: 600,
                                        color: '#2a3b3d'
                                    },
                                    '& .MuiStepLabel-label.Mui-active': {
                                        color: '#2f4b3f',
                                        fontWeight: 700
                                    },
                                    '& .MuiStepLabel-label.Mui-completed': {
                                        color: '#f9c74f'
                                    },
                                    '& .MuiStepIcon-root': {
                                        color: '#dee2e6',
                                        '&.Mui-active': {
                                            color: '#2f4b3f'
                                        },
                                        '&.Mui-completed': {
                                            color: '#f9c74f'
                                        }
                                    }
                                }}
                            >
                                <Step>
                                    <StepLabel>ข้อมูลพื้นฐาน</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>รายละเอียด</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>ทักษะและผลงาน</StepLabel>
                                </Step>
                            </Stepper>
                        </Box>

                        <Box sx={{ p: 3 }}>
                            {formStep === 0 && (
                                <Fade in timeout={300}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="ชื่อบริษัท"
                                                name="company_name"
                                                value={formData.company_name}
                                                onChange={handleInputChange}
                                                required
                                                InputProps={{
                                                    startAdornment: <BusinessIcon sx={{ color: '#6c757d', mr: 1 }} />
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '0.75rem',
                                                        background: '#f7f5f3',
                                                        border: '2px solid #dee2e6',
                                                        '&:hover fieldset': {
                                                            borderColor: '#f9c74f'
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#f9c74f',
                                                            borderWidth: 2
                                                        }
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: '#2a3b3d',
                                                        fontWeight: 600,
                                                        '&.Mui-focused': {
                                                            color: '#2f4b3f'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="ตำแหน่งงาน"
                                                name="position"
                                                value={formData.position}
                                                onChange={handleInputChange}
                                                required
                                                InputProps={{
                                                    startAdornment: <WorkIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="วันที่เริ่มงาน"
                                                name="start_date"
                                                type="date"
                                                value={formData.start_date}
                                                onChange={handleInputChange}
                                                required
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{
                                                    startAdornment: <DateIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="วันที่สิ้นสุดงาน"
                                                name="end_date"
                                                type="date"
                                                value={formData.end_date}
                                                onChange={handleInputChange}
                                                disabled={formData.is_current}
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{
                                                    startAdornment: <DateIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="is_current"
                                                        checked={formData.is_current}
                                                        onChange={handleInputChange}
                                                        sx={{ color: '#4299e1' }}
                                                    />
                                                }
                                                label="กำลังทำงานอยู่ในปัจจุบัน"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="สถานที่ทำงาน"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                InputProps={{
                                                    startAdornment: <LocationIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                                }}
                                            />
                                        </Grid>

                                        {/* Address dropdown fields */}
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>จังหวัด</InputLabel>
                                                <Select
                                                    name="work_province"
                                                    value={formData.work_province}
                                                    label="จังหวัด"
                                                    onChange={handleInputChange}
                                                >
                                                    <MenuItem value="">เลือกจังหวัด</MenuItem>
                                                    {provinceOptions.map((province) => (
                                                        <MenuItem key={province} value={province}>
                                                            {province}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth disabled={!formData.work_province}>
                                                <InputLabel>อำเภอ</InputLabel>
                                                <Select
                                                    name="work_district"
                                                    value={formData.work_district}
                                                    label="อำเภอ"
                                                    onChange={handleInputChange}
                                                >
                                                    <MenuItem value="">เลือกอำเภอ</MenuItem>
                                                    {amphoeOptions.map((amphoe) => (
                                                        <MenuItem key={amphoe} value={amphoe}>
                                                            {amphoe}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth disabled={!formData.work_district}>
                                                <InputLabel>ตำบล</InputLabel>
                                                <Select
                                                    name="work_subdistrict"
                                                    value={formData.work_subdistrict}
                                                    label="ตำบล"
                                                    onChange={handleInputChange}
                                                >
                                                    <MenuItem value="">เลือกตำบล</MenuItem>
                                                    {districtOptions.map((district) => (
                                                        <MenuItem key={district} value={district}>
                                                            {district}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="รหัสไปรษณีย์"
                                                value={formData.work_zipcode}
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Fade>
                            )}

                            {formStep === 1 && (
                                <Fade in timeout={300}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="คำอธิบายงาน"
                                                name="job_description"
                                                value={formData.job_description}
                                                onChange={handleInputChange}
                                                multiline
                                                rows={4}
                                                placeholder="อธิบายรายละเอียดงาน หน้าที่ความรับผิดชอบ..."
                                                InputProps={{
                                                    startAdornment: <DescriptionIcon sx={{ color: 'text.secondary', mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>ช่วงเงินเดือน</InputLabel>
                                                <Select
                                                    name="salary_range"
                                                    value={formData.salary_range}
                                                    onChange={handleInputChange}
                                                    label="ช่วงเงินเดือน"
                                                    startAdornment={<MoneyIcon sx={{ color: 'text.secondary', mr: 1 }} />}
                                                >
                                                    {salaryRanges.map((range) => (
                                                        <MenuItem key={range} value={range}>
                                                            {range}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>ขนาดทีม</InputLabel>
                                                <Select
                                                    name="team_size"
                                                    value={formData.team_size}
                                                    onChange={handleInputChange}
                                                    label="ขนาดทีม"
                                                    startAdornment={<TeamIcon sx={{ color: 'text.secondary', mr: 1 }} />}
                                                >
                                                    {teamSizes.map((size) => (
                                                        <MenuItem key={size} value={size}>
                                                            {size}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Fade>
                            )}

                            {formStep === 2 && (
                                <Fade in timeout={300}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="ทักษะที่ใช้"
                                                name="skills"
                                                value={formData.skills}
                                                onChange={handleInputChange}
                                                placeholder="เช่น JavaScript, React, Node.js, การจัดการทีม..."
                                                InputProps={{
                                                    startAdornment: <SkillsIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="เทคโนโลยีที่ใช้"
                                                name="technologies"
                                                value={formData.technologies}
                                                onChange={handleInputChange}
                                                placeholder="เช่น React, MySQL, AWS, Docker..."
                                                InputProps={{
                                                    startAdornment: <SchoolIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="ผลงานและความสำเร็จ"
                                                name="achievements"
                                                value={formData.achievements}
                                                onChange={handleInputChange}
                                                multiline
                                                rows={3}
                                                placeholder="อธิบายผลงานหรือความสำเร็จที่ได้รับในตำแหน่งนี้..."
                                                InputProps={{
                                                    startAdornment: <TrophyIcon sx={{ color: 'text.secondary', mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Fade>
                            )}
                        </Box>
                    </DialogContent>
                    
                    <DialogActions sx={{ p: 3, gap: 1, justifyContent: 'space-between' }}>
                        <Box>
                            <Button
                                onClick={() => {
                                    setShowForm(false);
                                    resetForm();
                                }}
                                startIcon={<CancelIcon />}
                                sx={{ color: '#718096' }}
                            >
                                ยกเลิก
                            </Button>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {formStep > 0 && (
                                <Button
                                    onClick={() => setFormStep(formStep - 1)}
                                    variant="outlined"
                                >
                                    ก่อนหน้า
                                </Button>
                            )}
                            
                            {formStep < 2 ? (
                                <Button
                                    onClick={() => setFormStep(formStep + 1)}
                                    variant="contained"
                                    disabled={formStep === 0 && (!formData.company_name || !formData.position || !formData.start_date)}
                                    sx={{
                                        background: 'linear-gradient(135deg, #2f4b3f 0%, #3a5c4b 100%)',
                                        color: 'white',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #243d33 0%, #2f4b3f 100%)'
                                        }
                                    }}
                                >
                                    ถัดไป
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    disabled={!formData.company_name || !formData.position || !formData.start_date}
                                    sx={{
                                        background: 'linear-gradient(135deg, #f9c74f 0%, #fbd36b 100%)',
                                        color: '#2f4b3f',
                                        fontWeight: 600,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #f8b42e 0%, #f9c74f 100%)'
                                        }
                                    }}
                                >
                                    {editingItem ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
                                </Button>
                            )}
                        </Box>
                    </DialogActions>
                </AnimatedDialog>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert 
                        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ borderRadius: 2 }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default WorkHistory;
