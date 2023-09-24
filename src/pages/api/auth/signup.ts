import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/mongodb";
import User, { IUser } from "../../../models/User";
import { hashPassword } from "@/lib/validation/passwordHash";
import { userValidationSchema } from "@/lib/validation/userValidation";
import { sendVerificationEmail } from "@/lib/validation/verificationEmail";

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
        // const { name, email, password, username } = req.body;
        const { name, email, username } = req.body;

        //make sure email follows conventions
        const validationResult = userValidationSchema.validate(req.body);

        if (validationResult.error) {
          res.status(400).json({
            success: false,
            error: validationResult.error.message,
            httpStatus: 400,
          });
          break;
        }
        //store the data into const's
        // const hashedPassword = await hashPassword(password);
        const vCode = Math.round(Math.random() * (99999 - 11111) + 11111);

        if (await User.findOne({ username })) {
          res
            .status(400)
            .json({ success: false, error: "That username is already taken" });
          break;
        }

        if (await User.findOne({ email })) {
          res
            .status(400)
            .json({ success: false, error: "That email is already taken" });
          break;
        }

        //create the wire frame user
        const wireUser = new User({
          username,
          email,
          name,
          // password: hashedPassword,
          code: vCode,
        });

        // Send verification email
        try {
          await sendVerificationEmail(email, vCode);
        } catch (error: any) {
          res
            .status(500)
            .json({ success: false, error: error.message, httpStatus: 500 });
          break;
        }

        // Upload the user
        try {
          await wireUser.save();
        } catch (error: any) {
          res
            .status(500)
            .json({ success: false, error: error.message, httpStatus: 500 });
          break;
        }

        res.status(201).json({ success: true, httpStatus: 201 });
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
