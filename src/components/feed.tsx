import { useState } from "react";
import useUser from "@/hooks/useUser";
import SideNav from "./SideNav";
import axios from "axios";
import Post, { PostProps } from "./post";
import CreatePostModal from "./create-post-modal";
import BtmNav from "./bottom-nav";
import { platformTypes } from "@/types/platform";
import { useQuery } from "@tanstack/react-query";
import { IConnectPost } from "@/models/Post";
import { GenericPost, IFacebookPost } from "@/types/post";
import CommentModal from "./comment-modal";
import UserFeed from "./user-feed";

export const Feed = () => {
  const { user, userLoading } = useUser();
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", "feed"],
    queryFn: async () => {
      const {
        data: { posts },
      } = await axios.get("/api/feed");

      return posts;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    const errorMessage = (error as Error).message;
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <>
      {createPostModalVisible && (
        <CreatePostModal
          newPost={true}
          setVisible={setCreatePostModalVisible}
        />
      )}
      <div className="min-h-screen min-w-full bg-base-200 pt-16 pb-8">
        <span className="hidden sm:block horz:hidden">
          <SideNav />
        </span>
        <span className="sm:hidden horz:block">
          <BtmNav />
        </span>
        {/* Main Content Area */}
        <div className="flex-1 bg-base-200 min-h-screen pr-8 pt-6 pl-8 sm:pl-24 w-full lg:pl-48 xl:pr-0 horz:pl-8">
          <div className="flex flex-row gap-x-10">
            <div className="flex-initial w-full xl:w-3/4">
              <div className="flex flex-col w-full gap-5">
                {/* Header for Main Feed and Post button */}
                <div className="card w-full bg-base-100 shadow-xl">
                  <div className="card-body p-4 flex-row justify-between">
                    <div className="card-title">Newsfeed</div>
                    <div className="card-actions justify-end">
                      <label
                        htmlFor="create-post"
                        className="btn btn-sm btn-primary gap-2 py-0 px-5 normal-case"
                        onClick={() =>
                          setCreatePostModalVisible((prev) => !prev)
                        }
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
                        Create Post
                      </label>
                    </div>
                  </div>
                </div>
                <UserFeed />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feed;
function displayFile(
  selectorFiles: any,
  FileList: { new (): FileList; prototype: FileList }
) {
  throw new Error("Function not implemented.");
}
