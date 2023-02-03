import mongoose, { Schema, SchemaTypes } from "mongoose";

interface IUser {
  id: number;
  name: string;
  email: string;
  bio_id: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  id: SchemaTypes.UUID,
  name: String,
  email: String,
  bio_id: SchemaTypes.UUID,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
