import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditPostModal from "./edit-post-modal";
import axios from "axios";
import { platformTypes } from "@/types/platform";
import { platform } from "os";
import { IPost } from "@/models/Post";

type OptionsDropdownProps = {
  postId: string;
  facebookId: string;
  instagramId: string;
  platforms: platformTypes[];
  content: IPost["content"];
};

const OptionsDropdown = ({
  postId,
  facebookId,
  instagramId,
  platforms,
  content,
}: OptionsDropdownProps) => {
  const queryClient = useQueryClient();
  const [editModalVisible, setEditModalVisible] = useState(false);

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      let success: any = {};

      for (const platform of platforms) {
        switch (platform) {
          case platformTypes.facebook:
            const { data: facebookData } = await axios.delete(
              `/api/platforms/facebook/posts/${facebookId}`
            );
            if (facebookData.error) {
              success.facebook = false;
              console.error(facebookData.error);
            } else success.facebook = true;
            break;
          default: // connect
            const { data: connectData } = await axios.delete(
              `/api/posts/${postId}`
            );
            if (connectData.error) {
              success.connect = false;
              console.error(connectData.error);
            } else success.connect = true;
            break;
        }
      }

      return success;
    },
    onSuccess: () => {
      for (const platform of platforms) {
        switch (platform) {
          case platformTypes.facebook:
            queryClient.invalidateQueries(["posts"]);
            break;
          default: // connect
            queryClient.invalidateQueries(["posts"]);
            break;
        }
      }
    },
  });

  return (
    <>
      {editModalVisible && (
        <EditPostModal
          postId={postId}
          facebookId={facebookId}
          instagramId={instagramId}
          platforms={platforms}
          content={content}
          setVisible={setEditModalVisible}
        />
      )}
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path
              fillRule="evenodd"
              d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <label
              htmlFor="edit-post-modal"
              onClick={() => setEditModalVisible((prev) => !prev)}
            >
              Edit
            </label>
          </li>

          <li>
            <a onClick={() => deletePostMutation.mutate()}>Delete</a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default OptionsDropdown;
