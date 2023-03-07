// models/Temp.ts

import mongoose, { Document, Schema } from "mongoose";

interface ITemp extends Document {
  title: string;
  message: string;
}

const TempSchema: Schema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
});

export default mongoose.models.Temp || mongoose.model<ITemp>("Temp", TempSchema);
