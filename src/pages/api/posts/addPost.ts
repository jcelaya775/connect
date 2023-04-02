import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/connectDB";
import User, { IUser } from "@/models/User";
import Post, { IPost } from "@/models/Post";

//NextApiRequest should contain the post to be added to the database
type Data = {
  success: boolean;
  status: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await connectDB();

  switch (method) {
    case "GET":
      // TODO: return only posts relevant to the user
      try {
        const post_id = req.query;
        const post: IPost[] = await Post.find(post_id);
        res.status(200).json({
          success: true,
          data: post,
          httpStatus: 200,
        });
      } catch (error) {
        res.status(400).json({ success: false, status: "post not found" });
      }

      break;
    case "POST":
      try {
        const { title, user_id, visibility, community_id } = req.body;
        const post: IPost = await Post.create({
          title,
          user_id,
          visibility,
          community_id,
        });
        await post.save();
        res.status(200).json({ success: true, status: "OK" });
      } catch {
        res.status(500).json({
          success: false,
          status: "could not save post",
        });
      }
      break;
  }
}
