import { Axios } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import User, { IUser } from "../../../../models/User";
import axios from "axios";
import getAuthUser from "@/lib/getAuthUser";

type Data = {
  success: boolean;
  data?: any;
  error?: string;
  httpStatus?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { method } = req;

  await connectDB();

  switch (method) {
    case "POST":
      try {
        const { accessToken } = req.body;
        console.log(accessToken);
        console.log(req.headers);

        const data = await axios.get(
          `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&
          client_id=${process.env.FACEBOOK_CLIENT_ID}&
          client_secret=${process.env.FACEBOOK_APP_SECRET}&
          fb_exchange_token=${accessToken}`,
        );

        res.status(200).json({ success: true, data, httpStatus: 200 });
      } catch (error: any) {
        res
          .status(500)
          .json({ success: false, error: error.message, httpStatus: 500 });
      }
      break;
    default:
      res
        .status(405)
        .json({ success: false, error: "Method not allowed", httpStatus: 405 });
  }
}
