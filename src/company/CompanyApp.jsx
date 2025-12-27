import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import companyTheme from './theme';
import CompanyLayout from './layouts/CompanyLayout';
import DashboardHomePage from './pages/DashboardHomePage';
import JobPostingsPage from './pages/JobPostingsPage';
import PostsPage from './pages/PostsPage';
import CandidatesPage from './pages/CandidatesPage';
import CompanyProfilePage from './pages/CompanyProfilePage';

export default function CompanyApp() {
    return (
        <ThemeProvider theme={companyTheme}>
            <CssBaseline />
            <CompanyLayout>
                <Routes>
                    <Route path="/" element={<DashboardHomePage />} />
                    <Route path="/jobs" element={<JobPostingsPage />} />
                    <Route path="/posts" element={<PostsPage />} />
                    <Route path="/candidates" element={<CandidatesPage />} />
                    <Route path="/profile" element={<CompanyProfilePage />} />
                </Routes>
            </CompanyLayout>
        </ThemeProvider>
    );
}
