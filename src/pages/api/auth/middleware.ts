import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest, res: NextResponse) {
	const { pathname } = req.nextUrl;
	const token = req.cookies.get("Authorization")?.value;

	if (!token || pathname == "/login") {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// Verify token
	const decoded = jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET!,
		(err, data) => {
			// if (err) return res.status(403).json({ success: false });
		}
	);

	// TODO: Refresh token

	return;
}
