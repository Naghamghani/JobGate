import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    Button,
    TextField,
    InputAdornment,
    CircularProgress,
    IconButton,
    Paper,
    Tabs,
    Tab,
} from '@mui/material';
import {
    Search as SearchIcon,
    Business as BusinessIcon,
    LocationOn as LocationIcon,
    ArrowBack as ArrowBackIcon,
    Work as WorkIcon,
    People as PeopleIcon,
    FilterList as FilterIcon,
} from '@mui/icons-material';
import { getAllCompanies } from '../api/AuthAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CompanyCard = ({ company }) => {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                height: 360,
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(47, 164, 169, 0.2)",
                    borderColor: "#2FA4A9",
                },
            }}
        >
            {/* Header Banner */}
            <Box
                sx={{
                    height: 80,
                    background: 'linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 50%, #AEE3E6 100%)',
                    position: 'relative',
                }}
            />

            {/* Avatar - centered on banner edge */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: -5 }}>
                {company.imageLink ? (
                    <Avatar
                        src={company.imageLink}
                        sx={{
                            width: 80,
                            height: 80,
                            border: "4px solid #FFFFFF",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        }}
                    />
                ) : (
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            background: "linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 100%)",
                            fontSize: "2rem",
                            fontWeight: 700,
                            border: "4px solid #FFFFFF",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        }}
                    >
                        {company.name?.charAt(0).toUpperCase()}
                    </Avatar>
                )}
            </Box>

            <CardContent sx={{ p: 2.5, pt: 1.5, display: "flex", flexDirection: "column", height: 'calc(100% - 80px)' }}>
                <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    {/* Company Name - fixed height */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 0.5,
                            color: "#2D3748",
                            lineHeight: 1.2,
                            fontSize: '1rem',
                            height: 24,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%',
                        }}
                    >
                        {company.name}
                    </Typography>

                    {/* Category Chip - fixed height */}
                    <Box sx={{ height: 28, display: 'flex', alignItems: 'center' }}>
                        <Chip
                            label={company.category || "Company"}
                            size="small"
                            sx={{
                                backgroundColor: "#E8F8F8",
                                color: "#2FA4A9",
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                height: 22,
                                '& .MuiChip-label': { px: 1.5 },
                            }}
                        />
                    </Box>

                    {/* Location - fixed height */}
                    <Box sx={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        {company.location && (
                            <>
                                <LocationIcon sx={{ fontSize: 14, color: "#718096" }} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#718096",
                                        fontWeight: 500,
                                        fontSize: '0.8rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: 150,
                                    }}
                                >
                                    {company.location}
                                </Typography>
                            </>
                        )}
                    </Box>

                    {/* About Text - fixed height with line clamp */}
                    <Box sx={{ height: 54, mt: 1, width: '100%' }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#718096",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                lineHeight: 1.5,
                                fontSize: "0.8rem",
                                textAlign: 'center',
                            }}
                        >
                            {company.about || 'No description available'}
                        </Typography>
                    </Box>
                </Box>

                {/* Button - fixed at bottom */}
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/company-profile/${company._id}`)}
                    sx={{
                        background: "linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 100%)",
                        textTransform: "none",
                        fontWeight: 600,
                        py: 1,
                        borderRadius: 2,
                        boxShadow: "0 4px 16px rgba(47, 164, 169, 0.35)",
                        fontSize: '0.85rem',
                        mt: 'auto',
                        "&:hover": {
                            background: "linear-gradient(135deg, #258A8E 0%, #4AABAD 100%)",
                            boxShadow: "0 6px 20px rgba(47, 164, 169, 0.45)",
                        },
                    }}
                >
                    View Profile
                </Button>
            </CardContent>
        </Card>
    );
};

export default function AllCompaniesPage() {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        filterCompanies();
    }, [searchQuery, companies, selectedCategory]);

    const fetchCompanies = async () => {
        try {
            const data = await getAllCompanies();
            setCompanies(data);
            setFilteredCompanies(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching companies:', error);
            toast.error('Failed to load companies');
            setLoading(false);
        }
    };

    const filterCompanies = () => {
        let filtered = companies;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter((company) =>
                company.category?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter((company) =>
                company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (company.category && company.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (company.location && company.location.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        setFilteredCompanies(filtered);
    };

    // Get unique categories
    const categories = ['all', ...new Set(companies.filter(c => c.category).map(c => c.category))];

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #F8FAFC 0%, #EDF2F7 100%)',
            }}>
                <CircularProgress sx={{ color: '#2FA4A9' }} size={50} />
                <Typography variant="body1" sx={{ mt: 2, color: '#718096' }}>
                    Loading companies...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            background: 'linear-gradient(180deg, #F8FAFC 0%, #EDF2F7 100%)',
            minHeight: '100vh',
        }}>
            {/* Hero Header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 50%, #AEE3E6 100%)',
                    py: 5,
                    mb: 4,
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <IconButton
                            onClick={() => navigate('/')}
                            sx={{
                                color: '#FFFFFF',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 0.5 }}>
                                Discover Companies
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}>
                                Explore {companies.length} amazing companies on JobGate
                            </Typography>
                        </Box>
                    </Box>

                    {/* Search Bar */}
                    <Paper
                        elevation={0}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 0.5,
                            borderRadius: 3,
                            maxWidth: 700,
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Search companies by name, category, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#718096' }} />
                                    </InputAdornment>
                                ),
                                disableUnderline: true,
                            }}
                            variant="standard"
                            sx={{
                                px: 2,
                                '& .MuiInputBase-input': {
                                    py: 1.5,
                                    fontSize: '1rem',
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 100%)',
                                borderRadius: 2.5,
                                px: 3,
                                py: 1.5,
                                mr: 0.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: 'none',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #258A8E 0%, #4AABAD 100%)',
                                },
                            }}
                        >
                            Search
                        </Button>
                    </Paper>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Category Filter Pills */}
                <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {categories.slice(0, 8).map((category) => (
                        <Chip
                            key={category}
                            label={category === 'all' ? 'All Companies' : category}
                            onClick={() => setSelectedCategory(category)}
                            sx={{
                                backgroundColor: selectedCategory === category ? '#2FA4A9' : '#FFFFFF',
                                color: selectedCategory === category ? '#FFFFFF' : '#4A5568',
                                border: '1px solid',
                                borderColor: selectedCategory === category ? '#2FA4A9' : '#E2E8F0',
                                fontWeight: 600,
                                px: 1,
                                fontSize: '0.85rem',
                                height: 36,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: selectedCategory === category ? '#258A8E' : '#F7FAFC',
                                    borderColor: '#2FA4A9',
                                },
                            }}
                        />
                    ))}
                </Box>

                {/* Results Count */}
                <Typography variant="body1" sx={{ mb: 3, color: '#718096', fontWeight: 500 }}>
                    Showing {filteredCompanies.length} of {companies.length} companies
                    {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                </Typography>

                {/* Companies Grid */}
                {filteredCompanies.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            textAlign: 'center',
                            py: 10,
                            px: 4,
                            borderRadius: 4,
                            backgroundColor: '#FFFFFF',
                            border: '1px dashed #CBD5E0',
                        }}
                    >
                        <BusinessIcon sx={{ fontSize: 80, color: '#CBD5E0', mb: 3 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#4A5568', mb: 1 }}>
                            {companies.length === 0 ? 'No companies yet' : 'No companies found'}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#718096', maxWidth: 400, mx: 'auto' }}>
                            {companies.length === 0
                                ? 'Be the first company to join JobGate and showcase your brand!'
                                : 'Try adjusting your search or filter to find what you\'re looking for.'}
                        </Typography>
                        {searchQuery && (
                            <Button
                                variant="outlined"
                                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                                sx={{
                                    mt: 3,
                                    borderColor: '#2FA4A9',
                                    color: '#2FA4A9',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': { borderColor: '#258A8E', backgroundColor: '#E8F8F8' },
                                }}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {filteredCompanies.map((company) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={company._id}>
                                <CompanyCard company={company} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Spacer for bottom */}
            <Box sx={{ py: 4 }} />
        </Box>
    );
}
