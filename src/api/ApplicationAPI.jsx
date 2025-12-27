import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Apply for job
export const applyForJobAPI = async (jobId, applicationData) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(
            `${API_URL}/jobs/${jobId}/apply`,
            applicationData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get user's applications
export const getUserApplicationsAPI = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/applications/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get company's applications
export const getCompanyApplicationsAPI = async (filters = {}) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/applications/company`, {
            params: filters,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get all applications (admin)
export const getAllApplicationsAPI = async (filters = {}) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/applications`, {
            params: filters,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update application status
export const updateApplicationStatusAPI = async (applicationId, status) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.put(
            `${API_URL}/applications/${applicationId}/status`,
            { status },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Notify applicant (admin)
export const notifyApplicantAPI = async (applicationId) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(
            `${API_URL}/applications/${applicationId}/notify`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
