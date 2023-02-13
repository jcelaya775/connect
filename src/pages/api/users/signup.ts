import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../connectDB";
import User, { IUser } from "../../../models/User";
import { sendVerificationEmail } from "../auth/signup/transport"
import { hashPassword, comparePassword } from "@/validation/passwordHash";
import { userValidationSchema } from "@/validation/userValidation";
import { sendEmail } from "@/validation/verificationEmail";

type Data = {
    success: boolean;
    data?: IUser[];
};
export default async function handler(
req: NextApiRequest,
res: NextApiResponse<Data>){
	const { method } = req;
	await connectDB();
	switch (method) {
		case "GET":
			const { _id } = req.body;
			const user = await User.findById(_id);
			if (!user) {
				return res.status(404).json({ success: false});
			}
			return res.status(200).json({ success: true, data: user });
		case "POST":
			try{
				//make sure email follows conventions
				const validationResult = userValidationSchema.validate(req.body.email);
				if (validationResult.error) {
					return res.status(400).json({ success: false });
				}
				//store the data into const's
				const { email, password, username } = req.body; 
				const hashedPassword = await hashPassword(password);
				let vCode = (Math.random() * (99999 - 11111) + 11111);

				//create the wire frame user
				const wireUser = new User({
					username: username,
					email: email,
					code: vCode,
					password: hashedPassword,
					is_verified: false,
				});

				//save the user
				await wireUser.save();
				await sendVerificationEmail(username, vCode);
				res.status(201).json({ success: true });
			}
			catch (error) {
				res.status(404).json({ success: false });
			}
			break;
		case "PUT":
			try {
        // Get the user ID and verification code from the request body
        const { _id, code } = req.body;
        

        // Verify the user's code
        // You should add the logic to verify the code here
        const thisUser = await User.findOneAndUpdate({ _id },
          { $set: { is_verified: true, code: null,} },
          { new: true })
          // Return the updated user
          res.status(200).json({success: true, data: thisUser});
        }
      catch (error) {
        // Return an error response
        res.status(500).json({
          success: false,
        });
      }
      break;
		default:
			res.status(404).json({success: false}); 
	}
}