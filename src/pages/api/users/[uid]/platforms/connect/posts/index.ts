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

  switch (method) {
    /**
     * @route   GET api/platforms/connect/posts
     * @desc    Get all posts
     * @access  Public
     **/
    case "GET":
      try {
        const { uid }: { uid?: string } = req.query;
        console.log(uid);

        // Get user's posts
        const posts: IConnectPost[] | null = await Post.find<IConnectPost>({
          user_id: uid,
        }).sort({
          createdAt: -1,
        });
        console.log(posts);

        res.status(200).json({
          success: true,
          posts,
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
