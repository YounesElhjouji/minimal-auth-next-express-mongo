import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { Express } from 'express';
import { getUserByEmail, getUserById } from '../users';

export function setupAuth(app: Express) {
  // Passport Local Strategy for user authentication
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        const user = getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }
        return done(null, user);
      }
    )
  );

  // Serialize the user ID into the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize the user from the session using their ID
  passport.deserializeUser((id: string, done) => {
    const user = getUserById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'));
    }
  });

  app.use(
    session({
      secret: 'your_secret_key', // Replace with your secret key
      resave: false,
      saveUninitialized: false,
      // Optionally set cookie options
      cookie: {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
}
