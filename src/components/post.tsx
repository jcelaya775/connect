import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { platformTypes } from "@/types/platform";
import PostStatsBar from "./post-stats-bar";
import OptionsDropdown from "./options-dropdown";
import { IConnectPost } from "@/models/Post";
import useUser from "@/hooks/useUser";

export type PostProps = {
  userId: string;
  postId: string;
  facebookId: string;
  instagramId: string;
  author: string;
  mainPlatform: platformTypes;
  platforms: platformTypes[];
  content: IConnectPost["content"];
};

const Post = ({
  userId,
  postId,
  facebookId,
  instagramId,
  author,
  mainPlatform,
  platforms,
  content,
}: PostProps) => {
  const { user, userLoading } = useUser();

  const statsBar = (platform: platformTypes) => {
    switch (platform) {
      case platformTypes.connect:
        return (
          <PostStatsBar
            key={platform}
            postId={postId}
            userId={userId}
            platform={platformTypes.connect}
          />
        );
      case platformTypes.facebook:
        return (
          <PostStatsBar
            key={platform}
            postId={facebookId}
            userId={userId}
            platform={platformTypes.facebook}
          />
        );
      case platformTypes.instagram:
        return (
          <PostStatsBar
            key={platform}
            postId={instagramId}
            userId={userId}
            platform={platformTypes.instagram}
          />
        );
      case platformTypes.tiktok:
        return (
          <PostStatsBar
            key={platform}
            postId={postId}
            userId={userId}
            platform={platformTypes.tiktok}
          />
        );
    }
  };

  const statBars = platforms.map((platform: platformTypes) =>
    statsBar(platform)
  );

  return (
    <>
      <div className="card compact side w-full bg-base-100 shadow-xl">
        {!userLoading && user?._id === userId && (
          <div className="h-4">
            <div className="relative">
              <div className="absolute right-3 top-1">
                <OptionsDropdown
                  postId={postId}
                  userId={userId}
                  facebookId={facebookId}
                  instagramId={instagramId}
                  platforms={platforms}
                  content={content}
                />
              </div>
            </div>
          </div>
        )}

        <div className="card-body p-4 flex-col items-start lg:flex-row lg:items-center lg:space-x-3 space-y-1 flex-wrap">
          <div className="flex-none">
            <div className="flex flex-row space-x-3">
              <div className="flex-none avatar">
                <div className="rounded-full w-10 h-10 shadow">
                  <Link
                    href={`${
                      mainPlatform === platformTypes.connect &&
                      String(user?._id) === userId
                        ? "profile"
                        : `users/${userId}`
                    }`}
                  >
                    {
                      <svg
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current"
                      >
                        <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z" />
                      </svg>
                    }
                  </Link>
                </div>
              </div>
              <div className="flex-none w-content">
                <div className="card-title">
                  <Link href={`/users/${userId}`}>{author}</Link>
                </div>
                <div className="text-base-content text-opacity-80">
                  {mainPlatform}
                </div>
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="flex-1">
            <p>{content?.body}</p>
          </div>
          <div className="basis-1/6">
            {content?.image?.signedUrl && (
              <Image
                className="w-full h-full"
                priority
                width={800}
                height={800}
                src={content.image.signedUrl}
                alt="post image"
                unoptimized
              />
            )}
          </div>

          {/* Likes and comments */}
          {statBars.map((statBar, idx) => {
            if (idx < statBars.length - 1) {
              return (
                <>
                  {statBar}
                  <div key={idx} className="divider basis-full"></div>
                </>
              );
            } else return statBar;
          })}
        </div>
      </div>
    </>
  );
};

export default Post;
