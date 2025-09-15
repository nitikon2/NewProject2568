import React from 'react';
import { Box, Container } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import AdminSidebar from '../admin/AdminSidebar';
import furniAdminTheme from '../../theme/furniAdminTheme';
import '../../styles/furniAnimations.css';

function AdminLayout({ children, title }) {
  return (
    <ThemeProvider theme={furniAdminTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AdminSidebar />
        <Box
          sx={{
            flexGrow: 1,
            marginLeft: '280px',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f7f5f3 0%, #f0ede8 100%)',
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="90" cy="10" r="1" fill="%23f9c74f" opacity="0.1"/><circle cx="20" cy="80" r="1.5" fill="%23f9c74f" opacity="0.08"/><circle cx="70" cy="50" r="0.8" fill="%23f9c74f" opacity="0.12"/><circle cx="10" cy="30" r="1.2" fill="%23f9c74f" opacity="0.06"/></svg>') repeat`,
              backgroundSize: '150px 150px',
              opacity: 0.3,
              animation: 'furniFloat 30s ease-in-out infinite',
              pointerEvents: 'none'
            }
          }}
        >
          <Box
            sx={{
              width: '100%',
              minHeight: '100vh',
              overflow: 'auto',
              position: 'relative',
              zIndex: 2,
              padding: 0
            }}
            className="furni-scrollbar"
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AdminLayout;
