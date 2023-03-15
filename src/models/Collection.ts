import mongoose, { Schema, models, SchemaTypes } from "mongoose";

export interface ICollection {
	user_id: number;
	name: string;
	icon: string; // TODO: determine image storage solution
}

const CollectionSchema = new Schema<ICollection>({
	user_id: SchemaTypes.ObjectId,
	name: String,
	icon: String,
});

export default models.Collection ||
	mongoose.model("Collection", CollectionSchema);
