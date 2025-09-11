import React from 'react';
import { Container, Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Work as WorkIcon, Home as HomeIcon, Person as PersonIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import BackgroundLayout from '../layout/BackgroundLayout';
import WorkHistory from './WorkHistory';

const WorkHistoryPage = () => {
    return (
        <BackgroundLayout>
            <Container maxWidth="lg" sx={{ py: 4 }}>

                {/* Work History Component */}
                <WorkHistory />
            </Container>
        </BackgroundLayout>
    );
};

export default WorkHistoryPage;
