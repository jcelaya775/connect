import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import User, { IUser } from "../../../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";
import getAuthUser from "@/lib/getAuthUser";

type Data = {
	success: boolean;
	user?: IUser;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { method } = req;

	const user = getAuthUser(req, res);
	if (!user) return res.status(401).json({ success: false });

	await connectDB();

	switch (method) {
		case "GET":
			try {
				const { email } = user!;
				const email = session.user!.email!;
				const user = await User.findOne<IUser>({ email });
				if (!user) return res.status(404).json({ success: false });

				res.status(200).json({ success: true, user });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(405).json({ success: false });
			break;
	}
}
