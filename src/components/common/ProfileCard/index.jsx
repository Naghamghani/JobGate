import React, { useState, useMemo } from "react";
import { getSingleStatus, getSingleUser } from "../../../api/FirestoreAPI";
import PostsCard from "../PostsCard";
import { HiOutlinePencil } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import FileUploadModal from "../FileUploadModal";
import { uploadImage as uploadImageAPI } from "../../../api/ImageUpload";


export default function ProfileCard({ onEdit, currentUser }) {
  let location = useLocation();
  const [allStatuses, setAllStatus] = useState([]);
  const [currentProfile, setCurrentProfile] = useState({});
  const [currentImage, setCurrentImage] = useState({});
  const [progress, setProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const getImage = (event) => {
    setCurrentImage(event.target.files[0]);
  };
  console.log(currentProfile);
  const uploadImage = () => {
    uploadImageAPI(
      currentImage,
      currentUser.id,
      setModalOpen,
      setProgress,
      setCurrentImage
    );
  };

  useMemo(() => {
    if (location?.state?.id) {
      getSingleStatus(setAllStatus, location?.state?.id);
    }

    if (location?.state?.email) {
      getSingleUser(setCurrentProfile, location?.state?.email);
    }
  }, []);

  const profileData = Object.values(currentProfile).length === 0 ? currentUser : currentProfile;

  return (
    <>
      <FileUploadModal
        getImage={getImage}
        uploadImage={uploadImage}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        currentImage={currentImage}
        progress={progress}
      />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 m-4 md:m-8 relative font-['Inter']">
        {currentUser.id === location?.state?.id ? (
          <div className="absolute right-6 top-6">
            <HiOutlinePencil
              className="w-10 h-10 p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              onClick={onEdit}
            />
          </div>
        ) : (
          <></>
        )}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex flex-col">
            <img
              className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-full border-4 border-white shadow-sm cursor-pointer hover:opacity-90 active:scale-95 transition-all"
              onClick={() => setModalOpen(true)}
              src={profileData?.imageLink}
              alt="profile-image"
            />
            <h3 className="text-2xl font-bold mt-4 text-gray-900">
              {profileData?.name}
            </h3>
            <p className="text-base text-gray-900 mt-1 max-w-sm">
              {profileData?.headline}
            </p>
            {(profileData?.city || profileData?.country) && (
              <p className="text-gray-500 text-sm mt-1">
                {profileData?.city}, {profileData?.country}
              </p>
            )}
            {profileData?.website && (
              <a
                className="text-[#0073b1] font-semibold text-sm mt-2 hover:underline"
                target="_blank"
                href={profileData.website}
                rel="noreferrer"
              >
                {profileData.website}
              </a>
            )}
          </div>

          <div className="flex flex-col mt-4 md:mt-8 md:mr-10 gap-2">
            <p className="text-gray-900 font-semibold text-sm">
              {profileData?.college}
            </p>
            <p className="text-gray-900 font-semibold text-sm">
              {profileData?.company}
            </p>
          </div>
        </div>

        <p className="mt-6 text-gray-900 whitespace-pre-wrap leading-relaxed">
          {profileData?.aboutMe}
        </p>

        {profileData?.skills && (
          <p className="mt-4 border-t pt-4 text-gray-900">
            <span className="font-bold">Skills</span>:&nbsp;
            {profileData?.skills}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center space-y-4 pb-10">
        {allStatuses?.map((posts) => {
          return (
            <div key={posts.id}>
              <PostsCard posts={posts} />
            </div>
          );
        })}
      </div>
    </>
  );
}
