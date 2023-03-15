import mongoose, { Schema, SchemaTypes, models, Document } from "mongoose";

export interface ISchool extends Document {
	user_id: string;
	name: string;
	city: string;
	degree: string;
	gpa: number;
}

const schoolSchema: Schema = new Schema<ISchool>({
	user_id: SchemaTypes.ObjectId,
	name: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	degree: {
		type: String,
		required: true,
	},
});
export default models.School || mongoose.model("School", schoolSchema);
