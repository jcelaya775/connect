import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/connectDB";
import Post, { IPost } from "@/models/Post";
import User, { IUser } from "@/models/User";

type GetData = {
	success: boolean;
	error?: string;
	data?: IPost[];
	error?: string;
	httpStatus?: number;
};

type PostData = {
	success: boolean;
	data?: IPost;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<GetData | PostData>
) {
  const { method } = req;

	// TODO: Fix decryption error in getServerSession
	const session = await getServerSession(req, res, authOptions);
	if (!session) return res.status(401).json({ success: false });

	await connectDB();

	switch (method) {
		case "GET":
			// TODO: return only posts relevant to the user
			try {
				const email: string = session.user!.email!;
				console.log(`session.user.email: ${email}`);
				const posts: IPost[] = await Post.find();
				res.status(200).json({
					success: true,
					data: posts,
					httpStatus: 200,
				});
			} catch (error) {
				res.status(400).json({ success: false });
			}

			break;
		case "POST":
			// TODO: add authentication for posting
			const {
				email,
				views,
				shared_with,
				title,
				author,
				community,
				password,
				jwt,
				content,
				comments,
				likes,
			} = req.body;

			const post: IPost = await Post.create({
				email,
				views,
				shared_with,
				title,
				author,
				community,
				password,
				jwt,
				content,
				comments,
				likes,
			});

			if (!post) {
				res.status(400).json({
					success: false,
					error: "Could not create post. Request body is invalid.",
				});
				break;
			}

			try {
				await post.save();
			} catch (error: any) {
				res.status(500).json({ success: false, error: error.message });
				break;
			}

			res.status(201).json({ success: true, data: post });
			break;
		case "PUT":
			break;
		default:
			res.status(400).json({ success: false, error: "could not contact the database" });
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
