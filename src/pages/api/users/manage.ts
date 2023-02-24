import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/connectDB";
import User, { IUser } from "../../../models/User";
import { hashPassword, comparePassword } from "@/validation/passwordHash";
import { userValidationSchema } from "@/validation/userValidation";

type Data = {
	success: boolean;
	status: string;
	data?: IUser;
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
				//find user with username matching req
				let email = req.body.email;
				const user: IUser | null = await User.findOne({ email });
				if (!user) {
					res
						.status(404)
						.json({ success: false, status: "Not Found" });
					break;
				}

				//hash the attempted password
				let attemptedPassHash = await hashPassword(req.body.password);
				let userPassHash = user.password;

				//compare the hashes
				let isCorrectPassword = await comparePassword(
					attemptedPassHash,
					userPassHash
				);

				//if the passwords are the same, return the user
				if (isCorrectPassword) {
					res.status(200).json({ success: true, data: user, status: "OK" });
					break;
				} else {
					res.status(403).json({ success: false, status: "Forbidden" });
					break;
				}
			} 
			catch (error) {
				res.status(400).json({ success: false, status: "Bad Request" });
			}
			break;
		case "PUT":
			// const { username, name, email } = req.body;
			// try{
			// 		//unsure how to change this from findOneAndUpdate
			// 		await User.findOneAndUpdate(username, name, email);
			// 		res.status(200).json({ success: true, status: "OK" })
			// 		break;
			// }
			// catch (error) {
			// 		res.status(500).json({ success: false, status: "Internal Server Error" });
			// }
			// break;

			try{	
				const { email, password } = req.body;
				
				
				const user: IUser | null = await User.findOne({ email });
				if (!user) {
					res
						.status(404)
						.json({ success: false, status: "Not Found" });
					break;
				}
				
				const pass_attempt = await hashPassword(password)
				const isMatch = await comparePassword(pass_attempt, user.password);
				if(!isMatch) {
					res.status(403).json({ success: false, status: "Forbidden" })
					break;
				}
				User.updateOne
				res.status(200).json({ success: true, status: "OK" })
			}
			catch(error){
				res.status(404).json({ success: false, status: "Not Found" });
			}
		case "DELETE":
			try{	
				const { email, password } = req.body;
				
				
				const user: IUser | null = await User.findOne({ email });
				if (!user) {
					res
						.status(404)
						.json({ success: false, status: "Not Found" });
					break;
				}
				
				const pass_attempt = await hashPassword(password)
				const isMatch = await comparePassword(pass_attempt, user.password);
				if(!isMatch) {
					res.status(403).json({ success: false, status: "Forbidden" })
					break;
				}
				User.deleteOne(email);
				res.status(200).json({ success: true, status: "OK" })
			}
			catch(error){
				res.status(404).json({ success: false, status: "Not Found" });
			}
			break;
		default:
			res.status(500).json({ success: false, status: "Internal Server Error" });
			break;
	}
}
