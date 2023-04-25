import { platformTypes } from "@/types/platform";
import SocialIcon from "./social-icon";
import CommentButton from "./comment-button";
import LikeButton from "./like-button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type PostStatsProps = {
  postId: string;
  platform: platformTypes;
};

export default function PostStatsBar({ postId, platform }: PostStatsProps) {
  // Connect stats
  const { data: connectLikes, isLoading: connectLikeLoading } = useQuery({
    queryKey: ["posts", postId, "likes", "count"],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/platforms/connect/posts/${postId}/likes`
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
        `/api/platforms/connect/posts/${postId}/comments`
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
      if (data.hasLiked) return data.likeCount + 1;
      else return data.likeCount;
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
        return <LikeButton postId={postId} platform={platformTypes.connect} />;
      case platformTypes.facebook:
        return <LikeButton postId={postId} platform={platformTypes.facebook} />;
      case platformTypes.instagram:
        return (
          <LikeButton postId={postId} platform={platformTypes.instagram} />
        );
      case platformTypes.tiktok:
        // TODO: Add TikTok icon
        return <LikeButton postId={postId} platform={platformTypes.tiktok} />;
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
        <div className="flex-none w-content">
          <CommentButton postId={postId} />
        </div>
        <div className="flex-none w-content">{commentCount} Comments</div>
      </div>
    </div>
  );
}
