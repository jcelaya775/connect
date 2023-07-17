import { platformTypes } from "@/types/platform";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type usePostProps = {
  postId: string;
  platform: string;
};

export default function usePost({ postId, platform }: usePostProps) {
  const queryClient = useQueryClient();
  const url = process.env.NEXT_PUBLIC_URL;
  const queryKey = ["posts", postId];
  const endpoint: string = (() => {
    switch (platform) {
      case platformTypes.connect:
        return `${url}/api/platforms/connect/posts/${postId}`;
      case platformTypes.facebook:
        return `${url}/api/platforms/facebook/posts/${postId}`;
      default:
        return "";
    }
  })();

  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = useQuery({
    queryKey: ["posts", postId],
    queryFn: async () => {
      const { data } = await axios.get(endpoint);
      return data.post;
    },
  });

  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: [...queryKey, "comments"],
    queryFn: async () => {
      const { data } = await axios.get(`${endpoint}/comments`);
      return data.comments;
    },
  });

  const postCommentMutation = useMutation({
    mutationKey: [...queryKey, "comments"],
    mutationFn: async ({ content }: { content: string }) => {
      const body =
        platform === platformTypes.connect ? { content } : { message: content };
      const { data } = await axios.post(`${endpoint}/comments`, body);
      return data.comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", postId]);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationKey: [...queryKey, "comments"],
    mutationFn: async ({ commentId }: { commentId: string }) => {
      const { data } = await axios.delete(`${endpoint}/comments/${commentId}`);
      return data.success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", postId]);
    },
  });

  return {
    post,
    postLoading,
    comments,
    commentsLoading,
    commentsError,
    postCommentMutation,
    deleteCommentMutation,
    postError,
  };
}
