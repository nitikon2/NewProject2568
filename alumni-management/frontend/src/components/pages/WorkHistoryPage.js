import React from 'react';
import { 
    Container, 
    Box, 
    Typography, 
    styled, 
    keyframes,
    Paper,
    useTheme,
    useMediaQuery 
} from '@mui/material';
import { Work as WorkIcon, Business as BusinessIcon } from '@mui/icons-material';
import WorkHistory from './WorkHistory';

// Furni Modern Theme Keyframes
const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
`;

const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const shimmer = keyframes`
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
`;

// Furni Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #2f4b3f, #243d33)',
    color: '#ffffff',
    padding: '4rem 0 3rem',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: '50%',
        backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='20' cy='20' r='1.5' fill='%23f9c74f' opacity='0.3'/><circle cx='80' cy='30' r='1' fill='%23f9c74f' opacity='0.2'/><circle cx='40' cy='70' r='1.2' fill='%23f9c74f' opacity='0.4'/><circle cx='90' cy='80' r='0.8' fill='%23f9c74f' opacity='0.3'/></svg>")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '100px 100px',
        opacity: 0.1,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: 'linear-gradient(135deg, rgba(249, 199, 79, 0.1), rgba(47, 75, 63, 0.2))',
        zIndex: 1,
    }
}));

const HeroContent = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 2,
    animation: `${fadeInUp} 0.8s ease-out`,
}));

const FloatingIcon = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #f9c74f, #fbd36b)',
    borderRadius: '50%',
    marginBottom: '1.5rem',
    animation: `${float} 3s ease-in-out infinite`,
    boxShadow: '0 10px 30px rgba(249, 199, 79, 0.3)',
    '& .MuiSvgIcon-root': {
        fontSize: '2.5rem',
        color: '#2f4b3f',
    }
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #f7f5f3, #f0ede8)',
    minHeight: 'calc(100vh - 300px)',
    paddingTop: '2rem',
    paddingBottom: '3rem',
}));

const GlassCard = styled(Paper)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(47, 75, 63, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(249, 199, 79, 0.1), transparent)',
        animation: `${shimmer} 2s infinite`,
    }
}));

const WorkHistoryPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{ minHeight: '100vh' }}>
            {/* Hero Section - Furni Style */}
            <HeroSection>
                <Container maxWidth="lg">
                    <HeroContent>
                        <Box sx={{ textAlign: 'center' }}>
                            <FloatingIcon>
                                <BusinessIcon />
                            </FloatingIcon>
                            <Typography 
                                variant="h2" 
                                component="h1" 
                                sx={{ 
                                    fontWeight: 700,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    mb: 2,
                                    fontFamily: 'Poppins, sans-serif'
                                }}
                            >
                                ประวัติการทำงาน
                            </Typography>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    opacity: 0.9,
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                                    fontWeight: 400,
                                    lineHeight: 1.6
                                }}
                            >
                                จัดการและแสดงประสบการณ์การทำงานของคุณอย่างเป็นระบบ
                            </Typography>
                        </Box>
                    </HeroContent>
                </Container>
            </HeroSection>

            {/* Main Content */}
            <ContentWrapper>
                <Container maxWidth="lg">
                    <GlassCard sx={{ p: { xs: 2, md: 3 }, mt: -6, position: 'relative', zIndex: 10 }}>
                        <WorkHistory />
                    </GlassCard>
                </Container>
            </ContentWrapper>
        </Box>
    );
};

export default WorkHistoryPage;
