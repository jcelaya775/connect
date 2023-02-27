import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export function withAuth(
	handler: (req: NextApiRequest, res: NextApiResponse) => void
) {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		// Get jwt token
		const authHeader = req.cookies["Authorization"] as string;
		const token = authHeader && authHeader.split(" ")[1];

		// Unauthorized
		if (!token) return res.status(401).json({ success: false });

		// Verify token
		const decoded = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET!,
			(err) => {
				if (err) return res.status(403).json({ success: false });
			}
		);

		return handler(req, res);
	};
}
