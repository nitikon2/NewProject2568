import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { label: 'หน้าหลัก', path: '/' },
    { label: 'ข่าวสาร', path: '/news' },
    { label: 'กิจกรรม', path: '/events' },
    { label: 'พูดคุย', path: '/forum', requireAuth: true },
    { label: 'ทำเนียบศิษย์เก่า', path: '/alumni', requireAuth: true },
    ...(user?.role === 'admin' ? [{ label: 'จัดการระบบ', path: '/admin' }] : [])
  ];

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Furni Modern Theme Styles
  const navbarStyle = {
    background: '#ffffff', // สีขาวตามแบบ Furni Modern Theme
    boxShadow: '0 0.5rem 1rem rgba(47, 75, 63, 0.15)',
    borderBottom: '1px solid #e9ecef',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const brandStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#2f4b3f', // สีเขียวเข้ม Furni
    fontFamily: "'Poppins', sans-serif",
    textDecoration: 'none',
    margin: 0
  };

  const navLinkStyle = {
    color: '#6c757d',
    fontWeight: '500',
    fontSize: '1rem',
    marginRight: '1.5rem',
    transition: '0.3s ease',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    position: 'relative',
    textDecoration: 'none',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer'
  };

  const activeLinkStyle = {
    ...navLinkStyle,
    color: '#2f4b3f',
    background: 'rgba(47, 75, 63, 0.08)'
  };

  return (
    <nav style={navbarStyle}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <Link to="/" style={brandStyle}>
          Alumni RMU.
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          style={{ 
            display: window.innerWidth < 992 ? 'block' : 'none',
            border: 'none',
            background: 'transparent',
            fontSize: '1.2rem',
            padding: '0.25rem 0.5rem',
            color: '#2f4b3f'
          }}
        >
          ☰
        </button>

        {/* Desktop Navigation Menu */}
        <div style={{ 
          display: window.innerWidth >= 992 ? 'flex' : 'none',
          alignItems: 'center',
          marginLeft: 'auto'
        }}>
          {menuItems.map((item) => {
            if (item.requireAuth && !user) return null;
            const isActive = isActivePath(item.path);
            return (
              <div key={item.path} style={{ position: 'relative' }}>
                <Link
                  to={item.path}
                  style={isActive ? activeLinkStyle : navLinkStyle}
                >
                  {item.label}
                </Link>
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-0.5rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '20px',
                      height: '3px',
                      background: '#f9c74f',
                      borderRadius: '2px'
                    }}
                  />
                )}
              </div>
            );
          })}
          
          {/* User Menu */}
          {!user && (
            <>
              <Link to="/login" style={navLinkStyle}>เข้าสู่ระบบ</Link>
              <Link to="/register" style={navLinkStyle}>สมัครสมาชิก</Link>
            </>
          )}
          
          {user && (
            <>
              <Link to="/profile" style={navLinkStyle}>โปรไฟล์</Link>
              <button onClick={handleLogout} style={navLinkStyle}>
                ออกจากระบบ
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div 
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#ffffff',
              boxShadow: '0 0.5rem 1rem rgba(47, 75, 63, 0.15)',
              border: '1px solid #e9ecef',
              zIndex: 1000,
              padding: '1rem'
            }}
          >
            {menuItems.map((item) => {
              if (item.requireAuth && !user) return null;
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  style={{
                    display: 'block',
                    padding: '0.5rem 0',
                    color: isActive ? '#2f4b3f' : '#6c757d',
                    textDecoration: 'none',
                    fontWeight: isActive ? '600' : '500'
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            
            <hr style={{ margin: '1rem 0', borderColor: '#e9ecef' }} />
            
            {!user && (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setShowMobileMenu(false)}
                  style={{
                    display: 'block',
                    padding: '0.5rem 0',
                    color: '#6c757d',
                    textDecoration: 'none'
                  }}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setShowMobileMenu(false)}
                  style={{
                    display: 'block',
                    padding: '0.5rem 0',
                    color: '#6c757d',
                    textDecoration: 'none'
                  }}
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
            
            {user && (
              <>
                <Link 
                  to="/profile" 
                  onClick={() => setShowMobileMenu(false)}
                  style={{
                    display: 'block',
                    padding: '0.5rem 0',
                    color: '#6c757d',
                    textDecoration: 'none'
                  }}
                >
                  โปรไฟล์
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  style={{
                    display: 'block',
                    padding: '0.5rem 0',
                    color: '#6c757d',
                    textDecoration: 'none',
                    border: 'none',
                    background: 'transparent',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  ออกจากระบบ
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
