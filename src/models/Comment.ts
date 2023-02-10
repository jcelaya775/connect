import mongoose, { Schema, SchemaTypes, models, Document } from "mongoose";

export interface IComment extends Document {
	likes: Number;
	content: string;
	username: string;
}

const CommentSchema: Schema = new Schema<IComment>({
	content: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	likes: {
		type: Number,
		default: 0,
	},
});

export default models.Comment || mongoose.model("Comment", CommentSchema);