import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Button,
    TextField,
    InputAdornment,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Search as SearchIcon,
    People as PeopleIcon,
    PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material';
import { getMyConnectionsAPI, removeConnectionAPI } from '../api/ConnectionAPI';
import { toast } from 'react-toastify';

// Topbar Component (same as ConnectionsPage)
const Topbar = ({ currentUser }) => {
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
    <div className="hidden md:flex items-center justify-center gap-4 lg:gap-8 text-xl lg:text-2xl text-gray-500">
      <AiOutlineHome
        className="cursor-pointer hover:text-black transition-colors"
        onClick={() => goToRoute("/home")}
        title="Home"
      />
      <AiOutlineUserSwitch
        className="cursor-pointer hover:text-black transition-colors"
        onClick={() => goToRoute("/connections")}
        title="Connections"
      />
      <BsPeople
        className="cursor-pointer hover:text-black transition-colors"
        onClick={() => goToRoute("/friends")}
        title="Friends"
      />
      <BsBriefcase
        className="cursor-pointer hover:text-black transition-colors"
        onClick={() => goToRoute("/jobs")}
        title="Jobs"
      />
      <AiOutlineMessage 
        className="cursor-pointer hover:text-black transition-colors" 
        title="Messages"
      />
       <div className="relative">
                 <AiOutlineBell
                   className="cursor-pointer hover:text-black transition-colors"
                   onClick={() => goToRoute("/notifications")}
                 />
                 {unreadCount > 0 && (
                   <span className="absolute -top-1 -right-1 bg-[#2FA4A9] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                     {unreadCount > 9 ? "9+" : unreadCount}
                   </span>
                 )}
               </div>
    </div>
  );

  const MobileNavIcons = () => (
    <div className="flex md:hidden items-center gap-4 text-xl text-gray-500">
      <div className="relative">
        <AiOutlineBell
          className="cursor-pointer hover:text-black transition-colors"
          onClick={toggleNotifications}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#2FA4A9] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
      <AiOutlineMenu
        className="cursor-pointer hover:text-black transition-colors"
        onClick={toggleMobileMenu}
      />
    </div>
  );

  return (
    <>
      <div className="w-full h-16 bg-white flex items-center shadow-sm sticky top-0 z-50 px-4 md:px-8 lg:px-12 justify-between font-['Inter']">
        {popupVisible && (
          <div className="absolute right-4 top-16 z-50">
            <div className="bg-white rounded-lg shadow-xl p-4">Profile Popup Placeholder</div>
          </div>
        )}

        {notificationVisible && (
          <div className="absolute right-4 top-16 w-80 md:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Notifications</h3>
              <AiOutlineCloseCircle 
                className="text-xl cursor-pointer text-gray-500 hover:text-gray-700" 
                onClick={() => setNotificationVisible(false)}
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <AiOutlineBell className="text-4xl mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-[#AEE3E6] bg-opacity-30" : ""
                      }`}
                  >
                    <p className={`text-sm ${!notification.read ? "font-semibold" : ""}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="fixed right-0 top-16 w-64 bg-white shadow-2xl z-50 h-[calc(100vh-4rem)] overflow-y-auto transform transition-transform duration-300 ease-in-out md:hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Menu</h3>
              <AiOutlineCloseCircle 
                className="text-xl cursor-pointer text-gray-500 hover:text-gray-700" 
                onClick={toggleMobileMenu}
              />
            </div>
            <div className="p-4 space-y-4">
              <div 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => goToRoute("/home")}
              >
                <AiOutlineHome className="text-xl text-gray-600" />
                <span className="font-medium">Home</span>
              </div>
              <div 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => goToRoute("/connections")}
              >
                <AiOutlineUserSwitch className="text-xl text-gray-600" />
                <span className="font-medium">Connections</span>
              </div>
              <div 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => goToRoute("/friends")}
              >
                <BsPeople className="text-xl text-gray-600" />
                <span className="font-medium">Friends</span>
              </div>
              <div 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => goToRoute("/jobs")}
              >
                <BsBriefcase className="text-xl text-gray-600" />
                <span className="font-medium">Jobs</span>
              </div>
              <div 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => goToRoute("/messages")}
              >
                <AiOutlineMessage className="text-xl text-gray-600" />
                <span className="font-medium">Messages</span>
              </div>
              {isLoggedIn && currentUser && (
                <div 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={displayPopup}
                >
                  {currentUser?.imageLink ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={currentUser.imageLink}
                      alt="user"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#2FA4A9] to-[#1a7a7e] flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {userEmail?.charAt(0).toUpperCase() || currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{currentUser.name || "Profile"}</p>
                    <p className="text-xs text-gray-500">View profile</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logo */}
        <span
          className="text-xl md:text-2xl font-bold cursor-pointer select-none"
          style={{
            background: 'linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          onClick={() => goToRoute("/home")}
        >
          JobGate
        </span>

        {/* Desktop Navigation */}
        <NavIcons />
        
        {/* Mobile Navigation Icons */}
        <MobileNavIcons />

        {/* User Profile Section */}
        {!isMobile && (isLoggedIn || currentUser?.name) ? (
          <div className="hidden md:flex items-center gap-3">
            {currentUser?.imageLink ? (
              <img
                className="h-9 w-9 rounded-full object-cover cursor-pointer border border-gray-200"
                src={currentUser.imageLink}
                alt="user"
                onClick={displayPopup}
              />
            ) : (
              <div
                className="h-9 w-9 rounded-full bg-gradient-to-br from-[#2FA4A9] to-[#1a7a7e] flex items-center justify-center cursor-pointer border border-gray-200"
                onClick={displayPopup}
              >
                <span className="text-white text-sm font-bold">
                  {userEmail?.charAt(0).toUpperCase() || currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
        ) : !isMobile && !isLoggedIn ? (
          <button
            onClick={() => goToRoute("/login")}
            className="hidden md:block px-4 md:px-6 py-1.5 md:py-2 rounded-full border-2 border-[#2FA4A9] text-[#2FA4A9] font-semibold hover:bg-[#2FA4A9] hover:text-white transition-all duration-200 text-sm md:text-base"
          >
            Sign In
          </button>
        ) : null}
      </div>

      {/* Responsive CSS */}
      <style jsx>{`
        /* Improve touch targets on mobile */
        @media (max-width: 768px) {
          .icon-button {
            min-width: 44px;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        
        /* Landscape orientation */
        @media (max-height: 500px) and (orientation: landscape) {
          .mobile-menu {
            max-height: 60vh;
          }
          
          .notification-popup {
            max-height: 60vh;
          }
        }
      `}</style>
    </>
  );
};

// Add missing imports for the Topbar
import { useNavigate } from 'react-router-dom';
import {
  AiOutlineHome,
  AiOutlineUserSwitch,
  AiOutlineMessage,
  AiOutlineBell,
  AiOutlineMenu,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { BsBriefcase, BsPeople } from "react-icons/bs";

export default function FriendsPage({ currentUser }) {
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [removeDialog, setRemoveDialog] = useState({ open: false, friend: null });

    useEffect(() => {
        fetchFriends();
    }, []);

    useEffect(() => {
        filterFriends();
    }, [searchQuery, friends]);

    const fetchFriends = async () => {
        try {
            const data = await getMyConnectionsAPI();
            setFriends(data);
            setFilteredFriends(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching friends:', error);
            toast.error('Failed to load friends');
            setLoading(false);
        }
    };

    const filterFriends = () => {
        if (!searchQuery.trim()) {
            setFilteredFriends(friends);
            return;
        }

        const filtered = friends.filter((connection) =>
            connection.friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (connection.friend.headline && connection.friend.headline.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredFriends(filtered);
    };

    const handleRemoveClick = (friend) => {
        setRemoveDialog({ open: true, friend });
    };

    const handleRemoveConfirm = async () => {
        try {
            await removeConnectionAPI(removeDialog.friend._id);
            setFriends(friends.filter((f) => f._id !== removeDialog.friend._id));
            toast.success('Connection removed');
            setRemoveDialog({ open: false, friend: null });
        } catch (error) {
            console.error('Error removing connection:', error);
            toast.error('Failed to remove connection');
        }
    };

    const handleRemoveCancel = () => {
        setRemoveDialog({ open: false, friend: null });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress sx={{ color: '#2FA4A9' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Topbar - Same as ConnectionsPage */}
            <Topbar currentUser={currentUser} />
            
            {/* Main Content */}
            <Box sx={{ mt: 8, p: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: '#4A4A4A' }}>
                        My Connections
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {friends.length} {friends.length === 1 ? 'connection' : 'connections'}
                    </Typography>
                </Box>

                {/* Search Bar */}
                {friends.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <TextField
                            fullWidth
                            placeholder="Search connections..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#7A7A7A' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                maxWidth: 600,
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#FFFFFF',
                                    '&:hover fieldset': {
                                        borderColor: '#2FA4A9',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2FA4A9',
                                    },
                                },
                            }}
                        />
                    </Box>
                )}

                {/* Friends List */}
                {filteredFriends.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <PeopleIcon sx={{ fontSize: 64, color: '#E5E7EB', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            {friends.length === 0 ? 'No connections yet' : 'No connections found'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {friends.length === 0
                                ? 'Start connecting with people to grow your network'
                                : 'Try a different search term'}
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {filteredFriends.map((connection) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={connection._id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 24px rgba(47, 164, 169, 0.15)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                        {/* Avatar */}
                                        <Avatar
                                            src={connection.friend.imageLink}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                margin: '0 auto',
                                                mb: 2,
                                                backgroundColor: '#2FA4A9',
                                                fontSize: '2rem',
                                            }}
                                        >
                                            {connection.friend.name.charAt(0).toUpperCase()}
                                        </Avatar>

                                        {/* Name */}
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 0.5,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {connection.friend.name}
                                        </Typography>

                                        {/* Headline */}
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 1,
                                                minHeight: 40,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {connection.friend.headline || 'Professional'}
                                        </Typography>

                                        {/* Connection Date */}
                                        <Chip
                                            label={`Connected ${formatDate(connection.connectedAt)}`}
                                            size="small"
                                            sx={{
                                                backgroundColor: '#AEE3E6',
                                                color: '#2FA4A9',
                                                fontWeight: 500,
                                                mb: 2,
                                            }}
                                        />

                                        {/* Action Buttons */}
                                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleRemoveClick(connection)}
                                                startIcon={<PersonRemoveIcon />}
                                                sx={{
                                                    borderColor: '#E5E7EB',
                                                    color: '#7A7A7A',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        borderColor: '#DC2626',
                                                        color: '#DC2626',
                                                        backgroundColor: '#FEF2F2',
                                                    },
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Remove Confirmation Dialog */}
                <Dialog open={removeDialog.open} onClose={handleRemoveCancel}>
                    <DialogTitle>Remove Connection?</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to remove{' '}
                            <strong>{removeDialog.friend?.friend?.name}</strong> from your connections?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleRemoveCancel} sx={{ color: '#7A7A7A' }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRemoveConfirm}
                            variant="contained"
                            sx={{
                                backgroundColor: '#DC2626',
                                '&:hover': { backgroundColor: '#B91C1C' },
                            }}
                        >
                            Remove
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}