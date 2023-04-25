import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { IPost } from "@/models/Post";
import { getAuthUser } from "@/lib/auth";
import { platformTypes } from "@/types/platform";
import axios from "axios";

type GetData = {
  success: boolean;
  posts?: IPost[];
  error?: string;
};

const getDate = (post: any): number => {
  switch (post.main_platform) {
    case platformTypes.connect:
      return Date.parse(post.createdAt);
    case platformTypes.facebook:
      return Date.parse(post.created_time);
    case platformTypes.instagram:
      return Date.parse(post.timestamp);
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
  const { _id: user_id } = user;

  const url = process.env.NEXTAUTH_URL;

  switch (method) {
    /**
     * @route   GET api/feed
     * @desc    Get the current user's feed
     * @access  Private
     **/
    case "GET":
      try {
        // TODO: Create facebook and instagram post interfaces
        const allPosts: any[] = [];
        const facebookPostIds: Set<string> = new Set<string>();
        const instagramPostIds: Set<string> = new Set<string>();

        const {
          data: { posts: connectPosts },
        } = await axios.get(`${url}/api/platforms/connect/posts`, {
          headers: {
            Cookie: req.headers.cookie,
          },
        });
        connectPosts.forEach((post: IPost) => {
          console.log(`Connect post found: ${post._id}`);
          // Store all facebook and instagram post ids
          for (const platform of post.platforms) {
            switch (platform) {
              case platformTypes.facebook:
                console.log(`Facebook post found: ${post.facebook_id}`);
                console.log(`Facebook hash set: ${facebookPostIds}`);
                facebookPostIds.add(post.facebook_id!);
                break;
              case platformTypes.instagram:
                instagramPostIds.add(post.instagram_id!);
                break;
            }
          }
        });
        allPosts.push(...connectPosts);

        const {
          data: { posts: facebookPosts },
        } = await axios.get(`${url}/api/platforms/facebook/posts`, {
          headers: {
            Cookie: req.headers.cookie,
          },
        });
        facebookPosts.forEach((post: any) => {
          if (!facebookPostIds.has(post.id)) {
            allPosts.push(post);
          } else console.log(`Facebook post ${post.id} already exists`);
        });

        allPosts.sort((postA: any, postB: any) => {
          let timeA: number = getDate(postA);
          let timeB: number = getDate(postB);

          return timeB! - timeA!;
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
