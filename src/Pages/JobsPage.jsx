import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Pagination,
    CircularProgress,
    Chip,
    Avatar,
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    Work as WorkIcon,
    Business as BusinessIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { getAllJobsAPI, getJobFiltersAPI } from '../api/JobAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        location: '',
        category: '',
        company: '',
        search: '',
    });
    const [filterOptions, setFilterOptions] = useState({
        locations: [],
        categories: [],
        companies: [],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [currentPage, filters]);

    const fetchFilterOptions = async () => {
        try {
            const data = await getJobFiltersAPI();
            setFilterOptions(data);
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
    };

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const cleanFilters = {};
            if (filters.location) cleanFilters.location = filters.location;
            if (filters.category) cleanFilters.category = filters.category;
            if (filters.company) cleanFilters.company = filters.company;
            if (filters.search) cleanFilters.search = filters.search;

            const data = await getAllJobsAPI(currentPage, cleanFilters);
            setJobs(data.jobs);
            setTotalPages(data.totalPages);
            setTotalJobs(data.totalJobs);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to load jobs');
            setLoading(false);
        }
    };

    const handleFilterChange = (filterName, value) => {
        setFilters({ ...filters, [filterName]: value });
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleClearFilters = () => {
        setFilters({
            location: '',
            category: '',
            company: '',
            search: '',
        });
        setCurrentPage(1);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2FA4A9', mb: 1 }}>
                    Browse Jobs
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {totalJobs} job{totalJobs !== 1 ? 's' : ''} available
                </Typography>

                {/* Search Bar at Top */}
                <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 2 }}>
                    <CardContent sx={{ py: 2 }}>
                        <TextField
                            fullWidth
                            placeholder="Search jobs by title or company..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: '#2FA4A9', fontSize: 24 }} />,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#2FA4A9',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2FA4A9',
                                    },
                                },
                            }}
                        />
                    </CardContent>
                </Card>
            </Box>

            <Grid container spacing={3}>
                {/* Filters Sidebar */}
                <Grid item xs={12} md={3}>
                    <Card
                        sx={{
                            position: 'sticky',
                            top: 20,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            borderRadius: 2,
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            {/* Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2FA4A9' }}>
                                    Filters
                                </Typography>
                                {(filters.location || filters.category || filters.company || filters.search) && (
                                    <Chip
                                        label="Active"
                                        size="small"
                                        sx={{
                                            backgroundColor: '#AEE3E6',
                                            color: '#2FA4A9',
                                            fontWeight: 600,
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Location Filter */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, display: 'block' }}>
                                    LOCATION
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={filters.location}
                                        onChange={(e) => handleFilterChange('location', e.target.value)}
                                        displayEmpty
                                        startAdornment={<LocationIcon sx={{ mr: 1, color: '#2FA4A9', fontSize: 20 }} />}
                                        sx={{
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#2FA4A9',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#2FA4A9',
                                            },
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>All Locations</em>
                                        </MenuItem>
                                        {filterOptions.locations.map((location) => (
                                            <MenuItem key={location} value={location}>
                                                {location}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Category Filter */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, display: 'block' }}>
                                    CATEGORY
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        displayEmpty
                                        startAdornment={<WorkIcon sx={{ mr: 1, color: '#2FA4A9', fontSize: 20 }} />}
                                        sx={{
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#2FA4A9',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#2FA4A9',
                                            },
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>All Categories</em>
                                        </MenuItem>
                                        {filterOptions.categories.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Company Filter */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, display: 'block' }}>
                                    COMPANY
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={filters.company}
                                        onChange={(e) => handleFilterChange('company', e.target.value)}
                                        displayEmpty
                                        startAdornment={<BusinessIcon sx={{ mr: 1, color: '#2FA4A9', fontSize: 20 }} />}
                                        sx={{
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#2FA4A9',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#2FA4A9',
                                            },
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>All Companies</em>
                                        </MenuItem>
                                        {filterOptions.companies.map((company) => (
                                            <MenuItem key={company._id} value={company._id}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {company.imageLink ? (
                                                        <Avatar src={company.imageLink} sx={{ width: 24, height: 24 }} />
                                                    ) : (
                                                        <Avatar sx={{ width: 24, height: 24, backgroundColor: '#2FA4A9', fontSize: 12 }}>
                                                            {company.name?.charAt(0)}
                                                        </Avatar>
                                                    )}
                                                    <Typography variant="body2">{company.name}</Typography>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Active Filters Display */}
                            {(filters.location || filters.category || filters.company || filters.search) && (
                                <Box sx={{ mb: 3, p: 2, backgroundColor: '#F0F9FA', borderRadius: 1 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#2FA4A9', mb: 1, display: 'block' }}>
                                        ACTIVE FILTERS
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {filters.search && (
                                            <Chip
                                                label={`Search: ${filters.search}`}
                                                size="small"
                                                onDelete={() => handleFilterChange('search', '')}
                                                sx={{ backgroundColor: 'white' }}
                                            />
                                        )}
                                        {filters.location && (
                                            <Chip
                                                label={filters.location}
                                                size="small"
                                                onDelete={() => handleFilterChange('location', '')}
                                                sx={{ backgroundColor: 'white' }}
                                            />
                                        )}
                                        {filters.category && (
                                            <Chip
                                                label={filters.category}
                                                size="small"
                                                onDelete={() => handleFilterChange('category', '')}
                                                sx={{ backgroundColor: 'white' }}
                                            />
                                        )}
                                        {filters.company && (
                                            <Chip
                                                label={filterOptions.companies.find(c => c._id === filters.company)?.name || 'Company'}
                                                size="small"
                                                onDelete={() => handleFilterChange('company', '')}
                                                sx={{ backgroundColor: 'white' }}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            )}

                            {/* Clear Filters */}
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleClearFilters}
                                disabled={!filters.location && !filters.category && !filters.company && !filters.search}
                                sx={{
                                    color: '#2FA4A9',
                                    borderColor: '#2FA4A9',
                                    fontWeight: 600,
                                    py: 1.5,
                                    '&:hover': {
                                        borderColor: '#258A8E',
                                        backgroundColor: '#F0F9FA',
                                    },
                                    '&:disabled': {
                                        borderColor: '#E5E7EB',
                                        color: '#9CA3AF',
                                    },
                                }}
                            >
                                Clear All Filters
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Jobs List */}
                <Grid item xs={12} md={9}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress sx={{ color: '#2FA4A9' }} />
                        </Box>
                    ) : jobs.length === 0 ? (
                        <Card sx={{ p: 6, textAlign: 'center' }}>
                            <WorkIcon sx={{ fontSize: 64, color: '#E5E7EB', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                No jobs found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Try adjusting your filters or search terms
                            </Typography>
                        </Card>
                    ) : (
                        <>
                            {/* Job Cards */}
                            <Box sx={{ mb: 4 }}>
                                {jobs.map((job) => (
                                    <Card
                                        key={job._id}
                                        sx={{
                                            mb: 2,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                transform: 'translateY(-2px)',
                                            },
                                        }}
                                        onClick={() => navigate(`/job/${job._id}`)}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                {/* Company Logo */}
                                                {job.company?.imageLink ? (
                                                    <Avatar
                                                        src={job.company.imageLink}
                                                        sx={{ width: 56, height: 56 }}
                                                    />
                                                ) : (
                                                    <Avatar
                                                        sx={{
                                                            width: 56,
                                                            height: 56,
                                                            backgroundColor: '#2FA4A9',
                                                        }}
                                                    >
                                                        {job.companyName?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                )}

                                                {/* Job Details */}
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{ fontWeight: 600, mb: 0.5 }}
                                                    >
                                                        {job.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ mb: 1 }}
                                                    >
                                                        {job.companyName}
                                                    </Typography>

                                                    {/* Job Meta */}
                                                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {job.location}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <WorkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {job.type}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    {/* Category & Experience */}
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Chip
                                                            label={job.category}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#AEE3E6',
                                                                color: '#2FA4A9',
                                                                fontWeight: 500,
                                                            }}
                                                        />
                                                        <Chip
                                                            label={job.experience}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        color="primary"
                                        size="large"
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                '&.Mui-selected': {
                                                    backgroundColor: '#2FA4A9',
                                                    '&:hover': {
                                                        backgroundColor: '#258A8E',
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}
