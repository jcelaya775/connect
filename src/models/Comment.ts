import mongoose, { Schema, SchemaTypes, models, Document } from "mongoose";

export interface IComment extends Document {
	user_id: string;
	content: string;
	replies?: IComment[];
	likes: Number;
}

const ReplySchema: Schema = new Schema<IComment>({
	user_id: SchemaTypes.ObjectId,
	content: {
		type: String,
		required: true,
		trim: true,
	},
	likes: {
		type: Number,
		default: 0,
	},
});

models.Reply = mongoose.model("Reply", ReplySchema);

export const CommentSchema: Schema = new Schema<IComment>({
	user_id: SchemaTypes.ObjectId,
	content: {
		type: String,
		required: true,
		trim: true,
	},
	likes: {
		type: Number,
		default: 0,
	},
	// replies: [ReplySchema], // TODO: Fix this
});

// This may potentially be useful for above
// [x: string | number | symbol]: any;

export default models.Comment || mongoose.model("Comment", CommentSchema);
