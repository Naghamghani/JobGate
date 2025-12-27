
import { toast } from "react-toastify";

// All imports from firebase/firestore REMOVED

export const postStatus = (object) => {
  console.log("postStatus called", object);
  // TODO: POST /posts
  toast.success("Post has been added successfully (MOCK)");
};

export const getStatus = (setAllStatus) => {
  console.log("getStatus called");
  // TODO: GET /posts
  setAllStatus([]);
};

export const getAllUsers = (setAllUsers) => {
  console.log("getAllUsers called");
  // TODO: GET /users
  setAllUsers([]);
};

export const getSingleStatus = (setAllStatus, id) => {
  console.log("getSingleStatus called", id);
  setAllStatus([]);
};

export const getSingleUser = (setCurrentUser, email) => {
  console.log("getSingleUser called", email);
  // TODO: GET /users?email=...
};

export const postUserData = (object) => {
  console.log("postUserData called", object);
  // TODO: POST /users (Register extra data)
};

export const getCurrentUser = (setCurrentUser) => {
  console.log("getCurrentUser called");
  // TODO: Get current user from token/backend
};

export const editProfile = (userID, payload) => {
  console.log("editProfile called", userID, payload);
  // TODO: PUT /users/:id
  toast.success("Profile has been updated successfully (MOCK)");
};

export const likePost = (userId, postId, liked) => {
  console.log("likePost called", userId, postId, liked);
};

export const getLikesByUser = (userId, postId, setLiked, setLikesCount) => {
  console.log("getLikesByUser called", userId, postId);
  setLikesCount(0);
  setLiked(false);
};

export const postComment = (postId, comment, timeStamp, name) => {
  console.log("postComment called", postId, comment);
};

export const getComments = (postId, setComments) => {
  console.log("getComments called", postId);
  setComments([]);
};

export const updatePost = (id, status, postImage) => {
  console.log("updatePost called", id);
};

export const deletePost = (id) => {
  console.log("deletePost called", id);
};

export const addConnection = (userId, targetId) => {
  console.log("addConnection called", userId, targetId);
};

export const getConnections = (userId, targetId, setIsConnected) => {
  console.log("getConnections called");
  setIsConnected(false);
};
