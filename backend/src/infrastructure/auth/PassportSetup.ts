import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import bcrypt from 'bcryptjs';
import { Express } from 'express';
import { UserUsecases } from '../../application/usecases/UserUsecases';
import { UserRepository } from '../repositories/UserRepository';
import { User } from 'backend/src/domain/entities/UserModel';

export async function setupAuth(app: Express) {
  const userRepository = new UserRepository(); // Your MongoDB User Repository
  const userUsecases = new UserUsecases(userRepository); // Inject repository into use case

  // Passport Local Strategy for user authentication
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await userUsecases.getUserByEmail(email);
          if (!user) {
            return done(null, false, {
              message: 'Incorrect email or password.',
            });
          }
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return done(null, false, {
              message: 'Incorrect email or password.',
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id',
        clientSecret:
          process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret',
        callbackURL: 'http://localhost:3001/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userUsecases.getUserByEmail(profile.emails[0].value);
          if (!user) {
            user = await userUsecases.addUser(
              profile.emails[0].value,
              'google',
              null,
              profile.id,
              null
            );
          }
          console.log('Google User', user);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Facebook OAuth Strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID || 'your_facebook_app_id',
        clientSecret:
          process.env.FACEBOOK_APP_SECRET || 'your_facebook_app_secret',
        callbackURL: 'http://localhost:3001/auth/facebook/callback',
        profileFields: ['id', 'emails', 'name'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          let user = await userUsecases.getUserByEmail(email);
          if (!user) {
            user = await userUsecases.addUser(
              email,
              'facebook',
              null,
              null,
              profile.id
            );
          }
          console.log('Facebook User', user);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialize the user ID into the session
  passport.serializeUser((user: User, done) => {
    let userId: string;
    switch (user.provider) {
      case 'google':
        userId = user.googleId;
        break;
      case 'facebook':
        userId = user.facebookId;
        break;
      default:
        userId = user._id;
    }
    const serializedUser = { id: userId, provider: user.provider };
    console.log('Serialized User ', JSON.stringify(serializedUser));
    done(null, serializedUser);
  });

  // Deserialize the user from the session using their ID
  passport.deserializeUser(
    async (serializedUser: { id: string; provider: string }, done) => {
      try {
        const user = await userUsecases.getUserBySerializedData(
          serializedUser.id,
          serializedUser.provider
        );

        if (user) {
          done(null, user);
        } else {
          done(new Error('User not found'));
        }
      } catch (err) {
        done(err);
      }
    }
  );

  const secretKey = process.env.SESSION_SECRET_KEY ?? 'your_secret_key';

  app.use(
    session({
      secret: secretKey, // Replace with your secret key
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
