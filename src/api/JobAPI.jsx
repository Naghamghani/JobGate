import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";

// Add timeout to prevent infinite pending requests
const axiosConfig = {
    timeout: 10000, // 10 seconds timeout
};

// Get all jobs with pagination and filters
export const getAllJobsAPI = async (page = 1, filters = {}) => {
    try {
        const params = {
            page,
            limit: 10,
            ...filters,
        };

        const response = await axios.get(API_URL, {
            params,
            ...axiosConfig
        });
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout - server is not responding');
        }
        throw error.response?.data || error.message;
    }
};

// Get job filters (locations, categories, companies)
export const getJobFiltersAPI = async () => {
    try {
        const response = await axios.get(`${API_URL}/filters`, axiosConfig);
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout - server is not responding');
        }
        throw error.response?.data || error.message;
    }
};

// Get job by ID
export const getJobByIdAPI = async (jobId) => {
    try {
        const response = await axios.get(`${API_URL}/${jobId}`, axiosConfig);
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout - server is not responding');
        }
        throw error.response?.data || error.message;
    }
};

// Apply for job
export const applyForJobAPI = async (jobId, applicationData) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(
            `${API_URL}/${jobId}/apply`,
            applicationData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                ...axiosConfig,
            }
        );
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout - server is not responding');
        }
        throw error.response?.data || error.message;
    }
};
