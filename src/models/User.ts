import mongoose, { Document, Schema, SchemaTypes, models } from "mongoose";

export interface IUser extends Document {
	_id: number;
	username: string;
	name: string;
	password: string;
	is_verified: boolean;
	email: string;
	long_token: string;
	page_token: string;
	long_token_expires: string;
	page_token_expires: string;
	code: Number;
	bio_id?: string;
}

const UserSchema = new Schema<IUser>({
	_id: SchemaTypes.ObjectId,
	username: { type: String, trim: true, required: true, unique: true },
	name: String,
	password: { type: String, trim: true, required: true },
	is_verified: { type: Boolean, default: false },
	email: { type: String, trim: true, required: true, unique: true },
	long_token: { type: String, trim: true, required: false, unique: true },
	page_token: { type: String, trim: true, required: false, unique: true },
	long_token_expires: { type: String, trim: true, required: false },
	page_token_expires: { type: String, trim: true, required: false },
	code: { type: Number, default: 0, trim: true, required: false },
	bio_id: SchemaTypes.ObjectId,
});

export default models.User || mongoose.model("User", UserSchema);
