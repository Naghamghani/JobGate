import React, { useState, useMemo } from "react";
import { postStatus, getStatus, updatePost } from "../../../api/FirestoreAPI";
import { getCurrentTimeStamp } from "../../../helpers/useMoment";
import ModalComponent from "../Modal";
import { uploadPostImage } from "../../../api/ImageUpload";
import { getUniqueID } from "../../../helpers/getUniqueId";
import PostsCard from "../PostsCard";
export default function PostStatus({ currentUser }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [allStatuses, setAllStatus] = useState([]);
  const [currentPost, setCurrentPost] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [postImage, setPostImage] = useState("");

  const sendStatus = async () => {
    let object = {
      status: status,
      timeStamp: getCurrentTimeStamp("LLL"),
      userEmail: currentUser.email,
      userName: currentUser.name,
      postID: getUniqueID(),
      userID: currentUser.id,
      postImage: postImage,
    };
    await postStatus(object);
    await setModalOpen(false);
    setIsEdit(false);
    await setStatus("");
  };

  const getEditData = (posts) => {
    setModalOpen(true);
    setStatus(posts?.status);
    setCurrentPost(posts);
    setIsEdit(true);
  };

  const updateStatus = () => {
    updatePost(currentPost.id, status, postImage);
    setModalOpen(false);
  };

  useMemo(() => {
    getStatus(setAllStatus);
  }, []);

  return (
    <div className="flex flex-col items-center relative w-full max-w-[550px] space-y-4">
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center pb-4 overflow-visible mt-10">
        <div className="relative w-full h-16 bg-[#a0b4b7] rounded-t-lg"></div>
        <img
          src={currentUser?.imageLink}
          alt="imageLink"
          className="w-20 h-20 object-cover rounded-full border-2 border-white -mt-10 bg-white"
        />
        <p className="font-bold text-lg mt-3 text-gray-900">{currentUser?.name}</p>
        <p className="text-sm text-gray-500 text-center px-4">{currentUser?.headline}</p>
      </div>

      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-4">
        <img
          className="w-12 h-12 object-cover rounded-full"
          src={currentUser?.imageLink}
          alt="imageLink"
        />
        <button
          className="flex-1 text-left pl-4 h-12 rounded-full border border-gray-400 bg-white text-gray-600 font-semibold text-sm hover:bg-gray-100 transition-colors"
          onClick={() => {
            setModalOpen(true);
            setIsEdit(false);
          }}
        >
          Start a Post
        </button>
      </div>

      <ModalComponent
        setStatus={setStatus}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        status={status}
        sendStatus={sendStatus}
        isEdit={isEdit}
        updateStatus={updateStatus}
        uploadPostImage={uploadPostImage}
        postImage={postImage}
        setPostImage={setPostImage}
        setCurrentPost={setCurrentPost}
        currentPost={currentPost}
      />

      <div className="w-full space-y-4">
        {allStatuses.map((posts) => {
          return (
            <div key={posts.id}>
              <PostsCard posts={posts} getEditData={getEditData} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
