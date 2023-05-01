import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import User, { IUser } from "../../../models/User";
import { comparePassword } from "@/lib/validation/passwordHash";
import jwt from "jsonwebtoken";
import cookie from "cookie";

type Data = {
  success: boolean;
  user?: Pick<IUser, "_id" | "username" | "name" | "email"> & Partial<IUser>;
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
        const { email, password, accessToken } = req.body;

        if (accessToken) {
          const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET!
          ) as { email: string };
        }

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

        // const passwordsMatch = await comparePassword(password, user.password);

        // User is not authroized
        // if (!passwordsMatch) {
        //   res.status(403).json({
        //     success: false,
        //     error: "Incorrect password",
        //     httpStatus: 403,
        //   });
        //   break;
        // }

        // User is authorized
        const newAccessToken = jwt.sign(
          { email },
          process.env.ACCESS_TOKEN_SECRET!,
          {
            expiresIn: "1d",
          }
        );

        res.setHeader(
          "Set-Cookie",
          cookie.serialize("Authorization", `Bearer ${newAccessToken}`, {
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 3600,
            path: "/",
          })
        );

        // TODO: Send public user info to client
        res.status(200).json({ success: true, httpStatus: 201 });
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
