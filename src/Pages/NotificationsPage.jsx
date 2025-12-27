import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Chip,
    Avatar,
    Container,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Badge,
    Tooltip,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    PersonAdd as PersonAddIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { getNotificationsAPI, markNotificationAsReadAPI, markAllNotificationsAsReadAPI } from '../api/NotificationAPI';
import { acceptConnectionRequestAPI, rejectConnectionRequestAPI } from '../api/ConnectionAPI';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Import React Icons for exact same icons
import {
    AiOutlineHome,
    AiOutlineUserSwitch,
    AiOutlineMessage,
    AiOutlineBell,
    AiOutlineCheck,
    AiOutlineClose,
    AiOutlineMenu,
    AiOutlineCloseCircle,
} from 'react-icons/ai';
import { BsBriefcase, BsPeople } from 'react-icons/bs';

// TopBar Component with EXACT same style as FriendsPage
const TopBar = ({ currentUser }) => {
    const [popupVisible, setPopupVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    // Check if mobile screen
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // Check if user is authenticated
        const loggedIn = true; // Temporarily set to true for testing
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
            setUserEmail("test@example.com"); // Temporarily set test email
        }
    }, []);

    const goToRoute = (route) => {
        navigate(route);
        setIsMobileMenuOpen(false);
        setPopupVisible(false);
        setNotificationVisible(false);
    };

    const displayPopup = () => {
        setPopupVisible(!popupVisible);
        setNotificationVisible(false);
        setIsMobileMenuOpen(false);
    };

    const toggleNotifications = () => {
        setNotificationVisible(!notificationVisible);
        setPopupVisible(false);
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setPopupVisible(false);
        setNotificationVisible(false);
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    };

    const NavIcons = () => (
        <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 4,
            color: '#6b7280',
            fontSize: { md: '1.5rem', lg: '1.75rem' }
        }}>
            <AiOutlineHome
                style={{
                    cursor: 'pointer',
                    color: '#6b7280',
                    fontSize: 'inherit',
                }}
                onClick={() => goToRoute("/home")}
                title="Home"
            />
            <AiOutlineUserSwitch
                style={{
                    cursor: 'pointer',
                    color: '#6b7280',
                    fontSize: 'inherit',
                }}
                onClick={() => goToRoute("/connections")}
                title="Connections"
            />
            <BsPeople
                style={{
                    cursor: 'pointer',
                    color: '#6b7280',
                    fontSize: 'inherit',
                }}
                onClick={() => goToRoute("/friends")}
                title="Friends"
            />
            <BsBriefcase
                style={{
                    cursor: 'pointer',
                    color: '#6b7280',
                    fontSize: 'inherit',
                }}
                onClick={() => goToRoute("/jobs")}
                title="Jobs"
            />
            <AiOutlineMessage
                style={{
                    cursor: 'pointer',
                    color: '#6b7280',
                    fontSize: 'inherit',
                }}
                title="Messages"
            />
            <Box sx={{ position: 'relative' }}>
                <AiOutlineBell
                    style={{
                        cursor: 'pointer',
                        color: '#6b7280',
                        fontSize: 'inherit',
                    }}
                    onClick={() => goToRoute("/notifications")}
                />
                {unreadCount > 0 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            backgroundColor: '#2FA4A9',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Box>
                )}
            </Box>
        </Box>
    );

    const MobileNavIcons = () => (
        <Box sx={{ 
            display: { xs: 'flex', md: 'none' }, 
            alignItems: 'center', 
            gap: 4,
            color: '#6b7280',
            fontSize: '1.5rem'
        }}>
            <Box sx={{ position: 'relative' }}>
                <AiOutlineBell
                    style={{
                        cursor: 'pointer',
                        color: '#6b7280',
                        fontSize: 'inherit',
                    }}
                    onClick={toggleNotifications}
                />
                {unreadCount > 0 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            backgroundColor: '#2FA4A9',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Box>
                )}
            </Box>
            <AiOutlineMenu
                style={{
                    cursor: 'pointer',
                    color: '#6b7280',
                    fontSize: 'inherit',
                }}
                onClick={toggleMobileMenu}
            />
        </Box>
    );

    return (
        <>
            {/* Main TopBar Container */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 64,
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: { xs: 4, md: 8, lg: 12 },
                    zIndex: 1100,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
            >
                {/* Profile Popup */}
                {popupVisible && (
                    <Box
                        sx={{
                            position: 'absolute',
                            right: { xs: 4, md: 8 },
                            top: 64,
                            zIndex: 1200,
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: 2,
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                                p: 3,
                                width: 300,
                            }}
                        >
                            <Typography>Profile Popup Placeholder</Typography>
                        </Box>
                    </Box>
                )}

                {/* Notifications Popup */}
                {notificationVisible && (
                    <Box
                        sx={{
                            position: 'absolute',
                            right: { xs: 4, md: 8 },
                            top: 64,
                            zIndex: 1200,
                            width: { xs: 320, md: 384 },
                            backgroundColor: 'white',
                            borderRadius: 2,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            border: '1px solid #e5e7eb',
                            maxHeight: '80vh',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Box
                            sx={{
                                p: 3,
                                borderBottom: '1px solid #e5e7eb',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
                                Notifications
                            </Typography>
                            <AiOutlineCloseCircle
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    color: '#6b7280',
                                }}
                                onClick={() => setNotificationVisible(false)}
                            />
                        </Box>
                        <Box sx={{ overflow: 'auto', flex: 1 }}>
                            {notifications.length === 0 ? (
                                <Box sx={{ p: 8, textAlign: 'center' }}>
                                    <AiOutlineBell style={{ fontSize: '3rem', color: '#e5e7eb', marginBottom: 2 }} />
                                    <Typography color="text.secondary">No notifications</Typography>
                                </Box>
                            ) : (
                                notifications.map((notification) => (
                                    <Box
                                        key={notification._id}
                                        sx={{
                                            p: 3,
                                            borderBottom: '1px solid #f3f4f6',
                                            '&:hover': { backgroundColor: '#f9fafb' },
                                            backgroundColor: !notification.read ? '#f0f9fa' : 'transparent',
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ 
                                            fontWeight: !notification.read ? 600 : 400,
                                            mb: 1
                                        }}>
                                            {notification.message}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatTimeAgo(notification.createdAt)}
                                        </Typography>
                                    </Box>
                                ))
                            )}
                        </Box>
                    </Box>
                )}

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <Box
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 40,
                            display: { xs: 'block', md: 'none' },
                        }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <Box
                        sx={{
                            position: 'fixed',
                            top: 64,
                            right: 0,
                            width: 256,
                            backgroundColor: 'white',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            zIndex: 50,
                            height: 'calc(100vh - 64px)',
                            overflowY: 'auto',
                            display: { xs: 'block', md: 'none' },
                        }}
                    >
                        <Box sx={{ 
                            p: 3, 
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center' 
                        }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
                                Menu
                            </Typography>
                            <AiOutlineCloseCircle
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    color: '#6b7280',
                                }}
                                onClick={toggleMobileMenu}
                            />
                        </Box>
                        <Box sx={{ p: 3 }}>
                            {[
                                { text: 'Home', path: '/home', icon: <AiOutlineHome /> },
                                { text: 'Connections', path: '/connections', icon: <AiOutlineUserSwitch /> },
                                { text: 'Friends', path: '/friends', icon: <BsPeople /> },
                                { text: 'Jobs', path: '/jobs', icon: <BsBriefcase /> },
                                { text: 'Messages', path: '/messages', icon: <AiOutlineMessage /> },
                            ].map((item) => (
                                <Box
                                    key={item.text}
                                    onClick={() => goToRoute(item.path)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        p: 2,
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        mb: 1,
                                        '&:hover': { backgroundColor: '#f9fafb' },
                                        color: '#4b5563',
                                    }}
                                >
                                    <Box sx={{ color: '#6b7280', fontSize: '1.25rem' }}>
                                        {item.icon}
                                    </Box>
                                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                        {item.text}
                                    </Typography>
                                </Box>
                            ))}
                            
                            {/* User Profile in Mobile Menu */}
                            {isLoggedIn && currentUser && (
                                <Box
                                    onClick={displayPopup}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        p: 2,
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        mt: 2,
                                        '&:hover': { backgroundColor: '#f9fafb' },
                                    }}
                                >
                                    {currentUser?.imageLink ? (
                                        <Box
                                            component="img"
                                            src={currentUser.imageLink}
                                            alt="user"
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #2FA4A9 0%, #1a7a7e 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: 'white',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {userEmail?.charAt(0).toUpperCase() || currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                                            </Typography>
                                        </Box>
                                    )}
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                            {currentUser.name || "Profile"}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            View profile
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}

                {/* Logo */}
                <Typography
                    onClick={() => goToRoute("/home")}
                    sx={{
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontSize: { xs: '1.5rem', md: '1.75rem', lg: '2rem' },
                        userSelect: 'none',
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    JobGate
                </Typography>

                {/* Desktop Navigation */}
                <NavIcons />
                
                {/* Mobile Navigation Icons */}
                <MobileNavIcons />

                {/* User Profile Section */}
                {!isMobile && (isLoggedIn || currentUser?.name) ? (
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                        {currentUser?.imageLink ? (
                            <Box
                                component="img"
                                src={currentUser.imageLink}
                                alt="user"
                                onClick={displayPopup}
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    cursor: 'pointer',
                                    border: '1px solid #e5e7eb',
                                }}
                            />
                        ) : (
                            <Box
                                onClick={displayPopup}
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #2FA4A9 0%, #1a7a7e 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    border: '1px solid #e5e7eb',
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {userEmail?.charAt(0).toUpperCase() || currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                ) : !isMobile && !isLoggedIn ? (
                    <Button
                        onClick={() => goToRoute("/login")}
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            px: { md: 4, lg: 6 },
                            py: { md: 0.75, lg: 1 },
                            borderRadius: '50px',
                            border: '2px solid #2FA4A9',
                            color: '#2FA4A9',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: { md: '0.875rem', lg: '1rem' },
                            '&:hover': {
                                backgroundColor: '#2FA4A9',
                                color: 'white',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Sign In
                    </Button>
                ) : null}
            </Box>

            {/* Spacer for fixed TopBar */}
            <Box sx={{ height: 64 }} />
        </>
    );
};

export default function NotificationsPage({ currentUser }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getNotificationsAPI();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to load notifications');
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsReadAPI(notificationId);
            await fetchNotifications();
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

    const handleAcceptConnection = async (connectionId, notificationId) => {
        try {
            const id = typeof connectionId === 'object' ? connectionId._id : connectionId;
            setNotifications(prevNotifications => prevNotifications.filter(n => n._id !== notificationId));
            setUnreadCount(prev => Math.max(0, prev - 1));
            await acceptConnectionRequestAPI(id);
            await markNotificationAsReadAPI(notificationId);
            toast.success('Connection request accepted');
        } catch (error) {
            console.error('Error accepting connection:', error);
            toast.error('Failed to accept connection');
            await fetchNotifications();
        }
    };

    const handleRejectConnection = async (connectionId, notificationId) => {
        try {
            const id = typeof connectionId === 'object' ? connectionId._id : connectionId;
            setNotifications(prevNotifications => prevNotifications.filter(n => n._id !== notificationId));
            setUnreadCount(prev => Math.max(0, prev - 1));
            await rejectConnectionRequestAPI(id);
            await markNotificationAsReadAPI(notificationId);
            toast.success('Connection request rejected');
        } catch (error) {
            console.error('Error rejecting connection:', error);
            toast.error('Failed to reject connection');
            await fetchNotifications();
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_user':
                return <PersonAddIcon sx={{ color: '#2FA4A9' }} />;
            case 'connection_request':
                return <PersonAddIcon sx={{ color: '#2FA4A9' }} />;
            case 'connection_accepted':
                return <CheckCircleIcon sx={{ color: '#10B981' }} />;
            case 'connection_rejected':
                return <CancelIcon sx={{ color: '#EF4444' }} />;
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
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Topbar with EXACT same style as FriendsPage */}
            <TopBar currentUser={currentUser} />
            
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2FA4A9', mb: 1 }}>
                        Notifications
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                    </Typography>
                </Box>

                {/* Notifications Content */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: '#2FA4A9' }} />
                    </Box>
                ) : notifications.length === 0 ? (
                    <Card sx={{ p: 6, textAlign: 'center' }}>
                        <NotificationsIcon sx={{ fontSize: 64, color: '#E5E7EB', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            No notifications
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            You're all caught up! Check back later for updates.
                        </Typography>
                    </Card>
                ) : (
                    <>
                        {/* Mark All as Read Button */}
                        {unreadCount > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleMarkAllAsRead}
                                    sx={{
                                        borderColor: '#2FA4A9',
                                        color: '#2FA4A9',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            borderColor: '#258A8E',
                                            backgroundColor: '#F0F9FA',
                                        },
                                    }}
                                >
                                    Mark all as read
                                </Button>
                            </Box>
                        )}

                        {/* Notifications List */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {notifications.map((notification) => (
                                <Card
                                    key={notification._id}
                                    sx={{
                                        backgroundColor: notification.read ? '#FFFFFF' : '#F0F9FA',
                                        borderLeft: notification.read ? 'none' : '4px solid #2FA4A9',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(47, 164, 169, 0.15)',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                            {/* Icon */}
                                            <Avatar 
                                                sx={{ 
                                                    backgroundColor: notification.read ? '#F5F5F5' : '#E6F7F7',
                                                    width: 56, 
                                                    height: 56 
                                                }}
                                            >
                                                {getNotificationIcon(notification.type)}
                                            </Avatar>

                                            {/* Content */}
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: notification.read ? 400 : 600,
                                                        mb: 0.5,
                                                        color: '#1A202C'
                                                    }}
                                                >
                                                    {notification.message}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </Typography>

                                                {/* Connection Request Actions */}
                                                {notification.type === 'connection_request' && notification.connectionId && (
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            startIcon={<CheckIcon />}
                                                            onClick={() => handleAcceptConnection(notification.connectionId, notification._id)}
                                                            sx={{
                                                                backgroundColor: '#2FA4A9',
                                                                textTransform: 'none',
                                                                fontWeight: 600,
                                                                '&:hover': {
                                                                    backgroundColor: '#258A8E',
                                                                },
                                                            }}
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<CloseIcon />}
                                                            onClick={() => handleRejectConnection(notification.connectionId, notification._id)}
                                                            sx={{
                                                                borderColor: '#E5E7EB',
                                                                color: '#7A7A7A',
                                                                textTransform: 'none',
                                                                fontWeight: 600,
                                                                '&:hover': {
                                                                    borderColor: '#DC2626',
                                                                    color: '#DC2626',
                                                                    backgroundColor: '#FEF2F2',
                                                                },
                                                            }}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Unread Badge */}
                                            {!notification.read && (
                                                <Chip
                                                    label="New"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: '#2FA4A9',
                                                        color: '#FFFFFF',
                                                        fontWeight: 600,
                                                        height: 24,
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    );
}