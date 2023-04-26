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
    /**
     * @route          GET api/users/[uid]/friends
     * @description    Get all friends of a user
     * @access         Public
     * @param {string} name - The name of the user (optional)
     * @param {string} username - The username of the user (optional)
     * @param {string} email - The email of the user (optional)
     *
     */
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

        const currentUser = await User.findById(_id);
        const friendObjects: { _id: ObjectId; user_id: ObjectId }[] =
          currentUser.friends;
        const friendIds = friendObjects.map((friend) => friend.user_id);

        const friends = await User.find({ _id: { $in: friendIds } }).select(
          "_id email username name"
        );

        // Programatic approach
        // const currentUser = await User.findById(_id).populate(
        //   "friends.user_id"
        // );

        // const friendObjects = currentUser.friends.filter(
        //   (friend: { user_id: IUser }) =>
        //     friend.user_id.name
        //       .toLowerCase()
        //       .match(new RegExp(name?.toLowerCase() + ".*")) ||
        //     friend.user_id.username
        //       .toLowerCase()
        //       .match(new RegExp(username?.toLowerCase() + ".*")) ||
        //     friend.user_id.email
        //       .toLowerCase()
        //       .match(new RegExp(email?.toLowerCase() + ".*"))
        // );
        // const friends = friendObjects.map((friend: { user_id: IUser }) => ({
        //   _id: friend.user_id._id,
        //   name: friend.user_id.name,
        //   username: friend.user_id.username,
        //   email: friend.user_id.email,
        // }));

        res.status(200).json({ success: true, friends });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
