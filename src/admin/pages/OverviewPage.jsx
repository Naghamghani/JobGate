import React, { useState, useEffect } from 'react';
import {
    Typography,
    Grid,
    Box,
    Card,
    CardContent,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Container,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    Business as BusinessIcon,
    Work as WorkIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { getAllUsersAPI, getAllCompanies } from '../../api/AuthAPI';
import { toast } from 'react-toastify';

const QuickStatCard = ({ title, value, icon, color, loading }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Card sx={{ 
            height: '100%', 
            border: '1px solid #E5E7EB',
            minHeight: 120,
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        }}>
            <CardContent sx={{ 
                p: { xs: 2, sm: 3 },
                '&:last-child': { pb: { xs: 2, sm: 3 } }
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    width: '100%'
                }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography 
                            variant="subtitle2" 
                            sx={{ 
                                color: '#7A7A7A', 
                                textTransform: 'uppercase', 
                                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' }, 
                                fontWeight: 600,
                                textAlign: 'left'
                            }} 
                            gutterBottom
                        >
                            {title}
                        </Typography>
                        {loading ? (
                            <Box sx={{ textAlign: 'left' }}>
                                <CircularProgress size={24} sx={{ color: '#2FA4A9' }} />
                            </Box>
                        ) : (
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 700, 
                                    color: color || '#2FA4A9',
                                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
                                    textAlign: 'left',
                                    lineHeight: 1.2
                                }}
                            >
                                {value}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: color ? `${color}15` : '#AEE3E6',
                            borderRadius: 2,
                            p: { xs: 1, sm: 1.25, md: 1.5 },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: isSmallScreen ? 40 : 48,
                            height: isSmallScreen ? 40 : 48,
                            ml: 2,
                            flexShrink: 0
                        }}
                    >
                        {React.cloneElement(icon, { 
                            sx: { 
                                fontSize: { xs: 20, sm: 24, md: 28 },
                                ...icon.props.sx 
                            } 
                        })}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const RecentActivity = ({ activities, loading }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Card sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <CardContent sx={{ 
                p: { xs: 2, sm: 3 },
                '&:last-child': { pb: { xs: 2, sm: 3 } },
                flex: 1
            }}>
                <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                        textAlign: 'left'
                    }}
                >
                    Recent Activity
                </Typography>
                <Box sx={{ mt: 2 }}>
                    {loading ? (
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            py: 4,
                            textAlign: 'center'
                        }}>
                            <CircularProgress />
                        </Box>
                    ) : activities.length === 0 ? (
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                                textAlign: 'center', 
                                py: 4,
                                fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' }
                            }}
                        >
                            No recent activity
                        </Typography>
                    ) : (
                        <Box sx={{ textAlign: 'left' }}>
                            {activities.map((activity, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: { xs: 1, sm: 1.5, md: 2 },
                                        py: { xs: 1.25, sm: 1.5 },
                                        borderBottom: index < activities.length - 1 ? '1px solid #e5e7eb' : 'none',
                                        textAlign: 'left',
                                        width: '100%'
                                    }}
                                >
                                    <CheckCircleIcon sx={{ 
                                        color: '#2FA4A9', 
                                        fontSize: { xs: '0.875rem', sm: '1rem', md: '1.2rem' },
                                        mt: 0.5,
                                        flexShrink: 0
                                    }} />
                                    <Box sx={{ flex: 1, textAlign: 'left' }}>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontWeight: 500,
                                                fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                                                textAlign: 'left',
                                                lineHeight: 1.4
                                            }}
                                        >
                                            {activity.action}
                                        </Typography>
                                        <Typography 
                                            variant="caption" 
                                            color="text.secondary"
                                            sx={{ 
                                                fontSize: { xs: '0.6875rem', sm: '0.75rem', md: '0.8125rem' },
                                                textAlign: 'left',
                                                display: 'block',
                                                mt: 0.5
                                            }}
                                        >
                                            {activity.time}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default function OverviewPage() {
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recentActivities, setRecentActivities] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [usersData, companiesData] = await Promise.all([
                    getAllUsersAPI(),
                    getAllCompanies()
                ]);

                setUsers(usersData);
                setCompanies(companiesData);

                // Generate recent activities from latest users
                const activities = [];
                const sortedUsers = [...usersData].sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                ).slice(0, 5);

                sortedUsers.forEach(user => {
                    const timeAgo = getTimeAgo(new Date(user.createdAt));
                    if (user.role === 'company') {
                        activities.push({
                            action: `New company registered: ${user.name}`,
                            time: timeAgo
                        });
                    } else {
                        activities.push({
                            action: `New user registered: ${user.name}`,
                            time: timeAgo
                        });
                    }
                });

                setRecentActivities(activities);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load dashboard data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);

        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    };

    const candidatesCount = users.filter(u => u.role === 'candidate').length;
    const companiesCount = companies.length;

    return (
        <Box sx={{ 
            width: '100%', 
            maxWidth: '100%', 
            overflow: 'hidden',
            textAlign: 'left'
        }}>
            {/* Header Section */}
            <Box sx={{ 
                mb: { xs: 3, sm: 4, md: 5 },
                textAlign: 'left'
            }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        mb: 1, 
                        color: 'primary.main',
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.125rem' },
                        fontWeight: 700,
                        textAlign: 'left',
                    }}
                >
                    Dashboard Overview
                </Typography>
                <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                        fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                        textAlign: 'left',
                        maxWidth: '800px'
                    }}
                >
                    Welcome to JobGate Admin. Here's what's happening today.
                </Typography>
            </Box>

            {/* Stats Cards Section */}
            <Grid 
                container 
                spacing={{ xs: 2, sm: 2.5, md: 3 }} 
                sx={{ 
                    mb: { xs: 3, sm: 4, md: 5 },
                    textAlign: 'left'
                }}
            >
                <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'left' }}>
                    <QuickStatCard
                        title="Total Users"
                        value={users.length.toLocaleString()}
                        icon={<PeopleIcon sx={{ color: '#0f172a' }} />}
                        color="#0f172a"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'left' }}>
                    <QuickStatCard
                        title="Companies"
                        value={companiesCount.toLocaleString()}
                        icon={<BusinessIcon sx={{ color: '#3b82f6' }} />}
                        color="#3b82f6"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'left' }}>
                    <QuickStatCard
                        title="Candidates"
                        value={candidatesCount.toLocaleString()}
                        icon={<PeopleIcon sx={{ color: '#10b981' }} />}
                        color="#10b981"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'left' }}>
                    <QuickStatCard
                        title="Active Jobs"
                        value="0"
                        icon={<TrendingUpIcon sx={{ color: '#f59e0b' }} />}
                        color="#f59e0b"
                        loading={false}
                    />
                </Grid>
            </Grid>

            {/* Chart and Activity Section */}
            <Grid 
                container 
                spacing={{ xs: 2, sm: 2.5, md: 3 }}
                sx={{ textAlign: 'left' }}
            >
                {/* Chart Section */}
                <Grid item xs={12} md={8} sx={{ textAlign: 'left' }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ 
                            p: { xs: 2, sm: 3 },
                            '&:last-child': { pb: { xs: 2, sm: 3 } }
                        }}>
                            <Typography 
                                variant="h6" 
                                gutterBottom 
                                sx={{ 
                                    fontWeight: 600,
                                    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                    textAlign: 'left'
                                }}
                            >
                                Platform Growth
                            </Typography>
                            <Box
                                sx={{
                                    height: { 
                                        xs: 250, 
                                        sm: 300,
                                        md: 350,
                                        lg: 400 
                                    },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: 2,
                                    mt: 2,
                                    p: { xs: 2, sm: 3 },
                                    textAlign: 'center'
                                }}
                            >
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography 
                                        variant="body1" 
                                        color="text.secondary"
                                        sx={{ 
                                            textAlign: 'center',
                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                        }}
                                    >
                                        📊 Chart visualization would go here
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            display: 'block', 
                                            mt: 1,
                                            textAlign: 'center'
                                        }}
                                    >
                                        (Interactive chart for mobile and desktop)
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Activity Section */}
                <Grid item xs={12} md={4} sx={{ textAlign: 'left' }}>
                    <RecentActivity activities={recentActivities} loading={loading} />
                </Grid>
            </Grid>

            {/* Add some bottom spacing for mobile */}
            <Box sx={{ height: { xs: 2, sm: 3, md: 4 } }} />
        </Box>
    );
}