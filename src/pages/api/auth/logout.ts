import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.setHeader(
		"Access-Token",
		cookie.serialize("token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV !== "development",
			sameSite: "strict",
			expires: new Date(0),
			path: "/",
		})
	);

	res.status(200).json({ message: "Logged out successfully" });
}
