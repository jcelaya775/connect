import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { IConnectPost } from "@/models/Post";
import { getAuthUser } from "@/lib/auth";
import { platformTypes } from "@/types/platform";

type GetData = {
  success: boolean;
  posts?: IConnectPost[];
  error?: string;
  email?: string;
};

type PostData = {
  success: boolean;
  post?: IConnectPost;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetData | PostData>
) {
  await connectDB();
  const { method } = req;

  // Authenticate user
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ success: false });

  switch (method) {
    /**
     * @route   GET api/platforms/connect/posts
     * @desc    Get all posts
     * @access  Public
     **/
    case "GET":
      try {
        const { _id: user_id } = user;

        // Get user's posts
        const posts: IConnectPost[] | null = await Post.find<IConnectPost>({
          user_id,
        }).sort({
          createdAt: -1,
        });

        res.status(200).json({
          success: true,
          posts,
        });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route   POST api/platforms/connect/posts
     * @desc    Create a post
     * @access  Private
     * @body    title: string (required)
     * @body    community_id: string (required)
     * @body    content: string (required)
     * @body    visibility: string (required)
     **/
    case "POST":
      try {
        const { _id: user_id, username, email, name } = user;

        // Params
        const {
          platforms,
          facebook_id,
          instagram_id,
          community_id,
          content,
          visibility,
        } = req.body;
        const main_platform = platformTypes.connect;

        // Create post
        const post: IConnectPost = await Post.create({
          user_id,
          username,
          email,
          author: name,
          main_platform,
          platforms,
          facebook_id,
          instagram_id,
          community_id,
          content,
          visibility,
        });

        await post.save();

        res.status(200).json({ success: true, post });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
