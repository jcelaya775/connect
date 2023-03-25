import mongoose, { Schema, SchemaTypes, models, Document } from "mongoose";
import School, { ISchool } from "../models/School";

export interface IAbout {
  user_id: number;
  works_at: string;
  lives_in: string;
  is_from: string;
  schools_attended: ISchool[];
  bithday: Date;
}

const AboutSchema: Schema = new Schema<IAbout>({
  user_id: SchemaTypes.ObjectId,
  works_at: String,
  lives_in: String,
  is_from: String,
  schools_attended: [
    { name: String, city: String, degree: String, gpa: Number },
  ],
  bithday: Date,
});

export default models.About || mongoose.model("About", AboutSchema);
