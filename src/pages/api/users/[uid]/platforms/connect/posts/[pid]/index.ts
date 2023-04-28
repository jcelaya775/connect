import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { IConnectPost } from "@/models/Post";
import { getAuthUser } from "@/lib/auth";

type Data = {
  success: boolean;
  data?: IConnectPost;
  postId?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();
  const { method } = req;

  switch (method) {
    /**
     * @route   GET api/users/[uid]platforms/connect/posts/:pid
     * @desc    Get a user's post by id
     * @access  Public
     * @params  pid: string (required)
     **/
    case "GET":
      // NOTE: This method is not authenticated
      try {
        const { pid } = req.query;

        // Get post
        const post: IConnectPost | null = await Post.findOne<IConnectPost>({
          _id: pid,
        });
        if (!post) return res.status(404).json({ success: false });

        res.status(200).json({
          success: true,
          data: post,
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
