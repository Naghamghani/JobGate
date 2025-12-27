import React, { useState, useEffect } from "react";
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
  Button,
  TextField,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  ClickAwayListener,
} from "@mui/material";
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import { getFeaturedCompaniesAPI, getAllCompanies } from "../api/AuthAPI";
import { getAllJobsAPI } from "../api/JobAPI";
import { getAllPostsAPI } from "../api/PostAPI";
import { useNavigate } from "react-router-dom";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import WhatIsJobGate from "./WhatIsJobGate";
import Footer from "./Footer";

const CompanyCard = ({ company }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: 280,
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 16px 32px rgba(47, 164, 169, 0.2)",
          borderColor: "#2FA4A9",
        },
      }}
    >
      <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1 }}>
          {company.imageLink ? (
            <Avatar
              src={company.imageLink}
              sx={{
                width: 60,
                height: 60,
                mb: 1.5,
                border: "3px solid #2FA4A9",
                boxShadow: "0 4px 12px rgba(47, 164, 169, 0.3)",
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 60,
                height: 60,
                mb: 1.5,
                background: "linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 100%)",
                fontSize: "1.5rem",
                fontWeight: 700,
                boxShadow: "0 4px 12px rgba(47, 164, 169, 0.3)",
              }}
            >
              {company.name?.charAt(0).toUpperCase()}
            </Avatar>
          )}

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: "#4A4A4A", lineHeight: 1.2 }}>
            {company.name}
          </Typography>

          <Chip
            label={company.category || "Company"}
            size="small"
            sx={{
              mb: 1,
              backgroundColor: "#AEE3E6",
              color: "#2FA4A9",
              fontWeight: 600,
              fontSize: "0.7rem",
              height: 22,
            }}
          />

          {company.location && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
              <LocationIcon sx={{ fontSize: 14, color: "#7A7A7A" }} />
              <Typography variant="caption" sx={{ color: "#7A7A7A", fontWeight: 500 }}>
                {company.location}
              </Typography>
            </Box>
          )}
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="small"
          onClick={() => navigate(`/company-profile/${company._id}`)}
          sx={{
            backgroundColor: "#2FA4A9",
            textTransform: "none",
            fontWeight: 600,
            py: 1,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(47, 164, 169, 0.3)",
            "&:hover": {
              backgroundColor: "#258A8E",
              boxShadow: "0 6px 16px rgba(47, 164, 169, 0.4)",
            },
          }}
        >
          View Company
        </Button>
      </CardContent>
    </Card>
  );
};

