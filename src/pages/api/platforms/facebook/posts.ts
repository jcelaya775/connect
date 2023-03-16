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
  res: NextApiResponse<Data>
) {
  const { method } = req;

  await connectDB();

  // TODO: add authentication
  switch (method) {
    case "GET":
      try {
        const user = await getAuthUser(req, res);
        const { long_token } = user!;
        console.log(long_token);
        const data = await axios.get(
          `https://graph.facebook.com/me/feed?access_token=${long_token}`
        );
        console.log(data);
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
