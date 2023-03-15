import getAuthUser from "@/lib/getAuthUser";
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/connectDB";
import About, { IAbout } from "../../../models/About";

type Data = {
	success: boolean;
	data?: IAbout[];
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { method } = req;

	await connectDB();
	const user = await getAuthUser(req, res);

	switch (method) {
		case "GET":
			try {
				const { _id: user_id } = user!;
				const about: IAbout[] = await About.find({ user_id });
				res.status(200).json({
					success: true,
					data: about,
				});
				console.log(about);
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
