import mongoose, { Schema, SchemaTypes, models, Document } from "mongoose";
import School, { ISchool } from "../models/School";

export interface IAbout {
	works_at: string;
	lives_in: string;
	is_from: string;
	schools_attended: ISchool[];
	bithday: Date;
}

const AboutSchema: Schema = new Schema<IAbout>({
	works_at: String,
	lives_in: String,
	is_from: String,
	schools_attended: [School],
	bithday: Date,
});

export default models.About || mongoose.model("About", AboutSchema);
