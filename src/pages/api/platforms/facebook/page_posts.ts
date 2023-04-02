import { Axios } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../../lib/connectDB";
import User, { IUser } from "../../../../models/User";
import { FacebookPost, FacebookResponse } from "@/models/FacebookPost";
import axios from "axios";

interface Data {
  success: boolean;
  status: string;
  posts?: FacebookPost[];
}
interface FacebookPagePostsResponse {
  data: FacebookPost[];
  paging?: {
    next?: string;
  };
}
//Params:
/*
  req.body.access_token: user access token to create page access token
  req.body.page_id: id of the page to grab posts from
*/
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  await connectDB();

  switch (method) {
    case "POST":
      const fields =
        "id,from,message,created_time,likes.summary(true),comments.summary(true),attachments{media_type,url}";
      const { pageId, accessToken } = req.body;
      const limit = 20;

      try {
        const { data } = await axios.get<FacebookPagePostsResponse>(
          `https://graph.facebook.com/v13.0/${pageId}/posts?access_token=${accessToken}&limit=${limit}`
        );
        let posts = data.data;
        let paging = data.paging;

        while (paging?.next) {
          const { data: nextPageData } =
            await axios.get<FacebookPagePostsResponse>(paging.next);
          paging = nextPageData.paging;
          posts = [...posts, ...nextPageData.data];
        }

        return posts;
      } catch (err) {
        res.status(404).json({ success: false, status: "Not Found" });
      }
    default:
      res.status(500).json({ success: false, status: "Internal Server Error" });
  }
}
