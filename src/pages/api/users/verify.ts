import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../connectDB";
import User, { IUser } from "../../../models/User";
import { sendVerificationEmail } from "../auth/signup/transport"
import { hashPassword, comparePassword } from "@/validation/passwordHash";
import { userValidationSchema } from "@/validation/userValidation";


type Data = {
    verificationCode?: Number,
    success: boolean;
  };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { method } = req;

	await connectDB();
	
	//returns true and the verification code as a number
	switch (method) {
		case "GET":

			try{
				const { _id } = req.body;
					const user = await User.findById(_id);
					if (!user) {
							return res.status(404).json({success: false,});
					}
					let vCode = user.code;
					return res.status(200).json({verificationCode: vCode, success: true});
				}
			catch (err) {
					res.status(404).json({success: false});
			}
			break;
		default:
			break;
	}
}