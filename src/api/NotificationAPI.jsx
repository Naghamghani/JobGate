import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

// Get recent notifications
export const getNotificationsAPI = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Mark notification as read
export const markNotificationAsReadAPI = async (id) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.put(`${API_URL}/${id}/read`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Mark all notifications as read
export const markAllNotificationsAsReadAPI = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.put(`${API_URL}/read-all`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
