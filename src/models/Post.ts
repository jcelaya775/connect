import mongoose, { Schema, SchemaTypes, models, Document } from "mongoose";
import { CommentSchema, IComment } from "../models/Comment";
import { ObjectId } from "mongodb";

export interface IPost extends Document {
	user_id: string;
	email: string;
	timestamp: Date;
	author: string;
	visibility: Number /* 1: public-post, 2: friends, 3: private-post */;
	likes: Number;
	views: Number;
	community: string;
	//comments?: IComment[];
	content: {
		body?: string;
		image?: string;
		link?: string;
		[x: string | number | symbol]: any;
	};
}

const PostSchema = new Schema<IPost>({
	user_id: SchemaTypes.ObjectId,
	// email: { type: String, required: true, trim: true },
	author: { type: String, required: true, trim: true },
	title: { type: String, required: true, trim: true },
	community: { type: String, trim: true },
	content: {
		body: { type: String, trim: true },
		image: { type: String, trim: true },
		link: { type: String, trim: true },
	},
	
	//comments: [CommentSchema],
	likes: { type: Number, default: 0 },
	views: { type: Number, default: 0 },
	visibility: { type: Number, required: true, default: 1 },
	timestamp: { type: Date, default: Date.now },
});

PostSchema.virtual("allComments", {
  ref: "Comment",
  localField: "comments",
  foreignField: "_id",
  justOne: false,
});

PostSchema.set("toJSON", {
  virtuals: true,
});
PostSchema.set("toObject", {
  virtuals: true,
});

export default models.Post || mongoose.model("Post", PostSchema);
