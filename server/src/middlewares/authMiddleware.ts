import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel';
import { IUserMongoose } from '../types/mongoose.types';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

declare global {
  namespace Express {
    interface User extends IUserMongoose {}
  }
}

export interface AuthRequest extends Request {
  user?: IUserMongoose;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.path.startsWith('/download/')) {
      return next();
    }
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};