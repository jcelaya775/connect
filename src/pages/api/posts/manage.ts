import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/connectDB";
import Post, { IPost } from "../../../models/Post";
import { hashPassword, comparePassword } from "@/validation/passwordHash";
import { userValidationSchema } from "@/validation/userValidation";

type Data = {
  success: boolean;
  status: string;
  data?: IPost;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  await connectDB();

  switch (method) {
    case "PUT":
      try {
        const { _id, _user_id, _visibility, _title } = req.query;

        const post = Post.findOne({ _id, _user_id });
        if (_visibility) {
          post.visibility = _visibility;
        }
      } catch (error) {
        res
          .status(500)
          .json({ success: false, status: "Internal Server Error" });
      }
  }
}
