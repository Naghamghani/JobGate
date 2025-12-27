import axios from "axios";

const API_URL = "http://localhost:5000/api/companies";

// Get company dashboard statistics
export const getDashboardStatsAPI = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/dashboard/stats`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get top performing jobs
export const getTopPerformingJobsAPI = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/dashboard/top-jobs`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get recent applications
export const getRecentApplicationsAPI = async (limit = 10) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/dashboard/recent-applications`, {
            params: { limit },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
