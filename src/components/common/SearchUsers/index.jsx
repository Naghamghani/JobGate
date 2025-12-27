import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";


export default function SearchUsers({ setIsSearch, setSearchInput }) {
  return (
    <div className="flex items-center w-2/5 ml-4 relative">
      <input
        placeholder="Search Users.."
        className="w-full h-8 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 px-3 text-sm outline-none focus:border-gray-500 font-['Inter']"
        onChange={(event) => setSearchInput(event.target.value)}
      />

      <AiOutlineCloseCircle
        className="text-gray-500 cursor-pointer absolute right-2"
        size={20}
        onClick={() => {
          setIsSearch(false);
          setSearchInput("");
        }}
      />
    </div>
  );
}
