import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import { ObjectId } from "mongoose";
import { getAuthUser } from "@/lib/auth";

type QueryParams = {
  uid?: string;
  name?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
};

type Data = {
  success: boolean;
  friends?: IUser["_id"] &
    IUser["name"] &
    IUser["email"] &
    IUser["username"] &
    IUser["profile_picture"];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();
  const { method }: { method?: string } = req;

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
        const { uid, name, username, email }: QueryParams = req.query;

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

        const currentUser = await User.findById(uid);
        const friendObjects: { _id: ObjectId; user_id: ObjectId }[] =
          currentUser.friends;
        const friendIds = friendObjects.map((friend) => friend.user_id);

        const friends = await User.find({
          $and: [
            { _id: { $in: friendIds } }, // get all friends
            query, // filter friends by name, username, or email
          ],
        }).select("_id email username name profile_picture");

        res.status(200).json({ success: true, friends });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route /api/users/[uid]/add-friend
     * @method POST
     * @description Add a friend
     * @access Private
     * @param {string} uid - The friend's id
     */
    case "POST":
      try {
        const currentUser: IUser | null | void = await getAuthUser(req, res);
        if (!currentUser) return res.status(401).json({ success: false });
        const { _id } = currentUser;

        const { uid } = req.query;

        // Check if the current currentUser is trying to add themselves as a friend
        if (String(_id) === uid)
          return res.status(404).json({
            success: false,
            error: "You cannot add yourself as a friend",
          });

        const targetUser: IUser | null = await User.findOne({ _id: uid });
        if (!targetUser) {
          return res.status(404).json({
            success: false,
            error: "User not found",
          });
        }

        // Check if the users are already friends
        if (
          targetUser.friends.some(
            (friend: { user_id: ObjectId }) =>
              String(friend.user_id) === String(currentUser._id)
          ) ||
          currentUser.friends.some(
            (friend: { user_id: ObjectId }) =>
              String(friend.user_id) === String(targetUser._id)
          )
        ) {
          return res.status(400).json({
            success: false,
            error: "Already friends",
          });
        }

        // Current user accepts friend request
        if (
          targetUser.pending_friends.some(
            (pending_friend: { user_id: ObjectId }) =>
              String(pending_friend.user_id) === String(uid)
          )
        ) {
          // Remove the users from each other friend requests/pending friends
          currentUser.friend_requests = currentUser.friend_requests.filter(
            (pending_friend: { user_id: ObjectId }) =>
              String(pending_friend.user_id) !== String(targetUser._id)
          );
          targetUser.pending_friends = targetUser.pending_friends.filter(
            (pending_friend: { user_id: ObjectId }) =>
              String(pending_friend.user_id) !== String(_id)
          );

          currentUser.friends.push({ user_id: targetUser._id });
          targetUser.friends.push({ user_id: currentUser._id });
        } else {
          // Current user sends friend request
          if (
            currentUser.pending_friends.some(
              (pending_friend: { user_id: ObjectId }) =>
                String(pending_friend.user_id) === String(targetUser._id)
            )
          ) {
            return res.status(400).json({
              success: false,
              error: "Already sent a friend request",
            });
          }

          currentUser.pending_friends.push({ user_id: targetUser._id });
          targetUser.friend_requests.push({ user_id: currentUser._id });
        }

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ success: true });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route /api/users/[uid]/friends
     * @method DELETE
     * @description Remove a friend
     * @access Private
     * @param {string} uid - The friend's id
     */
    case "DELETE":
      try {
        const currentUser: IUser | null | void = await getAuthUser(req, res);
        if (!currentUser) return res.status(401).json({ success: false });
        const { _id } = currentUser;

        const { uid } = req.query;

        const targetUser: IUser | null = await User.findOne({ _id: uid });
        if (!targetUser) {
          return res.status(404).json({
            success: false,
            error: "User not found",
          });
        }

        // If the users are not friends, decline the friend request
        if (
          !targetUser.friends.some(
            (friend: { user_id: ObjectId }) =>
              String(friend.user_id) === String(currentUser._id)
          ) &&
          !currentUser.friends.some(
            (friend: { user_id: ObjectId }) =>
              String(friend.user_id) === String(targetUser._id)
          )
        ) {
          currentUser.friend_requests = currentUser.friend_requests.filter(
            (pending_friend: { user_id: ObjectId }) =>
              String(pending_friend.user_id) !== String(targetUser._id)
          );
          targetUser.pending_friends = targetUser.pending_friends.filter(
            (pending_friend: { user_id: ObjectId }) =>
              String(pending_friend.user_id) !== String(_id)
          );
        } else {
          // Remove the users from each other's friends list
          currentUser.friends = currentUser.friends.filter(
            (friend: { user_id: ObjectId }) =>
              String(friend.user_id) !== String(targetUser._id)
          );
          targetUser.friends = targetUser.friends.filter(
            (friend: { user_id: ObjectId }) =>
              String(friend.user_id) !== String(currentUser._id)
          );
        }

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
