import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import AdminLayout from './layouts/AdminLayout';
import OverviewPage from './pages/OverviewPage';
import UserManagementPage from './pages/UserManagementPage';
import CompaniesPage from './pages/CompaniesPage';
import JobApplicationsPage from './pages/JobApplicationsPage';
import CompanyCategoriesPage from './pages/CompanyCategoriesPage';
import AddCompanyPage from './pages/AddCompanyPage';

export default function AdminApp() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AdminLayout>
                <Routes>
                    <Route path="/" element={<OverviewPage />} />
                    <Route path="/users" element={<UserManagementPage />} />
                    <Route path="/companies" element={<CompaniesPage />} />
                    <Route path="/add-company" element={<AddCompanyPage />} />
                    <Route path="/applications" element={<JobApplicationsPage />} />
                    <Route path="/categories" element={<CompanyCategoriesPage />} />
                </Routes>
            </AdminLayout>
        </ThemeProvider>
    );
}

