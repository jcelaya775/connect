import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/connectDB";
import User, { IUser } from "../../../models/User";
import { hashPassword, comparePassword } from "@/validation/passwordHash";
import { userValidationSchema } from "@/validation/userValidation";

type Data = {
	success: boolean;
	error?: string;
	data?: IUser[];
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
					res.status(400).json({ success: false });
				}
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case "PUT":
            const { username, name, email } = req.body;
            try{
                await User.findOneAndUpdate(username, name, email);
                res.status(400).json({ success: true })
            }
            catch (error) {
                res.status(400).json({ success: false });
            }
			break;
		case "DELETE":
			try{	
				const { username, password } = req.body;
				const pass_attempt = hashPassword(password)
				await User.findOneAndDelete({ username: username, password: pass_attempt});
				res.status(200).json({ success: true})
			}
			catch(error){
				res.status(404).json({ success: false, error: "incorrect username or password" });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
