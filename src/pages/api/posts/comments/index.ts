import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import Comment, { IComment } from "@/models/Comment";
import { getAuthUser } from "@/lib/auth";
import { uploadVideoToS3, uploadImageToS3 } from "@/lib/amazon-s3";

type GetData = {
  success: boolean;
  data?: IPost;
  error?: string;
};

type PostData = {
  success: boolean;
  data?: IPost;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetData | PostData>
) {
  const { method } = req;

  await connectDB();

  switch (method) {
    case "GET":
      try {
        
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
				// const user = await getAuthUser(req, res);
        // if (!user) return res.status(401).json({ success: false });
        // const { _id: user_id, username, email, name } = user;
        const { comment, userID, postID } = req.body;
        const thisPost: IPost | null = await Post.findOne<IPost>({ postID });
        if (!thisPost) {
          res.status(404).json({ success: false });
        }
        const thisComment: IComment = await Comment.create({
          user_id: userID,
          content: comment,
        });
        thisPost!.comments!.push(thisComment);
				await thisPost!.save();
        res.status(200).json({ success: true, data: thisPost! });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "PUT":
      try {
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "DELETE":
      try {
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
    default:
      res.status(400).json({ success: false });
      break;
  }
}
