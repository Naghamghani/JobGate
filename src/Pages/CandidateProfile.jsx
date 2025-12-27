import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../api/AuthAPI';
import { toast } from 'react-toastify';

export default function CandidateProfilePage() {
    const [candidateData, setCandidateData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidateProfile = async () => {
            try {
                const profile = await getUserProfile();
                setCandidateData(profile);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching candidate profile:', error);
                toast.error('Failed to load profile');
                setLoading(false);
            }
        };

        fetchCandidateProfile();
    }, []);

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

    if (!candidateData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">No profile data found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-start gap-6">
                        <img
                            src={candidateData.imageLink || 'https://via.placeholder.com/150'}
                            alt={candidateData.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-[#0a66c2]"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{candidateData.name}</h1>
                            <p className="text-lg text-gray-600 mt-1">{candidateData.headline || 'Professional'}</p>
                            <p className="text-sm text-gray-500 mt-2">{candidateData.email}</p>
                            <div className="mt-4">
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
                                    {candidateData.role === 'candidate' ? 'Job Seeker' : candidateData.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={candidateData.name || ''}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={candidateData.email || ''}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                            <input
                                type="text"
                                value={candidateData.userID || ''}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <input
                                type="text"
                                value={candidateData.role || ''}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                {/* CV Information */}
                {candidateData.cvFileName && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">CV / Resume</h2>
                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex-shrink-0">
                                <svg className="w-12 h-12 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">{candidateData.cvFileName}</p>
                                <p className="text-sm text-gray-600">Uploaded CV/Resume</p>
                            </div>
                            <button className="px-4 py-2 bg-[#0a66c2] text-white rounded-lg hover:bg-[#004182] transition-colors">
                                Download
                            </button>
                        </div>
                    </div>
                )}

                {/* About Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                    <textarea
                        value={candidateData.headline || 'No description provided'}
                        readOnly
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                </div>

                {/* Account Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                            <input
                                type="text"
                                value={candidateData.createdAt ? new Date(candidateData.createdAt).toLocaleDateString() : 'N/A'}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                            <input
                                type="text"
                                value={candidateData.updatedAt ? new Date(candidateData.updatedAt).toLocaleDateString() : 'N/A'}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
