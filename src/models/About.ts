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
        required: true
    },
    city: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    }
});

/* Do we want to include the userID as a field? */
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
    schools_attended: [schoolSchema],
    bithday: Date,
});

export default models.Post || mongoose.model("About", AboutSchema);
