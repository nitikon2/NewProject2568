import React from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';

function ModernLayout({ children, fullWidth = false, maxWidth = 'xl', sx = {} }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(102, 126, 234, 0.08) 0%, transparent 50%)
          `,
          zIndex: -1,
          pointerEvents: 'none'
        },
        ...sx
      }}
    >
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 3, sm: 4, md: 6 }
        }}
      >
        {fullWidth ? (
          <Box sx={{ width: '100%', px: 0 }}>
            {children}
          </Box>
        ) : (
          <Container
            maxWidth={maxWidth}
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              px: { xs: 2, sm: 3 }
            }}
          >
            {children}
          </Container>
        )}
      </Box>
    </Box>
  );
}

export default ModernLayout;
