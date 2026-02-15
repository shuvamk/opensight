import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  path: '/',
};

/**
 * Register handler
 * POST /auth/register
 */
export async function registerHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, name } = req.body;

    const user = await authService.register({ email, password, name });
    const { accessToken, refreshToken } = await authService.generateTokens(user.id);

    // Set refresh token cookie
    res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS);

    res.status(201).json({
      user,
      accessToken,
    });
  } catch (err) {
    const error = err as Error;
    logger.error(err, 'Register failed');
    
    if (error.message.includes('already in use')) {
      res.status(409).json({ error: error.message });
    } else {
      next(err);
    }
  }
}

/**
 * Login handler
 * POST /auth/login
 */
export async function loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    // Set refresh token cookie
    res.cookie('refresh_token', result.refreshToken, COOKIE_OPTIONS);

    res.status(200).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (err) {
    const error = err as Error;
    logger.error(err, 'Login failed');
    
    if (error.message.includes('Invalid')) {
      res.status(401).json({ error: 'Invalid email or password' });
    } else {
      next(err);
    }
  }
}

/**
 * Forgot password handler
 * POST /auth/forgot-password
 */
export async function forgotPasswordHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body;

    await authService.forgotPassword(email);

    res.status(200).json({
      message: 'If an account exists for this email, a password reset link has been sent.',
    });
  } catch (err) {
    logger.error(err, 'Forgot password failed');
    next(err);
  }
}

/**
 * Reset password handler
 * POST /auth/reset-password
 */
export async function resetPasswordHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, password } = req.body;

    await authService.resetPassword(token, password);

    res.status(200).json({
      message: 'Password reset successful. You can now log in with your new password.',
    });
  } catch (err) {
    const error = err as Error;
    logger.error(err, 'Reset password failed');
    
    if (error.message.includes('Invalid') || error.message.includes('expired')) {
      res.status(400).json({ error: error.message });
    } else {
      next(err);
    }
  }
}

/**
 * Refresh access token handler
 * POST /auth/refresh
 */
export async function refreshHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      res.status(401).json({ error: 'No refresh token provided' });
      return;
    }

    const result = await authService.refreshAccessToken(refreshToken);

    // Set new refresh token cookie
    res.cookie('refresh_token', result.refreshToken, COOKIE_OPTIONS);

    res.status(200).json({
      accessToken: result.accessToken,
    });
  } catch (err) {
    const error = err as Error;
    logger.error(err, 'Refresh token failed');
    
    // Clear invalid refresh token cookie
    res.clearCookie('refresh_token', { path: '/' });

    if (error.message.includes('Invalid')) {
      res.status(401).json({ error: error.message });
    } else {
      next(err);
    }
  }
}

/**
 * Logout handler
 * POST /auth/logout
 */
export async function logoutHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    // Clear refresh token cookie
    res.clearCookie('refresh_token', { path: '/' });

    res.status(200).json({
      message: 'Logged out successfully',
    });
  } catch (err) {
    logger.error(err, 'Logout failed');
    // Clear cookie even if logout fails
    res.clearCookie('refresh_token', { path: '/' });
    next(err);
  }
}

/**
 * GitHub OAuth callback handler
 * GET /auth/github/callback
 */
export async function githubCallbackHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = req.user as any;

    if (!user) {
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }

    // Generate tokens
    const tokens = await authService.generateTokens(user.id);

    // Set refresh token cookie
    res.cookie('refresh_token', tokens.refreshToken, COOKIE_OPTIONS);

    // Redirect to frontend with token
    const redirectUrl = `${env.FRONTEND_URL}/auth/callback?accessToken=${tokens.accessToken}&provider=github`;
    res.redirect(redirectUrl);
  } catch (err) {
    logger.error(err, 'GitHub callback failed');
    const errorUrl = `${env.FRONTEND_URL}/auth/error?message=authentication_failed`;
    res.redirect(errorUrl);
  }
}

/**
 * Google OAuth callback handler
 * GET /auth/google/callback
 */
export async function googleCallbackHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = req.user as any;

    if (!user) {
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }

    // Generate tokens
    const tokens = await authService.generateTokens(user.id);

    // Set refresh token cookie
    res.cookie('refresh_token', tokens.refreshToken, COOKIE_OPTIONS);

    // Redirect to frontend with token
    const redirectUrl = `${env.FRONTEND_URL}/auth/callback?accessToken=${tokens.accessToken}&provider=google`;
    res.redirect(redirectUrl);
  } catch (err) {
    logger.error(err, 'Google callback failed');
    const errorUrl = `${env.FRONTEND_URL}/auth/error?message=authentication_failed`;
    res.redirect(errorUrl);
  }
}
