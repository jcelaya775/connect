import mongoose, { Schema, SchemaTypes, models, Document } from "mongoose";

export interface ISchool extends Document {
	name: string;
	city: string;
	degree: string;
	gpa: number;
}

const schoolSchema: Schema = new Schema<ISchool>({
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