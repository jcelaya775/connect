import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// export default function withAuth(handler: any) {
// 	return function wrapperFunction(req: NextRequest, res: NextResponse) {
// 		// const session = getServerSession(req, res, authOptions);

// 		console.log(req.url);
// 		// console.log(session);

// 		// if (!session) {
// 		// 	return {
// 		// 		redirect: {
// 		// 			destination: "/",
// 		// 		},
// 		// 	};
// 		// }

// 		return handler(req, res);
// 	};
// }

const withAuth = (handler) => async (req, res) => {
	console.log(req.url);

	// const session = await getServerSession(req, res, authOptions);

	// if (!session) {
	// 	return {
	// 		redirect: {
	// 			destination: "/",
	// 		},
	// 	};

	return handler(req, res);
};

export default withAuth;

export const config = {
	matcher: "/verify-email",
};
