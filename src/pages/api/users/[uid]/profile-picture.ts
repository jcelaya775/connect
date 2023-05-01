import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { uploadFileToS3, deleteFileFromS3 } from "@/lib/amazon-s3";
import formidable from "formidable";
import fs from "fs";
import { parseForm } from "@/lib/parseForm";
import User from "@/models/User";

type Data = {
  success: boolean;
  profilePicture?: string;
  error?: string;
};

type formidableData = {
  fields: formidable.Fields;
  files: formidable.Files;
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
     * @route   GET  api/settings/profile-picture
     * @desc    Get  user profile picture
     * @access  Public
     **/
    case "GET":
      try {
        res.status(200).json({
          success: true,
          profilePicture: user.profile_picture.signedUrl,
        });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
