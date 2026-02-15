import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import { db, users } from '@opensight/db';
import { eq } from 'drizzle-orm';
import { env } from './env.js';
import { logger } from '../utils/logger.js';
import { authService } from '../services/auth.service.js';

// Types for user object
interface LocalUser {
  id: string;
  email: string;
  plan_id: string;
  password_hash: string;
}

interface OAuthUser {
  id: string;
  email: string;
  plan_id: string;
  name?: string;
  avatar_url?: string;
}

// Find user by email with password for local strategy
const findUserByEmail = async (email: string): Promise<LocalUser | null> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user[0]) {
    return null;
  }

  return {
    id: user[0].id,
    email: user[0].email,
    plan_id: user[0].planId,
    password_hash: user[0].passwordHash || '',
  };
};

// Find or create GitHub user
const findOrCreateGithubUser = async (profile: any): Promise<OAuthUser | null> => {
  try {
    const user = await authService.findOrCreateOAuthUser('github', {
      id: profile.id,
      email: profile.emails?.[0]?.value || profile.email,
      name: profile.displayName || profile.username,
      avatar: profile.photos?.[0]?.value,
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      plan_id: user.planId,
      name: user.fullName ?? undefined,
      avatar_url: user.avatarUrl ?? undefined,
    };
  } catch (err) {
    logger.error(err, 'Error in findOrCreateGithubUser');
    return null;
  }
};

// Find or create Google user
const findOrCreateGoogleUser = async (profile: any): Promise<OAuthUser | null> => {
  try {
    const user = await authService.findOrCreateOAuthUser('google', {
      id: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      avatar: profile.photos?.[0]?.value,
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      plan_id: user.planId,
      name: user.fullName ?? undefined,
      avatar_url: user.avatarUrl ?? undefined,
    };
  } catch (err) {
    logger.error(err, 'Error in findOrCreateGoogleUser');
    return null;
  }
};

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await findUserByEmail(email);
        
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (err) {
        logger.error(err, 'Error in local strategy');
        return done(err);
      }
    }
  )
);

// GitHub Strategy
if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: env.GITHUB_CALLBACK_URL || `${env.FRONTEND_URL}/auth/github/callback`,
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const user = await findOrCreateGithubUser(profile);
          return done(null, user || false);
        } catch (err) {
          logger.error(err, 'Error in GitHub strategy');
          return done(err);
        }
      }
    )
  );
}

// Google Strategy
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL || `${env.FRONTEND_URL}/auth/google/callback`,
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const user = await findOrCreateGoogleUser(profile);
          return done(null, user || false);
        } catch (err) {
          logger.error(err, 'Error in Google strategy');
          return done(err);
        }
      }
    )
  );
}

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (user[0]) {
      done(null, {
        id: user[0].id,
        email: user[0].email,
        plan_id: user[0].planId,
        fullName: user[0].fullName ?? undefined,
        avatarUrl: user[0].avatarUrl ?? undefined,
      });
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
});

export default passport;