export default function HomeComponent({ currentUser }) {
  const [companies, setCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState({ companies: [], jobs: [] });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const query = searchQuery.toLowerCase();

      // Filter companies
      const filteredCompanies = allCompanies.filter(company =>
        company.name?.toLowerCase().includes(query) ||
        company.category?.toLowerCase().includes(query) ||
        company.location?.toLowerCase().includes(query)
      ).slice(0, 5);

      // Filter jobs
      const filteredJobs = allJobs.filter(job =>
        job.title?.toLowerCase().includes(query) ||
        job.company?.name?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.category?.toLowerCase().includes(query)
      ).slice(0, 5);

      setSearchResults({ companies: filteredCompanies, jobs: filteredJobs });
      setShowResults(true);
    } else {
      setSearchResults({ companies: [], jobs: [] });
      setShowResults(false);
    }
  }, [searchQuery, allCompanies, allJobs]);

  const fetchData = async () => {
    try {
      const [companiesData, postsData, allCompaniesData, jobsResponse] = await Promise.all([
        getFeaturedCompaniesAPI(),
        getAllPostsAPI(),
        getAllCompanies().catch(() => []),
        getAllJobsAPI().catch(() => ({ jobs: [] })),
      ]);
      setCompanies(companiesData);
      setPosts(postsData);
      setAllCompanies(allCompaniesData || []);
      setAllJobs(jobsResponse?.jobs || jobsResponse || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    fetchData(); // Refresh posts after creating new one
  };

  const handleSearchResultClick = (type, id) => {
    setShowResults(false);
    setSearchQuery('');
    if (type === 'company') {
      navigate(`/company-profile/${id}`);
    } else {
      navigate(`/job/${id}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress sx={{ color: "#2FA4A9" }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Search Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 50%, #AEE3E6 100%)',
          py: { xs: 4, md: 6 },
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: '#FFFFFF',
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
              }}
            >
              Find Your Dream Opportunity
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 400,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
              }}
            >
              Search for companies and jobs that match your skills
            </Typography>
          </Box>

          {/* Search Bar */}
          <ClickAwayListener onClickAway={() => setShowResults(false)}>
            <Box sx={{ position: 'relative', maxWidth: 800, mx: 'auto' }}>
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  p: { xs: 1, sm: 0.5 },
                  borderRadius: showResults ? '12px 12px 0 0' : 3,
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  gap: { xs: 1, sm: 0 },
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search for companies or jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
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
                    flex: 1,
                    '& .MuiInputBase-input': {
                      py: 1.5,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    },
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                  <Button
                    variant="contained"
                    startIcon={<BusinessIcon />}
                    onClick={() => navigate('/companies')}
                    sx={{
                      background: 'linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 100%)',
                      borderRadius: 2,
                      px: { xs: 2, sm: 3 },
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: 'none',
                      flex: { xs: 1, sm: 'none' },
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      '&:hover': {
                        background: 'linear-gradient(135deg, #258A8E 0%, #4AABAD 100%)',
                      },
                    }}
                  >
                    Companies
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<WorkIcon />}
                    onClick={() => navigate('/jobs')}
                    sx={{
                      borderColor: '#2FA4A9',
                      color: '#2FA4A9',
                      borderRadius: 2,
                      px: { xs: 2, sm: 3 },
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      flex: { xs: 1, sm: 'none' },
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      backgroundColor: '#FFFFFF',
                      '&:hover': {
                        borderColor: '#258A8E',
                        backgroundColor: 'rgba(47, 164, 169, 0.08)',
                      },
                    }}
                  >
                    Jobs
                  </Button>
                </Box>
              </Paper>

              {/* Search Results Dropdown */}
              {showResults && (searchResults.companies.length > 0 || searchResults.jobs.length > 0) && (
                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    borderRadius: '0 0 12px 12px',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    maxHeight: 400,
                    overflow: 'auto',
                    zIndex: 1000,
                  }}
                >
                  {searchResults.companies.length > 0 && (
                    <>
                      <Typography
                        variant="subtitle2"
                        sx={{ px: 2, pt: 2, pb: 1, color: '#718096', fontWeight: 600 }}
                      >
                        Companies
                      </Typography>
                      <List dense sx={{ py: 0 }}>
                        {searchResults.companies.map((company) => (
                          <ListItem
                            key={company._id}
                            button
                            onClick={() => handleSearchResultClick('company', company._id)}
                            sx={{
                              '&:hover': { backgroundColor: '#F7FAFC' },
                              cursor: 'pointer',
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                src={company.imageLink}
                                sx={{ width: 40, height: 40, bgcolor: '#2FA4A9' }}
                              >
                                {company.name?.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={company.name}
                              secondary={company.category || company.location}
                              primaryTypographyProps={{ fontWeight: 600, color: '#2D3748' }}
                              secondaryTypographyProps={{ color: '#718096' }}
                            />
                            <Chip
                              icon={<BusinessIcon sx={{ fontSize: 14 }} />}
                              label="Company"
                              size="small"
                              sx={{ backgroundColor: '#E8F8F8', color: '#2FA4A9', fontSize: '0.7rem' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}

                  {searchResults.companies.length > 0 && searchResults.jobs.length > 0 && (
                    <Divider />
                  )}

                  {searchResults.jobs.length > 0 && (
                    <>
                      <Typography
                        variant="subtitle2"
                        sx={{ px: 2, pt: 2, pb: 1, color: '#718096', fontWeight: 600 }}
                      >
                        Jobs
                      </Typography>
                      <List dense sx={{ py: 0, pb: 1 }}>
                        {searchResults.jobs.map((job) => (
                          <ListItem
                            key={job._id}
                            button
                            onClick={() => handleSearchResultClick('job', job._id)}
                            sx={{
                              '&:hover': { backgroundColor: '#F7FAFC' },
                              cursor: 'pointer',
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ width: 40, height: 40, bgcolor: '#5BC0BE' }}>
                                <WorkIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={job.title}
                              secondary={job.company?.name || job.location}
                              primaryTypographyProps={{ fontWeight: 600, color: '#2D3748' }}
                              secondaryTypographyProps={{ color: '#718096' }}
                            />
                            <Chip
                              icon={<WorkIcon sx={{ fontSize: 14 }} />}
                              label="Job"
                              size="small"
                              sx={{ backgroundColor: '#FFF3E0', color: '#F57C00', fontSize: '0.7rem' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </Paper>
              )}
            </Box>
          </ClickAwayListener>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Featured Companies - Full Width Row */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TrendingUpIcon sx={{ color: "#2FA4A9" }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#4A4A4A" }}>
                Featured Companies
              </Typography>
            </Box>
            <Button
              variant="text"
              onClick={() => navigate('/companies')}
              sx={{ color: "#2FA4A9", textTransform: "none", fontWeight: 600 }}
            >
              View All
            </Button>
          </Box>

          {companies.length === 0 ? (
            <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid #E5E7EB" }}>
              <BusinessIcon sx={{ fontSize: 48, color: "#E5E7EB", mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No companies available
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {companies.slice(0, 5).map((company) => (
                <Grid item xs={12} sm={6} md={2.4} key={company._id}>
                  <CompanyCard company={company} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Main Feed */}
        <Box>
          {/* Create Post Section */}
          <CreatePost currentUser={currentUser} onPostCreated={handlePostCreated} />

          {/* Posts Feed */}
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: "#4A4A4A" }}>
            Recent Posts
          </Typography>

          {posts.length === 0 ? (
            <Card sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No posts yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Be the first to share something!
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUserId={currentUser?._id}
                    onUpdate={fetchData}
                  />
                ))}
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>

      {/* What is JobGate Section - Outside Container for better performance */}
      <WhatIsJobGate />

      {/* Footer - Outside Container */}
      <Footer />
    </Box >
  );
}
