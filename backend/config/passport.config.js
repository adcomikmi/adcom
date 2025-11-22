// backend/config/passport.config.js
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Admin from '../models/Admin.model.js';

export const configurePassport = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const adminEmail = profile.emails[0].value;
          
          const admin = await Admin.findOne({ email: adminEmail });

          if (admin) {
            return done(null, admin);
          } else {
            return done(null, false, { message: 'Email tidak terdaftar sebagai Admin' });
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};