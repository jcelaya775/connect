import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../connectDB";
import User, { IUser } from "../../../models/User";

type Data = {
	name?: string;
	success: boolean;
	data?: IUser[];
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { method } = req;
	console.log(`method: ${method}`);
	await connectDB();
	switch (method) {
		case "GET":
			try {
				const users: IUser[] = await User.find({});
				res.status(200).json({ success: true, data: users });
				console.log(users);
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case "POST":
			break;
		case "PUT":
			break;
		case "DELETE":
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
