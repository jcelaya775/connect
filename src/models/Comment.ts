import mongoose, { Schema, SchemaTypes, models, Document } from "mongoose";

export interface IComment extends Document {
  user_id: string;
  content: string;
  replies?: IComment[];
  likes: Number;
}

export const CommentSchema: Schema = new Schema<IComment | null>({
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
  parentComment: {
    type: SchemaTypes.ObjectId,
    ref: "Comment",
  },
  replies: [
    {
      type: SchemaTypes.ObjectId,
      ref: "Comment",
    },
  ],
});

export default models.Comment || mongoose.model("Comment", CommentSchema);
