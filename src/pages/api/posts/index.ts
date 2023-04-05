import type { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";
import { createReadStream } from "fs";
import AWS from "aws-sdk";
import connectDB from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import { getAuthUser } from "@/lib/auth";
import uploadHandler from "@/lib/amazon-s3";

type GetData = {
  success: boolean;
  data?: IPost[];
  error?: string;
  email?: string;
};

interface FormDataFields {
  user_id: string[];
  text: string[];
  image: multiparty.File[];
}

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
    case "GET": // authenticated endpoint
      try {
        //authenticate the user
        const user = await getAuthUser(req, res);
        const { _id } = user!;
        //get all the posts associated with their user_id
        const posts: IPost[] = await Post.find<IPost>({ user_id: _id });

        res.status(200).json({
          success: true,
          data: posts,
        });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route   POST api/posts
     * @desc    Create a post
     * @access  Private
     * @body    title: string (required)
     * @body    community_id: string (required)
     * @body    content: string (required)
     * @body    visibility: string (required)
     **/
    case "POST": // authenticated endpoint
      //authenticate the user
      // const user = await getAuthUser(req, res);
      // const { _id: user_id, username, email, name } = user!;

      // Params
      try {
        const { key, location } = await uploadHandler(req);

        //TODO: use the key and location to make the post with reference to s3
      } catch (error) {
        console.error(error);
      }

    case "PUT":
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
