import useUser from "@/hooks/useUser";
import { IConnectPost } from "@/models/Post";
import { Data as ConnectData } from "@/pages/api/platforms/connect/posts/[pid]/likes";
import { Data as FacebookData } from "@/pages/api/platforms/facebook/posts/[pid]/likes";
import { platformTypes } from "@/types/platform";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ObjectId } from "mongoose";

type LikeButtonProps = {
  postId: string;
  platform: platformTypes;
};

export default function LikeButton({ postId, platform }: LikeButtonProps) {
  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useUser();

  let queryKey: string[];
  let queryFn: () => Promise<boolean>;
  let mutationFn;

  switch (platform) {
    case platformTypes.facebook:
      queryKey = ["posts", postId, "likes", "hasLiked"];
      queryFn = async () => {
        const { data }: { data: FacebookData } = await axios.get(
          `/api/platforms/facebook/posts/${postId}/likes`
        );

        return data.hasLiked!;
      };
      mutationFn = async ({ dislike = false }: { dislike: boolean }) => {
        if (dislike)
          await axios.delete(`/api/platforms/facebook/posts/${postId}/likes`);
        else await axios.post(`/api/platforms/facebook/posts/${postId}/likes`);

        const { data: likeData } = await axios.get(
          `/api/platforms/facebook/posts/${postId}/likes`
        );

        return likeData;
      };
      break;
    default: // connect
      queryKey = ["posts", postId, "likes", "hasLiked"];
      queryFn = async () => {
        const { data }: { data: ConnectData } = await axios.get(
          `/api/platforms/connect/posts/${postId}/likes`
        );

        return data.hasLiked!;
      };
      mutationFn = async ({ dislike = false }: { dislike: boolean }) => {
        if (dislike)
          await axios.delete(`/api/platforms/connect/posts/${postId}/likes`);
        else await axios.post(`/api/platforms/connect/posts/${postId}/likes`);

        const { data: likeData } = await axios.get(
          `/api/platforms/connect/posts/${postId}/likes`
        );

        return likeData;
      };
      break;
  }

  const { data: hasLiked, isLoading } = useQuery({
    queryKey,
    queryFn,
    enabled: !userLoading,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    retryDelay(failureCount, error) {
      if (failureCount < 3) return 1000 * 60 * 1;
      else return 1000 * 60 * 5;
    },
  });

  const likeMutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey.slice(0, -1));
    },
  });

  const likeButton = (() => {
    switch (platform) {
      case platformTypes.connect:
        return (
          <button
            disabled={isLoading}
            onClick={() =>
              hasLiked
                ? likeMutation.mutate({ dislike: true })
                : likeMutation.mutate({ dislike: false })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={hasLiked ? "black" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        );
      case platformTypes.facebook:
        return (
          <button
            onClick={() =>
              hasLiked
                ? likeMutation.mutate({ dislike: true })
                : likeMutation.mutate({ dislike: false })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              id="like"
            >
              <path d="M21.3,10.08A3,3,0,0,0,19,9H14.44L15,7.57A4.13,4.13,0,0,0,11.11,2a1,1,0,0,0-.91.59L7.35,9H5a3,3,0,0,0-3,3v7a3,3,0,0,0,3,3H17.73a3,3,0,0,0,2.95-2.46l1.27-7A3,3,0,0,0,21.3,10.08ZM7,20H5a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H7Zm13-7.82-1.27,7a1,1,0,0,1-1,.82H9V10.21l2.72-6.12A2.11,2.11,0,0,1,13.1,6.87L12.57,8.3A2,2,0,0,0,14.44,11H19a1,1,0,0,1,.77.36A1,1,0,0,1,20,12.18Z"></path>
            </svg>
          </button>
        );
      case platformTypes.instagram:
        return (
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
          // TODO: Add TikTok icon
        );
    }
  })();

  return <div>{likeButton}</div>;
}
