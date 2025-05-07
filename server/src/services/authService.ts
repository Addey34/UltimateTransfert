import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { UserModel } from '../models/UserModel';
import { IUserMongoose } from '../types/mongoose.types';

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: `${process.env.VITE_SERVER_URL}/auth/google/callback`,
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
        ], // Ensure scopes are correct
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({ googleId: profile.id });
          if (!user) {
            user = await UserModel.create({
              googleId: profile.id,
              email: profile.emails?.[0]?.value,
              name: profile.displayName,
              picture: profile.photos?.[0]?.value,
            });
          }
          return done(null, user);
        } catch (error) {
          console.error('Error in Google strategy:', error);
          return done(error as Error);
        }
      }
    )
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'default-secret',
      },
      async (payload, done) => {
        try {
          const user = await UserModel.findById(payload.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          console.error('Error in JWT strategy:', error);
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user: IUserMongoose, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
