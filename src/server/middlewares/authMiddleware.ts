import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import { IUser } from '../../types/user';
import { UserModel } from '../models/UserModel';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export interface AuthRequest extends Request {
  user?: Document & IUser & Required<{ _id: unknown }> & { __v: number };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Skip auth for download route
    if (req.path.startsWith('/download/')) {
      return next();
    }

    // Récupération et vérification du token depuis l'en-tête Authorization
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Décodage et vérification du token JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Recherche de l'utilisateur en base de données
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attachement de l'utilisateur à la requête pour les prochains middlewares/contrôleurs
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};
