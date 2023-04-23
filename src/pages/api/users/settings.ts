import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import axios, { AxiosResponse } from "axios";
import { getAuthUser } from "@/lib/auth";
import User, { IUser } from "@/models/User";

type ResponseData = {
  success: boolean;
  settings?: IUser["settings"];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await connectDB();
  const { method }: { method?: string } = req;

  const user: IUser | null | void = await getAuthUser(req, res);
  if (!user)
    return res.status(401).json({ success: false, error: "Unauthorized" });
  const { _id } = user;

  switch (method) {
    case "GET":
      try {
        const user: IUser = (await User.findOne({ _id })) as IUser;

        const settings = user.settings;

        res.status(200).json({ success: true, settings });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
