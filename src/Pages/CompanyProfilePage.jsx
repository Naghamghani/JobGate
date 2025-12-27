import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    CircularProgress,
    Tabs,
    Tab,
    Divider,
    Button,
    IconButton,
    Stack,
    Paper,
    Skeleton,
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    Business as BusinessIcon,
    Work as WorkIcon,
    Article as ArticleIcon,
    People as PeopleIcon,
    ArrowBack as ArrowBackIcon,
    Language as LanguageIcon,
    Email as EmailIcon,
    Share as ShareIcon,
    Bookmark as BookmarkIcon,
    TrendingUp as TrendingUpIcon,
    Schedule as ScheduleIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { getCompanyProfileAPI, getPostsByCompanyAPI } from '../api/AuthAPI';
import { toast } from 'react-toastify';

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

const JobCard = ({ job, onApply }) => (
    <Card
        sx={{
            mb: 2.5,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid #E5E7EB',
            '&:hover': {
                boxShadow: '0 12px 24px rgba(47, 164, 169, 0.12)',
                transform: 'translateY(-4px)',
                borderColor: '#2FA4A9',
            }
        }}
    >
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: '#2FA4A9',
                            mb: 1.5,
                            '&:hover': { textDecoration: 'underline', cursor: 'pointer' }
                        }}
                        onClick={() => onApply(job._id)}
                    >
                        {job.title}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                            label={job.type}
                            size="small"
                            sx={{
                                backgroundColor: '#2FA4A9',
                                color: '#FFFFFF',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                            }}
                        />
                        <Chip
                            label={job.category}
                            size="small"
                            sx={{
                                borderColor: '#2FA4A9',
                                color: '#2FA4A9',
                                fontWeight: 500,
                            }}
                            variant="outlined"
                        />
                        {job.location && (
                            <Chip
                                icon={<LocationIcon sx={{ fontSize: 14, color: '#7A7A7A' }} />}
                                label={job.location}
                                size="small"
                                sx={{
                                    backgroundColor: '#F2F4F6',
                                    color: '#4A4A4A',
                                }}
                            />
                        )}
                        <Chip
                            icon={<ScheduleIcon sx={{ fontSize: 14 }} />}
                            label="Posted 2 days ago"
                            size="small"
                            sx={{ backgroundColor: '#F2F4F6' }}
                        />
                    </Stack>
                </Box>
                <IconButton sx={{ color: '#7A7A7A' }}>
                    <BookmarkIcon />
                </IconButton>
            </Box>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                    mb: 3,
                    lineHeight: 1.7,
                    color: '#4A4A4A',
                }}
            >
                {job.description?.substring(0, 250)}...
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                {job.salary && (
                    <Box sx={{
                        backgroundColor: '#AEE3E6',
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                        <MoneyIcon sx={{ color: '#2FA4A9', fontSize: 20 }} />
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#2FA4A9' }}>
                            {job.salary.currency} {job.salary.min?.toLocaleString()} - {job.salary.max?.toLocaleString()}
                        </Typography>
                    </Box>
                )}
                <Button
                    variant="contained"
                    onClick={() => onApply(job._id)}
                    sx={{
                        backgroundColor: '#2FA4A9',
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        '&:hover': { backgroundColor: '#258A8E' }
                    }}
                >
                    Apply Now
                </Button>
            </Box>
        </CardContent>
    </Card>
);

const PostCard = ({ post }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <Card sx={{ mb: 2.5, border: '1px solid #E5E7EB', transition: 'all 0.2s', '&:hover': { boxShadow: 2 } }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                    {post.authorImage ? (
                        <Avatar src={post.authorImage} sx={{ width: 52, height: 52 }} />
                    ) : (
                        <Avatar sx={{ backgroundColor: '#2FA4A9', width: 52, height: 52, fontSize: '1.5rem' }}>
                            {post.authorName?.charAt(0)}
                        </Avatar>
                    )}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#4A4A4A' }}>
                            {post.authorName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#7A7A7A', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ScheduleIcon sx={{ fontSize: 14 }} />
                            {formatDate(post.createdAt)}
                        </Typography>
                    </Box>
                    <IconButton size="small" sx={{ color: '#7A7A7A' }}>
                        <ShareIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Typography variant="body1" sx={{ mb: 2.5, whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#4A4A4A' }}>
                    {post.description}
                </Typography>

                {post.image && (
                    <Box
                        component="img"
                        src={post.image}
                        alt="Post"
                        sx={{
                            width: '100%',
                            maxHeight: 450,
                            objectFit: 'cover',
                            borderRadius: 2,
                            border: '1px solid #E5E7EB',
                            mb: 2,
                        }}
                    />
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', gap: 4 }}>
                    <Button
                        startIcon={<span>👍</span>}
                        sx={{
                            color: '#7A7A7A',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { color: '#2FA4A9', backgroundColor: 'transparent' }
                        }}
                    >
                        {post.likes?.length || 0} Likes
                    </Button>
                    <Button
                        startIcon={<span>💬</span>}
                        sx={{
                            color: '#7A7A7A',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { color: '#2FA4A9', backgroundColor: 'transparent' }
                        }}
                    >
                        {post.comments?.length || 0} Comments
                    </Button>
                    <Button
                        startIcon={<ShareIcon />}
                        sx={{
                            color: '#7A7A7A',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { color: '#2FA4A9', backgroundColor: 'transparent' }
                        }}
                    >
                        Share
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default function CompanyProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchCompanyData();
    }, [id]);

    const fetchCompanyData = async () => {
        try {
            setLoading(true);
            const [companyData, postsData] = await Promise.all([
                getCompanyProfileAPI(id),
                getPostsByCompanyAPI(id),
            ]);

            setCompany(companyData);
            setPosts(postsData);

            try {
                const jobsResponse = await fetch(`http://localhost:5000/api/jobs?company=${id}`);
                if (jobsResponse.ok) {
                    const jobsData = await jobsResponse.json();
                    // Extract jobs array from response (API returns { jobs: [...], totalPages, etc })
                    setJobs(jobsData.jobs || jobsData || []);
                }
            } catch (error) {
                console.log('Jobs not available');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching company data:', error);
            toast.error('Failed to load company profile');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ backgroundColor: '#F2F4F6', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="lg">
                    <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
                    <Skeleton variant="circular" width={140} height={140} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="60%" height={60} />
                    <Skeleton variant="text" width="40%" />
                </Container>
            </Box>
        );
    }

    if (!company) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <BusinessIcon sx={{ fontSize: 80, color: '#AEE3E6', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                    Company not found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    The company you're looking for doesn't exist or has been removed.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/')}
                    sx={{ backgroundColor: '#2FA4A9', px: 4 }}
                >
                    Go Back Home
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#F2F4F6', minHeight: '100vh', pb: 6 }}>
            {/* Top Navigation Bar */}
            <Paper elevation={0} sx={{ borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#FFFFFF' }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton
                                onClick={() => navigate('/')}
                                sx={{
                                    color: '#2FA4A9',
                                    '&:hover': { backgroundColor: '#AEE3E6' }
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#4A4A4A' }}>
                                {company.name}
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Paper>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                {/* Company Header */}
                <Card sx={{ mb: 3, overflow: 'visible', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <Box
                        sx={{
                            height: 240,
                            background: 'linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 50%, #AEE3E6 100%)',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '50%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
                            }
                        }}
                    />

                    <CardContent sx={{ pt: 0, pb: 4 }}>
                        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', mt: -10 }}>
                            {company.imageLink ? (
                                <Avatar
                                    src={company.imageLink}
                                    sx={{
                                        width: 160,
                                        height: 160,
                                        border: '6px solid #FFFFFF',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    }}
                                />
                            ) : (
                                <Avatar
                                    sx={{
                                        width: 160,
                                        height: 160,
                                        backgroundColor: '#2FA4A9',
                                        fontSize: '4rem',
                                        fontWeight: 700,
                                        border: '6px solid #FFFFFF',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    }}
                                >
                                    {company.name?.charAt(0)}
                                </Avatar>
                            )}

                            <Box sx={{ flex: 1, mt: 8 }}>
                                <Typography variant="h2" sx={{ fontWeight: 800, mb: 1.5, color: '#4A4A4A', fontSize: '2.5rem' }}>
                                    {company.name}
                                </Typography>
                                <Stack direction="row" spacing={1.5} sx={{ mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
                                    <Chip
                                        icon={<BusinessIcon />}
                                        label={company.category}
                                        sx={{
                                            backgroundColor: '#2FA4A9',
                                            color: '#FFFFFF',
                                            fontWeight: 700,
                                            fontSize: '0.95rem',
                                            px: 1,
                                        }}
                                    />
                                    {company.location && (
                                        <Chip
                                            icon={<LocationIcon />}
                                            label={company.location}
                                            sx={{
                                                backgroundColor: '#AEE3E6',
                                                color: '#2FA4A9',
                                                fontWeight: 600,
                                            }}
                                        />
                                    )}
                                    {company.website && (
                                        <Chip
                                            icon={<LanguageIcon />}
                                            label={company.website.replace(/^https?:\/\/(www\.)?/, '')}
                                            component="a"
                                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                            target="_blank"
                                            clickable
                                            variant="outlined"
                                            sx={{ borderColor: '#2FA4A9', color: '#2FA4A9', fontWeight: 500 }}
                                        />
                                    )}
                                </Stack>
                                {company.about && (
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            lineHeight: 1.8,
                                            maxWidth: '900px',
                                            color: '#4A4A4A',
                                            fontSize: '1.05rem',
                                        }}
                                    >
                                        {company.about}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                    {[
                        { icon: WorkIcon, value: jobs.length, label: 'Open Positions', color: '#2FA4A9' },
                        { icon: ArticleIcon, value: posts.length, label: 'Posts', color: '#5BC0BE' },
                        { icon: PeopleIcon, value: company.followers || 0, label: 'Followers', color: '#AEE3E6' },
                        { icon: TrendingUpIcon, value: '95%', label: 'Response Rate', color: '#2FA4A9' },
                    ].map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{
                                textAlign: 'center',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 24px rgba(47, 164, 169, 0.15)',
                                }
                            }}>
                                <CardContent sx={{ py: 3.5 }}>
                                    <Box sx={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 20px',
                                        boxShadow: `0 4px 12px ${stat.color}40`,
                                    }}>
                                        <stat.icon sx={{ fontSize: 36, color: '#FFFFFF' }} />
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#2FA4A9', mb: 1, fontSize: '2.5rem' }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#7A7A7A', fontWeight: 600, fontSize: '0.9rem' }}>
                                        {stat.label}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Content Tabs */}
                <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#FFFFFF' }}>
                        <Tabs
                            value={tabValue}
                            onChange={(e, newValue) => setTabValue(newValue)}
                            sx={{
                                px: 2,
                                '& .MuiTab-root': {
                                    color: '#7A7A7A',
                                    fontWeight: 700,
                                    fontSize: '1.05rem',
                                    textTransform: 'none',
                                    py: 2.5,
                                    minHeight: 64,
                                },
                                '& .Mui-selected': { color: '#2FA4A9' },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#2FA4A9',
                                    height: 4,
                                    borderRadius: '4px 4px 0 0',
                                },
                            }}
                        >
                            <Tab icon={<WorkIcon />} iconPosition="start" label={`Jobs (${jobs.length})`} />
                            <Tab icon={<ArticleIcon />} iconPosition="start" label={`Posts (${posts.length})`} />
                            <Tab icon={<BusinessIcon />} iconPosition="start" label="About" />
                        </Tabs>
                    </Box>

                    <CardContent sx={{ minHeight: 500, p: 4 }}>
                        <TabPanel value={tabValue} index={0}>
                            {jobs.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 10 }}>
                                    <WorkIcon sx={{ fontSize: 80, color: '#AEE3E6', mb: 3 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: '#4A4A4A' }}>
                                        No open positions
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Check back later for new opportunities at {company.name}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#4A4A4A' }}>
                                        Open Positions at {company.name}
                                    </Typography>
                                    {jobs.map((job) => <JobCard key={job._id} job={job} onApply={(jobId) => navigate(`/job/${jobId}`)} />)}
                                </Box>
                            )}
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            {posts.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 10 }}>
                                    <ArticleIcon sx={{ fontSize: 80, color: '#AEE3E6', mb: 3 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: '#4A4A4A' }}>
                                        No posts yet
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {company.name} hasn't shared any updates
                                    </Typography>
                                </Box>
                            ) : (
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#4A4A4A' }}>
                                        Latest from {company.name}
                                    </Typography>
                                    {posts.map((post) => <PostCard key={post._id} post={post} />)}
                                </Box>
                            )}
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <Box sx={{ maxWidth: 900 }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: '#4A4A4A' }}>
                                    About {company.name}
                                </Typography>
                                <Paper elevation={0} sx={{ p: 4, backgroundColor: '#F2F4F6', borderRadius: 3, mb: 4 }}>
                                    <Typography variant="body1" sx={{ lineHeight: 2, color: '#4A4A4A', fontSize: '1.1rem' }}>
                                        {company.about || 'No description available'}
                                    </Typography>
                                </Paper>

                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#4A4A4A' }}>
                                    Company Information
                                </Typography>
                                <Grid container spacing={3}>
                                    {[
                                        { label: 'Industry', value: company.category, icon: BusinessIcon },
                                        { label: 'Location', value: company.location || 'Not specified', icon: LocationIcon },
                                        { label: 'Company Size', value: '50-200 employees', icon: PeopleIcon },
                                        { label: 'Founded', value: '2020', icon: TrendingUpIcon },
                                    ].map((item, index) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 3,
                                                    backgroundColor: '#FFFFFF',
                                                    border: '2px solid #E5E7EB',
                                                    borderRadius: 2,
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        borderColor: '#2FA4A9',
                                                        boxShadow: '0 4px 12px rgba(47, 164, 169, 0.1)',
                                                    }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                                                    <Box sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        backgroundColor: '#AEE3E6',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}>
                                                        <item.icon sx={{ fontSize: 20, color: '#2FA4A9' }} />
                                                    </Box>
                                                    <Typography variant="subtitle2" sx={{ color: '#7A7A7A', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                                        {item.label}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2FA4A9', ml: 7 }}>
                                                    {item.value}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </TabPanel>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
