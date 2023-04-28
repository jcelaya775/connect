import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import axios from "axios";
import { getAuthUser } from "@/lib/auth";

type Data = {
  success: boolean;
  comment?: any[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();

  const user = await getAuthUser(req, res);
  if (!user || !user.facebook?.page_token)
    return res.status(401).json({ success: false, error: "Not logged in" });
  const { page_token } = user.facebook;

  const { method } = req;

  switch (method) {
    case "PUT":
      try {
        const { cid } = req.query;
        const { message } = req.body;

        const response = await axios.post(
          `https://graph.facebook.com/v16.0/${cid}?message=${message}&access_token=${page_token}`
        );
        const comment = response.data;

        res.status(200).json({ success: true, comment });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }

      break;
    case "DELETE":
      try {
        const { cid } = req.query;

        await axios.delete(
          `https://graph.facebook.com/v16.0/${cid}?access_token=${page_token}`
        );

        res.status(200).json({ success: true });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
