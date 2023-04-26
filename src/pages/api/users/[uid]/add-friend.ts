import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import axios, { AxiosResponse } from "axios";
import { getAuthUser } from "@/lib/auth";
import User, { IUser } from "@/models/User";
import { ObjectId } from "mongoose";

type Data = {
  success: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const { method }: { method?: string } = req;

  const currentUser: IUser | null | void = await getAuthUser(req, res);
  if (!currentUser) return res.status(401).json({ success: false });
  const { _id } = currentUser;

  switch (method) {
    /**
     * @route /api/users/[uid]/add-friend
     * @method POST
     * @description Add a friend
     * @access Private
     * @param {string} uid - The friend's id
     */
    case "POST":
      try {
        const { uid } = req.query;
        const currentUser: IUser = (await User.findOne({ _id })) as IUser;

        // TODO: Check if both users accept each other
        // Check if the current currentUser is already friends with the target currentUser
        if (
          currentUser.friends.some(
            (friend: { user_id: ObjectId }) => String(_id) === uid
          )
        ) {
          return res.status(400).json({
            success: false,
            error: "Already friends",
          });
        }

        const targetUser: IUser | null = await User.findOne({ _id: uid });
        if (!targetUser) {
          return res.status(404).json({
            success: false,
            error: "User not found",
          });
        }

        // Check if the target currentUser is already friends with the current currentUser
        if (
          targetUser.friends.some(
            (friend: { user_id: ObjectId }) =>
              String(friend.user_id) === String(currentUser._id)
          )
        ) {
          return res.status(400).json({
            success: false,
            error: "Target currentUser is already friends with you",
          });
        }

        currentUser.friends.push({ user_id: targetUser._id });
        targetUser.friends.push({ user_id: currentUser._id });

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ success: true });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
