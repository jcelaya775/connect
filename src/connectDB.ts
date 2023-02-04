import mongoose from "mongoose";
const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  mongoose.connect(MONGODB_URI as string).then((connection) => connection);
}

export default connectDB;
