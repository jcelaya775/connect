import { Axios } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import User, { IUser } from "../../../../models/User";
import axios from "axios";

type Data = {
	success: boolean;
	data?: any;
	error?: string;
	httpStatus?: number;
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
				const { accessToken } = req.body;

				const data = await axios.post(
					"https://graph.facebook.com/v11.0/me/accounts"
				);

				res.status(200).json({ success: true, data, httpStatus: 200 });
			} catch (error: any) {
				res
					.status(500)
					.json({ success: false, error: error.message, httpStatus: 500 });
			}
			break;
		default:
			res
				.status(405)
				.json({ success: false, error: "Method not allowed", httpStatus: 405 });
	}
}
