import connectDB from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import Collection, { ICollection } from "@/models/Collection";
import { getAuthUser } from "@/lib/auth";

type Data = {
  success: boolean;
  data?: ICollection[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  await connectDB();
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ success: false });

  switch (method) {
    case "GET":
      try {
        const { _id } = user;
        const collections = await Collection.find({ user_id: _id });
        res.status(200).json({ success: true, data: collections });
      } catch (error) {
        res.status(400).json({ success: false });
      }

      break;
    case "POST":
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
