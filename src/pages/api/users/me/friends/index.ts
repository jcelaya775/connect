import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import axios, { AxiosResponse } from "axios";
import { getAuthUser } from "@/lib/auth";
import User, { IUser } from "@/models/User";
import { ObjectId } from "mongoose";

type ResponseData = {
  success: boolean;
  friends?: IUser["name"] & IUser["email"] & IUser["username"];
  error?: string;
};

type reqBody = {
  name?: string;
  username?: string;
  email?: string;
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
    case "GET":
      try {
        const { name, username, email }: reqBody = req.query;

        // Query users by name, username, or email
        const query: { $or: {}[] } = { $or: [] };
        const orArray = [];
        if (name)
          orArray.push({ name: { $regex: name as string, $options: "i" } });
        if (username)
          orArray.push({
            username: { $regex: username as string, $options: "i" },
          });
        if (email)
          orArray.push({ email: { $regex: email as string, $options: "i" } });
        if (orArray.length > 0) query.$or = orArray;

        const currentUser = await User.findById(_id).populate(
          "friends.user_id"
        );
        console.log(currentUser);
        console.log(currentUser.friends);

        const friendObjects: [{ user_id: ObjectId }] = currentUser.friends;
        const friends = friendObjects.map((friend: { user_id: ObjectId }) => {
          {
            friend._id, friend.name, friend.username, friend.email;
          }
        });

        res.status(200).json({ success: true, friends });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
      }

      break;
    case "POST":
      try {
        const { fid }: { fid: string } = req.body;
        const currentUser: IUser = (await User.findOne({ _id })) as IUser;

        // TODO: Check if both users accept each other
        // Check if the current currentUser is already friends with the target currentUser
        if (
          currentUser.friends.some(
            (friend: { user_id: ObjectId }) => String(_id) === fid
          )
        ) {
          return res.status(400).json({
            success: false,
            error: "Already friends",
          });
        }

        const targetUser: IUser = (await User.findOne({ _id: fid })) as IUser;

        // // Check if the target currentUser is already friends with the current currentUser
        // if (
        //   targetUser.friends.some(
        //     (friend: { user_id: ObjectId }) =>
        //       String(friend.user_id) === String(currentUser._id)
        //   )
        // ) {
        //   return res.status(400).json({
        //     success: false,
        //     error: "Target currentUser is already friends with you",
        //   });
        // }

        currentUser.friends.push({ user_id: targetUser._id });
        targetUser.friends.push({ user_id: currentUser._id });

        await currentUser.save();
        await targetUser.save();

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
