import React, { useState } from "react";
import Link from 'next/link';
import cityscape from '@/images/Cityscape.jpg'
import Image from "next/image";

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

const comments = [
  {
    id: 1,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde laudantium enim ab doloremque quod velit",
  },
  {
    id: 2,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde laudantium enim ab doloremque quod velit",
  },
  {
    id: 3,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde laudantium enim ab doloremque quod velit",
  },
  {
    id: 4,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde laudantium enim ab doloremque quod velit",
  },
];

export const CommentModal: React.FC<PostModalProps> = ({ post, onClose }) => {
  const [comment, setComment] = useState("");

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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
          <form onSubmit={handleCommentSubmit}></form>
          <div className="flex flex-col w-full items-start gap-y-2 flex-wrap">
            <div className="flex-none">
              <div className="flex flex-row space-x-3">
                <div className="flex-none avatar">
                  <Link href="#">
                  <svg
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="flex-none w-content">
                <div className="card-title">
                  <Link href="#">User</Link>
                </div>
                <div className="text-base-content text-opacity-80">
                  Connect
                </div>
              </div>
            </div>
          <div className="flex-1">
            <p>This is my post...</p>
          </div>
          <img src={post.image} alt={`Post ${post.id}`} />
          <div className="mt-4 mb-8">
            {post.comments.map((comment) => (
              <Comment key={comment.id} text={comment.text} />
            ))}
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
            <div className="basis-full"></div>
            <div className="basis-full w-full">
            <form onSubmit={handleCommentSubmit}>
                <textarea
                  className="textarea h-24 w-full resize-none border-base-200 border-solid"
                  placeholder="Write a comment"
                  value={comment}
                  onChange={handleCommentChange}
                />
              <div className="btn btn-primary normal-case">Add Comment</div>
          </form>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentModal;
