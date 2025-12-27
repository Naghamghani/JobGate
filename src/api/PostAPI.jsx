import axios from "axios";

const API_URL = "http://localhost:5000/api/posts";

// Get all posts
export const getAllPostsAPI = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Create post
export const createPostAPI = async (postData) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(API_URL, postData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Like/Unlike post
export const likePostAPI = async (postId) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(`${API_URL}/${postId}/like`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Add comment
export const addCommentAPI = async (postId, text) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(`${API_URL}/${postId}/comment`, { text }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get posts by company
export const getPostsByCompanyAPI = async (companyId) => {
    try {
        const response = await axios.get(`${API_URL}/company/${companyId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
