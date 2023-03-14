// export { default } from "next-auth";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RequestCookie } from "next/dist/server/web/spec-extension/cookies";
import jwt from "jsonwebtoken";

export default function middleware(req: NextRequest) {
	// const { pathname } = req.nextUrl;
	// console.log("in middleware");
	// const authHeader: RequestCookie | undefined =
	// 	req.cookies.get("Authorization") || req.cookies.get("authorization");
	// const token = authHeader?.value?.split(" ")[1];
	// if (token && userAuth(token)) return NextResponse.next();
	// else return NextResponse.redirect(new URL("/login", req.url));
}

// export const config = {
// 	matcher: "/*",
// };
