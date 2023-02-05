import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../connectDB";
import Post, { IPost } from "../../../models/Post";

//response to client
type Data = {
  success: boolean;
  data?: IPost[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  await connectDB();

  switch (method) {
    case "GET":
      try {
        const posts: IPost[] = await Post.find();
        res.status(200).json({
          success: true,
          data: posts,
        });
        console.log(posts);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}