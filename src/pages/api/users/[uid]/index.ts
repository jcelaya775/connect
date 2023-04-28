import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import User, { IUser } from "@/models/User";

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

  switch (method) {
    /**
     * @route          GET api/users/me
     * @description    Get the current user
     * @access         Private
     */
    case "GET":
      try {
        const { uid }: { uid?: string } = req.query;
        const user: IUser | undefined = await User.findById(uid).select(
          "_id name email username profile_picture"
        );
        if (!user) return res.status(404).json({ success: false });

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
