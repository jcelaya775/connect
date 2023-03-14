import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";
import { authOptions } from "./pages/api/auth/[...nextauth]";

// export default withAuth({
// 	function middleware(req) {
//     console.log(req.nextauth.token)
//   },
// 	callbacks: {
// 		authorized: ({ token }) => !!token,
// 	},
// });

export default withAuth(
	// `withAuth` augments your `Request` with the user's token.
	function middleware(req) {
		console.log("in middleware");
		console.log(req.nextauth.token);
	}
	// {
	// 	callbacks: {
	// 		authorized: ({ token }) => !!token,
	// 	},
	// }
);

export const config = {
	matcher: "/verify-email",
};
