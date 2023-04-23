import { themeTypes } from "@/types/theme";
import mongoose, {
  Document,
  ObjectId,
  Schema,
  SchemaTypes,
  models,
} from "mongoose";

export interface IUser extends Document {
  username: string;
  name: string;
  is_verified: boolean;
  email: string;
  facebook: {
    page_id?: string;
    page_name?: string;
    page_token?: string;
    page_token_expires?: string;
    user_token?: string;
    user_token_expires?: string;
  };
  friends: [user_id: ObjectId];
  pending_friends: [user_id: string];
  settings: {
    theme: themeTypes;
  };
  biography?: string;
  timestamp: Date;
  code: Number;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, trim: true, required: true, unique: true },
    name: { type: String, trim: true, required: true },
    is_verified: { type: Boolean, default: false },
    email: { type: String, trim: true, required: true, unique: true },
    facebook: {
      page_id: { type: String, trim: true, required: false },
      page_name: { type: String, trim: true, required: false },
      user_token: { type: String, trim: true, required: false },
      page_token: { type: String, trim: true, required: false },
      user_token_expires: { type: String, trim: true, required: false },
      page_token_expires: { type: String, trim: true, required: false },
    },
    friends: [{ user_id: { type: SchemaTypes.ObjectId, ref: "User" } }],
    pending_friends: [{ user_id: { type: SchemaTypes.ObjectId, ref: "User" } }],
    settings: {
      theme: {
        type: String,
        default: "corporate",
        trim: true,
        required: false,
        enum: Object.values(themeTypes),
      },
    },
    biography: { type: String, trim: true, required: false },
    code: { type: Number, default: 0, trim: true, required: false },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
