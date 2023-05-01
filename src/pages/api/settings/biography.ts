import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";

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

  const user = await getAuthUser(req, res);
  if (!user)
    return res.status(401).json({ success: false, error: "Unauthorized" });

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
    /**
     * @route   PUT api/settings/biography
     * @desc    Update user bio
     * @access  Private
     */
    case "PUT":
      try {
        const { biography } = req.body;
        user.biography = biography;
        await user.save();

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
