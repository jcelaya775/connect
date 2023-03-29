import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import { getAuthUser } from "@/lib/auth";
import { uploadVideoToS3, uploadImageToS3 } from "@/lib/amazon-s3";

type GetData = {
  success: boolean;
  data?: IPost[];
  error?: string;
  email?: string;
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
        //authenticate the user
        const user = await getAuthUser(req, res);
        const { _id } = user!;
        //get all the posts associated with their user_id
        const posts: IPost[] = await Post.find<IPost>({ user_id: _id });

        res.status(200).json({
          success: true,
          data: posts,
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
    case "POST": // authenticated endpoint
      //authenticate the user
      // const user = await getAuthUser(req, res);
      // const { _id: user_id, username, email, name } = user!;

      // Params
      const { user_id, username, email, visibility, title, community, content, image, video } = req.body;
      //if its just a text post
      console.log(`We have recieved the id ${user_id} and username ${username}`)
      if (content && (!image || !video)) {
        //make the post based off of the body as content
        console.log("We are inside content only area");
        const post: IPost = await Post.create({
          user_id,
          username,
          email,
          author: name,
          title,
          community,
          content: {
            body: content,
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
      } else if (image) {
        console.log("We are inside image only area");
        //attempt to upload the image to amazon S3
        const result = await uploadImageToS3(content.image);
        //if accepted, create a post, logging the bucket, key, and location
        const post: IPost = await Post.create({
          user_id,
          username,
          email,
          author: name,
          title,
          community,
          content: {
            body: content,
            image: {
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
      } else if (video) {
        //attempt to upload the video to the amazon s3 server bucket
        const result = await uploadImageToS3(content.video);

        //if accepted, create a post, logging the bucket, key, and location
        const post: IPost = await Post.create({
          user_id,
          username,
          email,
          author: name,
          title,
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
      else{
        console.log("nothing was grabbed");
        res.status(404).json({ success: false, error: "bad request" });
      }
    case "PUT":
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}

    
    