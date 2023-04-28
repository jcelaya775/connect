import React, { useState } from "react";
import ExitBtn from "./exit-button";

type Post = {
  id: number;
  image: string;
  comments: Comment[];
};

type Comment = {
  id: number;
  text: string;
};

type PostModalProps = {
  post: Post;
  onClose: () => void;
};

export const CommentModal: React.FC<PostModalProps> = ({ post, onClose }) => {
  const [comment, setComment] = useState("");

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add comment logic here
    setComment("");
  };

  return (
    <>
    <input type="checkbox" id="comment-modal" className="modal-toggle" />

    <div className="modal">
        <div className="modal-box rounded-lg">
        <div className="modal-action">
              <label
                htmlFor="comment-modal"
                className="btn btn-sm btn-ghost absolute top-2 right-2 gap-2 py-0 px-5 normal-case"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </label>
          </div>
        <img src={post.image} alt={`Post ${post.id}`} />
        <div className="mt-4 mb-8">
          {/* {post.comments.map((comment) => (
            <Comment key={comment.id} text={comment.text} />
          ))} */}
        </div>
        <form onSubmit={handleCommentSubmit}>
          <div className="relative mb-4">
            <textarea
              className="textarea h-24 w-full pr-10"
              placeholder="Write a comment"
              value={comment}
              onChange={handleCommentChange}
            />
            <button
              className="btn btn-primary absolute right-2 top-2"
              type="submit"
            >
              Comment
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default CommentModal;