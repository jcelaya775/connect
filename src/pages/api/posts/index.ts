import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/connectDB";
import Post, { IPost } from "../../../models/Post";

//response to client
type Data = {
	success: boolean;
	data?: IPost[];
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { method } = req;

	// TODO: Fix decryption error in getServerSession
	const session = await getServerSession(req, res, authOptions);
	if (!session) return res.status(401).json({ success: false });

	await connectDB();

	switch (method) {
		case "GET":
			try {
				const email: string = session.user!.email!;
				console.log(`session.user.email: ${email}`);
				const posts: IPost[] = await Post.find();
				res.status(200).json({
					success: true,
					data: posts,
				});
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case "POST":
			break;
		case "PUT":
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}

// export const config = {
// 	api: {
// 		bodyParser: false,
// 		externalResolver: true,
// 		middlewares: [serverAuth],
// 	},
// };
