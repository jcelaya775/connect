import mongoose, { Schema, SchemaTypes, models } from "mongoose";

export interface IUser {
	_id: string;
	username: string;
	name: string;
	password: string;
	is_verified: boolean;
	email: string;
	code: Number;
	bio_id?: string;
}

const UserSchema = new Schema<IUser>({
	username: { type: String, trim: true, required: true, unique: true },
	password: { type: String, trim: true, required: true },
	name: { type: String, trim: true, required: true },
	email: { type: String, trim: true, required: true, unique: true },
	is_verified: { type: Boolean, default: false },
	code: Number,
	bio_id: SchemaTypes.ObjectId,
});

export default models.User || mongoose.model("User", UserSchema);
