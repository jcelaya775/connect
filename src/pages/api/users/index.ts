import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/connectDB";
import User, { IUser } from "../../../models/User";
import { hashPassword, comparePassword } from "@/validation/passwordHash";
import { userValidationSchema } from "@/validation/userValidation";

type Data = {
	name?: string;
	success: boolean;
	data?: IUser[];
};

type Data = {
  success: boolean;
  users?: (IUser["_id"] &
    IUser["name"] &
    IUser["email"] &
    IUser["username"] &
    IUser["profile_picture"])[];
  error?: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { method } = req;

	await connectDB();

	switch (method) {
		case "GET":
			//make sure the username follows conventions
			const validationResult = userValidationSchema.validate(req.body.username);
			if (validationResult.error) {
				return res.status(400).json({ success: false });
			}
			try {
				//find user with username matching req
				let username = req.body.username;
				let thisUser = await User.findOne({ username });
				const { query } = req;
				if ("code" in query) {
				}
				//hash the attempted password
				let attemptedPassHash = await hashPassword(req.body.password);
				let userPassHash = thisUser.pass_hash;

				//compare the hashes
				let isCorrectPassword = await comparePassword(
					attemptedPassHash,
					userPassHash
				);

				//if the passwords are the same, return the user
				if (isCorrectPassword) {
					res.status(200).json({ success: true, data: thisUser });
				} else {
					//unsure what error status to return upon failed password verification
					res.status(401).json({ success: false });
				}
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case "POST":
			try {
				//make sure email follows conventions
				const validationResult = userValidationSchema.validate(req.body.email);
				if (validationResult.error) {
					return res.status(400).json({ success: false });
				}
				//store the data into const's
				const { name, email, password, username } = req.body;
				const hashedPassword = await hashPassword(req.body.password);
				let vCode = Math.random() * (99999 - 11111) + 11111;

				//create the wire frame user
				const wireUser = new User({
					username: req.body.username,
					email: req.body.email,
					code: vCode,
					password: hashedPassword,
				});

				//save the user
				await wireUser.save();

				//send the verification email and success status
				res.status(201).json({ success: true });
			} catch (error) {
				res.status(400).json({ success: false });
			}
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
