import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
// import middleware from "./middleware/withAuth";
// import { withAuth } from "next-auth/middleware";

// export default withAuth({
// 	function middleware(req) {
//     console.log(req.nextauth.token)
//   },
// 	callbacks: {
// 		authorized: ({ token }) => !!token,
// 	},
// });

// export default withAuth(
// 	// `withAuth` augments your `Request` with the user's token.
// 	function middleware(req) {
// 		console.log("in middleware");
// 		console.log(req.nextauth.token);
// 	}
// 	// {
// 	// 	callbacks: {
// 	// 		authorized: ({ token }) => !!token,
// 	// 	},
// 	// }
// );

export default function middleware(res: NextResponse) {}
