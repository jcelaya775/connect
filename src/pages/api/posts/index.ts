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
  post?: IPost;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetData | PostData>
) {
  await connectDB();
  const { method } = req;

  // Authenticate user
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ success: false });

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
    /**
     * @route   POST api/posts
     * @desc    Create a post
     * @access  Private
     * @body    title: string (required)
     * @body    community_id: string (required)
     * @body    content: string (required)
     * @body    visibility: string (required)
     **/
    case "POST":
      // Authenticate user
      const user = await getAuthUser(req, res);
      if (!user) return res.status(401).json({ success: false });
      const { _id: user_id, username, email, name } = user;

      // Params
      const { visibility, community, content } = req.body;
      console.log(`Posts:`);
      console.log(content);
      //if its just a text post
      console.log(
        `content: ${content.body} username: ${username} email: ${email}`
      );
      if (content.body) {
        //make the post based off of the body as content
        const post: IPost = await Post.create({
          user_id,
          username,
          email,
          author: name,
          community,
          content: {
            body: content.body,
          },
          visibility,
        });
        //throw if the post cannot be created
        if (!post) {
          res.status(400).json({
            success: false,
            error: "Could not create post. Request body is invalid.",
          });
          break;
        }
        //try to save the post, throw if unable
        try {
          await post.save();
        } catch (error: any) {
          res.status(500).json({ success: false, error: error.message });
          break;
        }
        res.status(201).json({ success: true, data: post });
        break;

        //if there is an image to upload
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

        //if accepted, create a post, logging the bucket, key, and location
        const post: IPost = await Post.create({
          user_id,
          username,
          email,
          author: name,
          community,
          content: {
            video: {
              bucket: "connect-social-media-bucket",
              key: result.Key,
              location: result.Location,
            },
          },
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
        res.status(201).json({ success: true, data: post });
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