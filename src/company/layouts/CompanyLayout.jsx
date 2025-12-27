import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import CompanySidebar from '../components/CompanySidebar';
import CompanyTopBar from '../components/CompanyTopBar';

export default function CompanyLayout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isPortrait = useMediaQuery('(orientation: portrait)');
    const isLandscape = useMediaQuery('(orientation: landscape)');

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            minHeight: '100vh', 
            backgroundColor: 'background.default',
            width: '100vw',
            maxWidth: '100%',
            overflowX: 'hidden'
        }}>
            <CompanySidebar 
                mobileOpen={mobileOpen} 
                handleDrawerToggle={handleDrawerToggle} 
            />
            <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                width: '100%',
                minWidth: 0,
                maxWidth: '100%',
                // ml: { md: `${isMobile ? 0 : 260}px` },
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            }}>
                <CompanyTopBar handleDrawerToggle={handleDrawerToggle} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: { 
                            xs: isPortrait ? 2 : 1.5, 
                            sm: 2.5, 
                            md: 3,
                            lg: 4 
                        },
                        mt: { 
                            xs: isMobile ? 7 : 8, 
                            sm: 8,
                            md: 8 
                        },
                        width: '100%',
                        maxWidth: '100%',
                        overflow: 'auto',
                        boxSizing: 'border-box',
                        textAlign: 'left !important',
                        '@media (max-width: 360px)': {
                            p: isPortrait ? 1.5 : 1,
                        },
                        '@media (max-height: 500px) and (orientation: landscape)': {
                            p: 1.5,
                            mt: 7,
                        },
                        // Force left alignment for all content
                        '& > *': {
                            textAlign: 'left !important',
                        },
                        '& .MuiTypography-root': {
                            textAlign: 'left !important',
                        },
                        '& .MuiCardContent-root': {
                            textAlign: 'left !important',
                        },
                        '& .MuiGrid-container': {
                            justifyContent: 'flex-start !important',
                        }
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}