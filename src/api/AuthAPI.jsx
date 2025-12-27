import axios from "axios";

const API_URL = "http://localhost:5000/api/users";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";
const JOB_API_URL = "http://localhost:5000/api/jobs";

// Register user
export const RegisterAPI = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userEmail", response.data.email);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("userId", response.data.userID);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Login user
export const LoginAPI = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userEmail", response.data.email);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("userId", response.data.userID);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Logout user
export const LogoutAPI = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
  return { success: true, message: "Logged out successfully" };
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`${API_URL}/profile`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all users (admin only)
export const getAllUsersAPI = async () => {
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

// Get user by ID (admin only)
export const getUserById = async (userId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user (admin only)
export const updateUserById = async (userId, userData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`${API_URL}/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete user (admin only)
export const deleteUserById = async (userId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin create company
export const adminCreateCompanyAPI = async (companyData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${API_URL}/admin/create-company`, {
      ...companyData,
      role: 'company',
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all companies (public)
export const getAllCompanies = async () => {
  try {
    const response = await axios.get(`${API_URL}/all-companies`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem("userRole");
};

// Get user email
export const getUserEmail = () => {
  return localStorage.getItem("userEmail");
};

// ============= Category API Functions =============

// Get all categories
export const getAllCategoriesAPI = async () => {
  try {
    const response = await axios.get(CATEGORY_API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const response = await axios.get(`${CATEGORY_API_URL}/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create category (admin only)
export const createCategory = async (categoryData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(CATEGORY_API_URL, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update category (admin only)
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`${CATEGORY_API_URL}/${categoryId}`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete category (admin only)
export const deleteCategoryAPI = async (categoryId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(`${CATEGORY_API_URL}/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============= Job API Functions =============

// Get all jobs
export const getAllJobsAPI = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `${JOB_API_URL}?${params}` : JOB_API_URL;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get job by ID
export const getJobByIdAPI = async (jobId) => {
  try {
    const response = await axios.get(`${JOB_API_URL}/${jobId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create job (company only)
export const createJobAPI = async (jobData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(JOB_API_URL, jobData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update job (company owner or admin)
export const updateJobAPI = async (jobId, jobData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`${JOB_API_URL}/${jobId}`, jobData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete job (company owner or admin)
export const deleteJobAPI = async (jobId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(`${JOB_API_URL}/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get my jobs (logged in company)
export const getMyJobsAPI = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${JOB_API_URL}/my/jobs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============= Post API Functions =============

const POST_API_URL = "http://localhost:5000/api/posts";

// Get all posts
export const getAllPostsAPI = async () => {
  try {
    const response = await axios.get(POST_API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get my posts
export const getMyPostsAPI = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${POST_API_URL}/my/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create post
export const createPostAPI = async (postData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(POST_API_URL, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete post
export const deletePostAPI = async (postId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(`${POST_API_URL}/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Like/unlike post
export const likePostAPI = async (postId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${POST_API_URL}/${postId}/like`, {}, {
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
    const response = await axios.post(`${POST_API_URL}/${postId}/comment`, { text }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============= Home Page API Functions =============

// Get featured companies
export const getFeaturedCompaniesAPI = async (limit = 6) => {
  try {
    const response = await axios.get(`${API_URL}/featured-companies?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get posts by company ID
export const getPostsByCompanyAPI = async (companyId) => {
  try {
    const response = await axios.get(`${POST_API_URL}/company/${companyId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get company profile by ID (public)
export const getCompanyProfileAPI = async (companyId) => {
  try {
    const response = await axios.get(`${API_URL}/company/${companyId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
