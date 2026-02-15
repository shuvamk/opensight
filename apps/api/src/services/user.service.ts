import { db, users } from '@opensight/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger.js';

interface UpdateProfileInput {
  name?: string;
  avatar_url?: string;
}

export class UserService {
  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user[0]) {
      throw new Error('User not found');
    }

    return this.formatUserResponse(user[0]);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileInput) {
    const updates: Record<string, any> = {};

    if (data.name !== undefined) {
      updates.fullName = data.name;
    }

    if (data.avatar_url !== undefined) {
      updates.avatarUrl = data.avatar_url;
    }

    if (Object.keys(updates).length === 0) {
      return this.getProfile(userId);
    }

    updates.updatedAt = new Date();

    const updated = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();

    if (!updated[0]) {
      throw new Error('Failed to update profile');
    }

    return this.formatUserResponse(updated[0]);
  }

  /**
   * Change password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // Get user with password hash
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user[0] || !user[0].passwordHash) {
      throw new Error('User not found or has no password set');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user[0].passwordHash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    const updated = await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (!updated[0]) {
      throw new Error('Failed to update password');
    }

    return { success: true };
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

export const userService = new UserService();
