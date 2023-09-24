import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import User, { IUser } from "../../../models/User";
import { sendPasswordResetEmail } from "@/lib/validation/resetPasswordEmail";

type Data = {
  success: boolean;
  user?: IUser;
  error?: string;
  httpStatus?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  await connectDB();

  switch (method) {
    case "POST":
      try {
        const { email } = req.body;
        const user: IUser | null = await User.findOne({ email });

        // User not found
        if (!user) {
          res
            .status(404)
            .json({ success: false, error: "User not found", httpStatus: 404 });
          break;
        }

        // User is not verified
        if (!user.is_verified) {
          res.status(403).json({
            success: false,
            error: "User is not verified",
            httpStatus: 403,
          });
          break;
        }

        try {
          sendPasswordResetEmail(user.email);
        } catch (error: any) {
          res
            .status(500)
            .json({ success: false, error: error.message, httpStatus: 500 });
          break;
        }

        // User is authorized
        // TODO: Send JWT token
        res.status(200).json({ success: true, httpStatus: 200 });
      } catch (error: any) {
        res
          .status(500)
          .json({ success: false, error: error.message, httpStatus: 500 });
      }
      break;
    default:
      res
        .status(405)
        .json({ success: false, error: "Method not allowed", httpStatus: 405 });
  }
}
