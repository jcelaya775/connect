import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/connectDB";
import User, { IUser } from "../../../models/User";

type Data = {
  success: boolean;
  user?: IUser;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  await connectDB();

  //returns true and the verification code as a number
  switch (method) {
    case "PUT":
      try {
        // Get the user ID and verification code from the request body
        const { email, code } = req.body;
        const user = await User.findOne({ email });

        // User not found
        if (!user) {
          res.status(404).json({ success: false });
          break;
        }

        // Verify the user's code
        if (user.code !== parseInt(code)) {
          res.status(403).json({ success: false });
          break;
        }

        // Update fields
        user.is_verified = true;
        user.code = undefined;

        await user.save();

        res.status(200).json({ success: true });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
        });
      }
      break;
    default:
      break;
  }
}
