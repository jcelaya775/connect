import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import axios, { AxiosResponse } from "axios";
import { getAuthUser } from "@/lib/auth";
import User, { IUser } from "@/models/User";

type QueryParams = {
  name?: string;
  username?: string;
  email?: string;
};

type Data = {
  success: boolean;
  users?: (IUser["_id"] &
    IUser["name"] &
    IUser["email"] &
    IUser["username"] &
    IUser["profile_picture"])[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();
  const { method }: { method?: string } = req;

  const user: IUser | null | void = await getAuthUser(req, res);
  if (!user)
    return res.status(401).json({ success: false, error: "Unauthorized" });

  switch (method) {
    case "GET":
      try {
        const { name, username, email }: QueryParams = req.query;

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

        const users: IUser[] = await User.find(query).select(
          "_id email username name friends profile_picture"
        );

        res.status(200).json({ success: true, users });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
