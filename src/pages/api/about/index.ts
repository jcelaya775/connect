import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../connectDB";
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
	switch (method) {
		case "GET":
			try {
				const about: IAbout[] = await About.find();
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
