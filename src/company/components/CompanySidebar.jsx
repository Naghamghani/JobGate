import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Work as WorkIcon,
    People as PeopleIcon,
    Business as BusinessIcon,
    Article as ArticleIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

const menuItems = [
    { text: 'Dashboard Home', icon: <DashboardIcon />, path: '/company' },
    { text: 'Job Postings', icon: <WorkIcon />, path: '/company/jobs' },
    { text: 'Posts', icon: <ArticleIcon />, path: '/company/posts' },
    { text: 'Candidates', icon: <PeopleIcon />, path: '/company/candidates' },
    { text: 'Company Profile', icon: <BusinessIcon />, path: '/company/profile' },
];

export default function CompanySidebar({ mobileOpen, handleDrawerToggle }) { // Add props
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const drawerContent = (
        <>
            <Box sx={{ 
                p: { xs: 2, sm: 3 }, 
                borderBottom: '1px solid #E5E7EB',
                textAlign: 'center'
            }}>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: 700, 
                        color: '#2FA4A9',
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                    }}
                >
                    JobGate
                </Typography>
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: '#7A7A7A',
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                    }}
                >
                    Company Dashboard
                </Typography>
            </Box>

            <List sx={{ 
                px: { xs: 1, sm: 2 }, 
                pt: { xs: 1, sm: 2 },
                overflow: 'auto'
            }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || 
                                    (item.path === '/company' && location.pathname === '/company/');
                    return (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => {
                                navigate(item.path);
                                if (isMobile) {
                                    handleDrawerToggle();
                                }
                            }}
                            sx={{
                                borderRadius: 2,
                                mb: { xs: 0.5, sm: 1 },
                                backgroundColor: isActive ? '#AEE3E6' : 'transparent',
                                borderLeft: isActive ? '4px solid #2FA4A9' : '4px solid transparent',
                                '&:hover': {
                                    backgroundColor: isActive ? '#AEE3E6' : 'rgba(47, 164, 169, 0.08)',
                                },
                                py: { xs: 0.75, sm: 1 }
                            }}
                        >
                            <ListItemIcon 
                                sx={{ 
                                    color: isActive ? '#2FA4A9' : '#7A7A7A', 
                                    minWidth: { xs: 36, sm: 40 },
                                    '& svg': {
                                        fontSize: { xs: '1.125rem', sm: '1.25rem' }
                                    }
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '0.95rem' },
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? '#4A4A4A' : '#7A7A7A',
                                }}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
            {/* Mobile drawer */}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={isMobile ? mobileOpen : true}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better mobile performance
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#F2F4F6',
                        color: '#4A4A4A',
                        borderRight: '1px solid #E5E7EB',
                    },
                }}
            >
                {drawerContent}
            </Drawer>
            
            {/* Desktop drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#F2F4F6',
                        color: '#4A4A4A',
                        borderRight: '1px solid #E5E7EB',
                        position: 'fixed',
                        height: '100vh',
                        overflowY: 'auto',
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
}