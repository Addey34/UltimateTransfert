import express from 'express';
import passport from 'passport';
import { getUser, googleCallback } from '../controllers/authController';

const router: express.Router = express.Router();
const CLIENT_URL = process.env.VITE_CLIENT_URL || 'http://localhost:5173';

// Démarrage de l'authentification avec Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  })
);

// Callback après authentification Google
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${CLIENT_URL}/auth/callback?error=auth_failed`,
    session: false,
  }),
  googleCallback
);

// Endpoint pour récupérer les informations utilisateur
router.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  getUser
);

export default router;
