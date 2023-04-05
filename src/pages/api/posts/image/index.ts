import type { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";
import connectDB from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import { getAuthUser } from "@/lib/auth";
import { uploadHandler } from "@/lib/amazon-s3";
import { request } from "http";

type GetData = {
  success: boolean;
  data?: IPost[];
  error?: string;
  email?: string;
};

// IMPORTANT: Prevents next from trying to parse the form
export const config = {
  api: {
    bodyParser: false,
  },
};
interface PostData {
  success: boolean;
  httpResponse: string;
  data?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetData | PostData>
) {
  const { method } = req;
  console.log(method);

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
      console.log(`POST api/posts`);
      // Params
      try {
        
        const { url } = await uploadHandler(req);
        if(!url){
          res.status(400).json({ success: false, httpResponse: "400" })
        }
        res.status(200).json({ success: true, httpResponse: "200", data: url });
        //TODO: use the key and location to make the post with reference to s3
      } catch (error) {
        res.status(202).json({ success: false, httpResponse: "accepted but with errors" });
      }

    case "PUT":
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
