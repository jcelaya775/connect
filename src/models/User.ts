import mongoose, { Schema, SchemaTypes, models } from "mongoose";

export interface IUser {
	id: number;
	username: string;
	name: string;
	email: string;
	bio_id?: string;
}

const UserSchema = new Schema<IUser>({
	id: SchemaTypes.ObjectId,
	username: String,
	name: String,
	email: String,
	bio_id: SchemaTypes.ObjectId,
});

export default models.User || mongoose.model("User", UserSchema);
