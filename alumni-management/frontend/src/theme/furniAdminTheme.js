import { createTheme } from '@mui/material/styles';

// Furni Enhanced Green Theme for Admin Panel
export const furniAdminTheme = createTheme({
  palette: {
    primary: {
      main: '#2f4b3f',       // Furni Deep Green
      light: '#3a5c4b',      // Furni Light Green  
      dark: '#243d33',       // Furni Dark Green
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#f9c74f',       // Bright Yellow Accent
      light: '#fbd36b',      // Light Yellow
      dark: '#f8b42e',       // Dark Yellow
      contrastText: '#2a3b3d'
    },
    background: {
      default: '#f7f5f3',    // Warm Cream Background
      paper: '#ffffff',      // Card Background
      secondary: '#f0ede8'   // Secondary Background
    },
    text: {
      primary: '#2a3b3d',    // Dark Text
      secondary: '#6c757d',  // Muted Text
      disabled: '#adb5bd'    // Disabled Text
    },
    divider: '#e9ecef',
    success: {
      main: '#22c55e',
      light: '#86efac',
      dark: '#16a34a'
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706'
    },
    error: {
      main: '#ef4444',
      light: '#fca5a5',
      dark: '#dc2626'
    },
    info: {
      main: '#3b82f6',
      light: '#93c5fd',
      dark: '#2563eb'
    }
  },
  typography: {
    fontFamily: [
      'Source Sans Pro',
      'Segoe UI',
      'system-ui',
      'sans-serif'
    ].join(','),
    h1: {
      fontFamily: 'Poppins, Inter, sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2
    },
    h2: {
      fontFamily: 'Poppins, Inter, sans-serif',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3
    },
    h3: {
      fontFamily: 'Poppins, Inter, sans-serif',
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3
    },
    h4: {
      fontFamily: 'Poppins, Inter, sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4
    },
    h5: {
      fontFamily: 'Poppins, Inter, sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4
    },
    h6: {
      fontFamily: 'Poppins, Inter, sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.6
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.7
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.025em'
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)',  // Light shadow
    '0 0.25rem 0.5rem rgba(47, 75, 63, 0.12)',   // Default shadow
    '0 0.5rem 1rem rgba(47, 75, 63, 0.15)',      // Medium shadow
    '0 1rem 2rem rgba(47, 75, 63, 0.18)',        // Heavy shadow
    '0 1rem 3rem rgba(47, 75, 63, 0.2)',         // Elevated shadow
    '0 0.25rem 0.75rem rgba(249, 199, 79, 0.3)', // Orange shadow
    '0 2rem 4rem rgba(47, 75, 63, 0.25)',        // Deep shadow
    '0 2rem 6rem rgba(47, 75, 63, 0.3)',         // Very deep shadow
    '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)',
    '0 0.25rem 0.5rem rgba(47, 75, 63, 0.12)',
    '0 0.5rem 1rem rgba(47, 75, 63, 0.15)',
    '0 1rem 2rem rgba(47, 75, 63, 0.18)',
    '0 1rem 3rem rgba(47, 75, 63, 0.2)',
    '0 0.25rem 0.75rem rgba(249, 199, 79, 0.3)',
    '0 2rem 4rem rgba(47, 75, 63, 0.25)',
    '0 2rem 6rem rgba(47, 75, 63, 0.3)',
    '0 2rem 8rem rgba(47, 75, 63, 0.35)',
    '0 3rem 10rem rgba(47, 75, 63, 0.4)',
    '0 3rem 12rem rgba(47, 75, 63, 0.45)',
    '0 4rem 14rem rgba(47, 75, 63, 0.5)',
    '0 4rem 16rem rgba(47, 75, 63, 0.55)',
    '0 5rem 18rem rgba(47, 75, 63, 0.6)',
    '0 5rem 20rem rgba(47, 75, 63, 0.65)',
    '0 6rem 22rem rgba(47, 75, 63, 0.7)'
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          border: '1px solid #e9ecef',
          boxShadow: '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 1rem 2rem rgba(47, 75, 63, 0.25)',
            borderColor: '#f9c74f'
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #f9c74f, #fbd36b)',
            opacity: 0,
            transition: 'opacity 0.3s ease'
          },
          '&:hover::before': {
            opacity: 1
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '0.75rem 1.5rem',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s'
          },
          '&:hover::before': {
            left: '100%'
          },
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
          color: '#2a3b3d',
          boxShadow: '0 0.25rem 0.75rem rgba(249, 199, 79, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #f8b42e, #f9c74f)',
            boxShadow: '0 1rem 2rem rgba(249, 199, 79, 0.4)'
          }
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #243d33, #2f4b3f)'
          }
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            border: '2px solid #dee2e6',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#f9c74f'
            },
            '&.Mui-focused': {
              borderColor: '#f9c74f',
              boxShadow: '0 0 0 0.2rem rgba(249, 199, 79, 0.25)'
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
          color: '#2a3b3d'
        },
        colorSecondary: {
          background: 'linear-gradient(135deg, #2f4b3f, #3a5c4b)',
          color: '#ffffff'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: '1px solid #e9ecef'
        },
        elevation1: {
          boxShadow: '0 0.125rem 0.25rem rgba(47, 75, 63, 0.1)'
        },
        elevation2: {
          boxShadow: '0 0.25rem 0.5rem rgba(47, 75, 63, 0.12)'
        },
        elevation3: {
          boxShadow: '0 0.5rem 1rem rgba(47, 75, 63, 0.15)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          color: '#2a3b3d',
          boxShadow: '0 0.5rem 1rem rgba(47, 75, 63, 0.15)',
          borderBottom: '1px solid #e9ecef'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          border: 'none'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          margin: '0.25rem 0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: 'translateX(4px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)'
            }
          }
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)'
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#e9ecef'
        },
        head: {
          backgroundColor: '#f8fafc',
          fontWeight: 600,
          fontSize: '0.9rem'
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          overflow: 'hidden'
        },
        colorPrimary: {
          backgroundColor: 'rgba(249, 199, 79, 0.1)'
        },
        barColorPrimary: {
          backgroundColor: '#f9c74f'
        }
      }
    }
  }
});

export default furniAdminTheme;