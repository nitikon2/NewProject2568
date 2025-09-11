import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModernLayout from '../layout/ModernLayout';
import PageHeader from '../layout/PageHeader';
import { Button } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import './EditableProfile.css';

function EditableProfile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const provinces = [
    'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 'ขอนแก่น',
    'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ', 'ชุมพร', 'เชียงราย',
    'เชียงใหม่', 'ตรัง', 'ตราด', 'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม', 'นครราชสีมา',
    'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส', 'น่าน', 'บึงกาฬ', 'บุรีรัมย์',
    'ปทุมธานี', 'ประจวบคีรีขันธ์', 'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พังงา',
    'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 'แพร่', 'พะเยา', 'ภูเก็ต',
    'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน', 'ยโสธร', 'ยะลา', 'ร้อยเอ็ด', 'ระนอง',
    'ระยอง', 'ราชบุรี', 'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย', 'ศรีสะเกษ', 'สกลนคร',
    'สงขลา', 'สตูล', 'สมุทรปราการ', 'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี',
    'สิงห์บุรี', 'สุโขทัย', 'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย',
    'หนองบัวลำภู', 'อ่างทอง', 'อุดรธานี', 'อุทัยธานี', 'อุตรดิตถ์', 'อุบลราชธานี',
    'อำนาจเจริญ'
  ];

  useEffect(() => {
    if (!user || !user.id) {
      setError('กรุณาเข้าสู่ระบบก่อนใช้งาน');
      setLoading(false);
      return;
    }

    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log('Fetching user data for ID:', user.id);
      const response = await axios.get(`http://localhost:5000/api/users/${user.id}`);
      setUserData(response.data);
      setFormData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }

      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImage) return null;

    setUploadingImage(true);
    const imageFormData = new FormData();
    imageFormData.append('profile_image', profileImage);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/users/${user.id}/profile-image`,
        imageFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data.profile_image;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error('ไม่สามารถอัปโหลดรูปภาพได้');
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'กรุณากรอกชื่อ-นามสกุล';
    }
    
    if (!formData.phone?.trim()) {
      errors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      errors.phone = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)';
    }
    
    if (!formData.graduation_year) {
      errors.graduation_year = 'กรุณาเลือกปีที่จบการศึกษา';
    }
    
    if (!formData.faculty?.trim()) {
      errors.faculty = 'กรุณากรอกคณะ';
    }
    
    if (!formData.major?.trim()) {
      errors.major = 'กรุณากรอกสาขาวิชา';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setError('กรุณาตรวจสอบข้อมูลให้ถูกต้อง');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // Upload image first if there's a new image
      let imageUrl = userData.profile_image;
      if (profileImage) {
        imageUrl = await uploadProfileImage();
      }

      // Update user data
      const updateData = {
        ...formData,
        profile_image: imageUrl
      };

      const response = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        updateData
      );

      if (response.data.status === 'success') {
        setUserData(response.data.user);
        setFormData(response.data.user);
        setEditMode(false);
        setSuccessMessage('บันทึกข้อมูลสำเร็จ!');
        setProfileImage(null);
        setImagePreview(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setEditMode(false);
    setValidationErrors({});
    setError('');
    setProfileImage(null);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>กำลังโหลดข้อมูลโปรไฟล์...</h2>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h1>⚠️</h1>
          <h2>เกิดข้อผิดพลาด</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <ModernLayout>
      <PageHeader
        title="โปรไฟล์ของฉัน"
        subtitle="จัดการข้อมูลส่วนตัวและข้อมูลติดต่อ"
        action={
          !editMode ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              แก้ไขข้อมูล
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving || uploadingImage}
                sx={{
                  bgcolor: 'rgba(132, 250, 176, 0.9)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(132, 250, 176, 1)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    opacity: 0.7
                  }
                }}
              >
                {saving || uploadingImage ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={saving || uploadingImage}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    opacity: 0.7
                  }
                }}
              >
                ยกเลิก
              </Button>
            </div>
          )
        }
      />
      
      <div className="editable-profile-container"
        style={{
          background: 'transparent',
          minHeight: 'auto',
          padding: 0
        }}
      >
      {/* Profile Image Section */}
      <div className="profile-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div className="profile-image-container">
          <div className="profile-image">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile Preview" />
            ) : userData?.profile_image ? (
              <img 
                src={`http://localhost:5000${userData.profile_image}`} 
                alt="Profile"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="profile-placeholder" style={{display: (!imagePreview && !userData?.profile_image) ? 'flex' : 'none'}}>
              {userData?.name?.charAt(0) || '👤'}
            </div>
          </div>
          
          {editMode && (
            <div className="image-upload-section">
              <input
                type="file"
                id="profile-image-input"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="profile-image-input" className="upload-btn">
                📷 เปลี่ยนรูปโปรไฟล์
              </label>
              {profileImage && (
                <p className="image-name">{profileImage.name}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert alert-error">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="alert-close">×</button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          <span>✅ {successMessage}</span>
          <button onClick={() => setSuccessMessage('')} className="alert-close">×</button>
        </div>
      )}

      {/* Profile Content */}
      {userData && (
        <div className="profile-content">
          <div className="profile-grid">
            
            {/* Personal Information */}
            <div className="info-card">
              <div className="card-header">
                <div className="card-icon personal">👤</div>
                <h2>ข้อมูลส่วนตัว</h2>
              </div>
              <div className="card-content">
                <div className="form-group">
                  <label>ชื่อ-นามสกุล *</label>
                  {editMode ? (
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        className={validationErrors.name ? 'error' : ''}
                        placeholder="กรอกชื่อ-นามสกุล"
                      />
                      {validationErrors.name && <span className="error-text">{validationErrors.name}</span>}
                    </div>
                  ) : (
                    <span>{userData.name || 'ไม่ระบุ'}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>อีเมล</label>
                  <span>{userData.email || 'ไม่ระบุ'}</span>
                </div>

                <div className="form-group">
                  <label>เบอร์โทรศัพท์ *</label>
                  {editMode ? (
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                        className={validationErrors.phone ? 'error' : ''}
                        placeholder="กรอกเบอร์โทรศัพท์"
                      />
                      {validationErrors.phone && <span className="error-text">{validationErrors.phone}</span>}
                    </div>
                  ) : (
                    <span>{userData.phone || 'ไม่ระบุ'}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>ปีที่จบการศึกษา *</label>
                  {editMode ? (
                    <div>
                      <select
                        name="graduation_year"
                        value={formData.graduation_year || ''}
                        onChange={handleInputChange}
                        className={validationErrors.graduation_year ? 'error' : ''}
                      >
                        <option value="">เลือกปีที่จบ</option>
                        {Array.from({ length: 30 }, (_, i) => 2024 - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      {validationErrors.graduation_year && <span className="error-text">{validationErrors.graduation_year}</span>}
                    </div>
                  ) : (
                    <span>{userData.graduation_year || 'ไม่ระบุ'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Education Information */}
            <div className="info-card">
              <div className="card-header">
                <div className="card-icon education">🎓</div>
                <h2>ข้อมูลการศึกษา</h2>
              </div>
              <div className="card-content">
                <div className="form-group">
                  <label>คณะ *</label>
                  {editMode ? (
                    <div>
                      <input
                        type="text"
                        name="faculty"
                        value={formData.faculty || ''}
                        onChange={handleInputChange}
                        className={validationErrors.faculty ? 'error' : ''}
                        placeholder="กรอกชื่อคณะ"
                      />
                      {validationErrors.faculty && <span className="error-text">{validationErrors.faculty}</span>}
                    </div>
                  ) : (
                    <span>{userData.faculty || 'ไม่ระบุ'}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>สาขาวิชา *</label>
                  {editMode ? (
                    <div>
                      <input
                        type="text"
                        name="major"
                        value={formData.major || ''}
                        onChange={handleInputChange}
                        className={validationErrors.major ? 'error' : ''}
                        placeholder="กรอกชื่อสาขาวิชา"
                      />
                      {validationErrors.major && <span className="error-text">{validationErrors.major}</span>}
                    </div>
                  ) : (
                    <span>{userData.major || 'ไม่ระบุ'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="info-card">
              <div className="card-header">
                <div className="card-icon work">💼</div>
                <h2>ข้อมูลการทำงาน</h2>
              </div>
              <div className="card-content">
                <div className="form-group">
                  <label>อาชีพ</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation || ''}
                      onChange={handleInputChange}
                      placeholder="กรอกอาชีพ"
                    />
                  ) : (
                    <span>{userData.occupation || 'ไม่ระบุ'}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>ตำแหน่ง</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="position"
                      value={formData.position || ''}
                      onChange={handleInputChange}
                      placeholder="กรอกตำแหน่งงาน"
                    />
                  ) : (
                    <span>{userData.position || 'ไม่ระบุ'}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>สถานที่ทำงาน</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="workplace"
                      value={formData.workplace || ''}
                      onChange={handleInputChange}
                      placeholder="กรอกสถานที่ทำงาน"
                    />
                  ) : (
                    <span>{userData.workplace || 'ไม่ระบุ'}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>เงินเดือน (บาท)</label>
                  {editMode ? (
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary || ''}
                      onChange={handleInputChange}
                      placeholder="กรอกจำนวนเงินเดือน"
                      min="0"
                    />
                  ) : (
                    <span>{userData.salary ? `${userData.salary} บาท` : 'ไม่ระบุ'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="info-card">
              <div className="card-header">
                <div className="card-icon address">🏠</div>
                <h2>ที่อยู่</h2>
              </div>
              <div className="card-content">
                <div className="form-group">
                  <label>ที่อยู่</label>
                  {editMode ? (
                    <textarea
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      placeholder="กรอกที่อยู่"
                      rows="3"
                    />
                  ) : (
                    <span>{userData.address || 'ไม่ระบุ'}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>จังหวัด</label>
                    {editMode ? (
                      <select
                        name="province"
                        value={formData.province || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">เลือกจังหวัด</option>
                        {provinces.map(province => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    ) : (
                      <span>{userData.province || 'ไม่ระบุ'}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>อำเภอ</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="district"
                        value={formData.district || ''}
                        onChange={handleInputChange}
                        placeholder="กรอกอำเภอ"
                      />
                    ) : (
                      <span>{userData.district || 'ไม่ระบุ'}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ตำบล</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="subdistrict"
                        value={formData.subdistrict || ''}
                        onChange={handleInputChange}
                        placeholder="กรอกตำบล"
                      />
                    ) : (
                      <span>{userData.subdistrict || 'ไม่ระบุ'}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>รหัสไปรษณีย์</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="zipcode"
                        value={formData.zipcode || ''}
                        onChange={handleInputChange}
                        placeholder="กรอกรหัสไปรษณีย์"
                        maxLength="5"
                      />
                    ) : (
                      <span>{userData.zipcode || 'ไม่ระบุ'}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="info-card bio-card">
              <div className="card-header">
                <div className="card-icon bio">✨</div>
                <h2>แนะนำตัว</h2>
              </div>
              <div className="card-content">
                <div className="form-group">
                  {editMode ? (
                    <textarea
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleInputChange}
                      placeholder="เขียนข้อความแนะนำตัว..."
                      rows="4"
                    />
                  ) : (
                    <p>{userData.bio || 'ยังไม่มีข้อมูลแนะนำตัว'}</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
      </div>
    </ModernLayout>
  );
}

export default EditableProfile;
