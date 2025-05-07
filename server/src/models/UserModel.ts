import mongoose, { Schema } from 'mongoose';
import { IUserMongoose } from '../types/mongoose.types';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    picture: {
      type: String,
    },
    files: [
      {
        type: Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUserMongoose & Document>(
  'User',
  userSchema
);
