import { db, users, refreshTokens, passwordResetTokens } from '@opensight/db';
import { eq, isNull } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env.js';
import { sendPasswordResetEmail, sendVerificationEmail } from '../config/email.js';
import { logger } from '../utils/logger.js';

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface OAuthProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface TokenPayload {
  id: string;
  email: string;
  plan_id: string;
}

export class AuthService {
  /**
   * Register a new user with email and password
   */
  async register(input: RegisterInput) {
    const { email, password, name } = input;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('Email already in use');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        id: uuidv4(),
        email,
        passwordHash,
        fullName: name,
        emailVerified: false,
        planId: 'free',
      })
      .returning();

    if (!newUser[0]) {
      throw new Error('Failed to create user');
    }

    // Send verification email (in production)
    if (env.RESEND_API_KEY) {
      const verificationToken = this.generateVerificationToken(newUser[0].id);
      const verificationUrl = `${env.FRONTEND_URL}/auth/verify?token=${verificationToken}`;
      
      try {
        await sendVerificationEmail(email, verificationUrl);
      } catch (err) {
        logger.error(err, 'Failed to send verification email');
        // Don't throw - allow signup to proceed
      }
    }

    return this.formatUserResponse(newUser[0]);
  }

  /**
   * Login user with email and password
   */
  async login(email: string, password: string) {
    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user[0] || !user[0].passwordHash) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user[0].passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user[0].id);

    return {
      user: this.formatUserResponse(user[0]),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Initiate password reset
   */
  async forgotPassword(email: string) {
    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user[0]) {
      // Don't reveal if email exists - for security
      logger.info(`Password reset requested for non-existent email: ${email}`);
      return { success: true };
    }

    // Generate reset token
    const resetToken = uuidv4();
    const tokenHash = await bcrypt.hash(resetToken, 12);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Store token hash
    await db
      .insert(passwordResetTokens)
      .values({
        id: uuidv4(),
        userId: user[0].id,
        tokenHash,
        expiresAt,
      });

    // Send email
    if (env.RESEND_API_KEY) {
      const resetUrl = `${env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
      try {
        await sendPasswordResetEmail(email, resetUrl);
      } catch (err) {
        logger.error(err, 'Failed to send password reset email');
      }
    }

    return { success: true };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string) {
    // Find valid reset token
    const resetTokens = await db
      .select()
      .from(passwordResetTokens)
      .where(isNull(passwordResetTokens.usedAt))
      .limit(50); // Get multiple to check validity

    let validToken = null;
    for (const rt of resetTokens) {
      if (rt.expiresAt > new Date()) {
        const isValid = await bcrypt.compare(token, rt.tokenHash);
        if (isValid) {
          validToken = rt;
          break;
        }
      }
    }

    if (!validToken) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update user password
    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, validToken.userId));

    // Mark token as used
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, validToken.id));

    return { success: true };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string) {
    try {
      // Verify refresh token JWT
      const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as TokenPayload;

      // Find user
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.id))
        .limit(1);

      if (!user[0]) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user[0].id);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (err) {
      logger.error(err, 'Invalid refresh token');
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Logout by revoking refresh token
   */
  async logout(refreshToken: string) {
    try {
      // Verify and extract payload
      const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as TokenPayload & { tokenId: string };

      // Revoke the refresh token
      if (decoded.tokenId) {
        await db
          .update(refreshTokens)
          .set({ revokedAt: new Date() })
          .where(eq(refreshTokens.id, decoded.tokenId));
      }

      return { success: true };
    } catch (err) {
      logger.debug(err, 'Failed to revoke refresh token');
      // Don't throw - logout is not critical if token is invalid
      return { success: true };
    }
  }

  /**
   * Find or create OAuth user
   */
  async findOrCreateOAuthUser(provider: 'github' | 'google', profile: OAuthProfile) {
    // Find existing user by OAuth ID
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(
        provider === 'github' ? users.githubId : users.googleId,
        profile.id
      ))
      .limit(1);

    if (existingUser[0]) {
      return existingUser[0];
    }

    // Check if user exists by email
    const userByEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, profile.email))
      .limit(1);

    if (userByEmail[0]) {
      // Link OAuth account to existing user
      const updates = provider === 'github'
        ? { githubId: profile.id }
        : { googleId: profile.id };

      const updated = await db
        .update(users)
        .set(updates)
        .where(eq(users.id, userByEmail[0].id))
        .returning();

      return updated[0];
    }

    // Create new user
    const newValues = {
      id: uuidv4(),
      email: profile.email,
      fullName: profile.name,
      avatarUrl: profile.avatar,
      emailVerified: true, // OAuth emails are verified
      planId: 'free' as const,
      ...(provider === 'github' ? { githubId: profile.id } : { googleId: profile.id }),
    };

    const newUser = await db
      .insert(users)
      .values(newValues)
      .returning();

    return newUser[0];
  }

  /**
   * Generate access and refresh tokens
   */
  async generateTokens(userId: string) {
    // Find user to get plan_id
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user[0]) {
      throw new Error('User not found');
    }

    const accessToken = this.generateAccessToken({
      id: user[0].id,
      email: user[0].email,
      plan_id: user[0].planId,
    });

    // Create refresh token in DB
    const refreshTokenId = uuidv4();
    const refreshTokenSecret = uuidv4();
    const tokenHash = await bcrypt.hash(refreshTokenSecret, 12);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db
      .insert(refreshTokens)
      .values({
        id: refreshTokenId,
        userId,
        tokenHash,
        expiresAt,
      });

    // Create refresh token JWT
    const refreshToken = jwt.sign(
      {
        id: user[0].id,
        email: user[0].email,
        plan_id: user[0].planId,
        tokenId: refreshTokenId,
      },
      env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generate access token
   */
  private generateAccessToken(user: TokenPayload): string {
    return jwt.sign(user, env.JWT_SECRET, { expiresIn: '15m' });
  }

  /**
   * Generate verification token
   */
  private generateVerificationToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '24h' });
  }

  /**
   * Format user for response
   */
  private formatUserResponse(user: typeof users.$inferSelect) {
    return {
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      avatar_url: user.avatarUrl,
      email_verified: user.emailVerified,
      plan_id: user.planId,
      created_at: user.createdAt?.toISOString(),
      updated_at: user.updatedAt?.toISOString(),
    };
  }
}

export const authService = new AuthService();
