import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import { ObjectId } from "mongoose";
import { getAuthUser } from "@/lib/auth";

type Request = {
  name?: string;
  username?: string;
  email?: string;
};

type Data = {
  success: boolean;
  pendingFriends?: IUser["_id"] &
    IUser["name"] &
    IUser["email"] &
    IUser["username"];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
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
     * @access         Private
     * @param {string} name - The name of the user (optional)
     * @param {string} username - The username of the user (optional)
     * @param {string} email - The email of the user (optional)
     *
     */
    case "GET":
      try {
        const { name, username, email }: Request = req.query;

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
        const pendingFriendObjects: { _id: ObjectId; user_id: ObjectId }[] =
          currentUser.pending_friends;
        const pendingFriendIds = pendingFriendObjects.map(
          (pendingFriend) => pendingFriend.user_id
        );

        const pendingFriends = await User.find({
          _id: { $in: pendingFriendIds },
        }).select("_id email username name");

        res.status(200).json({ success: true, pendingFriends });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
      }

      break;
    default:
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
  }
}
