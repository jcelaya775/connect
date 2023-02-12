import mongoose, { Schema, models, SchemaTypes } from "mongoose";

export interface ICollection {
	name: string;
	icon: string; // TODO: determine image storage solution
	user_id: number;
}

const CollectionSchema = new Schema<ICollection>({
	name: String,
	icon: String,
	user_id: SchemaTypes.ObjectId,
});

export default models.Collection ||
	mongoose.model("Collection", CollectionSchema);
