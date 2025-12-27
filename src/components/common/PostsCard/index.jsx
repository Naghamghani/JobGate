import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import { BsPencil, BsTrash } from "react-icons/bs";
import {
  getCurrentUser,
  getAllUsers,
  deletePost,
  getConnections,
} from "../../../api/FirestoreAPI";
import LikeButton from "../LikeButton";


export default function PostsCard({ posts, id, getEditData }) {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [imageModal, setImageModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  useMemo(() => {
    getCurrentUser(setCurrentUser);
    getAllUsers(setAllUsers);
  }, []);

  useEffect(() => {
    getConnections(currentUser.id, posts.userID, setIsConnected);
  }, [currentUser.id, posts.userID]);

  return isConnected || currentUser.id === posts.userID ? (
    <div className="w-full max-w-[550px] bg-white mt-6 border border-gray-200 rounded-lg flex flex-col pb-4 shadow-sm" key={id}>
      <div className="flex p-4 gap-3 relative">
        {currentUser.id === posts.userID ? (
          <div className="absolute right-4 top-4 flex gap-2">
            <BsPencil
              size={20}
              className="text-gray-600 p-1 cursor-pointer hover:text-black hover:bg-gray-100 rounded-full transition-colors w-8 h-8"
              onClick={() => getEditData(posts)}
            />
            <BsTrash
              size={20}
              className="text-gray-600 p-1 cursor-pointer hover:text-black hover:bg-gray-100 rounded-full transition-colors w-8 h-8"
              onClick={() => deletePost(posts.id)}
            />
          </div>
        ) : (
          <></>
        )}

        <img
          alt="profile-image"
          className="w-12 h-12 rounded-full object-cover cursor-pointer"
          src={
            allUsers
              .filter((item) => item.id === posts.userID)
              .map((item) => item.imageLink)[0]
          }
          onClick={() =>
            navigate("/profile", {
              state: { id: posts?.userID, email: posts.userEmail },
            })
          }
        />
        <div className="flex flex-col">
          <p
            className="font-semibold text-sm text-gray-900 cursor-pointer hover:underline hover:text-[#0073b1]"
            onClick={() =>
              navigate("/profile", {
                state: { id: posts?.userID, email: posts.userEmail },
              })
            }
          >
            {allUsers.filter((user) => user.id === posts.userID)[0]?.name}
          </p>
          <p className="text-xs text-gray-500">
            {allUsers.filter((user) => user.id === posts.userID)[0]?.headline}
          </p>
          <p className="text-xs text-gray-400 mt-1">{posts.timeStamp}</p>
        </div>
      </div>

      <p
        className="text-left mx-4 mt-1 mb-3 text-sm text-gray-800 whitespace-pre-wrap font-['Inter']"
        dangerouslySetInnerHTML={{ __html: posts.status }}
      ></p>

      {posts.postImage ? (
        <img
          onClick={() => setImageModal(true)}
          src={posts.postImage}
          className="w-full object-cover cursor-pointer"
          alt="post-image"
        />
      ) : (
        <></>
      )}

      <LikeButton
        userId={currentUser?.id}
        postId={posts.id}
        currentUser={currentUser}
      />

      <Modal
        centered
        open={imageModal}
        onOk={() => setImageModal(false)}
        onCancel={() => setImageModal(false)}
        footer={[]}
        width={800}
      >
        <img
          onClick={() => setImageModal(true)}
          src={posts.postImage}
          className="w-full max-h-[80vh] object-contain rounded"
          alt="post-image"
        />
      </Modal>
    </div>
  ) : (
    <></>
  );
}
