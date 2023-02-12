import connectDB from "@/connectDB";
import { NextApiRequest, NextApiResponse } from "next";
import Collection, { ICollection } from "@/models/Collection";

type Data = {
	success: boolean;
	data?: ICollection[];
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
				const collections = await Collection.find({});
				res.status(200).json({ success: true, data: collections });
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
