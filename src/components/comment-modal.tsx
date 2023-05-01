import { useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import cityscape from "@/images/Cityscape.jpg";
import Image from "next/image";
import { platformTypes } from "@/types/platform";
import usePost from "@/hooks/usePost";

type CommentModalProps = {
  postId: string;
  platform: platformTypes;
  setVisible: (visible: boolean) => void;
};

export const CommentModal: React.FC<CommentModalProps> = ({
  postId,
  platform,
  setVisible,
}: CommentModalProps) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const { post, postLoading, comments, commentsLoading, postCommentMutation } =
    usePost({
      postId,
      platform,
    });

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if ((e.target as Element)?.classList.contains("modal")) {
        setVisible(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  });

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    postCommentMutation.mutate({ content: comment });

    // Add comment logic here
    setComment("");
  };

  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => {
        if (count === 100) {
          return 0;
        }
        return count + 1;
      });
    }, 5);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <input type="checkbox" id="comment-modal" className="modal-toggle" />

      <div className="modal">
        <div className="modal-box rounded-lg h-max">
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
                  <Link href="#">{post?.username}</Link>
                </div>
                <div className="text-base-content text-opacity-80">
                  {post?.main_platform ?? "Facebook"}
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
                  className="textarea h-24 w-full resize-none bg-base-200 border-base-200 border-solid"
                  placeholder="Write a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="modal-action">
                  <label
                    htmlFor="comment-modal"
                    className="btn btn-sm btn-ghost gap-2 py-0 px-5 normal-case"
                    onClick={() => setVisible(false)}
                  >
                    Cancel
                  </label>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary gap-2 py-0 px-5 normal-case"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Add Comment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentModal;
