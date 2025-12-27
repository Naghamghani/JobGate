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
} from '@mui/material';
import {
    Search as SearchIcon,
    PersonAdd as PersonAddIcon,
    Check as CheckIcon,
    People as PeopleIcon,
} from '@mui/icons-material';
import { getSuggestedUsersAPI, sendConnectionRequestAPI } from '../api/ConnectionAPI';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Add the exact Topbar component from your index file
const Topbar = ({ currentUser }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  let navigate = useNavigate();

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
      // fetchNotifications();

      // Auto-refresh notifications every 30 seconds
      const interval = setInterval(() => {
        // fetchNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      // const data = await getNotificationsAPI();
      // setNotifications(data.notifications);
      // setUnreadCount(data.unreadCount);
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        // await markNotificationAsReadAPI(notification._id);
        await fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleAcceptConnection = async (connectionId, notificationId) => {
    try {
      // Extract ID if connectionId is an object
      const id = typeof connectionId === 'object' ? connectionId._id : connectionId;
      // await acceptConnectionRequestAPI(id);
      // await markNotificationAsReadAPI(notificationId);
      await fetchNotifications();
      toast.success("Connection request accepted");
    } catch (error) {
      console.error("Error accepting connection:", error);
      toast.error("Failed to accept connection");
    }
  };

  const handleRejectConnection = async (connectionId, notificationId) => {
    try {
      // Extract ID if connectionId is an object
      const id = typeof connectionId === 'object' ? connectionId._id : connectionId;
      // await rejectConnectionRequestAPI(id);
      // await markNotificationAsReadAPI(notificationId);
      await fetchNotifications();
      toast.success("Connection request rejected");
    } catch (error) {
      console.error("Error rejecting connection:", error);
      toast.error("Failed to reject connection");
    }
  };

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
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <p className={`text-sm ${!notification.read ? "font-semibold" : ""}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(notification.createdAt)}
                    </p>

                    {notification.type === "connection_request" && notification.connectionId && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptConnection(notification.connectionId, notification._id);
                          }}
                          className="flex-1 px-3 py-1.5 bg-[#2FA4A9] text-white rounded-md text-sm font-medium hover:bg-[#258A8E] transition-colors flex items-center justify-center gap-1"
                        >
                          <AiOutlineCheck /> Accept
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRejectConnection(notification.connectionId, notification._id);
                          }}
                          className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                        >
                          <AiOutlineClose /> Reject
                        </button>
                      </div>
                    )}
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
import {
  AiOutlineHome,
  AiOutlineUserSwitch,
  AiOutlineMessage,
  AiOutlineBell,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { BsBriefcase, BsPeople } from "react-icons/bs";

export default function ConnectionsPage({ currentUser }) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [pendingRequests, setPendingRequests] = useState(new Set());

    useEffect(() => {
        fetchSuggestedUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchQuery, users]);

    const fetchSuggestedUsers = async () => {
        try {
            const data = await getSuggestedUsersAPI();
            setUsers(data);
            setFilteredUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
            setLoading(false);
        }
    };

    const filterUsers = () => {
        if (!searchQuery.trim()) {
            setFilteredUsers(users);
            return;
        }

        const filtered = users.filter((user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.headline && user.headline.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredUsers(filtered);
    };

    const handleSendRequest = async (userId) => {
        try {
            await sendConnectionRequestAPI(userId);
            setPendingRequests(new Set([...pendingRequests, userId]));
            toast.success('Connection request sent');
        } catch (error) {
            console.error('Error sending request:', error);
            toast.error(error.message || 'Failed to send request');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Topbar - Same as index.jsx */}
            <Topbar currentUser={currentUser} />
            
            {/* Main Content */}
            <Box sx={{ mt: 8, p: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: '#4A4A4A' }}>
                        My Network
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Connect with professionals and grow your network
                    </Typography>
                </Box>

                {/* Search Bar */}
                <Box sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        placeholder="Search people..."
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

                {/* Stats */}
                <Box sx={{ mb: 3 }}>
                    <Chip
                        icon={<PeopleIcon />}
                        label={`${filteredUsers.length} people to connect with`}
                        sx={{
                            backgroundColor: '#AEE3E6',
                            color: '#2FA4A9',
                            fontWeight: 600,
                            px: 1,
                        }}
                    />
                </Box>

                {/* User Cards */}
                {filteredUsers.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <PeopleIcon sx={{ fontSize: 64, color: '#E5E7EB', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            {searchQuery ? 'No users found' : 'No suggestions available'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {searchQuery ? 'Try a different search term' : 'Check back later for new connections'}
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {filteredUsers.map((user) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
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
                                            src={user.imageLink}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                margin: '0 auto',
                                                mb: 2,
                                                backgroundColor: '#2FA4A9',
                                                fontSize: '2rem',
                                            }}
                                        >
                                            {user.name.charAt(0).toUpperCase()}
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
                                            {user.name}
                                        </Typography>

                                        {/* Headline */}
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 2,
                                                minHeight: 40,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {user.headline || 'Professional'}
                                        </Typography>

                                        {/* Connect Button */}
                                        {pendingRequests.has(user._id) ? (
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                disabled
                                                startIcon={<CheckIcon />}
                                                sx={{
                                                    borderColor: '#2FA4A9',
                                                    color: '#2FA4A9',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Pending
                                            </Button>
                                        ) : (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<PersonAddIcon />}
                                                onClick={() => handleSendRequest(user._id)}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 100%)',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    boxShadow: '0 4px 12px rgba(47, 164, 169, 0.3)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #258A8E 0%, #4AABAD 100%)',
                                                    },
                                                }}
                                            >
                                                Connect
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
}