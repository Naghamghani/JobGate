import axios from "axios";

const API_URL = "http://localhost:5000/api/connections";

// Send connection request
export const sendConnectionRequestAPI = async (receiverId) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(`${API_URL}/request`, { receiverId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Accept connection request
export const acceptConnectionRequestAPI = async (connectionId) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.put(`${API_URL}/${connectionId}/accept`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Reject connection request
export const rejectConnectionRequestAPI = async (connectionId) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.put(`${API_URL}/${connectionId}/reject`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get my connections
export const getMyConnectionsAPI = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/my-connections`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get pending requests
export const getPendingRequestsAPI = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/pending`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get suggested users
export const getSuggestedUsersAPI = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/suggestions`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Remove connection
export const removeConnectionAPI = async (connectionId) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.delete(`${API_URL}/${connectionId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
