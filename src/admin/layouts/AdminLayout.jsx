import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function AdminLayout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
            <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                width: { md: `calc(100% - ${isMobile ? 0 : 240}px)` },
                // ml: { md: `${isMobile ? 0 : 240}px` }
            }}>
                <TopBar handleDrawerToggle={handleDrawerToggle} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: { xs: 2, sm: 3 },
                        mt: { xs: 7, sm: 8 },
                        width: '100%',
                        maxWidth: '100%',
                        overflow: 'auto',
                        textAlign: 'left',
                        '& *': {
                            textAlign: 'left !important'
                        }
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}