import React, { useState, useEffect } from 'react';
import {
    Typography,
    Grid,
    Box,
    Card,
    CardContent,
    LinearProgress,
    Avatar,
    CircularProgress,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Work as WorkIcon,
    People as PeopleIcon,
    Visibility as VisibilityIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { getDashboardStatsAPI, getTopPerformingJobsAPI, getRecentApplicationsAPI } from '../../api/CompanyAPI';
import { toast } from 'react-toastify';

const StatCard = ({ title, value, subtitle, icon, color, loading }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isPortrait = useMediaQuery('(orientation: portrait)');
    
    return (
        <Card
            sx={{
                height: '100%',
                borderRadius: { xs: 2, sm: 3 },
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-4px)' },
                    boxShadow: { xs: '0 4px 12px rgba(0,0,0,0.05)', sm: '0 12px 24px rgba(47, 164, 169, 0.15)' },
                    borderColor: '#2FA4A9',
                },
                minHeight: { xs: isPortrait ? 110 : 100, sm: 120 }
            }}
        >
            <CardContent sx={{ 
                p: { xs: isPortrait ? 1.5 : 1.25, sm: 2, md: 3 }
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    gap: { xs: 1, sm: 1.5 }
                }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                color: '#7A7A7A',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                fontSize: { 
                                    xs: isPortrait ? '0.65rem' : '0.6rem', 
                                    sm: '0.7rem', 
                                    md: '0.75rem' 
                                },
                                letterSpacing: '0.5px',
                                mb: { xs: 0.5, sm: 1 },
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {title}
                        </Typography>
                        {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', height: { xs: 32, sm: 48 } }}>
                                <CircularProgress size={isSmallScreen ? 20 : 24} sx={{ color: color || '#2FA4A9' }} />
                            </Box>
                        ) : (
                            <>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 800,
                                        color: color || '#2FA4A9',
                                        mb: 0.5,
                                        fontSize: { 
                                            xs: isPortrait ? '1.5rem' : '1.25rem', 
                                            sm: '1.75rem', 
                                            md: '2.25rem' 
                                        },
                                        lineHeight: 1.2
                                    }}
                                >
                                    {value}
                                </Typography>
                                {subtitle && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: '#7A7A7A',
                                            fontWeight: 500,
                                            fontSize: { 
                                                xs: isPortrait ? '0.75rem' : '0.7rem', 
                                                sm: '0.8125rem' 
                                            }
                                        }}
                                    >
                                        {subtitle}
                                    </Typography>
                                )}
                            </>
                        )}
                    </Box>
                    <Box
                        sx={{
                            background: `linear-gradient(135deg, ${color || '#2FA4A9'}20, ${color || '#2FA4A9'}10)`,
                            borderRadius: { xs: 2, sm: 3 },
                            p: { xs: isPortrait ? 1 : 0.875, sm: 1.5, md: 2 },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}
                    >
                        {React.cloneElement(icon, { 
                            sx: { 
                                fontSize: { 
                                    xs: isPortrait ? 24 : 20, 
                                    sm: 28, 
                                    md: 32 
                                },
                                ...icon.props.sx 
                            } 
                        })}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const RecentActivity = ({ applications, loading }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isPortrait = useMediaQuery('(orientation: portrait)');

    const cardStyles = {
        borderRadius: { xs: 2, sm: 3 },
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    };

    if (loading) {
        return (
            <Card sx={cardStyles}>
                <CardContent sx={{ 
                    p: { xs: isPortrait ? 1.5 : 1.25, sm: 2, md: 3 },
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 700, 
                            color: '#4A4A4A', 
                            mb: 2,
                            fontSize: { 
                                xs: isPortrait ? '0.875rem' : '0.8125rem', 
                                sm: '1rem', 
                                md: '1.125rem' 
                            }
                        }}
                    >
                        Recent Applications
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        flex: 1,
                        py: { xs: 3, sm: 4 }
                    }}>
                        <CircularProgress size={isSmallScreen ? 24 : 32} sx={{ color: '#2FA4A9' }} />
                    </Box>
                </CardContent>
            </Card>
        );
    }
    return (
        <Card sx={cardStyles}>
            <CardContent sx={{ 
                p: { xs: isPortrait ? 1.5 : 1.25, sm: 2, md: 3 },
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 700, 
                        color: '#4A4A4A', 
                        mb: { xs: 1.5, sm: 2 },
                        fontSize: { 
                            xs: isPortrait ? '0.875rem' : '0.8125rem', 
                            sm: '1rem', 
                            md: '1.125rem' 
                        }
                    }}
                >
                    Recent Applications
                </Typography>
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    {applications.length === 0 ? (
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            align="center" 
                            sx={{ 
                                py: { xs: 3, sm: 4 },
                                fontSize: { 
                                    xs: isPortrait ? '0.75rem' : '0.7rem', 
                                    sm: '0.8125rem', 
                                    md: '0.875rem' 
                                }
                            }}
                        >
                            No recent applications
                        </Typography>
                    ) : (
                        applications.map((app, index) => (
                            <Box
                                key={app._id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: { xs: 1, sm: 1.5, md: 2 },
                                    py: { xs: 1, sm: 1.25, md: 1.5 },
                                    borderBottom: index < applications.length - 1 ? '1px solid #e5e7eb' : 'none',
                                }}
                            >
                                <Avatar
                                    src={app.applicant?.imageLink}
                                    sx={{
                                        width: { xs: 28, sm: 32, md: 36 },
                                        height: { xs: 28, sm: 32, md: 36 },
                                        backgroundColor: '#AEE3E6',
                                        color: '#2FA4A9',
                                        fontSize: { 
                                            xs: isPortrait ? '0.75rem' : '0.7rem', 
                                            sm: '0.8125rem' 
                                        }
                                    }}
                                >
                                    {app.applicantName?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            fontWeight: 500,
                                            fontSize: { 
                                                xs: isPortrait ? '0.75rem' : '0.7rem', 
                                                sm: '0.8125rem', 
                                                md: '0.875rem' 
                                            },
                                            lineHeight: 1.4,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {app.applicantName} applied for {app.jobTitle}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        color="text.secondary"
                                        sx={{ 
                                            fontSize: { 
                                                xs: isPortrait ? '0.625rem' : '0.5625rem', 
                                                sm: '0.6875rem', 
                                                md: '0.75rem' 
                                            }
                                        }}
                                    >
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

const JobPerformance = ({ jobs, loading }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isPortrait = useMediaQuery('(orientation: portrait)');

    const cardStyles = {
        borderRadius: { xs: 2, sm: 3 },
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    };

    if (loading) {
        return (
            <Card sx={cardStyles}>
                <CardContent sx={{ 
                    p: { xs: isPortrait ? 1.5 : 1.25, sm: 2, md: 3 },
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 700, 
                            color: '#4A4A4A', 
                            mb: 2,
                            fontSize: { 
                                xs: isPortrait ? '0.875rem' : '0.8125rem', 
                                sm: '1rem', 
                                md: '1.125rem' 
                            }
                        }}
                    >
                        Top Performing Jobs
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        flex: 1,
                        py: { xs: 3, sm: 4 }
                    }}>
                        <CircularProgress size={isSmallScreen ? 24 : 32} sx={{ color: '#2FA4A9' }} />
                    </Box>
                </CardContent>
            </Card>
        );
    }
    return (
        <Card sx={cardStyles}>
            <CardContent sx={{ 
                p: { xs: isPortrait ? 1.5 : 1.25, sm: 2, md: 3 },
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 700, 
                        color: '#4A4A4A', 
                        mb: { xs: 1.5, sm: 2 },
                        fontSize: { 
                            xs: isPortrait ? '0.875rem' : '0.8125rem', 
                            sm: '1rem', 
                            md: '1.125rem' 
                        }
                    }}
                >
                    Top Performing Jobs (by Applicants)
                </Typography>
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    {jobs.length === 0 ? (
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            align="center" 
                            sx={{ 
                                py: { xs: 3, sm: 4 },
                                fontSize: { 
                                    xs: isPortrait ? '0.75rem' : '0.7rem', 
                                    sm: '0.8125rem', 
                                    md: '0.875rem' 
                                }
                            }}
                        >
                            No active jobs yet
                        </Typography>
                    ) : (
                        jobs.map((job, index) => {
                            const maxApplicants = Math.max(...jobs.map(j => j.applicants || 0));
                            const fillRate = maxApplicants > 0 ? ((job.applicants || 0) / maxApplicants) * 100 : 0;

                            return (
                                <Box
                                    key={job._id}
                                    sx={{
                                        py: { xs: 1.25, sm: 1.5, md: 2 },
                                        borderBottom: index < jobs.length - 1 ? '1px solid #e5e7eb' : 'none',
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        mb: 0.5,
                                        gap: 1
                                    }}>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontWeight: 500,
                                                fontSize: { 
                                                    xs: isPortrait ? '0.75rem' : '0.7rem', 
                                                    sm: '0.8125rem', 
                                                    md: '0.875rem' 
                                                },
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {job.title}
                                        </Typography>
                                        <Typography 
                                            variant="caption" 
                                            color="text.secondary"
                                            sx={{ 
                                                fontSize: { 
                                                    xs: isPortrait ? '0.625rem' : '0.5625rem', 
                                                    sm: '0.6875rem', 
                                                    md: '0.75rem' 
                                                },
                                                flexShrink: 0
                                            }}
                                        >
                                            {job.applicants || 0} applicants
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={fillRate}
                                        sx={{
                                            height: { xs: 4, sm: 6 },
                                            borderRadius: 3,
                                            backgroundColor: '#e5e7eb',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: '#2FA4A9',
                                            },
                                        }}
                                    />
                                    <Typography 
                                        variant="caption" 
                                        color="text.secondary" 
                                        sx={{ 
                                            mt: 0.5, 
                                            display: 'block',
                                            fontSize: { 
                                                xs: isPortrait ? '0.625rem' : '0.5625rem', 
                                                sm: '0.6875rem', 
                                                md: '0.75rem' 
                                            }
                                        }}
                                    >
                                        {job.views || 0} views • {job.location}
                                    </Typography>
                                </Box>
                            );
                        })
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default function DashboardHomePage() {
    const [stats, setStats] = useState(null);
    const [topJobs, setTopJobs] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isPortrait = useMediaQuery('(orientation: portrait)');
    const isLandscape = useMediaQuery('(orientation: landscape)');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel
            const [statsData, topJobsData, applicationsData] = await Promise.all([
                getDashboardStatsAPI(),
                getTopPerformingJobsAPI(),
                getRecentApplicationsAPI(5),
            ]);

            setStats(statsData.stats);
            setTopJobs(topJobsData.topByApplicants || []);
            setRecentApplications(applicationsData.applications || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden', textAlign: 'left' }}>
            {/* Header Section */}
            <Box sx={{ 
                mb: { 
                    xs: isPortrait ? 2.5 : 2, 
                    sm: 3, 
                    md: 4 
                },
                textAlign: 'left'
            }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        mb: { 
                            xs: isPortrait ? 0.5 : 0.25, 
                            sm: 0.75, 
                            md: 1 
                        }, 
                        color: 'text.primary', 
                        fontWeight: 600,
                        fontSize: { 
                            xs: isPortrait ? '1.25rem' : '1.1rem', 
                            sm: '1.5rem', 
                            md: '1.75rem',
                            lg: '2rem' 
                        },
                        lineHeight: 1.2
                    }}
                >
                    Dashboard Home
                </Typography>
                <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                        mb: 4,
                        fontSize: { 
                            xs: isPortrait ? '0.75rem' : '0.7rem', 
                            sm: '0.8125rem', 
                            md: '0.875rem',
                            lg: '1rem' 
                        },
                        maxWidth: { md: '600px' }
                    }}
                >
                    Welcome back! Here's an overview of your recruitment activity.
                </Typography>
            </Box>

            {/* Stats Cards Grid */}
            <Grid 
                container 
                spacing={{ 
                    xs: isPortrait ? 2 : 1.5, 
                    sm: 2, 
                    md: 2.5, 
                    lg: 3 
                }} 
                sx={{ 
                    mb: { 
                        xs: isPortrait ? 3 : 2.5, 
                        sm: 3.5, 
                        md: 4 
                    }
                }}
            >
                <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
                    <StatCard
                        title="Active Jobs"
                        value={loading ? '...' : stats?.activeJobs || 0}
                        subtitle={`${loading ? '...' : stats?.totalJobs || 0} total`}
                        icon={<WorkIcon sx={{ color: '#2FA4A9' }} />}
                        color="#2FA4A9"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
                    <StatCard
                        title="Total Applicants"
                        value={loading ? '...' : stats?.totalApplications || 0}
                        subtitle={`${loading ? '...' : stats?.pendingApplications || 0} pending`}
                        icon={<PeopleIcon sx={{ color: '#10b981' }} />}
                        color="#10b981"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
                    <StatCard
                        title="Total Views"
                        value={loading ? '...' : stats?.totalViews || 0}
                        subtitle="Across all jobs"
                        icon={<VisibilityIcon sx={{ color: '#f59e0b' }} />}
                        color="#f59e0b"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
                    <StatCard
                        title="Shortlisted"
                        value={loading ? '...' : stats?.shortlistedApplications || 0}
                        subtitle={`${loading ? '...' : stats?.rejectedApplications || 0} rejected`}
                        icon={<CheckCircleIcon sx={{ color: '#8b5cf6' }} />}
                        color="#8b5cf6"
                        loading={loading}
                    />
                </Grid>
            </Grid>

            {/* Performance and Activity Grid */}
            <Grid 
                container 
                spacing={{ 
                    xs: isPortrait ? 2 : 1.5, 
                    sm: 2, 
                    md: 2.5, 
                    lg: 3 
                }}
                sx={{ alignItems: 'stretch' }}
            >
                <Grid item xs={12} md={8} sx={{ display: 'flex' }}>
                    <JobPerformance jobs={topJobs} loading={loading} />
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                    <RecentActivity applications={recentApplications} loading={loading} />
                </Grid>
            </Grid>
        </Box>
    );
}