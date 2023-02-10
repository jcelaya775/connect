import mongoose, { Schema, SchemaTypes, models, Document } from "mongoose";
import Comment, { IComment } from "../models/Comment";

export interface IPost extends Document {
	username: string;
	name: string;
	shared_with: Number /* 1:public, 2: friends, 3: private*/;
	likes: Number;
	views: Number;
	comments: IComment[];
	content: string;
	bio_id?: string;
}

const PostSchema: Schema = new Schema<IPost>({
	username: String,
	name: String,
	shared_with: Number,
	likes: Number,
	views: Number,
	content: String,
	comments: [Comment]
});

export default models.Post || mongoose.model("Post", PostSchema);
