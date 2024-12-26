import { IUser } from '../../types/user';
import mongoose, { Schema } from 'mongoose';

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

// Modèle utilisateur
export const UserModel = mongoose.model<IUser & Document>('User', userSchema);
