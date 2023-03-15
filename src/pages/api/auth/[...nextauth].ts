import NextAuth from "next-auth";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

export const authOptions = {
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
	],
	//TODO: add db adapter
	pages: {
		signIn: "/login",
	},
	// debug: process.env.NODE_ENV === "development",
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},
	jwt: {
		async encode({ secret, token }: { secret: string; token: string }) {
			return jwt.sign(token, secret);
		},
		async decode({ secret, token }: { secret: string; token: any }) {
			return jwt.verify(token, secret);
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	logger: {
		error: (code: any) => console.error(code),
		warn: (code: any) => console.warn(code),
		debug: (code: any) => console.debug(code),
	},
};

export default NextAuth(authOptions);
