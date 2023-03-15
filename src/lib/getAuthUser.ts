import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import User, { IUser } from "@/models/User";

// type UserResponse = IUser | ((body: any) => void);

export default async function getAuthUser(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const session = await getServerSession(req, res, authOptions);
		if (!session) return res.status(401).json({ success: false });

		// find user
		const user: IUser | null = await User.findOne<IUser>({
			email: session.user!.email!,
		});

		console.log(`In getUser() => user: ${user}`);

		if (!user) return res.status(404).json({ success: false });

		return user;
	} catch (error) {
		console.log(error);
		return null;
	}
}
