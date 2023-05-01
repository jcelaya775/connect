import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import User from "@/models/User";

type Data = {
  success: boolean;
  biography?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();
  const { method } = req;

  const { uid }: { uid?: string } = req.query;
  const user = await User.findById(uid);
  if (!user)
    return res.status(404).json({ success: false, error: "User not found" });

  switch (method) {
    /*
     * @route   GET api/settings/biography
     * @desc    Get user bio
     * @access  Public
     **/
    case "GET":
      try {
        res.status(200).json({ success: true, biography: user.biography });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
