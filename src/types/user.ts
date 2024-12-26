import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  id: string;
  email: string;
  name: string;
  googleId: string;
  picture?: string;
  files: mongoose.Types.ObjectId[];
}
