import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../connectDB";
import Collection, { ICollection } from "@/models/Collection";

type Data = {
	success: boolean;
	data?: ICollection[];
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req;

	await connectDB();

	switch (method) {
		case "GET":
			try {
				const collections = Collection.find({});
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
