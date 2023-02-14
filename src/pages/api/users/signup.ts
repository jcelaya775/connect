import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../connectDB";
import User, { IUser } from "../../../models/User";
import { sendVerificationEmail } from "../auth/signup/transport";
import { hashPassword, comparePassword } from "@/validation/passwordHash";
import { userValidationSchema } from "@/validation/userValidation";
import { hasSubscribers } from "diagnostics_channel";
import { log } from "console";
import { sendEmail } from "@/validation/verificationEmail";

type Data = {
	success: boolean;
	user?: IUser;
};
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { method } = req;
	await connectDB();
	switch (method) {
		case "GET":
			const { _id } = req.body;
			const user = await User.findById(_id);
			if (!user) {
				return res.status(404).json({ success: false });
			}
			return res.status(200).json({ success: true, user });
		case "POST":
			try {
				const { name, email, password, username } = req.body;

				//make sure email follows conventions
				const validationResult = userValidationSchema.validate(req.body);
				// console.log(validationResult);
				if (validationResult.error) {
					return res.status(400).json({ success: false });
				}
				//store the data into const's
				const hashedPassword = await hashPassword(password);
				const vCode = Math.round(Math.random() * (99999 - 11111) + 11111);

				//create the wire frame user
				const wireUser = new User({
					username,
					email,
					name,
					password: hashedPassword,
					code: vCode,
				});

				//save the user
				await wireUser.save();
				sendEmail(email, name, vCode);
				res.status(201).json({ success: true, user: wireUser });
			} catch (error) {
				res.status(500).json({ success: false });
			}
			break;
		default:
			res.status(404).json({ success: false });
	}
}
