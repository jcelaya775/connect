import mongoose, { Schema, SchemaTypes, models } from "mongoose";

export interface IUser {
	_id: number;
	email: string;
	password: string;
	username: string;
	name: string;
	is_verified: boolean;
	code: Number;
}

const UserSchema = new Schema<IUser>({
	_id: SchemaTypes.ObjectId,
	email: { type: String, trim: true, required: true, unique: true },
	password: { type: String, trim: true, required: true },
	username: { type: String, trim: true, required: true, unique: true },
	name: { type: String, trim: true, required: true },
	is_verified: { type: Boolean, default: false },
	code: Number,
});

export default models.User || mongoose.model("User", UserSchema);
