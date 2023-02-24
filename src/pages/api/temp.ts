import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/connectDB";
import Temp from "@/models/Temp";

type Data = {
	success: boolean;
	message?: string[];
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
				const tempList = await Temp.find();

				// Temp list is empty
				if (!tempList) {
					res.status(404).json({ success: false });
					break;
				}

				res.status(200).json({ success: true, message: tempList });
			} catch (error) {
				console.log(error);
				res.status(500).json({
					success: false,
				});
			}

			break;
		case "POST":
			try {
				const { message } = req.body;
				console.log(`Got request to post message: ${message}`);

				const temp = await Temp.create({ message });

				// Invalid request
				if (!temp) {
					res.status(400).json({ success: false });
				}

				res.status(201).json({ success: true, message: temp });
			} catch (error) {
				console.log(error);
				res.status(500).json({
					success: false,
				});
			}

			break;
		case "PUT":
			try {
				const { message_id, message } = req.body;
				const temp = await Temp.findById(message_id);

				temp.message = message;
				await temp.save();

				res.json({ success: true, message: temp });
			} catch (error) {
				console.log(error);
				res.status(500).json({
					success: false,
				});
			}

			break;
		default:
			break;
	}
}
