import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../connectDB";
import User, { IUser } from "../../../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";

type Data = {
	name?: string;
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
		case "POST":
			try {
				// const authHeader = req.headers.cookie;
				// console.log(authHeader);

				// if (!authHeader) return res.status(401).json({ success: false });

				// const token: string = authHeader && authHeader?.split(" ")[1];
				const { token } = req.body;

				let email;
				try {
					const decoded: JwtPayload = jwt.verify(
						token,
						process.env.ACCESS_TOKEN_SECRET!
					) as JwtPayload;
					email = decoded.email;
				} catch (error) {
					return res.status(403).json({ success: false });
				}

				const user: IUser | null = await User.findOne({ email });
				if (!user) return res.status(404).json({ success: false });

				res.status(201).json({ success: true, user });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(405).json({ success: false });
			break;
	}
}
