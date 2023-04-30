import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { IConnectPost } from "@/models/Post";
import { getAuthUser } from "@/lib/auth";
import { platformTypes } from "@/types/platform";
import axios from "axios";
import { GenericPost, IFacebookPost, IInstagramPost } from "@/types/post";
import { ObjectId } from "mongoose";

type GetData = {
  success: boolean;
  posts?: GenericPost[];
  error?: string;
};

const getDate = (
  post: IConnectPost | IFacebookPost | IInstagramPost
): number => {
  switch (post.main_platform) {
    case platformTypes.connect:
      return Date.parse((post as IConnectPost).createdAt);
    case platformTypes.facebook:
      return Date.parse((post as IFacebookPost).created_time);
    // case platformTypes.instagram:
    //   return Date.parse(post.timestamp);
    default:
      return 0;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetData>
) {
  await connectDB();
  const { method } = req;

  // Authenticate user
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ success: false });

  const url = process.env.NEXTAUTH_URL;

  switch (method) {
    /**
     * @route   GET api/users/[uid]/feed
     * @desc    Get the current user's feed
     * @access  Private
     **/
    case "GET":
      try {
        const { uid }: { uid?: string } = req.query;
        const allPosts: GenericPost[] = [];
        const facebookPostIds: Set<string> = new Set<string>();
        const instagramPostIds: Set<string> = new Set<string>();

        try {
          // Get connect feed
          const {
            data: { posts: connectPosts },
          } = await axios.get(
            `${url}/api/users/${uid}/platforms/connect/posts`,
            {
              headers: {
                Cookie: req.headers.cookie,
              },
            }
          );
          if (connectPosts)
            connectPosts.forEach((post: IConnectPost) => {
              // Keep track of all facebook and instagram post ids
              for (const platform of post.platforms) {
                switch (platform) {
                  case platformTypes.facebook:
                    if (facebookPostIds.has(post.facebook_id!)) {
                      // Remove repeated facebook posts
                      post.platforms = post.platforms.filter(
                        (platform) => platform !== platformTypes.facebook
                      );
                      post.facebook_id = undefined;
                      break;
                    }
                    facebookPostIds.add(post.facebook_id!);
                    break;
                  case platformTypes.instagram:
                    if (instagramPostIds.has(post.instagram_id!)) {
                      // Remove repeated instagram posts
                      post.platforms = post.platforms.filter(
                        (platform) => platform !== platformTypes.instagram
                      );
                      post.instagram_id = undefined;
                      break;
                    }
                    instagramPostIds.add(post.instagram_id!);
                    break;
                }
              }
            });
          allPosts.push(...connectPosts);
        } catch (error: any) {
          console.log(error.response.data);
        }

        try {
          // Get user's facebook posts
          const {
            data: { posts: facebookPosts },
          } = await axios.get(
            `${url}/api/users/${uid}/platforms/facebook/posts`,
            {
              headers: {
                Cookie: req.headers.cookie,
              },
            }
          );
          if (facebookPosts)
            facebookPosts.forEach((post: IFacebookPost) => {
              // Only add post if it doesn't already exist
              if (!facebookPostIds.has(post.id)) allPosts.push(post);
            });
        } catch (error: any) {
          console.log(error.response.data);
        }

        allPosts.sort((postA: GenericPost, postB: GenericPost) => {
          let timeA: number = getDate(postA);
          let timeB: number = getDate(postB);

          return timeB - timeA;
        });

        res.status(200).json({
          success: true,
          posts: allPosts,
        });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
