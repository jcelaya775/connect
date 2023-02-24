import mongoose, { Schema, SchemaTypes, models, Document } from "mongoose";

export interface IMessageData {
	message: string;
}

const TempSchema: Schema = new Schema<IMessageData>({
	message: String,
});

export default models.Temp || mongoose.model("Temp", TempSchema);
