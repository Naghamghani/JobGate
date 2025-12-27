import React, { useMemo, useState } from "react";
import {
  likePost,
  getLikesByUser,
  postComment,
  getComments,
} from "../../../api/FirestoreAPI";
import { getCurrentTimeStamp } from "../../../helpers/useMoment";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { BsFillHandThumbsUpFill, BsHandThumbsUp } from "react-icons/bs";

export default function LikeButton({ userId, postId, currentUser }) {
  const [likesCount, setLikesCount] = useState(0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const handleLike = () => {
    likePost(userId, postId, liked);
  };
  const getComment = (event) => {
    setComment(event.target.value);
  };

  const addComment = () => {
    postComment(postId, comment, getCurrentTimeStamp("LLL"), currentUser?.name);
    setComment("");
  };
  useMemo(() => {
    getLikesByUser(userId, postId, setLiked, setLikesCount);
    getComments(postId, setComments);
  }, [userId, postId]);

  return (
    <div className="flex flex-col gap-1.5 p-2.5 cursor-default mb-0 font-['Inter']">
      <p className="text-sm text-gray-600 ml-1.5">{likesCount} People Like this Post</p>
      <div className="mt-1 border-t border-gray-300"></div>

      <div className="flex gap-4 mt-1">
        <div
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
          onClick={handleLike}
        >
          {liked ? (
            <BsFillHandThumbsUpFill size={24} color="#0a66c2" />
          ) : (
            <BsHandThumbsUp size={24} className="text-gray-600" />
          )}

          <p className={`font-semibold text-sm ${liked ? "text-[#0a66c2]" : "text-gray-600"}`}>Like</p>
        </div>
        <div
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
          onClick={() => setShowCommentBox(!showCommentBox)}
        >
          <AiOutlineComment
            size={24}
            color={showCommentBox ? "#0a66c2" : "#4b4b4b"}
          />

          <p className={`font-semibold text-sm ${showCommentBox ? "text-[#0a66c2]" : "text-gray-600"}`}>Comments</p>
        </div>
      </div>

      {showCommentBox && (
        <>
          <input
            onChange={getComment}
            placeholder="Add a Comment"
            className="h-10 bg-gray-100 pl-4 rounded-full border border-gray-400 text-gray-800 text-sm focus:outline-none focus:border-gray-600 focus:bg-white w-full mt-2"
            name="comment"
            value={comment}
          />
          <button
            className="w-36 h-8 bg-[#0a66c2] text-white rounded-full text-sm font-semibold hover:bg-[#004182] transition-colors mt-3 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={addComment}
            disabled={!comment.trim()}
          >
            Add Comment
          </button>

          {comments.length > 0 && comments.map((comment) => (
            <div className="bg-gray-100 rounded-lg p-3 m-2 relative" key={comment.id || Math.random()}>
              <p className="font-semibold text-sm text-gray-900">{comment.name}</p>
              <p className="text-sm text-gray-800 mt-1">{comment.comment}</p>
              <p className="text-xs text-gray-500 absolute right-3 top-3">{comment.timeStamp}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
