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

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        animation: `${float} 20s ease-in-out infinite`
    }
}));

const StatsCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: 16,
    padding: theme.spacing(3),
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: 'linear-gradient(90deg, #4299e1, #9f7aea)',
        borderRadius: '16px 16px 0 0'
    }
}));

const WorkCard = styled(Card)(({ theme }) => ({
    borderRadius: 16,
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    position: 'relative',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: 'linear-gradient(90deg, #4299e1, #9f7aea)'
    }
}));

const AnimatedDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 20,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        maxHeight: '90vh'
    }
}));

const FilterBar = styled(Card)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    borderRadius: 16,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '1px solid rgba(255,255,255,0.3)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: theme.spacing(3)
}));

const TimelineDot = styled(Box)(({ theme }) => ({
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4299e1 0%, #9f7aea 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 4px 16px rgba(66, 153, 225, 0.4)',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #4299e1 0%, #9f7aea 100%)',
        opacity: 0.3,
        animation: `${pulse} 2s infinite`
    }
}));

const FloatingActionButton = styled(Button)(({ theme }) => ({
    borderRadius: 50,
    padding: theme.spacing(1.5, 4),
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 8px 32px rgba(72, 187, 120, 0.4)',
    border: 'none',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 40px rgba(72, 187, 120, 0.5)'
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
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: 20,
    border: '2px dashed #e2e8f0',
    animation: `${fadeIn} 0.8s ease-out`
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
        company_type: 'private',
        industry: '',
        company_size: 'medium',
        position: '',
        department: '',
        job_level: 'entry',
        job_description: '',
        start_date: '',
        end_date: '',
        is_current: false,
        employment_type: 'full_time',
        salary_range: '',
        location: '',
        work_province: '',
        work_district: '',
        skills_used: '',
        key_achievements: '',
        team_size: '',
        technologies_used: ''
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    useEffect(() => {
        fetchWorkHistory();
    }, []);

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
        
        // Handle different input types
        let newValue;
        if (type === 'checkbox') {
            newValue = checked;
        } else {
            newValue = value;
        }
        
        console.log(`Input change: ${name} = ${newValue}`); // Debug log
        
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                showSnackbar('กรุณาเข้าสู่ระบบก่อน', 'error');
                return;
            }
            
            // ตรวจสอบข้อมูลจำเป็น
            if (!formData.company_name || !formData.position || !formData.start_date) {
                showSnackbar('กรุณากรอกข้อมูลที่จำเป็น: ชื่อบริษัท, ตำแหน่ง, และวันที่เริ่มงาน', 'error');
                return;
            }
            
            const endpoint = editingItem 
                ? `http://localhost:5000/api/work-history/${editingItem.id}`
                : 'http://localhost:5000/api/work-history';
            
            const method = editingItem ? 'put' : 'post';
            
            // ทำความสะอาดข้อมูลก่อนส่ง
            const cleanedData = {
                ...formData,
                // แปลง string ว่างเป็น null
                company_type: formData.company_type || 'private',
                company_size: formData.company_size || 'medium',
                job_level: formData.job_level || 'entry',
                employment_type: formData.employment_type || 'full_time',
                is_current: Boolean(formData.is_current),
                end_date: formData.is_current ? null : formData.end_date || null,
                team_size: formData.team_size || null,
                skills_used: formData.skills_used || null,
                technologies_used: formData.technologies_used || null,
                key_achievements: formData.key_achievements || null
            };
            
            // ส่งข้อมูลไปตรงๆ ตามที่กำหนดในฐานข้อมูล
            console.log('Sending data to server:', cleanedData); // สำหรับ debug
            
            await axios[method](endpoint, cleanedData, {
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
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Form data sent:', formData);
            
            let errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }
            
            showSnackbar(errorMessage, 'error');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            company_name: item.company_name || '',
            company_type: item.company_type || 'private',
            industry: item.industry || '',
            company_size: item.company_size || 'medium',
            position: item.position || '',
            department: item.department || '',
            job_level: item.job_level || 'entry',
            job_description: item.job_description || '',
            start_date: item.start_date || '',
            end_date: item.end_date || '',
            is_current: item.is_current || false,
            employment_type: item.employment_type || 'full_time',
            salary_range: item.salary_range || '',
            location: item.location || '',
            work_province: item.work_province || '',
            work_district: item.work_district || '',
            skills_used: item.skills_used || '',
            key_achievements: item.key_achievements || '',
            team_size: item.team_size || '',
            technologies_used: item.technologies_used || ''
        });
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
            company_type: 'private',
            industry: '',
            company_size: 'medium',
            position: '',
            department: '',
            job_level: 'entry',
            job_description: '',
            start_date: '',
            end_date: '',
            is_current: false,
            employment_type: 'full_time',
            salary_range: '',
            location: '',
            work_province: '',
            work_district: '',
            skills_used: '',
            key_achievements: '',
            team_size: '',
            technologies_used: ''
        });
        setEditingItem(null);
        setShowForm(false);
        setFormStep(0);
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
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
            {/* Hero Section */}
            <HeroSection>
                <Container maxWidth="lg">
                    <Slide direction="down" in timeout={800}>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Box sx={{ mb: 4 }}>
                                <WorkIcon sx={{ 
                                    fontSize: 80, 
                                    color: 'white',
                                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                                    animation: `${float} 3s ease-in-out infinite`
                                }} />
                            </Box>
                            <Typography 
                                variant="h2" 
                                sx={{ 
                                    color: 'white',
                                    fontWeight: 800,
                                    mb: 2,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                ประวัติการทำงาน
                            </Typography>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    color: 'rgba(255,255,255,0.9)',
                                    mb: 4,
                                    fontWeight: 300
                                }}
                            >
                                จัดการและแสดงประสบการณ์การทำงานของคุณอย่างเป็นระบบ
                            </Typography>
                            <FloatingActionButton
                                onClick={() => setShowForm(true)}
                                size="large"
                                sx={{ 
                                    px: 4, 
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600
                                }}
                            >
                                <AddIcon sx={{ mr: 1 }} />
                                เพิ่มประวัติการทำงานใหม่
                            </FloatingActionButton>
                        </Box>
                    </Slide>
                </Container>
            </HeroSection>

            <Container maxWidth="lg" sx={{ py: 4, mt: -8, position: 'relative', zIndex: 1 }}>
                {/* Statistics Cards */}
                {showStats && (
                    <Fade in timeout={1000}>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a365d', mb: 0.5 }}>
                                                {stats.total}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                ประสบการณ์ทั้งหมด
                                            </Typography>
                                        </Box>
                                        <WorkIcon sx={{ fontSize: 40, color: '#4299e1', opacity: 0.7 }} />
                                    </Box>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a365d', mb: 0.5 }}>
                                                {stats.current}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                ทำงานปัจจุบัน
                                            </Typography>
                                        </Box>
                                        <TrendingUpIcon sx={{ fontSize: 40, color: '#48bb78', opacity: 0.7 }} />
                                    </Box>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a365d', mb: 0.5 }}>
                                                {stats.past}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                ประสบการณ์ที่ผ่านมา
                                            </Typography>
                                        </Box>
                                        <AccessTimeIcon sx={{ fontSize: 40, color: '#ed8936', opacity: 0.7 }} />
                                    </Box>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a365d', mb: 0.5 }}>
                                                {stats.totalExperience}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                ปีประสบการณ์
                                            </Typography>
                                        </Box>
                                        <StarIcon sx={{ fontSize: 40, color: '#f6ad55', opacity: 0.7 }} />
                                    </Box>
                                </StatsCard>
                            </Grid>
                        </Grid>
                    </Fade>
                )}

                {/* Filter and Controls */}
                <Fade in timeout={1200}>
                    <FilterBar>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                placeholder="ค้นหาบริษัท ตำแหน่ง หรือสถานที่..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                                }}
                                sx={{ minWidth: 300 }}
                                size="small"
                            />
                            
                            <ToggleButtonGroup
                                value={filterStatus}
                                exclusive
                                onChange={(e, newFilter) => newFilter && setFilterStatus(newFilter)}
                                size="small"
                            >
                                <ToggleButton value="all">ทั้งหมด</ToggleButton>
                                <ToggleButton value="current">ปัจจุบัน</ToggleButton>
                                <ToggleButton value="past">อดีต</ToggleButton>
                            </ToggleButtonGroup>

                            <FormControl size="small" sx={{ minWidth: 120 }}>
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
                    </FilterBar>
                </Fade>

                {/* Content Area */}
                {filteredWorkHistory.length === 0 ? (
                    <Fade in timeout={1400}>
                        <EmptyState>
                            <WorkIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                                {workHistory.length === 0 ? 'ยังไม่มีประวัติการทำงาน' : 'ไม่พบข้อมูลที่ค้นหา'}
                            </Typography>
                            <Typography variant="body1" color="text.disabled" sx={{ mb: 3 }}>
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
                                        background: 'linear-gradient(to bottom, #4299e1, #9f7aea)',
                                        borderRadius: 2,
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: -2,
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: '#4299e1',
                                            boxShadow: '0 0 0 4px rgba(66, 153, 225, 0.2)'
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
                                                                                fontWeight: 600,
                                                                                animation: `${pulse} 2s infinite`
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                                <Typography variant="subtitle1" sx={{ color: '#4299e1', fontWeight: 600, mb: 1 }}>
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
                                                                    {item.location && (
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                                            <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                                            <Typography variant="body2">
                                                                                {item.location}
                                                                                {item.work_province && `, ${item.work_province}`}
                                                                                {item.work_district && `, ${item.work_district}`}
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
                                                            {item.department && (
                                                                <Box sx={{ mb: 2 }}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1a365d' }}>
                                                                        แผนก/ฝ่าย
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                                        {item.department}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            {item.industry && (
                                                                <Box sx={{ mb: 2 }}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1a365d' }}>
                                                                        อุตสาหกรรม
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                                        {item.industry}
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
                                                            {item.skills_used && (
                                                                <Box sx={{ mb: 2 }}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1a365d' }}>
                                                                        <SkillsIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                                                        ทักษะที่ใช้
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                                        {item.skills_used}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            {item.key_achievements && (
                                                                <Box sx={{ mb: 2 }}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1a365d' }}>
                                                                        <TrophyIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                                                        ผลงานสำคัญ
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                                                        {item.key_achievements}
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
                                                                <Typography variant="subtitle1" sx={{ color: '#4299e1', fontWeight: 600, mb: 1 }}>
                                                                    <BusinessIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
                                                                    {item.company_name}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                                                    {item.employment_type && (
                                                                        <Chip 
                                                                            label={
                                                                                item.employment_type === 'full_time' ? 'เต็มเวลา' :
                                                                                item.employment_type === 'part_time' ? 'พาร์ทไทม์' :
                                                                                item.employment_type === 'contract' ? 'สัญญาจ้าง' :
                                                                                item.employment_type === 'internship' ? 'ฝึกงาน' :
                                                                                item.employment_type === 'freelance' ? 'อิสระ' :
                                                                                item.employment_type === 'volunteer' ? 'อาสาสมัคร' :
                                                                                item.employment_type
                                                                            }
                                                                            size="small" 
                                                                            sx={{
                                                                                bgcolor: '#e6f3ff',
                                                                                color: '#0066cc'
                                                                            }}
                                                                        />
                                                                    )}
                                                                    {item.company_type && (
                                                                        <Chip 
                                                                            label={
                                                                                item.company_type === 'private' ? 'เอกชน' :
                                                                                item.company_type === 'government' ? 'รัฐบาล' :
                                                                                item.company_type === 'state_enterprise' ? 'รัฐวิสาหกิจ' :
                                                                                item.company_type === 'nonprofit' ? 'ไม่แสวงหาผลกำไร' :
                                                                                item.company_type === 'startup' ? 'สตาร์ทอัพ' :
                                                                                item.company_type
                                                                            }
                                                                            size="small" 
                                                                            sx={{
                                                                                bgcolor: '#f0f9ff',
                                                                                color: '#0369a1'
                                                                            }}
                                                                        />
                                                                    )}
                                                                    {item.job_level && (
                                                                        <Chip 
                                                                            label={
                                                                                item.job_level === 'entry' ? 'Entry Level' :
                                                                                item.job_level === 'junior' ? 'Junior' :
                                                                                item.job_level === 'senior' ? 'Senior' :
                                                                                item.job_level === 'lead' ? 'Team Lead' :
                                                                                item.job_level === 'manager' ? 'Manager' :
                                                                                item.job_level === 'director' ? 'Director' :
                                                                                item.job_level === 'executive' ? 'Executive' :
                                                                                item.job_level
                                                                            }
                                                                            size="small" 
                                                                            sx={{
                                                                                bgcolor: '#fef3e2',
                                                                                color: '#ea580c'
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Box>
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
                                                            {item.location && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                                    <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                                    <Typography variant="body2">{item.location}</Typography>
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
                                                                        {item.location && (
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                • {item.location}
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
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.5rem'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {editingItem ? <EditIcon /> : <AddIcon />}
                            {editingItem ? 'แก้ไขประวัติการทำงาน' : 'เพิ่มประวัติการทำงานใหม่'}
                        </Box>
                    </DialogTitle>
                    
                    <DialogContent sx={{ p: 0 }}>
                        {/* Stepper */}
                        <Box sx={{ px: 3, pt: 3 }}>
                            <Stepper activeStep={formStep} alternativeLabel>
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
                                                    startAdornment: <BusinessIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>ประเภทบริษัท</InputLabel>
                                                <Select
                                                    name="company_type"
                                                    value={formData.company_type}
                                                    label="ประเภทบริษัท"
                                                    onChange={handleInputChange}
                                                >
                                                    <MenuItem value="private">เอกชน</MenuItem>
                                                    <MenuItem value="government">รัฐบาล</MenuItem>
                                                    <MenuItem value="state_enterprise">รัฐวิสาหกิจ</MenuItem>
                                                    <MenuItem value="nonprofit">องค์กรไม่แสวงหาผลกำไร</MenuItem>
                                                    <MenuItem value="startup">สตาร์ทอัพ</MenuItem>
                                                    <MenuItem value="other">อื่นๆ</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="อุตสาหกรรม/สาขา"
                                                name="industry"
                                                value={formData.industry}
                                                onChange={handleInputChange}
                                                placeholder="เช่น เทคโนโลยี, การเงิน, การศึกษา"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>ขนาดบริษัท</InputLabel>
                                                <Select
                                                    name="company_size"
                                                    value={formData.company_size}
                                                    label="ขนาดบริษัท"
                                                    onChange={handleInputChange}
                                                >
                                                    <MenuItem value="startup">สตาร์ทอัพ (1-10 คน)</MenuItem>
                                                    <MenuItem value="small">เล็ก (11-50 คน)</MenuItem>
                                                    <MenuItem value="medium">กลาง (51-200 คน)</MenuItem>
                                                    <MenuItem value="large">ใหญ่ (201-1000 คน)</MenuItem>
                                                    <MenuItem value="enterprise">องค์กรขนาดใหญ่ (1000+ คน)</MenuItem>
                                                </Select>
                                            </FormControl>
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
                                                label="แผนก/ฝ่าย"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                placeholder="เช่น IT, การเงิน, ทรัพยากรบุคคล"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>ระดับตำแหน่ง</InputLabel>
                                                <Select
                                                    name="job_level"
                                                    value={formData.job_level}
                                                    label="ระดับตำแหน่ง"
                                                    onChange={handleInputChange}
                                                >
                                                    <MenuItem value="entry">Entry Level</MenuItem>
                                                    <MenuItem value="junior">Junior</MenuItem>
                                                    <MenuItem value="senior">Senior</MenuItem>
                                                    <MenuItem value="lead">Team Lead</MenuItem>
                                                    <MenuItem value="manager">Manager</MenuItem>
                                                    <MenuItem value="director">Director</MenuItem>
                                                    <MenuItem value="executive">Executive</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>ประเภทการจ้างงาน</InputLabel>
                                                <Select
                                                    name="employment_type"
                                                    value={formData.employment_type}
                                                    label="ประเภทการจ้างงาน"
                                                    onChange={handleInputChange}
                                                >
                                                    <MenuItem value="full_time">เต็มเวลา</MenuItem>
                                                    <MenuItem value="part_time">พาร์ทไทม์</MenuItem>
                                                    <MenuItem value="contract">สัญญาจ้าง</MenuItem>
                                                    <MenuItem value="internship">ฝึกงาน</MenuItem>
                                                    <MenuItem value="freelance">อิสระ</MenuItem>
                                                    <MenuItem value="volunteer">อาสาสมัคร</MenuItem>
                                                </Select>
                                            </FormControl>
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
                                            <TextField
                                                fullWidth
                                                label="ช่วงเงินเดือน"
                                                name="salary_range"
                                                value={formData.salary_range}
                                                onChange={handleInputChange}
                                                placeholder="เช่น 25,000 - 30,000 บาท"
                                                InputProps={{
                                                    startAdornment: <MoneyIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="ขนาดทีม"
                                                name="team_size"
                                                value={formData.team_size}
                                                onChange={handleInputChange}
                                                placeholder="เช่น 5-10 คน"
                                                InputProps={{
                                                    startAdornment: <TeamIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="สถานที่ทำงาน"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                placeholder="เช่น ซาทร์นแล้ท คอร์ปอเรท ทาวเวอร์"
                                                InputProps={{
                                                    startAdornment: <LocationIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="จังหวัด"
                                                name="work_province"
                                                value={formData.work_province}
                                                onChange={handleInputChange}
                                                placeholder="เช่น กรุงเทพมหานคร"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="อำเภอ/เขต"
                                                name="work_district"
                                                value={formData.work_district}
                                                onChange={handleInputChange}
                                                placeholder="เช่น วัฒนา"
                                            />
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
                                                name="skills_used"
                                                value={formData.skills_used}
                                                onChange={handleInputChange}
                                                placeholder="เช่น JavaScript, React, Node.js, การจัดการทีม, การนำเสนอ..."
                                                InputProps={{
                                                    startAdornment: <SkillsIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="เทคโนโลยีที่ใช้"
                                                name="technologies_used"
                                                value={formData.technologies_used}
                                                onChange={handleInputChange}
                                                placeholder="เช่น React, MySQL, AWS, Docker, Git, VS Code..."
                                                InputProps={{
                                                    startAdornment: <SchoolIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="ผลงานและความสำเร็จสำคัญ"
                                                name="key_achievements"
                                                value={formData.key_achievements}
                                                onChange={handleInputChange}
                                                multiline
                                                rows={4}
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
                                        background: 'linear-gradient(135deg, #4299e1 0%, #9f7aea 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #3182ce 0%, #805ad5 100%)'
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
                                        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)'
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
