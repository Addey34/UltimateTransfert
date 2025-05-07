import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUserMongoose } from '../types/mongoose.types';

const CLIENT_URL = process.env.VITE_CLIENT_URL as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

export const googleCallback = (req: Request, res: Response) => {
  try {
    const user = req.user as IUserMongoose;
    if (!user) {
      console.error('User not found after Google authentication');
      return res.redirect(`${CLIENT_URL}/auth/callback?error=user_not_found`);
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });
    return res.redirect(`${CLIENT_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Token generation error:', error);
    return res.redirect(`${CLIENT_URL}/auth/callback?error=token_error`);
  }
};

export const getUser = (req: Request, res: Response) => {
  try {
    const user = req.user as IUserMongoose;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    });
  } catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
