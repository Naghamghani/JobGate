import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { editProfile } from "../../../api/FirestoreAPI";

export default function ProfileEdit({ onEdit, currentUser }) {
  const [editInputs, setEditInputs] = useState(currentUser);
  const getInput = (event) => {
    let { name, value } = event.target;
    let input = { [name]: value };
    setEditInputs({ ...editInputs, ...input });
  };

  const updateProfileData = async () => {
    await editProfile(currentUser?.id, editInputs);
    await onEdit();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 m-4 md:m-8 relative font-['Inter']">
      <div className="absolute right-6 top-6">
        <AiOutlineClose className="cursor-pointer text-gray-600 hover:text-black transition-colors" onClick={onEdit} size={25} />
      </div>

      <div className="grid grid-cols-1 gap-5 mt-10">
        <label className="font-medium text-gray-700 -mb-3">Name</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="Name"
          name="name"
          value={editInputs.name}
        />
        <label className="font-medium text-gray-700 -mb-3">Headline</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="Headline"
          value={editInputs.headline}
          name="headline"
        />
        <label className="font-medium text-gray-700 -mb-3">Country</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="Country"
          name="country"
          value={editInputs.country}
        />
        <label className="font-medium text-gray-700 -mb-3">City</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="City"
          name="city"
          value={editInputs.city}
        />
        <label className="font-medium text-gray-700 -mb-3">Company</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="Company"
          value={editInputs.company}
          name="company"
        />
        <label className="font-medium text-gray-700 -mb-3">Industry </label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="Industry"
          name="industry"
          value={editInputs.industry}
        />
        <label className="font-medium text-gray-700 -mb-3">College</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="College"
          name="college"
          value={editInputs.college}
        />
        <label className="font-medium text-gray-700 -mb-3">Website</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="Website"
          name="website"
          value={editInputs.website}
        />
        <label className="font-medium text-gray-700 -mb-3">About</label>
        <textarea
          placeholder="About Me"
          className="common-textArea"
          onChange={getInput}
          rows={5}
          name="aboutMe"
          value={editInputs.aboutMe}
        />
        <label className="font-medium text-gray-700 -mb-3">Skills</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="Skill"
          name="skills"
          value={editInputs.skills}
        />
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="bg-[#0073b1] text-white rounded-full px-12 py-3 font-semibold text-lg hover:bg-[#004c75] transition-colors"
          onClick={updateProfileData}
        >
          Save
        </button>
      </div>
    </div>
  );
}
