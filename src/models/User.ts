import mongoose, { Schema, SchemaTypes, models } from "mongoose";

export interface IUser {
	username: string;
	name: string;
	password: string;
	is_verified: boolean;
	email: string;
	pass: string;
	code: Number;
	bio_id?: string;
}

const UserSchema = new Schema<IUser>({
	username: { type: String, unique: true },
	password: { type: String, required: true },
	name: String,
	email: { type: String, required: true, unique: true },
	is_verified: { type: Boolean, required: true, default: false },
	code: Number,
	bio_id: SchemaTypes.ObjectId,
});

export default models.User || mongoose.model("User", UserSchema);
