import React from 'react';
import { Box, Container } from '@mui/material';
import AdminSidebar from '../admin/AdminSidebar';

function AdminLayout({ children, title }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: '280px', // ความกว้างของ sidebar
          minHeight: '100vh',
          bgcolor: '#f8fafc',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Box
          sx={{
            width: '100%',
            minHeight: '100vh',
            overflow: 'auto'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default AdminLayout;
