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
// const connectDB =
//   (handler: Function) => async (req: Request, res: Response) => {
async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    bufferMaxEntries: 0,
    useFindAndModify: true,
    useCreateIndex: true,
  };

  mongoose
    .connect(MONGODB_URI as string, options)
    .then((connection) => connection);
}

export default connectDB;
