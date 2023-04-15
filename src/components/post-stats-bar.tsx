import { platformTypes } from "@/types/platform";
import SocialIcon from "./social-icon";
import CommentButton from "./comment-button";
import LikeButton from "./like-button";

type PostProps = {
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
  platform,
  connectStats,
  facebookStats,
  instagramStats,
  tiktokStats,
}: PostProps) {
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
        return <LikeButton platform={platformTypes.connect} />;
      case platformTypes.facebook:
        return <LikeButton platform={platformTypes.facebook} />;
      case platformTypes.instagram:
        return <LikeButton platform={platformTypes.instagram} />;
      case platformTypes.tiktok:
        // TODO: Add TikTok icon
        return <LikeButton platform={platformTypes.tiktok} />;
    }
  })();

  const likeCount = (() => {
    switch (platform) {
      case platformTypes.connect:
        return connectStats!.likes;
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
        return connectStats!.comments;
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
          <CommentButton />
        </div>
        <div className="flex-none w-content">{commentCount} Comments</div>
      </div>
    </div>
  );
}
