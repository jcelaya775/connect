import useUser from "@/hooks/useUser";
import { Data as ConnectData } from "@/pages/api/platforms/connect/posts/[pid]/likes";
import { Data as FacebookData } from "@/pages/api/platforms/facebook/posts/[pid]/likes";
import { platformTypes } from "@/types/platform";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

type LikeButtonProps = {
  postId: string;
  platform: platformTypes;
};

export default function LikeButton({ postId, platform }: LikeButtonProps) {
  const queryClient = useQueryClient();

  let queryKey: string[] = ["posts", postId, "likes", "hasLiked"];
  let queryFn: () => Promise<boolean>;
  let mutationFn;

  switch (platform) {
    case platformTypes.facebook:
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
  });

  const likeMutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", postId, "likes", "hasLiked"]);
      queryClient.invalidateQueries(["posts", postId, "likes", "count"]);
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
            {hasLiked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
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
