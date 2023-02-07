import mongoose, { Schema, SchemaTypes, models } from "mongoose";

export interface IUser {
	username: string;
	name: string;
	email: string;
	bio_id?: string;
}

const UserSchema = new Schema<IUser>({
	username: String,
	name: String,
	email: String,
	bio_id: SchemaTypes.ObjectId,
});

export default models.User || mongoose.model("User", UserSchema);
