import mongoose, { Schema, SchemaTypes, models, Document } from "mongoose";
import { IUser } from "./User";

export interface IComment extends Document {
  user_id: IUser["_id"];
  name: string;
  content: string;
  replies?: IComment[];
  likes: Number;
}

export const CommentSchema: Schema = new Schema<IComment | null>({
  user_id: { type: SchemaTypes.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, trim: true },
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
