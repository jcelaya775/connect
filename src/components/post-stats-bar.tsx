import { platformTypes } from "@/types/platform";
import SocialIcon from "./social-icon";
import CommentButton from "./comment-button";
import LikeButton from "./like-button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type PostStatsProps = {
  postId: string;
  platform: platformTypes;
  connectStats?: {
    likes: number;
    comments: number;
  };
  facebookStats?: {
    likes: number;
    comments: number;
  };
  instagramStats?: {
    likes: number;
    comments: number;
  };
  tiktokStats?: {
    likes: number;
    comments: number;
  };
};

export default function PostStatsBar({
  postId,
  platform,
  connectStats,
  facebookStats,
  instagramStats,
  tiktokStats,
}: PostStatsProps) {
  const { data: connectLikes, isLoading: connectLikeLoading } = useQuery({
    queryKey: ["connect", "posts", postId, "likes", "count"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/posts/${postId}/likes`);
      return data.likeCount;
    },
    cacheTime: 0,
    refetchOnWindowFocus: true,
  });
  const { data: connectComments, isLoading: connectCommentLoading } = useQuery({
    queryKey: ["connect", "posts", postId, "comments", "count"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/posts/${postId}/comments`);
      return data.commentCount;
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
        return facebookStats!.likes;
      case platformTypes.instagram:
        return instagramStats!.likes;
      case platformTypes.tiktok:
        return tiktokStats!.likes;
    }
  })();

  const commentCount = (() => {
    switch (platform) {
      case platformTypes.connect:
        return connectComments;
      case platformTypes.facebook:
        return facebookStats!.comments;
      case platformTypes.instagram:
        return instagramStats!.comments;
      case platformTypes.tiktok:
        return tiktokStats!.comments;
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
