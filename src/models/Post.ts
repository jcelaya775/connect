import mongoose, { Schema, SchemaTypes, models, Document } from "mongoose";

export interface IComment extends Document {
  likes: Number;
  content: string;
  username: string;
};

const commentSchema: Schema = new Schema<IComment>(
  {
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
  }
);
export interface IPost extends Document {
  id: number;
  username: string;
  name: string;
  shared_with: Number /* 1:public, 2: friends, 3: private*/;
  likes: Number;
  views: Number;
  comments: Comment[];
  content: string;
  bio_id?: string;
}

const PostSchema: Schema = new Schema<IPost>({
  id: SchemaTypes.ObjectId,
  username: String,
  name: String,
  shared_with: Number,
  likes: Number,
  views: Number,
  content: String,
  
  bio_id: SchemaTypes.ObjectId,
  comments: {  // TODO: fix
    type: [],
    required: true,
  }
});

export default models.Post || mongoose.model("Post", PostSchema);