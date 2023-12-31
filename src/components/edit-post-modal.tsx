import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { platformTypes } from "@/types/platform";
import { IConnectPost } from "@/models/Post";
import { GenericPost } from "@/types/post";

type EditPostModalProps = {
  postId: string;
  userId: string;
  facebookId: string;
  instagramId: string;
  platforms: platformTypes[];
  content: IConnectPost["content"];
  setVisible: (visible: boolean) => void;
};

const EditPostModal = ({
  postId,
  userId,
  facebookId,
  instagramId,
  platforms,
  content,
  setVisible,
}: EditPostModalProps) => {
  const queryClient = useQueryClient();

  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [description, setDescription] = useState(content.body);
  const [upload, setUpload] = useState("no file uploaded");

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

  function resetPost() {
    setDescription("");
    setUpload("no file uploaded");
  }

  const editPostMutation = useMutation({
    mutationFn: async () => {
      const updatedPost: GenericPost & any = {};

      const file: File | undefined = inputRef.current.files?.[0];
      let formData: FormData | undefined;
      if (file) {
        formData = new FormData();
        formData.append("file", file);
      }

      for (const platform of platforms) {
        switch (platform) {
          case platformTypes.connect:
            // Update content
            content.body = description;
            if (file) {
              const {
                data: { signedUrl, filename },
              } = await axios.put(
                `api/platforms/connect/posts/${postId}/image`,
                formData
              );

              content.image = { signedUrl, filename };
            }

            // Update post
            const { data: connectData } = await axios.put(
              `/api/platforms/connect/posts/${postId}`,
              {
                content,
              }
            );
            if (connectData.error) {
              updatedPost.connect = false;
              console.error(connectData.error);
            } else updatedPost.connect = connectData;
            break;
          case platformTypes.facebook:
            if (
              content.image &&
              !platforms.every(
                (platform: platformTypes) => platform === platformTypes.facebook
              )
            )
              break;

            const { data: facebookData } = await axios.put(
              `/api/platforms/facebook/posts/${facebookId}`,
              { message: description }
            );

            if (facebookData.error) {
              updatedPost.facebook = false;
              console.error(facebookData.error);
            } else updatedPost.facebook = facebookData;
            break;
        }
      }

      return updatedPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
      queryClient.invalidateQueries(["posts"]);
      setVisible(false);
    },
  });

  return (
    <>
      <input type="checkbox" id="edit-post-modal" className="modal-toggle" />

      <div className="modal">
        <div className="modal-box rounded-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editPostMutation.mutate();
            }}
          >
            <h3 className="py-0 my-0 font-bold text-lg">Edit Post</h3>
            <div className="divider pb-3 my-0"></div>
            <div className="form-control">
              <textarea
                className="textarea textarea-borderd border rounded-lg border-gray-400 h-24 w-full resize-none"
                placeholder="Enter your description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex items-center justify-center w-full pt-5">
              <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-30 p-10 group text-center">
                <div className="h-full w-full text-center flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="pointer-hand text-gray-500 ">
                    <span className="text-sm">Upload</span> files here
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={inputRef}
                  onChange={(e) =>
                    e.target.value === ""
                      ? " "
                      : setUpload(inputRef.current.files?.[0].name!)
                  }
                />
              </label>
            </div>
            <p className="text-gray-500 text-sm py-2">File: {upload}</p>

            <div className="modal-action">
              <label
                htmlFor="edit-post-modal"
                className="btn btn-sm btn-ghost gap-2 py-0 px-5 normal-case"
                onClick={() => resetPost()}
              >
                Cancel
              </label>
              <button
                type="submit"
                className="btn btn-sm btn-primary gap-2 py-0 px-5 normal-case"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPostModal;
