import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/connectDB";
import User, { IUser } from "@/models/User";
import Post, { IPost } from "@/models/Post";

//NextApiRequest should contain the post to be added to the database
type Data = {
	success: boolean;
	error?: string;
	httpStatus?: number;
};
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req;

	await connectDB();

	switch (method) {
		case "POST":
			try {
        const filter = req.body.email
        const update = req.body.post;
        let thisUser = await User.findOneAndUpdate({ email: filter, Post: update });
        res.status(200).json({
            success: true,
            httpStatus: 200,
        })
    }
    catch{
      res.status(404).json({
        success: false,
        error: "user not found",
        httpStatus: 404,
      })
    }
		break;
  }
}