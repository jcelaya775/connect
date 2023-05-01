import { platformTypes } from "@/types/platform";
import SocialIcon from "./social-icon";
import CommentButton from "./comment-button";
import LikeButton from "./like-button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

type PostStatsProps = {
  postId: string;
  userId: string;
  platform: platformTypes;
};

export default function PostStatsBar({
  postId,
  userId,
  platform,
}: PostStatsProps) {
  // Connect stats
  const { data: connectLikes, isLoading: connectLikeLoading } = useQuery({
    queryKey: ["posts", postId, "likes", "count"],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/users/${userId}/platforms/connect/posts/${postId}/likes`
      );
      return data.likeCount;
    },
    enabled: platform == platformTypes.connect,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    retryDelay(failureCount, error) {
      if (failureCount < 3) return 1000 * 60 * 5;
      else return 1000 * 60 * 60;
    },
  });
  const { data: connectComments, isLoading: connectCommentLoading } = useQuery({
    queryKey: ["posts", postId, "comments", "count"],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/users/${userId}/platforms/connect/posts/${postId}/comments`
      );
      return data.commentCount;
    },
    enabled: platform == platformTypes.connect,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    retryDelay(failureCount, error) {
      if (failureCount < 3) return 1000 * 60 * 5;
      else return 1000 * 60 * 60;
    },
  });

  // Facebook stats
  const { data: facebookLikes, isLoading: facebookLikesLoading } = useQuery({
    queryKey: ["posts", postId, "likes", "count"],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/platforms/facebook/posts/${postId}/likes`
      );
      return data.likeCount;
    },
    enabled: platform == platformTypes.facebook,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    retryDelay(failureCount, error) {
      if (failureCount < 3) return 1000 * 60 * 5;
      else return 1000 * 60 * 60;
    },
  });

  const { data: facebookComments, isLoading: facebookCommentsLoading } =
    useQuery({
      queryKey: ["posts", postId, "comments", "count"],
      queryFn: async () => {
        const { data } = await axios.get(
          `/api/platforms/facebook/posts/${postId}/comments`
        );
        return data.commentCount;
      },
      enabled: platform == platformTypes.facebook,
      refetchOnWindowFocus: false,
      refetchInterval: 1000 * 60 * 5, // 5 minutes
      retryDelay(failureCount, error) {
        if (failureCount < 3) return 1000 * 60 * 5;
        else return 1000 * 60 * 60;
      },
    });

  const icon = (() => {
    switch (platform) {
      case platformTypes.facebook:
        return <SocialIcon platform={platformTypes.facebook} />;
      case platformTypes.instagram:
        return <SocialIcon platform={platformTypes.instagram} />;
      case platformTypes.tiktok:
        // TODO: Add TikTok icon
        return <SocialIcon platform={platformTypes.tiktok} />;
    }
  })();

  const likeButton = (() => {
    switch (platform) {
      case platformTypes.connect:
        return (
          <LikeButton
            postId={postId}
            userId={userId}
            platform={platformTypes.connect}
          />
        );
      case platformTypes.facebook:
        return (
          <LikeButton
            postId={postId}
            userId={userId}
            platform={platformTypes.facebook}
          />
        );
      case platformTypes.instagram:
        return (
          <LikeButton
            postId={postId}
            userId={userId}
            platform={platformTypes.instagram}
          />
        );
      case platformTypes.tiktok:
        // TODO: Add TikTok icon
        return (
          <LikeButton
            postId={postId}
            userId={userId}
            platform={platformTypes.tiktok}
          />
        );
    }
  })();

  const commentButton = (() => {
    switch (platform) {
      case platformTypes.connect:
        return <CommentButton postId={postId} platform={platform} />;
      case platformTypes.facebook:
        return <CommentButton postId={postId} platform={platform} />;
      case platformTypes.instagram:
        return <CommentButton postId={postId} platform={platform} />;
      case platformTypes.tiktok:
        return <CommentButton postId={postId} platform={platform} />;
    }
  })();

  const likeCount = (() => {
    switch (platform) {
      case platformTypes.connect:
        return connectLikeLoading ? 0 : connectLikes;
      case platformTypes.facebook:
        return facebookLikesLoading ? 0 : facebookLikes;
      // case platformTypes.instagram:
      //   return instagramStats!.likes;
      // case platformTypes.tiktok:
      //   return tiktokStats!.likes;
    }
  })();

  const commentCount = (() => {
    switch (platform) {
      case platformTypes.connect:
        return connectComments;
      case platformTypes.facebook:
        return facebookComments;
      // case platformTypes.instagram:
      //   return instagramStats!.comments;
      // case platformTypes.tiktok:
      //   return tiktokStats!.comments;
    }
  })();

  return (
    <div className="basis-full">
      <div className="flex flex-row space-x-3 justify-start">
        {icon}
        <div className="flex-none w-content lg:-ml-2">{likeButton}</div>
        <div className="flex-none w-content">{likeCount} Likes</div>
        <div className="flex-none w-content">{commentButton}</div>
        <div className="flex-none w-content">{commentCount} Comments</div>
      </div>
    </div>
  );
}
