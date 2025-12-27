import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../api/AuthAPI';
import { toast } from 'react-toastify';
import { AiOutlineCamera, AiOutlineClose } from 'react-icons/ai';

export default function ProfileComponent() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [saving, setSaving] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setProfileData(profile);
        setAboutText(profile.headline || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveAbout = async () => {
    try {
      setSaving(true);
      await updateUserProfile({ headline: aboutText });
      setProfileData({ ...profileData, headline: aboutText });
      setIsEditingAbout(false);
      toast.success('About section updated successfully');
      setSaving(false);
    } catch (error) {
      console.error('Error updating about:', error);
      toast.error('Failed to update about section');
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setAboutText(profileData.headline || '');
    setIsEditingAbout(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }

    try {
      setUploadingImage(true);

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await updateUserProfile({ imageLink: reader.result });
          setProfileData({ ...profileData, imageLink: reader.result });
          setShowImageModal(false);
          setSelectedImage(null);
          setImagePreview(null);
          toast.success('Profile picture updated successfully');
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error('Failed to update profile picture');
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to update profile picture');
      setUploadingImage(false);
    }
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a66c2] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">No profile data found</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-[#0a66c2] text-white rounded-lg hover:bg-[#004182]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Get first letter for avatar
  const avatarLetter = profileData.name?.charAt(0).toUpperCase() || 'U';

  const handleDownloadCV = () => {
    if (profileData.cvFileName) {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = profileData.cvFileName; // This should be the actual file URL
      link.download = profileData.cvFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('CV download started');
    } else {
      toast.error('No CV file available');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Profile Image with Camera Icon */}
            <div className="relative group">
              {profileData.imageLink ? (
                <img
                  src={profileData.imageLink}
                  alt={profileData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#0a66c2]"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] flex items-center justify-center border-4 border-[#0a66c2] shadow-lg">
                  <span className="text-white text-5xl font-bold">{avatarLetter}</span>
                </div>
              )}
              {/* Camera Icon Overlay */}
              <button
                onClick={() => setShowImageModal(true)}
                className="absolute bottom-0 right-0 bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full p-3 shadow-lg transition-all duration-200 transform hover:scale-110"
                title="Change profile picture"
              >
                <AiOutlineCamera className="text-xl" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
              <p className="text-lg text-gray-600 mt-1">{profileData.headline || 'Professional'}</p>
              <p className="text-sm text-gray-500 mt-2">{profileData.email}</p>
              <div className="mt-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
                  {profileData.role === 'candidate' ? 'Job Seeker' : profileData.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Change Profile Picture</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <AiOutlineClose className="text-2xl" />
                </button>
              </div>

              {/* Image Preview */}
              <div className="mb-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <AiOutlineCamera className="text-6xl text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No image selected</p>
                    </div>
                  </div>
                )}
              </div>

              {/* File Input */}
              <div className="mb-4">
                <label className="block w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="imageInput"
                  />
                  <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-[#0a66c2] hover:bg-blue-50 transition-all">
                    <p className="text-gray-600">Click to select an image</p>
                    <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={uploadingImage}
                >
                  Cancel
                </button>
                <button
                  onClick={handleImageUpload}
                  disabled={!selectedImage || uploadingImage}
                  className="flex-1 px-4 py-2 bg-[#0a66c2] text-white rounded-lg hover:bg-[#004182] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profileData.name || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profileData.email || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                type="text"
                value={profileData.userID || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={profileData.role || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* CV Information */}
        {profileData.cvFileName && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">CV / Resume</h2>
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{profileData.cvFileName}</p>
                <p className="text-sm text-gray-600">Uploaded CV/Resume</p>
              </div>
              <button
                onClick={handleDownloadCV}
                className="px-4 py-2 bg-[#0a66c2] text-white rounded-lg hover:bg-[#004182] transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        )}

        {/* About Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">About</h2>
            {!isEditingAbout && (
              <button
                onClick={() => setIsEditingAbout(true)}
                className="px-4 py-2 text-[#0a66c2] border border-[#0a66c2] rounded-lg hover:bg-blue-50 transition-colors"
              >
                Edit
              </button>
            )}
          </div>
          {isEditingAbout ? (
            <div>
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSaveAbout}
                  disabled={saving}
                  className="px-6 py-2 bg-[#0a66c2] text-white rounded-lg hover:bg-[#004182] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">
              {profileData.headline || 'No description provided'}
            </p>
          )}
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <input
                type="text"
                value={profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'N/A'}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
              <input
                type="text"
                value={profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString() : 'N/A'}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
