// backend/routes/auth.routes.js
import express from 'express';
import passport from 'passport';
import { loginUser, googleCallback } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', loginUser);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        const errorMessage = info ? info.message : 'Login Gagal';
        res.send(`
          <script>
            window.opener.postMessage({ error: "${errorMessage}" }, '${process.env.CLIENT_URL || "http://localhost:5173"}');
            window.close();
          </script>
        `);
        return;
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  googleCallback
);

export default router;