import { useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { platformTypes } from "@/types/platform";
import usePost from "@/hooks/usePost";
import useUser from "@/hooks/useUser";

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
  const { user } = useUser();
  const [comment, setComment] = useState("");
  const {
    post,
    postLoading,
    comments,
    postCommentMutation,
    deleteCommentMutation,
  } = usePost({
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
            <div className="flex-1 my-2 w-full">
              {postLoading ? (
                <progress
                  className="progress progress-primary w-full"
                  value={count}
                  max="100"
                ></progress>
              ) : (
                post?.content?.body ?? post?.message ?? ""
              )}
            </div>
            <div className="basis-1/6">
              {(post?.content?.image || post?.full_picture) && (
                <Image
                  className="w-full h-full"
                  priority
                  width={800}
                  height={800}
                  src={post?.content?.image.signedUrl ?? post?.full_picture}
                  alt="post image"
                  unoptimized
                />
              )}
            </div>
            <div className="divider basis-full"></div>
            <div className="basis-full w-full">
              <h2 className="text-md mb-4">Comments</h2>
              <div className="flex flex-col gap-y-4 w-full max-h-40 overflow-y-scroll scrollbar-width mb-4">
                {comments &&
                  comments.map((comment: any) => (
                    <>
                      <div className="card compact card-side w-full bg-base-200 shadow-lg">
                        <div className="card-body p-3 flex-row items-start">
                          <div className="flex-none">
                            <div className="card-title">
                              <h3 className="text-sm">
                                {comment.name ?? comment.from.name}
                              </h3>
                            </div>
                          </div>
                          <div className="flex-1">
                            {comment.content ?? comment.message}
                          </div>
                          {(user?._id === comment.user_id ||
                            platform === platformTypes.facebook) && (
                            <button
                              onClick={() =>
                                deleteCommentMutation.mutate({
                                  commentId: comment._id ?? comment.id,
                                })
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="text-error w-5 h-5"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  ))}
              </div>
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
