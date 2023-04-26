import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { IUser } from "@/models/User";

type Data = {
  success: boolean;
  user?: IUser;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();
  const { method } = req;

  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ success: false });

  switch (method) {
    /**
     * @route          GET api/users/me
     * @description    Get the current user
     * @access         Private
     */
    case "GET":
      try {
        const { email } = user;
        res.status(200).json({ success: true, user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(405).json({ success: false });
      break;
  }
}
