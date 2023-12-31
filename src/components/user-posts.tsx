import useUser from "@/hooks/useUser";
import { GenericPost, IFacebookPost } from "@/types/post";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Post from "./post";
import { PostProps } from "./post";
import { platformTypes } from "@/types/platform";
import { IConnectPost } from "@/models/Post";
import { useRouter } from "next/router";

export default function UserPosts() {
  const router = useRouter();
  const { uid }: { uid?: string } = router.query;
  const { user: currentUser, userLoading: currentUserLoading } = useUser();
  const { user: targetUser } = useUser(uid);

  const url = process.env.NEXT_PUBLIC_URL;

  const { isLoading, error, data } = useQuery({
    queryKey: ["users", uid, "posts"],
    queryFn: async () => {
      const endpoint: string =
        uid !== undefined
          ? `${url}/api/users/${uid}/feed`
          : `${url}/api/users/${currentUser?._id}/feed`;
      const { data } = await axios.get(endpoint);

      return data.posts;
    },
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    enabled: !currentUserLoading,
  });

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        (!data || data?.length === 0) && <p>No posts found.</p>
      )}

      <div className="card w-full bg-base-200 rounded">
        <div className="flex flex-col w-full gap-5">
          {data &&
            data.map((post: GenericPost, idx: number) => {
              const props: Partial<PostProps & { key: string }> = {
                author: post.author,
                userId: String(post.user_id),
                mainPlatform: post.main_platform,
              };

              switch (post.main_platform) {
                case platformTypes.connect:
                  props.key = (post as IConnectPost)._id;
                  props.postId = (post as IConnectPost)._id;
                  props.platforms = (post as IConnectPost).platforms;
                  props.platforms.forEach((platform: string) => {
                    switch (platform) {
                      case platformTypes.facebook:
                        if (!targetUser?.facebook?.page_token) {
                          props.platforms = props.platforms?.filter(
                            (p) => p !== platformTypes.facebook
                          );
                          break;
                        }

                        props.facebookId = (post as IConnectPost).facebook_id!;
                        break;
                      case platformTypes.instagram:
                        props.instagramId = (
                          post as IConnectPost
                        ).instagram_id!;
                        break;
                    }
                  });
                  props.content = (post as IConnectPost).content;
                  break;
                case platformTypes.facebook:
                  props.key = (post as IFacebookPost).id;
                  props.facebookId = (post as IFacebookPost).id;
                  props.platforms = [platformTypes.facebook];
                  props.content = {
                    body: (post as IFacebookPost).message,
                    image: {
                      signedUrl: (post as IFacebookPost).full_picture,
                    },
                  };
                  break;
              }

              return <Post key={idx} {...(props as PostProps)} />;
            })}
        </div>
      </div>
    </>
  );
}
