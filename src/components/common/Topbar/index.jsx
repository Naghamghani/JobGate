import React, { useEffect, useState, useRef } from "react";
const LinkedinLogo = "/b528c485-1cc6-41f6-8521-404788fdef37.jpg";
import user from "../../../assets/user.png";
import SearchUsers from "../SearchUsers";
import {
  AiOutlineHome,
  AiOutlineUserSwitch,
  AiOutlineSearch,
  AiOutlineMessage,
  AiOutlineBell,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineClose as AiOutlineCloseIcon,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { BsBriefcase, BsPeople } from "react-icons/bs";
import { getAllUsers } from "../../../api/FirestoreAPI";
import ProfilePopup from "../ProfilePopup";
import { isAuthenticated, getUserEmail } from "../../../api/AuthAPI";
import { getNotificationsAPI, markNotificationAsReadAPI } from "../../../api/NotificationAPI";
import { acceptConnectionRequestAPI, rejectConnectionRequestAPI } from "../../../api/ConnectionAPI";
import { toast } from "react-toastify";

export default function Topbar({ currentUser }) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const popupRef = useRef(null);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);

  let navigate = useNavigate();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationVisible(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    // Check if user is authenticated
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setUserEmail(getUserEmail());
      fetchNotifications();

      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotificationsAPI();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await markNotificationAsReadAPI(notification._id);
        await fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleAcceptConnection = async (connectionId, notificationId) => {
    try {
      const id = typeof connectionId === 'object' ? connectionId._id : connectionId;
      await acceptConnectionRequestAPI(id);
      await markNotificationAsReadAPI(notificationId);
      await fetchNotifications();
      toast.success("Connection request accepted");
    } catch (error) {
      console.error("Error accepting connection:", error);
      toast.error("Failed to accept connection");
    }
  };

  const handleRejectConnection = async (connectionId, notificationId) => {
    try {
      const id = typeof connectionId === 'object' ? connectionId._id : connectionId;
      await rejectConnectionRequestAPI(id);
      await markNotificationAsReadAPI(notificationId);
      await fetchNotifications();
      toast.success("Connection request rejected");
    } catch (error) {
      console.error("Error rejecting connection:", error);
      toast.error("Failed to reject connection");
    }
  };

  const goToRoute = (route) => {
    navigate(route);
    setMobileMenuOpen(false);
    setNotificationVisible(false);
    setPopupVisible(false);
  };

  const displayPopup = () => {
    setPopupVisible(!popupVisible);
    setNotificationVisible(false);
    setMobileMenuOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationVisible(!notificationVisible);
    setPopupVisible(false);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setNotificationVisible(false);
    setPopupVisible(false);
  };

  const openUser = (user) => {
    navigate("/profile", {
      state: {
        id: user.id,
        email: user.email,
      },
    });
    setMobileMenuOpen(false);
    setNotificationVisible(false);
    setPopupVisible(false);
  };

  const handleSearch = () => {
    if (searchInput !== "") {
      let searched = users.filter((user) => {
        return Object.values(user)
          .join("")
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });

      setFilteredUsers(searched);
    } else {
      setFilteredUsers(users);
    }
  };

  useEffect(() => {
    let debounced = setTimeout(() => {
      handleSearch();
    }, 1000);

    return () => clearTimeout(debounced);
  }, [searchInput]);

  useEffect(() => {
    getAllUsers(setUsers);
  }, []);

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

  // Mobile navigation items
  const MobileNavItem = ({ icon: Icon, text, onClick, route }) => (
    <div
      className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
      onClick={() => onClick(route)}
    >
      <Icon className="text-xl text-gray-700" />
      <span className="font-medium text-gray-800">{text}</span>
    </div>
  );

  return (
    <>
      <div className="w-full h-16 bg-white flex items-center shadow-sm sticky top-0 z-50 px-4 md:px-8 lg:px-12 justify-between font-['Inter']">
        {/* Logo */}
        <div className="flex items-center gap-4">
          {isMobile && !isSearch && (
            <AiOutlineMenu
              className="text-2xl text-gray-600 cursor-pointer"
              onClick={toggleMobileMenu}
            />
          )}
          <span
            className="text-xl md:text-2xl font-bold cursor-pointer select-none"
            style={{
              background: 'linear-gradient(135deg, #0066CC 0%, #0099FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            onClick={() => goToRoute("/home")}
          >
            JobGate
          </span>
        </div>

        {/* Desktop Navigation & Search */}
        {!isMobile && (
          <>
            {isSearch ? (
              <div className="flex-1 max-w-2xl mx-4">
                <SearchUsers
                  setIsSearch={setIsSearch}
                  setSearchInput={setSearchInput}
                />
              </div>
            ) : (
              <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8 xl:gap-10 text-xl text-gray-500">
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
                    onClick={toggleNotifications}
                    title="Notifications"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#2FA4A9] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Mobile Search Icon */}
        {isMobile && !isSearch && (
          <div className="flex items-center gap-3">
            <AiOutlineSearch
              className="text-xl text-gray-600 cursor-pointer"
              onClick={() => setIsSearch(true)}
            />
            <div className="relative">
              <AiOutlineBell
                className="text-xl text-gray-600 cursor-pointer"
                onClick={toggleNotifications}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2FA4A9] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Mobile Search Component */}
        {isMobile && isSearch && (
          <div className="flex-1 mx-2">
            <SearchUsers
              setIsSearch={setIsSearch}
              setSearchInput={setSearchInput}
              isMobile={isMobile}
            />
          </div>
        )}

        {/* User Profile / Sign In */}
        {!isSearch && (
          <div className="flex items-center gap-3">
            {isLoggedIn || currentUser?.name ? (
              <>
                {currentUser?.imageLink ? (
                  <img
                    className="h-8 w-8 md:h-9 md:w-9 rounded-full object-cover cursor-pointer border border-gray-200"
                    src={currentUser.imageLink}
                    alt="user"
                    onClick={displayPopup}
                  />
                ) : (
                  <div
                    className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] flex items-center justify-center cursor-pointer border border-gray-200"
                    onClick={displayPopup}
                  >
                    <span className="text-white text-sm font-bold">
                      {userEmail?.charAt(0).toUpperCase() || currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => goToRoute("/login")}
                className="px-4 py-1.5 md:px-6 md:py-2 rounded-full border-2 border-[#0a66c2] text-[#0a66c2] font-semibold hover:bg-[#0a66c2] hover:text-white transition-all duration-200 text-sm md:text-base"
              >
                Sign In
              </button>
            )}
          </div>
        )}

        {/* Profile Popup */}
        {popupVisible && (
          <div 
            ref={popupRef}
            className={`absolute ${isMobile ? 'right-2 top-16' : 'right-4 md:right-8 lg:right-12 top-16'} z-50`}
          >
            <ProfilePopup />
          </div>
        )}

        {/* Notifications Popup */}
        {notificationVisible && (
          <div 
            ref={notificationRef}
            className={`absolute ${isMobile ? 'right-2 top-16 w-[calc(100vw-1rem)]' : 'right-4 md:right-8 lg:right-12 top-16 w-80 md:w-96'} bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[70vh] overflow-hidden flex flex-col`}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Notifications</h3>
              {isMobile && (
                <AiOutlineCloseIcon
                  className="text-gray-500 cursor-pointer"
                  onClick={() => setNotificationVisible(false)}
                />
              )}
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

        {/* Search Results Dropdown */}
        {searchInput.length > 0 && (
          <div className={`absolute ${isMobile ? 'left-4 right-4' : 'left-24'} top-16 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-40 ${isMobile ? 'w-auto' : 'w-80'}`}>
            {filteredUsers.length === 0 ? (
              <div className="p-3 text-gray-500 text-sm">No Results Found..</div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                  onClick={() => openUser(user)}
                >
                  <img 
                    src={user.imageLink || "/default-avatar.png"} 
                    className="h-8 w-8 rounded-full object-cover" 
                    alt={user.name}
                  />
                  <p className="font-semibold text-sm text-gray-800 truncate">{user.name}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 md:hidden"
        >
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-xl transform transition-transform">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <AiOutlineCloseIcon
                className="text-gray-600 text-xl cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>
            
            <div className="p-4 space-y-2">
              <MobileNavItem 
                icon={AiOutlineHome} 
                text="Home" 
                onClick={goToRoute}
                route="/home"
              />
              <MobileNavItem 
                icon={AiOutlineUserSwitch} 
                text="Connections" 
                onClick={goToRoute}
                route="/connections"
              />
              <MobileNavItem 
                icon={BsPeople} 
                text="Friends" 
                onClick={goToRoute}
                route="/friends"
              />
              <MobileNavItem 
                icon={BsBriefcase} 
                text="Jobs" 
                onClick={goToRoute}
                route="/jobs"
              />
              <MobileNavItem 
                icon={AiOutlineMessage} 
                text="Messages" 
                onClick={goToRoute}
                route="/messages"
              />
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 p-3">
                  {currentUser?.imageLink ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover border border-gray-200"
                      src={currentUser.imageLink}
                      alt="Profile"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] flex items-center justify-center">
                      <span className="text-white font-bold">
                        {userEmail?.charAt(0).toUpperCase() || currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">
                      {currentUser?.name || userEmail?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                </div>
                
                <div 
                  className="p-3 text-[#0a66c2] font-medium hover:bg-blue-50 rounded-lg cursor-pointer"
                  onClick={displayPopup}
                >
                  View Profile
                </div>
                
                <div 
                  className="p-3 text-red-600 font-medium hover:bg-red-50 rounded-lg cursor-pointer"
                  onClick={() => goToRoute("/logout")}
                >
                  Sign Out
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}