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
    Badge,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Button,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    PersonAdd as PersonAddIcon,
    Work as WorkIcon,
    Menu as MenuIcon,
} from '@mui/icons-material';
import { LogoutAPI, getUserEmail } from '../../api/AuthAPI';
import { getNotificationsAPI, markNotificationAsReadAPI, markAllNotificationsAsReadAPI } from '../../api/NotificationAPI';
import { toast } from 'react-toastify';

export default function TopBar({ handleDrawerToggle }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const email = getUserEmail();
        setUserEmail(email || 'Admin');
        fetchNotifications();

        // Auto-refresh notifications every 30 seconds
        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getNotificationsAPI();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationOpen = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.read) {
                await markNotificationAsReadAPI(notification._id);
                await fetchNotifications();
            }
            handleNotificationClose();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsReadAPI();
            await fetchNotifications();
            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Failed to mark notifications as read');
        }
    };

    const handleLogout = () => {
        LogoutAPI();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_user':
                return <PersonAddIcon sx={{ color: '#2FA4A9' }} />;
            case 'job_application':
                return <WorkIcon sx={{ color: '#2FA4A9' }} />;
            default:
                return <NotificationsIcon sx={{ color: '#2FA4A9' }} />;
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #E5E7EB',
                color: '#4A4A4A',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', py: 1, px: { xs: 1, sm: 2, md: 3 } }}>
                {/* Left side with menu button for mobile */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    
                    {/* Admin Dashboard Title - responsive font size */}
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 600, 
                            color: '#2FA4A9',
                            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                        }}
                    >
                        Admin Dashboard
                    </Typography>
                </Box>

                {/* Right Side Icons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                    {/* Notifications */}
                    <IconButton onClick={handleNotificationOpen} size="small">
                        <Badge badgeContent={unreadCount} sx={{ '& .MuiBadge-badge': { 
                            backgroundColor: '#2FA4A9', 
                            color: '#FFFFFF',
                            fontSize: { xs: '0.6rem', sm: '0.75rem' }
                        } }}>
                            <NotificationsIcon sx={{ 
                                color: '#7A7A7A',
                                fontSize: { xs: '1.25rem', sm: '1.5rem' }
                            }} />
                        </Badge>
                    </IconButton>

                    {/* Settings - hide on very small screens */}
                    <IconButton size="small" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        <SettingsIcon sx={{ 
                            color: '#7A7A7A',
                            fontSize: { xs: '1.25rem', sm: '1.5rem' }
                        }} />
                    </IconButton>

                    {/* User Avatar */}
                    <IconButton onClick={handleMenuOpen} size="small">
                        <Avatar sx={{ 
                            width: { xs: 28, sm: 32 }, 
                            height: { xs: 28, sm: 32 }, 
                            backgroundColor: '#2FA4A9',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                            {userEmail.charAt(0).toUpperCase()}
                        </Avatar>
                    </IconButton>
                </Box>

                {/* Notification Menu - responsive width */}
                <Menu
                    anchorEl={notificationAnchorEl}
                    open={Boolean(notificationAnchorEl)}
                    onClose={handleNotificationClose}
                    PaperProps={{
                        sx: {
                            width: { xs: 300, sm: 350, md: 400 },
                            maxHeight: 500,
                            mt: 1,
                        },
                    }}
                >
                    <Box sx={{ 
                        px: 2, 
                        py: 1.5, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                            Notifications
                        </Typography>
                        {unreadCount > 0 && (
                            <Button
                                size="small"
                                onClick={handleMarkAllAsRead}
                                sx={{ color: '#2FA4A9', textTransform: 'none', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                                Mark all as read
                            </Button>
                        )}
                    </Box>
                    <Divider />
                    {notifications.length === 0 ? (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <NotificationsIcon sx={{ fontSize: 48, color: '#E5E7EB', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                No notifications
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ py: 0, maxHeight: 400, overflow: 'auto' }}>
                            {notifications.map((notification) => (
                                <ListItem
                                    key={notification._id}
                                    button
                                    onClick={() => handleNotificationClick(notification)}
                                    sx={{
                                        backgroundColor: notification.read ? 'transparent' : '#AEE3E6',
                                        '&:hover': { backgroundColor: notification.read ? '#F2F4F6' : '#9DD9DC' },
                                        borderBottom: '1px solid #E5E7EB',
                                        py: 1.5,
                                        px: 2,
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        {getNotificationIcon(notification.type)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={notification.message}
                                        secondary={formatTimeAgo(notification.createdAt)}
                                        primaryTypographyProps={{
                                            fontWeight: notification.read ? 400 : 600,
                                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                        }}
                                        secondaryTypographyProps={{
                                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Menu>

                {/* User Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: { width: 200, mt: 1 },
                    }}
                >
                    <MenuItem disabled>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {userEmail}
                        </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 1, fontSize: { xs: 18, sm: 20 } }} />
                        <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            Logout
                        </Typography>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}