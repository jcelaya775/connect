import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import axios from "axios";
import { getAuthUser } from "@/lib/auth";

type Data = {
  success: boolean;
  longToken?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();

  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ success: false });

  await connectDB();
  if (!user) return res.status(401).json({ success: false });

  const { method } = req;

  switch (method) {
    case "POST":
      try {
        user.facebook.long_token = undefined;
        user.facebook.page_token = undefined;
        user.facebook.long_token_expires = undefined;
        user.facebook.page_token_expires = undefined;
        await user.save();

        res.status(200).json({ success: true });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
