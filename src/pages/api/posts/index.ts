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

  await connectDB();

	switch (method) {
		case "GET": // authenticated endpoint
			try {
				const email: string = session.user!.email!;
				console.log(`session.user.email: ${email}`);
				const posts: IPost[] = await Post.find();
				res.status(200).json({
					success: true,
					data: posts,
					httpStatus: 200,
				});
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}

      break;
    case "POST": // authenticated endpoint
      const user = await getAuthUser(req, res);
      const { _id: user_id, username, email, name } = user!;

      // Params
      const { visibility, title, community, content } = req.body;
      if (content.body) {
        const post: IPost = await Post.create({
          user_id,
          username,
          email,
          author: name,
          title,
          community,
          content: {
            body: content.body,
          },
          visibility,
        });
        await post.save();
      } else if (content.image) {
        //TODO: allow for processing of images
      }
      const post: IPost = await Post.create({
        user_id,
        username,
        email,
        author: name,
        title,
        community,
        //content,
        //comments,
        visibility,
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
