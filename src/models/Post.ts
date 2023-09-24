import mongoose, { Schema, SchemaTypes, models, Document } from "mongoose";
import { CommentSchema, IComment } from "../models/Comment";
import { ObjectId } from "mongodb";
import { platformTypes } from "@/types/platform";

export interface IConnectPost extends Document {
  user_id?: ObjectId;
  username: string;
  email: string;
  author: string;
  community_id?: ObjectId;
  main_platform: platformTypes;
  platforms: platformTypes[];
  facebook_id?: string;
  instagram_id?: string;
  content: {
    body?: string;
    image?: {
      signedUrl?: string;
      filename?: string;
    };
    video?: {
      bucket?: string;
      key?: string;
      location?: string;
    };
    link?: string;
    [x: string | number | symbol]: any;
  };
  likes: [{ user_id: ObjectId }];
  comments?: IComment[];
  views: [{ user_id: ObjectId }];
  visibility: "Public" | "Private";
  createdAt: string;
  updatedAt: string;
}

const PostSchema = new Schema<IConnectPost>(
  {
    user_id: { type: SchemaTypes.ObjectId, required: true },
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    community_id: SchemaTypes.ObjectId,
    main_platform: {
      type: String,
      required: true,
      trim: true,
      enum: Object.values(platformTypes),
    },
    platforms: {
      type: [String],
      trim: true,
      enum: Object.values(platformTypes),
    },
    facebook_id: { type: String, trim: true, required: false },
    instagram_id: { type: String, trim: true, required: false },
    content: {
      body: { type: String, trim: true },
      image: {
        signedUrl: { type: String, trim: true },
        filename: { type: String, trim: true },
      },
      video: {
        bucket: { type: String, trim: true },
        key: { type: String, trim: true },
        location: { type: String, trim: true },
      },
      link: { type: String, trim: true },
    },
    comments: [CommentSchema],
    likes: [{ user_id: { type: SchemaTypes.ObjectId, required: true } }],
    views: [{ user_id: { type: SchemaTypes.ObjectId, required: true } }],
    visibility: {
      type: String,
      required: true,
      default: "Public",
      enum: ["Public", "Private"],
    },
  },
  { strict: false, timestamps: true }
);

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
