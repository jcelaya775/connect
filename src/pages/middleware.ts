import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest, res: NextResponse) {
	const { pathname } = req.nextUrl;
	return NextResponse.redirect(new URL("/about-2", request.url));
}
