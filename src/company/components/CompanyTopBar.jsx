import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Avatar,
    Box,
    Menu,
    MenuItem,
    Typography,
    Divider,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Business as BusinessIcon,
    Menu as MenuIcon, // Add MenuIcon
} from '@mui/icons-material';
import { LogoutAPI, getUserEmail, getUserProfile } from '../../api/AuthAPI';
import { toast } from 'react-toastify';

export default function CompanyTopBar({ handleDrawerToggle }) { // Add handleDrawerToggle prop
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState(null);
    const [companyName, setCompanyName] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                const profile = await getUserProfile();
                setCompanyName(profile.name || 'Company');
                setCompanyEmail(profile.email || getUserEmail());
            } catch (error) {
                console.error('Error fetching profile:', error);
                setCompanyName('Company');
                setCompanyEmail(getUserEmail() || '');
            }
        };

        fetchCompanyProfile();
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        LogoutAPI();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    // Get first letter of company name for avatar
    const avatarLetter = companyName.charAt(0).toUpperCase() || 'C';

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { md: `calc(100% - 260px)` },
                ml: { md: `260px` },
                backgroundColor: 'white',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                color: 'text.primary',
                zIndex: theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar sx={{ 
                justifyContent: 'space-between', 
                py: { xs: 0.5, sm: 1 },
                minHeight: { xs: 56, sm: 64 }
            }}>
                {/* Left side with menu button and title */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 600, 
                            color: '#2FA4A9',
                            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                        }}
                    >
                        Company Dashboard
                    </Typography>
                </Box>

                {/* Right side with icons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                    <IconButton size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                        <NotificationsIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                        <SettingsIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={handleMenuOpen} size="small">
                        <Avatar 
                            sx={{ 
                                width: { xs: 32, sm: 36 }, 
                                height: { xs: 32, sm: 36 }, 
                                backgroundColor: '#0a66c2',
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            {avatarLetter}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                minWidth: 220,
                                maxWidth: { xs: '90vw', sm: 220 },
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            },
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    fontWeight: 600, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 0.5,
                                    fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                                }}
                            >
                                <BusinessIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                                {companyName}
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: 'text.secondary',
                                    fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                                    wordBreak: 'break-word'
                                }}
                            >
                                {companyEmail}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem 
                            onClick={() => { 
                                handleMenuClose(); 
                                navigate('/company/profile'); 
                            }}
                            sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}
                        >
                            <SettingsIcon sx={{ mr: 1, fontSize: { xs: 18, sm: 20 } }} />
                            Company Profile
                        </MenuItem>
                        <MenuItem 
                            onClick={handleLogout} 
                            sx={{ 
                                color: 'error.main',
                                fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                            }}
                        >
                            <LogoutIcon sx={{ mr: 1, fontSize: { xs: 18, sm: 20 } }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}