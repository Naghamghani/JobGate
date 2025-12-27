
// import { storage } from "../firebaseConfig"; // REMOVED

export const uploadImage = (
  file,
  id,
  setModalOpen,
  setProgress,
  setCurrentImage
) => {
  console.log("uploadImage called", file.name);
  // TODO: Upload to backend
  setProgress(100);
  setModalOpen(false);
};

export const uploadPostImage = (file, setPostImage, setProgress) => {
  console.log("uploadPostImage called", file.name);
  // TODO: Upload to backend
  setProgress(100);
  setPostImage("http://via.placeholder.com/150");
};
