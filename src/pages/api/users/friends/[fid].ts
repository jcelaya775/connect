import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import User, { IUser } from "@/models/User";
import mongoose from "mongoose";
import ObjectId = mongoose.Types.ObjectId;

type ResponseData = {
  success: boolean;
  friend?: IUser;
  friends?: IUser["friends"];
  error?: string;
};

type query = {
  fid?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await connectDB();
  const { method }: { method?: string } = req;

  const user: IUser | null | void = await getAuthUser(req, res);
  if (!user)
    return res.status(401).json({ success: false, error: "Unauthorized" });
  const { _id }: { _id?: ObjectId } = user;

  switch (method) {
    case "POST":
      try {
        const { fid }: query = req.query;
        const user: IUser = (await User.findOne({ _id })) as IUser;

        if (user.friends.some((friendId: ObjectId) => friendId.equals(fid)))
          return res.status(400).json({
            success: false,
            error: "Already friends",
          });

        const friend: IUser = (await User.findOne({ _id: fid }).select(
          "_id email username name friends"
        )) as IUser;

        user.friends.push(friend._id);
        friend.friends.push(user._id);

        await user.save();
        await friend.save();

        res.status(200).json({ success: true, friend });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
