import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import {
    LinkedIn as LinkedInIcon,
    Twitter as TwitterIcon,
    Facebook as FacebookIcon,
    Instagram as InstagramIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
} from '@mui/icons-material';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                pt: 8,
                pb: 4,
                mt: 8,
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* About Section */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#2FA4A9' }}>
                            JobGate
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: '#b0b0b0', lineHeight: 1.8 }}>
                            Connecting talent with opportunity. Your gateway to the perfect career match.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                            <IconButton
                                sx={{
                                    color: 'white',
                                    backgroundColor: '#2FA4A9',
                                    '&:hover': { backgroundColor: '#258A8E' },
                                    width: 40,
                                    height: 40,
                                }}
                            >
                                <LinkedInIcon />
                            </IconButton>
                            <IconButton
                                sx={{
                                    color: 'white',
                                    backgroundColor: '#2FA4A9',
                                    '&:hover': { backgroundColor: '#258A8E' },
                                    width: 40,
                                    height: 40,
                                }}
                            >
                                <TwitterIcon />
                            </IconButton>
                            <IconButton
                                sx={{
                                    color: 'white',
                                    backgroundColor: '#2FA4A9',
                                    '&:hover': { backgroundColor: '#258A8E' },
                                    width: 40,
                                    height: 40,
                                }}
                            >
                                <FacebookIcon />
                            </IconButton>
                            <IconButton
                                sx={{
                                    color: 'white',
                                    backgroundColor: '#2FA4A9',
                                    '&:hover': { backgroundColor: '#258A8E' },
                                    width: 40,
                                    height: 40,
                                }}
                            >
                                <InstagramIcon />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            For Candidates
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Link href="/jobs" sx={{ color: '#b0b0b0', textDecoration: 'none', '&:hover': { color: '#2FA4A9' } }}>
                                Browse Jobs
                            </Link>
                            <Link href="#" sx={{ color: '#b0b0b0', textDecoration: 'none', '&:hover': { color: '#2FA4A9' } }}>
                                Career Advice
                            </Link>
                            <Link href="#" sx={{ color: '#b0b0b0', textDecoration: 'none', '&:hover': { color: '#2FA4A9' } }}>
                                Resume Builder
                            </Link>
                            <Link href="#" sx={{ color: '#b0b0b0', textDecoration: 'none', '&:hover': { color: '#2FA4A9' } }}>
                                Salary Guide
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            For Employers
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Link href="#" sx={{ color: '#b0b0b0', textDecoration: 'none', '&:hover': { color: '#2FA4A9' } }}>
                                Post a Job
                            </Link>
                            <Link href="#" sx={{ color: '#b0b0b0', textDecoration: 'none', '&:hover': { color: '#2FA4A9' } }}>
                                Pricing
                            </Link>
                            <Link href="#" sx={{ color: '#b0b0b0', textDecoration: 'none', '&:hover': { color: '#2FA4A9' } }}>
                                Talent Search
                            </Link>
                            <Link href="#" sx={{ color: '#b0b0b0', textDecoration: 'none', '&:hover': { color: '#2FA4A9' } }}>
                                Success Stories
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Company
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Link href="#" sx={{ color: '#b0b0b0', textDecoration: 'none', '&:hover': { color: '#2FA4A9' } }}>
                                About Us
                            </Link>
                            <Link href="#" sx={{ color: '#b0b0b0', textDecoration: 'none', '&:hover': { color: '#2FA4A9' } }}>
                                Contact
                            </Link>
                            <Link href="#" sx={{ color: '#b0b0b0', textDecoration: 'none', '&:hover': { color: '#2FA4A9' } }}>
                                Privacy Policy
                            </Link>
                            <Link href="#" sx={{ color: '#b0b0b0', textDecoration: 'none', '&:hover': { color: '#2FA4A9' } }}>
                                Terms of Service
                            </Link>
                        </Box>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Contact Us
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#b0b0b0' }}>
                                <EmailIcon sx={{ fontSize: 18 }} />
                                <Typography variant="body2">info@jobgate.com</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#b0b0b0' }}>
                                <PhoneIcon sx={{ fontSize: 18 }} />
                                <Typography variant="body2">+1 (555) 123-4567</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, color: '#b0b0b0' }}>
                                <LocationIcon sx={{ fontSize: 18, mt: 0.3 }} />
                                <Typography variant="body2">123 Business Ave, Suite 100, NY 10001</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* Bottom Bar */}
                <Box
                    sx={{
                        borderTop: '1px solid #333',
                        mt: 6,
                        pt: 3,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        © {new Date().getFullYear()} JobGate. All rights reserved.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Link href="#" sx={{ color: '#b0b0b0', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#2FA4A9' } }}>
                            Privacy
                        </Link>
                        <Link href="#" sx={{ color: '#b0b0b0', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#2FA4A9' } }}>
                            Terms
                        </Link>
                        <Link href="#" sx={{ color: '#b0b0b0', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#2FA4A9' } }}>
                            Cookies
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
