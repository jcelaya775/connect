import mongoose, { Document, Schema, SchemaTypes, models } from "mongoose";

export interface IUser extends Document {
  username: string;
  name: string;
  password: string;
  is_verified: boolean;
  email: string;
  facebook?: {
    page_id?: string;
    page_name?: string;
    page_token?: string;
    page_token_expires?: string;
    user_token?: string;
    user_token_expires?: string;
  };
  code: Number;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, trim: true, required: true, unique: true },
  name: String,
  password: { type: String, trim: true, required: true },
  is_verified: { type: Boolean, default: false },
  email: { type: String, trim: true, required: true, unique: true },
  facebook: {
    page_id: { type: String, trim: true, required: false },
    page_name: { type: String, trim: true, required: false },
    user_token: { type: String, trim: true, required: false, unique: true },
    page_token: { type: String, trim: true, required: false, unique: true },
    user_token_expires: { type: String, trim: true, required: false },
    page_token_expires: { type: String, trim: true, required: false },
  },
  code: { type: Number, default: 0, trim: true, required: false },
});

export default models.User || mongoose.model("User", UserSchema);
