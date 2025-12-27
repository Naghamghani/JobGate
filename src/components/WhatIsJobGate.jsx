import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import {
    WorkOutline as WorkIcon,
    PeopleOutline as PeopleIcon,
    TrendingUp as TrendingIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';

export default function WhatIsJobGate() {
    const features = [
        {
            icon: <WorkIcon sx={{ fontSize: 48, color: '#2FA4A9' }} />,
            title: 'Thousands of Jobs',
            description: 'Access a vast network of job opportunities from top companies worldwide.',
        },
        {
            icon: <PeopleIcon sx={{ fontSize: 48, color: '#10b981' }} />,
            title: 'Connect with Talent',
            description: 'Build your professional network and connect with industry leaders.',
        },
        {
            icon: <TrendingIcon sx={{ fontSize: 48, color: '#f59e0b' }} />,
            title: 'Career Growth',
            description: 'Get personalized recommendations and insights to advance your career.',
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 48, color: '#8b5cf6' }} />,
            title: 'Secure & Trusted',
            description: 'Your data is protected with enterprise-grade security measures.',
        },
    ];

    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2f1 100%)',
                py: 10,
                mt: 8,
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            mb: 2,
                            background: 'linear-gradient(135deg, #2FA4A9 0%, #10b981 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        What is JobGate?
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: 700,
                            mx: 'auto',
                            lineHeight: 1.8,
                            fontWeight: 400,
                        }}
                    >
                        Your gateway to career success. JobGate connects talented professionals with
                        their dream opportunities through intelligent matching and powerful networking.
                    </Typography>
                </Box>

                {/* Features Grid */}
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(47, 164, 169, 0.1)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 20px 40px rgba(47, 164, 169, 0.15)',
                                        border: '1px solid rgba(47, 164, 169, 0.3)',
                                    },
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                    <Box
                                        sx={{
                                            mb: 3,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 80,
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 2,
                                            color: 'text.primary',
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Stats Section */}
                <Box
                    sx={{
                        mt: 8,
                        p: 6,
                        background: 'linear-gradient(135deg, #2FA4A9 0%, #10b981 100%)',
                        borderRadius: 4,
                        boxShadow: '0 20px 60px rgba(47, 164, 169, 0.3)',
                    }}
                >
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                                    10K+
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                    Active Jobs
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                                    50K+
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                    Professionals
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                                    5K+
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                    Companies
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
