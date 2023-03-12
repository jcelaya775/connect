import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req;

	if (method == "GET") {
		res.setHeader("Set-Cookie", "Authorization=; Max-Age=0; Path=/;");

		res.status(200).json({ message: "Logged out successfully" });
	}
}
