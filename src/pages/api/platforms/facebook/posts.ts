import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import axios from "axios";
import { getAuthUser } from "@/lib/auth";

type Data = {
  success: boolean;
  posts?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();

  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ success: false });
  const { long_token, page_token } = user;

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const data = await axios.get(
          `https://graph.facebook.com/v16.0/me/feed?access_token=${long_token}`
        );

        // Get user's posts
        const posts = [];
        let hasNextPage: boolean = true;
        do {
          posts.push(...data.data.data);
          const nextPage: string = data.data.paging.next;
          const newPostData = await axios.get(nextPage);
          hasNextPage = newPostData.data.length > 0 ? true : false;
        } while (hasNextPage);

        res.status(200).json({ success: true, posts });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const { message } = req.body;

        // const data = await axios.post(
        //   `https://graph.facebook.com/me/feed`,
        //   {
        //     access_token: long_token,
        //   }
        // );
        // console.log(data);
        const response = await axios.post(
          `https://graph.facebook.com/v16.0/me/feed?message=Hello world&access_token=${long_token}`
        );
        console.log(response);

        res.status(200).json({ success: true });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
